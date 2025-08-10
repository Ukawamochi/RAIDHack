import { Hono } from "hono";
import { AppContext, User, ErrorResponse } from "../types";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth";

export const projectRoutes = new Hono<AppContext>();

// プロジェクト詳細取得 (/:userId/:projectId)
projectRoutes.get('/:userId/:projectId', optionalAuthMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId');
    const projectIdParam = c.req.param('projectId');
    const currentUserId = c.get('userId') as number | undefined;

    if (!userId || !projectIdParam) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なパラメーターです",
        error: "Invalid parameters"
      };
      return c.json(errorResponse, 400);
    }

    // プロジェクト名をURLデコード
    const projectName = decodeURIComponent(projectIdParam);

    // プロジェクト詳細を取得（プロジェクト名で検索）
    const project = await c.env.DB.prepare(`
      SELECT 
        i.id, i.title, i.description, i.required_skills, i.status, 
        i.start_date, i.deadline, i.progress_percentage,
        i.created_at, i.updated_at, i.user_id,
        u.username, u.email, u.bio, u.skills, u.avatar_url,
        ps.is_recruiting, ps.github_url, ps.demo_url, ps.other_links,
        ps.max_members
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN project_settings ps ON i.id = ps.project_id
      WHERE i.title = ? AND u.username = ?
    `).bind(projectName, userId).first();

    if (!project) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "プロジェクトが見つかりません",
        error: "Project not found"
      };
      return c.json(errorResponse, 404);
    }

    // チームメンバー取得
    const teamMembers = await c.env.DB.prepare(`
      SELECT 
        tm.user_id, tm.role, tm.joined_at,
        u.username, u.avatar_url, u.bio
      FROM team_members tm
      JOIN teams t ON tm.team_id = t.id
      JOIN users u ON tm.user_id = u.id
      WHERE t.idea_id = ?
      ORDER BY tm.joined_at ASC
    `).bind(project.id).all();

    // 申請者取得（プロジェクトオーナーのみ）
    let applicants: any[] = [];
    if (currentUserId === project.user_id) {
      const applicationData = await c.env.DB.prepare(`
        SELECT 
          a.id, a.message, a.motivation, a.status, a.applied_at,
          u.id as user_id, u.username, u.avatar_url, u.bio
        FROM applications a
        JOIN users u ON a.applicant_id = u.id
        WHERE a.idea_id = ? AND a.status = 'pending'
        ORDER BY a.applied_at DESC
      `).bind(project.id).all();
      
      applicants = applicationData.results.map((app: any) => ({
        id: app.id,
        userId: app.user_id,
        username: app.username,
        avatar: app.avatar_url,
        message: app.message,
        motivation: app.motivation,
        appliedAt: app.applied_at
      }));
    }

    // レスポンス構築
    const response = {
      success: true,
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        hostId: project.user_id,
        hostName: project.username,
        githubUrl: project.github_url,
        demoUrl: project.demo_url,
  otherLinks: typeof project.other_links === 'string' ? JSON.parse(project.other_links) : [],
        members: teamMembers.results.map((member: any) => ({
          id: member.user_id,
          name: member.username,
          avatar: member.avatar_url,
          role: member.role,
          joinedAt: member.joined_at
        })),
        applicants: applicants,
        isRecruitingEnabled: project.is_recruiting !== false,
        maxMembers: project.max_members || 10,
        progressPercentage: project.progress_percentage || 0,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        startDate: project.start_date,
        deadline: project.deadline
      }
    };

    return c.json(response);

  } catch (error) {
    console.error('Get project error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "プロジェクト取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// プロジェクト設定更新
projectRoutes.put('/:userId/:projectId/settings', authMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId');
    const projectIdParam = c.req.param('projectId');
    const currentUserId = c.get('userId') as number;
    const { is_recruiting, github_url, demo_url, other_links, max_members } = await c.req.json();

    const projectName = decodeURIComponent(projectIdParam);

    // 権限確認
    const project = await c.env.DB.prepare(
      "SELECT i.id AS id, i.user_id AS user_id FROM ideas i JOIN users u ON i.user_id = u.id WHERE i.title = ? AND u.username = ?"
    ).bind(projectName, userId).first();

    if (!project || project.user_id !== currentUserId) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "このプロジェクトを編集する権限がありません",
        error: "Not authorized"
      };
      return c.json(errorResponse, 403);
    }

    // プロジェクト設定を更新/作成
    await c.env.DB.prepare(`
      INSERT INTO project_settings (project_id, is_recruiting, github_url, demo_url, other_links, max_members, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(project_id) DO UPDATE SET
        is_recruiting = excluded.is_recruiting,
        github_url = excluded.github_url,
        demo_url = excluded.demo_url,
        other_links = excluded.other_links,
        max_members = excluded.max_members,
        updated_at = excluded.updated_at
    `).bind(
      project.id,
      is_recruiting !== undefined ? is_recruiting : true,
      github_url || null,
      demo_url || null,
      other_links ? JSON.stringify(other_links) : null,
      max_members || 10
    ).run();

    return c.json({
      success: true,
      message: "プロジェクト設定を更新しました"
    });

  } catch (error) {
    console.error('Update project settings error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "設定更新中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// プロジェクトメッセージ取得
projectRoutes.get('/:userId/:projectId/messages', authMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId');
    const projectIdParam = c.req.param('projectId');
    const currentUserId = c.get('userId') as number;
    const messageType = c.req.query('type') || 'public'; // 'public' | 'private'
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    const projectName = decodeURIComponent(projectIdParam);

    // プロジェクトアクセス権限確認
    const project = await c.env.DB.prepare(
      "SELECT i.id AS id, i.user_id AS user_id FROM ideas i JOIN users u ON i.user_id = u.id WHERE i.title = ? AND u.username = ?"
    ).bind(projectName, userId).first();

    if (!project) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "プロジェクトが見つかりません",
        error: "Project not found"
      };
      return c.json(errorResponse, 404);
    }

    const isHost = project.user_id === currentUserId;

    // メッセージ取得クエリ
  let query = `
      SELECT 
        pm.id, pm.message, pm.message_type, pm.created_at,
        pm.user_id, u.username, u.avatar_url
      FROM project_messages pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ?
    `;
  const params: any[] = [project.id];

    if (messageType === 'public') {
      query += " AND pm.message_type = 'public'";
    } else if (messageType === 'private') {
      query += ` AND pm.message_type = 'private' 
                 AND (pm.user_id = ? OR EXISTS (
                   SELECT 1 FROM project_message_recipients pmr 
                   WHERE pmr.message_id = pm.id AND pmr.recipient_id = ?
                 ) OR ?)`;
      params.push(currentUserId, currentUserId, isHost);
    }

    query += " ORDER BY pm.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const messages = await c.env.DB.prepare(query).bind(...params).all();

    const response = {
      success: true,
      messages: messages.results.map((msg: any) => ({
        id: msg.id,
        userId: msg.user_id,
        userName: msg.username,
        message: msg.message,
        timestamp: msg.created_at,
        type: msg.message_type
      }))
    };

    return c.json(response);

  } catch (error) {
    console.error('Get messages error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "メッセージ取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// プロジェクトメッセージ送信
projectRoutes.post('/:userId/:projectId/messages', authMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId');
    const projectIdParam = c.req.param('projectId');
    const currentUserId = c.get('userId') as number;
    const { message, message_type, recipients } = await c.req.json();

    if (!message || !message.trim()) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "メッセージ内容は必須です",
        error: "Message is required"
      };
      return c.json(errorResponse, 400);
    }

    const projectName = decodeURIComponent(projectIdParam);

    // プロジェクトアクセス権限確認
    const project = await c.env.DB.prepare(
      "SELECT i.id AS id, i.user_id AS user_id FROM ideas i JOIN users u ON i.user_id = u.id WHERE i.title = ? AND u.username = ?"
    ).bind(projectName, userId).first();

    if (!project) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "プロジェクトが見つかりません",
        error: "Project not found"
      };
      return c.json(errorResponse, 404);
    }

    // メッセージを挿入
    const messageResult = await c.env.DB.prepare(`
      INSERT INTO project_messages (project_id, user_id, message, message_type)
      VALUES (?, ?, ?, ?)
    `).bind(
      project.id,
      currentUserId,
      message.trim(),
      message_type || 'public'
    ).run();

    const messageId = messageResult.meta.last_row_id;

    // プライベートメッセージの場合、受信者を設定
    if (message_type === 'private' && recipients && Array.isArray(recipients)) {
      for (const recipientId of recipients) {
        await c.env.DB.prepare(`
          INSERT INTO project_message_recipients (message_id, recipient_id)
          VALUES (?, ?)
        `).bind(messageId, recipientId).run();
      }
    }

    // プロジェクトホストにもプライベートメッセージを送信する場合
    if (message_type === 'private' && project.user_id !== currentUserId) {
      await c.env.DB.prepare(`
        INSERT INTO project_message_recipients (message_id, recipient_id)
        VALUES (?, ?)
      `).bind(messageId, project.user_id).run();
    }

    return c.json({
      success: true,
      message: "メッセージを送信しました",
      messageId: messageId
    });

  } catch (error) {
    console.error('Send message error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "メッセージ送信中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 応募承認/拒否
projectRoutes.put('/:userId/:projectId/applications/:applicationId', authMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId');
    const projectIdParam = c.req.param('projectId');
    const applicationId = parseInt(c.req.param('applicationId'));
    const currentUserId = c.get('userId') as number;
    const { action, message } = await c.req.json();

    const projectName = decodeURIComponent(projectIdParam);

    // 権限確認
    const project = await c.env.DB.prepare(
      "SELECT i.id AS id, i.user_id AS user_id FROM ideas i JOIN users u ON i.user_id = u.id WHERE i.title = ? AND u.username = ?"
    ).bind(projectName, userId).first();

    if (!project || project.user_id !== currentUserId) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "この応募を処理する権限がありません",
        error: "Not authorized"
      };
      return c.json(errorResponse, 403);
    }

    if (!['approve', 'reject'].includes(action)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なアクションです",
        error: "Invalid action"
      };
      return c.json(errorResponse, 400);
    }

    // 応募ステータス更新
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await c.env.DB.prepare(`
      UPDATE applications 
      SET status = ?, reviewed_at = CURRENT_TIMESTAMP, review_message = ?
      WHERE id = ? AND idea_id = ?
    `).bind(newStatus, message || '', applicationId, project.id).run();

    // 承認の場合、チームに追加
    if (action === 'approve') {
      // チーム取得または作成
      let team = await c.env.DB.prepare(
        "SELECT id FROM teams WHERE idea_id = ?"
      ).bind(project.id).first();

      if (!team) {
        const teamResult = await c.env.DB.prepare(`
          INSERT INTO teams (idea_id, name, description, status)
          VALUES (?, ?, '', 'active')
        `).bind(project.id, `プロジェクトチーム`).run();
        team = { id: teamResult.meta.last_row_id };
      }

      // 申請者情報を取得してチームメンバーに追加
      const application = await c.env.DB.prepare(
        "SELECT applicant_id FROM applications WHERE id = ?"
      ).bind(applicationId).first();

      if (application) {
        await c.env.DB.prepare(`
          INSERT INTO team_members (team_id, user_id, role)
          VALUES (?, ?, 'member')
        `).bind(team.id, application.applicant_id).run();
      }
    }

    return c.json({
      success: true,
      message: action === 'approve' ? "応募を承認しました" : "応募を拒否しました"
    });

  } catch (error) {
    console.error('Process application error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "応募処理中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});
import { Hono } from "hono";
import { 
  AppContext, 
  Work, 
  WorksResponse,
  WorkResponse,
  ErrorResponse,
  CreateWorkRequest,
  User 
} from "../types";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth";

export const workRoutes = new Hono<AppContext>();

// 作品一覧取得（ページネーション付き）
workRoutes.get('/', optionalAuthMiddleware, async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = (page - 1) * limit;
    const userId = c.get('userId') as number | undefined;

    // 合計作品数を取得
    const countResult = await c.env.DB.prepare(
      "SELECT COUNT(*) as total FROM works"
    ).first();
    const total = (countResult?.total as number) || 0;

    // 作品一覧を取得（投票情報も含む）
    const works = await c.env.DB.prepare(`
      SELECT 
        w.id, w.title, w.description, w.technologies, w.image_url, 
        w.live_url, w.github_url, w.created_at, w.updated_at, w.idea_id,
        i.title as idea_title,
        COUNT(wv.id) as vote_count,
        ${userId ? `CASE WHEN wv_user.user_id IS NOT NULL THEN 1 ELSE 0 END as user_voted` : '0 as user_voted'}
      FROM works w
      LEFT JOIN ideas i ON w.idea_id = i.id
      LEFT JOIN work_votes wv ON w.id = wv.work_id
      ${userId ? 'LEFT JOIN work_votes wv_user ON w.id = wv_user.work_id AND wv_user.user_id = ?' : ''}
      GROUP BY w.id, w.title, w.description, w.technologies, w.image_url, 
               w.live_url, w.github_url, w.created_at, w.updated_at, w.idea_id, i.title
      ORDER BY w.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...(userId ? [userId, limit, offset] : [limit, offset])).all();

    const workList: Work[] = [];
    
    for (const work of works.results) {
      // チームメンバーを取得
      const teamMembers = await c.env.DB.prepare(`
        SELECT u.id, u.username, u.avatar_url
        FROM work_team_members wtm
        JOIN users u ON wtm.user_id = u.id
        WHERE wtm.work_id = ?
        ORDER BY wtm.created_at ASC
      `).bind(work.id).all();

      workList.push({
        id: work.id as number,
        title: work.title as string,
        description: work.description as string,
        technologies: work.technologies ? JSON.parse(work.technologies as string) : [],
        imageUrl: work.image_url as string || undefined,
        liveUrl: work.live_url as string || undefined,
        githubUrl: work.github_url as string || undefined,
        createdAt: work.created_at as string,
        updatedAt: work.updated_at as string,
        ideaId: work.idea_id as number || undefined,
        ideaTitle: work.idea_title as string || undefined,
        teamMembers: teamMembers.results.map((member: any) => ({
          id: member.id as number,
          username: member.username as string,
          avatarUrl: member.avatar_url as string || undefined
        })),
        voteCount: work.vote_count as number,
        userVoted: userId ? Boolean(work.user_voted) : false
      });
    }

    const response: WorksResponse = {
      success: true,
      message: "作品一覧を取得しました",
      works: workList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    return c.json(response);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "作品一覧の取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 作品詳細取得
workRoutes.get('/:id', optionalAuthMiddleware, async (c) => {
  try {
    const workId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number | undefined;

    if (isNaN(workId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効な作品IDです",
        error: "Invalid work ID"
      };
      return c.json(errorResponse, 400);
    }

    // 作品詳細を取得
    const workData = await c.env.DB.prepare(`
      SELECT 
        w.id, w.title, w.description, w.technologies, w.image_url, 
        w.live_url, w.github_url, w.created_at, w.updated_at, w.idea_id,
        i.title as idea_title, i.description as idea_description,
        COUNT(wv.id) as vote_count,
        ${userId ? `CASE WHEN wv_user.user_id IS NOT NULL THEN 1 ELSE 0 END as user_voted` : '0 as user_voted'}
      FROM works w
      LEFT JOIN ideas i ON w.idea_id = i.id
      LEFT JOIN work_votes wv ON w.id = wv.work_id
      ${userId ? 'LEFT JOIN work_votes wv_user ON w.id = wv_user.work_id AND wv_user.user_id = ?' : ''}
      WHERE w.id = ?
      GROUP BY w.id, w.title, w.description, w.technologies, w.image_url, 
               w.live_url, w.github_url, w.created_at, w.updated_at, w.idea_id, 
               i.title, i.description
    `).bind(...(userId ? [userId, workId] : [workId])).first();

    if (!workData) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "作品が見つかりません",
        error: "Work not found"
      };
      return c.json(errorResponse, 404);
    }

    // チームメンバーを取得
    const teamMembers = await c.env.DB.prepare(`
      SELECT u.id, u.username, u.email, u.bio, u.skills, u.avatar_url
      FROM work_team_members wtm
      JOIN users u ON wtm.user_id = u.id
      WHERE wtm.work_id = ?
      ORDER BY wtm.created_at ASC
    `).bind(workId).all();

    const work: Work = {
      id: workData.id as number,
      title: workData.title as string,
      description: workData.description as string,
      technologies: workData.technologies ? JSON.parse(workData.technologies as string) : [],
      imageUrl: workData.image_url as string || undefined,
      liveUrl: workData.live_url as string || undefined,
      githubUrl: workData.github_url as string || undefined,
      createdAt: workData.created_at as string,
      updatedAt: workData.updated_at as string,
      ideaId: workData.idea_id as number || undefined,
      ideaTitle: workData.idea_title as string || undefined,
      teamMembers: teamMembers.results.map((member: any) => ({
        id: member.id as number,
        username: member.username as string,
        email: member.email as string,
        bio: member.bio as string || undefined,
        skills: member.skills ? JSON.parse(member.skills as string) : [],
        avatarUrl: member.avatar_url as string || undefined
      })),
      voteCount: workData.vote_count as number,
      userVoted: userId ? Boolean(workData.user_voted) : false
    };

    const response: WorkResponse = {
      success: true,
      message: "作品詳細を取得しました",
      work
    };

    return c.json(response);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "作品詳細の取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 作品投稿（認証必須）
workRoutes.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json() as CreateWorkRequest;
    const { title, description, technologies, imageUrl, liveUrl, githubUrl, ideaId, teamMemberIds } = body;
    const user = c.get('user') as User;

    // バリデーション
    if (!title || !description) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "タイトルと説明は必須です",
        error: "Missing required fields"
      };
      return c.json(errorResponse, 400);
    }

    // 作品作成
    const technologiesJson = technologies ? JSON.stringify(technologies) : null;
    const result = await c.env.DB.prepare(
      `INSERT INTO works (title, description, technologies, image_url, live_url, github_url, idea_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, created_at, updated_at`
    ).bind(title, description, technologiesJson, imageUrl || null, liveUrl || null, githubUrl || null, ideaId || null).first();

    if (!result) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "作品の作成に失敗しました",
        error: "Failed to create work"
      };
      return c.json(errorResponse, 500);
    }

    const workId = result.id as number;

    // チームメンバーを追加（作成者を含む）
    const allMemberIds = [user.id, ...(teamMemberIds || [])];
    const uniqueMemberIds = [...new Set(allMemberIds)];

    for (const memberId of uniqueMemberIds) {
      await c.env.DB.prepare(
        "INSERT INTO work_team_members (work_id, user_id) VALUES (?, ?)"
      ).bind(workId, memberId).run();
    }

    // チームメンバー情報を取得
    const teamMembers = await c.env.DB.prepare(`
      SELECT u.id, u.username, u.avatar_url
      FROM work_team_members wtm
      JOIN users u ON wtm.user_id = u.id
      WHERE wtm.work_id = ?
    `).bind(workId).all();

    const work: Work = {
      id: workId,
      title,
      description,
      technologies: technologies || [],
      imageUrl,
      liveUrl,
      githubUrl,
      createdAt: result.created_at as string,
      updatedAt: result.updated_at as string,
      ideaId,
      teamMembers: teamMembers.results.map((member: any) => ({
        id: member.id as number,
        username: member.username as string,
        avatarUrl: member.avatar_url as string || undefined
      })),
      voteCount: 0,
      userVoted: false
    };

    const response: WorkResponse = {
      success: true,
      message: "作品が正常に投稿されました",
      work
    };

    return c.json(response, 201);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "作品投稿中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 作品に投票/投票解除（認証必須）
workRoutes.post('/:id/vote', authMiddleware, async (c) => {
  try {
    const workId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;

    if (isNaN(workId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効な作品IDです",
        error: "Invalid work ID"
      };
      return c.json(errorResponse, 400);
    }

    // 作品の存在確認
    const work = await c.env.DB.prepare(
      "SELECT id FROM works WHERE id = ?"
    ).bind(workId).first();

    if (!work) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "作品が見つかりません",
        error: "Work not found"
      };
      return c.json(errorResponse, 404);
    }

    // 既存の投票を確認
    const existingVote = await c.env.DB.prepare(
      "SELECT id FROM work_votes WHERE work_id = ? AND user_id = ?"
    ).bind(workId, userId).first();

    if (existingVote) {
      // 投票解除
      await c.env.DB.prepare(
        "DELETE FROM work_votes WHERE work_id = ? AND user_id = ?"
      ).bind(workId, userId).run();

      return c.json({
        success: true,
        message: "投票を解除しました",
        voted: false
      });
    } else {
      // 投票追加
      await c.env.DB.prepare(
        "INSERT INTO work_votes (work_id, user_id) VALUES (?, ?)"
      ).bind(workId, userId).run();

      return c.json({
        success: true,
        message: "投票しました",
        voted: true
      });
    }

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "投票処理中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

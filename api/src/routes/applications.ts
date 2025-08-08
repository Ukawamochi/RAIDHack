import { Hono } from "hono";
import { AppContext, ErrorResponse } from "../types";
import { authMiddleware } from "../middleware/auth";

export const applicationRoutes = new Hono<AppContext>();

// 自分の応募一覧取得
applicationRoutes.get('/me', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId') as number;

    const applications = await c.env.DB.prepare(`
      SELECT 
        a.id, a.message, a.motivation, a.status, a.applied_at, a.reviewed_at, a.review_message,
        i.id as idea_id, i.title as idea_title, i.description as idea_description,
        u.username as idea_author
      FROM applications a
      JOIN ideas i ON a.idea_id = i.id
      JOIN users u ON i.user_id = u.id
      WHERE a.applicant_id = ?
      ORDER BY a.applied_at DESC
    `).bind(userId).all();

    return c.json({
      success: true,
      applications: applications.results.map((app: any) => ({
        id: app.id,
        message: app.message,
        motivation: app.motivation,
        status: app.status,
        applied_at: app.applied_at,
        reviewed_at: app.reviewed_at,
        review_message: app.review_message,
        idea: {
          id: app.idea_id,
          title: app.idea_title,
          description: app.idea_description,
          author: app.idea_author
        }
      }))
    });

  } catch (error) {
    console.error('Get my applications error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "応募履歴の取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 承認された応募からチーム作成
applicationRoutes.post('/:id/create-team', authMiddleware, async (c) => {
  try {
    const applicationId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;

    if (!applicationId || isNaN(applicationId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効な応募IDです",
        error: "Invalid application ID"
      };
      return c.json(errorResponse, 400);
    }

    // 応募とアイデア情報を取得
    const applicationData = await c.env.DB.prepare(`
      SELECT 
        a.id, a.status, a.idea_id, a.applicant_id,
        i.title, i.user_id as idea_owner_id, i.status as idea_status
      FROM applications a
      JOIN ideas i ON a.idea_id = i.id
      WHERE a.id = ? AND (a.applicant_id = ? OR i.user_id = ?)
    `).bind(applicationId, userId, userId).first();

    if (!applicationData) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "応募が見つかりません",
        error: "Application not found"
      };
      return c.json(errorResponse, 404);
    }

    if (applicationData.status !== 'approved') {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "承認されていない応募からはチームを作成できません",
        error: "Application not approved"
      };
      return c.json(errorResponse, 400);
    }

    // 既にチームが存在するかチェック
    const existingTeam = await c.env.DB.prepare(
      "SELECT id FROM teams WHERE idea_id = ?"
    ).bind(applicationData.idea_id).first();

    if (existingTeam) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "このアイデアには既にチームが作成されています",
        error: "Team already exists for this idea"
      };
      return c.json(errorResponse, 400);
    }

    // チーム作成
    const teamResult = await c.env.DB.prepare(`
      INSERT INTO teams (idea_id, name, status, created_at)
      VALUES (?, ?, 'active', CURRENT_TIMESTAMP)
    `).bind(applicationData.idea_id, `${applicationData.title} チーム`).run();

    const teamId = teamResult.meta.last_row_id;

    // チームメンバー追加（アイデア作成者と応募者）
    await c.env.DB.prepare(`
      INSERT INTO team_members (team_id, user_id, role, joined_at)
      VALUES (?, ?, 'leader', CURRENT_TIMESTAMP), (?, ?, 'member', CURRENT_TIMESTAMP)
    `).bind(teamId, applicationData.idea_owner_id, teamId, applicationData.applicant_id).run();

    // アイデアのステータスを'development'に変更
    await c.env.DB.prepare(
      "UPDATE ideas SET status = 'development' WHERE id = ?"
    ).bind(applicationData.idea_id).run();

    // 承認通知を応募者に送信
    await c.env.DB.prepare(`
      INSERT INTO notifications (user_id, type, title, message, data, created_at)
      VALUES (?, 'application_status', ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      applicationData.applicant_id,
      '応募が承認されました',
      `あなたの「${applicationData.title}」への応募が承認され、チームが作成されました。`,
      JSON.stringify({ ideaId: applicationData.idea_id, teamId })
    ).run();

    return c.json({
      success: true,
      message: "チームが作成されました",
      team: {
        id: teamId,
        idea_id: applicationData.idea_id,
        name: `${applicationData.title} チーム`,
        status: 'active'
      }
    });

  } catch (error) {
    console.error('Create team error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "チーム作成中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

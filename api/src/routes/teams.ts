import { Hono } from "hono";
import { AppContext, ErrorResponse, Team, TeamWithMembers } from "../types";
import { authMiddleware } from "../middleware/auth";

export const teamRoutes = new Hono<AppContext>();

// チーム一覧取得（自分が参加しているチーム）
teamRoutes.get('/me', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId') as number;

    const teams = await c.env.DB.prepare(`
      SELECT 
        t.id, t.idea_id, t.name, t.description, t.status, t.discord_invite_url,
        t.created_at, t.updated_at,
        i.title as idea_title, i.description as idea_description,
        tm.role as my_role
      FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      JOIN ideas i ON t.idea_id = i.id
      WHERE tm.user_id = ?
      ORDER BY t.created_at DESC
    `).bind(userId).all();

    return c.json({
      success: true,
      teams: teams.results.map((team: any) => ({
        id: team.id,
        idea_id: team.idea_id,
        name: team.name,
        description: team.description,
        status: team.status,
        discord_invite_url: team.discord_invite_url,
        created_at: team.created_at,
        updated_at: team.updated_at,
        my_role: team.my_role,
        idea: {
          title: team.idea_title,
          description: team.idea_description
        }
      }))
    });

  } catch (error) {
    console.error('Get my teams error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "チーム一覧の取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// チーム詳細取得
teamRoutes.get('/:id', authMiddleware, async (c) => {
  try {
    const teamId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;

    if (!teamId || isNaN(teamId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なチームIDです",
        error: "Invalid team ID"
      };
      return c.json(errorResponse, 400);
    }

    // チーム基本情報を取得
    const team = await c.env.DB.prepare(`
      SELECT 
        t.id, t.idea_id, t.name, t.description, t.status, t.discord_invite_url,
        t.created_at, t.updated_at,
        i.title as idea_title, i.description as idea_description,
        i.required_skills as idea_required_skills
      FROM teams t
      JOIN ideas i ON t.idea_id = i.id
      WHERE t.id = ?
    `).bind(teamId).first();

    if (!team) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "チームが見つかりません",
        error: "Team not found"
      };
      return c.json(errorResponse, 404);
    }

    // チームメンバーを取得
    const members = await c.env.DB.prepare(`
      SELECT 
        tm.id as member_id, tm.role, tm.joined_at,
        u.id, u.username, u.email, u.bio, u.skills, u.avatar_url
      FROM team_members tm
      JOIN users u ON tm.user_id = u.id
      WHERE tm.team_id = ?
      ORDER BY tm.role DESC, tm.joined_at ASC
    `).bind(teamId).all();

    // ユーザーがチームメンバーかチェック
    const isMember = members.results.some((member: any) => member.id === userId);
    
    if (!isMember) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "このチームの詳細を表示する権限がありません",
        error: "Not a team member"
      };
      return c.json(errorResponse, 403);
    }

    const teamWithMembers: TeamWithMembers = {
      id: team.id as number,
      idea_id: team.idea_id as number,
      name: team.name as string,
      description: team.description as string,
      status: team.status as 'active' | 'completed' | 'disbanded',
      discord_invite_url: team.discord_invite_url as string,
      created_at: team.created_at as string,
      updated_at: team.updated_at as string,
      members: members.results.map((member: any) => ({
        id: member.member_id as number,
        team_id: teamId,
        user_id: member.id as number,
        role: member.role as 'leader' | 'member',
        joined_at: member.joined_at as string,
        // User properties
        email: member.email as string,
        username: member.username as string,
        bio: member.bio as string,
        skills: member.skills ? JSON.parse(member.skills as string) : [],
        avatar_url: member.avatar_url as string,
        created_at: '', // These are not needed for this response
        updated_at: ''
      })),
      idea: {
        id: team.idea_id as number,
        title: team.idea_title as string,
        description: team.idea_description as string,
        required_skills: team.idea_required_skills ? JSON.parse(team.idea_required_skills as string) : [],
        user_id: 0, // この値は使用されない
        status: 'development',
        created_at: '',
        updated_at: ''
      }
    };

    return c.json({
      success: true,
      team: teamWithMembers
    });

  } catch (error) {
    console.error('Get team error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "チーム詳細の取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// Discord招待URL設定
teamRoutes.put('/:id/discord', authMiddleware, async (c) => {
  try {
    const teamId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;
    const { discord_invite_url } = await c.req.json();

    if (!teamId || isNaN(teamId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なチームIDです",
        error: "Invalid team ID"
      };
      return c.json(errorResponse, 400);
    }

    // チームリーダーかチェック
    const teamMember = await c.env.DB.prepare(`
      SELECT tm.role
      FROM team_members tm
      WHERE tm.team_id = ? AND tm.user_id = ?
    `).bind(teamId, userId).first();

    if (!teamMember) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "このチームのメンバーではありません",
        error: "Not a team member"
      };
      return c.json(errorResponse, 403);
    }

    if (teamMember.role !== 'leader') {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "チームリーダーのみがDiscord招待URLを設定できます",
        error: "Only team leader can set Discord invite URL"
      };
      return c.json(errorResponse, 403);
    }

    // Discord招待URLを更新
    await c.env.DB.prepare(`
      UPDATE teams 
      SET discord_invite_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(discord_invite_url, teamId).run();

    return c.json({
      success: true,
      message: "Discord招待URLを設定しました",
      discord_invite_url
    });

  } catch (error) {
    console.error('Set Discord URL error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Discord招待URL設定中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// チーム解散
teamRoutes.delete('/:id', authMiddleware, async (c) => {
  try {
    const teamId = parseInt(c.req.param('id'));
    const userId = c.get('userId') as number;

    if (!teamId || isNaN(teamId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なチームIDです",
        error: "Invalid team ID"
      };
      return c.json(errorResponse, 400);
    }

    // チームリーダーかチェック
    const teamMember = await c.env.DB.prepare(`
      SELECT tm.role, t.idea_id
      FROM team_members tm
      JOIN teams t ON tm.team_id = t.id
      WHERE tm.team_id = ? AND tm.user_id = ?
    `).bind(teamId, userId).first();

    if (!teamMember) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "このチームのメンバーではありません",
        error: "Not a team member"
      };
      return c.json(errorResponse, 403);
    }

    if (teamMember.role !== 'leader') {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "チームリーダーのみがチームを解散できます",
        error: "Only team leader can disband team"
      };
      return c.json(errorResponse, 403);
    }

    // チームを解散状態に更新
    await c.env.DB.prepare(`
      UPDATE teams 
      SET status = 'disbanded', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(teamId).run();

    // 関連するアイデアのステータスを'open'に戻す
    await c.env.DB.prepare(`
      UPDATE ideas 
      SET status = 'open', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(teamMember.idea_id).run();

    return c.json({
      success: true,
      message: "チームを解散しました"
    });

  } catch (error) {
    console.error('Disband team error:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      message: "チーム解散中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

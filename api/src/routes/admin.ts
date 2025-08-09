import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { AppContext, User } from '../types';

const admin = new Hono<AppContext>();

// 管理者権限チェックミドルウェア
const requireAdmin = async (c: any, next: any) => {
  // デモ用：特定のユーザーIDまたはメールアドレスで管理者判定
  const user = c.get('user') as User;
  const adminIds = [1]; // デモ用：user_id 1を管理者とする
  const adminEmails = ['admin@example.com', 'raid@example.com'];
  
  if (!adminIds.includes(user.id) && !adminEmails.includes(user.email)) {
    return c.json({ error: '管理者権限が必要です' }, 403);
  }
  
  await next();
};

// 全体統計の取得
admin.get('/stats', authMiddleware, requireAdmin, async (c) => {
  try {
    const db = c.env.DB;
    
    // 基本統計
    const userCount = await db.prepare('SELECT COUNT(*) as count FROM users').first();
    const ideaCount = await db.prepare('SELECT COUNT(*) as count FROM ideas').first();
    const teamCount = await db.prepare('SELECT COUNT(*) as count FROM teams').first();
    const workCount = await db.prepare('SELECT COUNT(*) as count FROM works').first();
    const applicationCount = await db.prepare('SELECT COUNT(*) as count FROM applications').first();
    const voteCount = await db.prepare('SELECT COUNT(*) as count FROM votes').first();
    
    // 最近の活動
    const recentIdeas = await db.prepare(`
      SELECT i.*, u.username 
      FROM ideas i 
      JOIN users u ON i.user_id = u.id 
      ORDER BY i.created_at DESC 
      LIMIT 5
    `).all();
    
    const recentApplications = await db.prepare(`
      SELECT a.*, u.username, i.title 
      FROM applications a 
      JOIN users u ON a.user_id = u.id 
      JOIN ideas i ON a.idea_id = i.id 
      ORDER BY a.created_at DESC 
      LIMIT 5
    `).all();
    
    const recentWorks = await db.prepare(`
      SELECT w.*, t.name as team_name 
      FROM works w 
      JOIN teams t ON w.team_id = t.id 
      ORDER BY w.created_at DESC 
      LIMIT 5
    `).all();
    
    // ステータス別統計
    const ideaStatusStats = await db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM ideas 
      GROUP BY status
    `).all();
    
    const applicationStatusStats = await db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM applications 
      GROUP BY status
    `).all();
    
    const teamStatusStats = await db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM teams 
      GROUP BY status
    `).all();
    
    return c.json({
      stats: {
        users: userCount?.count || 0,
        ideas: ideaCount?.count || 0,
        teams: teamCount?.count || 0,
        works: workCount?.count || 0,
        applications: applicationCount?.count || 0,
        votes: voteCount?.count || 0
      },
      recentActivity: {
        ideas: recentIdeas.results || [],
        applications: recentApplications.results || [],
        works: recentWorks.results || []
      },
      statusStats: {
        ideas: ideaStatusStats.results || [],
        applications: applicationStatusStats.results || [],
        teams: teamStatusStats.results || []
      }
    });
  } catch (error) {
    console.error('管理者統計取得エラー:', error);
    return c.json({ error: '統計の取得に失敗しました' }, 500);
  }
});

// 全ユーザー一覧
admin.get('/users', authMiddleware, requireAdmin, async (c) => {
  try {
    const db = c.env.DB;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;
    
    const users = await db.prepare(`
      SELECT 
        u.id, u.email, u.username, u.bio, u.skills, u.created_at,
        COUNT(DISTINCT i.id) as idea_count,
        COUNT(DISTINCT a.id) as application_count,
        COUNT(DISTINCT tm.id) as team_count
      FROM users u
      LEFT JOIN ideas i ON u.id = i.user_id
      LEFT JOIN applications a ON u.id = a.user_id
      LEFT JOIN team_members tm ON u.id = tm.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    const totalCount = await db.prepare('SELECT COUNT(*) as count FROM users').first();
    
    return c.json({
      users: users.results || [],
      pagination: {
        page,
        limit,
        total: totalCount?.count as number || 0,
        totalPages: Math.ceil((totalCount?.count as number || 0) / limit)
      }
    });
  } catch (error) {
    console.error('ユーザー一覧取得エラー:', error);
    return c.json({ error: 'ユーザー一覧の取得に失敗しました' }, 500);
  }
});

// 全アイデア管理
admin.get('/ideas', authMiddleware, requireAdmin, async (c) => {
  try {
    const db = c.env.DB;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;
    const status = c.req.query('status');
    
    let query = `
      SELECT 
        i.*, u.username,
        COUNT(DISTINCT a.id) as application_count,
        COUNT(DISTINCT il.id) as like_count
      FROM ideas i
      JOIN users u ON i.user_id = u.id
      LEFT JOIN applications a ON i.id = a.idea_id
      LEFT JOIN idea_likes il ON i.id = il.idea_id
    `;
    
    const params = [];
    if (status) {
      query += ' WHERE i.status = ?';
      params.push(status);
    }
    
    query += ' GROUP BY i.id ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const ideas = await db.prepare(query).bind(...params).all();
    
    let countQuery = 'SELECT COUNT(*) as count FROM ideas';
    if (status) {
      countQuery += ' WHERE status = ?';
      const totalCount = await db.prepare(countQuery).bind(status).first();
      return c.json({
        ideas: ideas.results || [],
        pagination: {
          page,
          limit,
          total: totalCount?.count as number || 0,
          totalPages: Math.ceil((totalCount?.count as number || 0) / limit)
        }
      });
    } else {
      const totalCount = await db.prepare(countQuery).first();
      return c.json({
        ideas: ideas.results || [],
        pagination: {
          page,
          limit,
          total: totalCount?.count as number || 0,
          totalPages: Math.ceil((totalCount?.count as number || 0) / limit)
        }
      });
    }
  } catch (error) {
    console.error('アイデア一覧取得エラー:', error);
    return c.json({ error: 'アイデア一覧の取得に失敗しました' }, 500);
  }
});

// アイデアのステータス更新
admin.put('/ideas/:id/status', authMiddleware, requireAdmin, async (c) => {
  try {
    const ideaId = parseInt(c.req.param('id'));
    const { status } = await c.req.json();
    
    if (!['open', 'development', 'completed'].includes(status)) {
      return c.json({ error: '無効なステータスです' }, 400);
    }
    
    const db = c.env.DB;
    await db.prepare(`
      UPDATE ideas 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(status, ideaId).run();
    
    return c.json({ success: true, message: 'ステータスを更新しました' });
  } catch (error) {
    console.error('アイデアステータス更新エラー:', error);
    return c.json({ error: 'ステータスの更新に失敗しました' }, 500);
  }
});

// 全チーム管理
admin.get('/teams', authMiddleware, requireAdmin, async (c) => {
  try {
    const db = c.env.DB;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;
    
    const teams = await db.prepare(`
      SELECT 
        t.*, i.title as idea_title,
        COUNT(DISTINCT tm.id) as member_count
      FROM teams t
      JOIN ideas i ON t.idea_id = i.id
      LEFT JOIN team_members tm ON t.id = tm.team_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();
    
    const totalCount = await db.prepare('SELECT COUNT(*) as count FROM teams').first();
    
    return c.json({
      teams: teams.results || [],
      pagination: {
        page,
        limit,
        total: totalCount?.count as number || 0,
        totalPages: Math.ceil((totalCount?.count as number || 0) / limit)
      }
    });
  } catch (error) {
    console.error('チーム一覧取得エラー:', error);
    return c.json({ error: 'チーム一覧の取得に失敗しました' }, 500);
  }
});

// システム通知送信
admin.post('/notifications/system', authMiddleware, requireAdmin, async (c) => {
  try {
    const { title, message, target_type, target_ids } = await c.req.json();
    
    if (!title || !message) {
      return c.json({ error: 'タイトルとメッセージは必須です' }, 400);
    }
    
    const db = c.env.DB;
    let userIds = [];
    
    if (target_type === 'all') {
      // 全ユーザーに送信
      const users = await db.prepare('SELECT id FROM users').all();
      userIds = users.results?.map((u: any) => u.id) || [];
    } else if (target_type === 'specific' && target_ids) {
      // 特定ユーザーに送信
      userIds = target_ids;
    } else {
      return c.json({ error: '無効な送信対象です' }, 400);
    }
    
    // 通知を一括作成
    const stmt = db.prepare(`
      INSERT INTO notifications (user_id, type, title, message, is_read, created_at)
      VALUES (?, 'system', ?, ?, 0, CURRENT_TIMESTAMP)
    `);
    
    for (const userId of userIds) {
      await stmt.bind(userId, title, message).run();
    }
    
    return c.json({ 
      success: true, 
      message: `${userIds.length}人のユーザーに通知を送信しました` 
    });
  } catch (error) {
    console.error('システム通知送信エラー:', error);
    return c.json({ error: '通知の送信に失敗しました' }, 500);
  }
});

export default admin;

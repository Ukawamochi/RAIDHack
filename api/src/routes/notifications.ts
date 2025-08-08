import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { 
  AppContext, 
  User, 
  ErrorResponse 
} from "../types";

export const notificationsRoutes = new Hono<AppContext>();

// 通知一覧取得
notificationsRoutes.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as User;

    // 通知一覧を取得（未読・既読含む、最新順）
    const notifications = await c.env.DB.prepare(`
      SELECT 
        id, 
        type, 
        title, 
        message, 
        data, 
        is_read, 
        created_at
      FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `).bind(user.id).all();

    const notificationList = notifications.results.map((notification: any) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data ? JSON.parse(notification.data) : null,
      is_read: Boolean(notification.is_read),
      created_at: notification.created_at
    }));

    return c.json({
      success: true,
      notifications: notificationList
    });

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "通知一覧の取得に失敗しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 未読通知数取得
notificationsRoutes.get('/unread-count', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as User;

    const result = await c.env.DB.prepare(`
      SELECT COUNT(*) as count 
      FROM notifications 
      WHERE user_id = ? AND is_read = 0
    `).bind(user.id).first();

    return c.json({
      success: true,
      count: result?.count || 0
    });

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "未読通知数の取得に失敗しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 通知を既読にする
notificationsRoutes.put('/:id/read', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as User;
    const notificationId = c.req.param('id');

    // 通知の存在確認と権限チェック
    const notification = await c.env.DB.prepare(`
      SELECT id FROM notifications 
      WHERE id = ? AND user_id = ?
    `).bind(notificationId, user.id).first();

    if (!notification) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "通知が見つかりません",
        error: "Notification not found"
      };
      return c.json(errorResponse, 404);
    }

    // 既読にする
    await c.env.DB.prepare(`
      UPDATE notifications 
      SET is_read = 1 
      WHERE id = ? AND user_id = ?
    `).bind(notificationId, user.id).run();

    return c.json({
      success: true,
      message: "通知を既読にしました"
    });

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "通知の更新に失敗しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 全ての通知を既読にする
notificationsRoutes.put('/mark-all-read', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as User;

    await c.env.DB.prepare(`
      UPDATE notifications 
      SET is_read = 1 
      WHERE user_id = ? AND is_read = 0
    `).bind(user.id).run();

    return c.json({
      success: true,
      message: "全ての通知を既読にしました"
    });

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "通知の更新に失敗しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 通知削除
notificationsRoutes.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as User;
    const notificationId = c.req.param('id');

    // 通知の存在確認と権限チェック
    const notification = await c.env.DB.prepare(`
      SELECT id FROM notifications 
      WHERE id = ? AND user_id = ?
    `).bind(notificationId, user.id).first();

    if (!notification) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "通知が見つかりません",
        error: "Notification not found"
      };
      return c.json(errorResponse, 404);
    }

    // 通知を削除
    await c.env.DB.prepare(`
      DELETE FROM notifications 
      WHERE id = ? AND user_id = ?
    `).bind(notificationId, user.id).run();

    return c.json({
      success: true,
      message: "通知を削除しました"
    });

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "通知の削除に失敗しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 通知作成ヘルパー関数
export const createNotification = async (
  DB: any,
  userId: number,
  type: string,
  title: string,
  message: string,
  data?: any
) => {
  try {
    const dataJson = data ? JSON.stringify(data) : null;
    await DB.prepare(`
      INSERT INTO notifications (user_id, type, title, message, data, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
    `).bind(userId, type, title, message, dataJson).run();
    return true;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return false;
  }
};

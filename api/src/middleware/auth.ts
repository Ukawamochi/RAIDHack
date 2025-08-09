import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { ErrorResponse, User, AppContext } from "../types";

// JWT認証ミドルウェア
export const authMiddleware = async (c: Context<AppContext>, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "認証が必要です",
        error: "Authorization header missing or invalid"
      };
      return c.json(errorResponse, 401);
    }

    const token = authHeader.substring(7); // "Bearer " を削除
    
    // JWTトークンを検証
    const payload = await verify(token, c.env.JWT_SECRET);
    
    if (!payload.userId) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "無効なトークンです",
        error: "Invalid token payload"
      };
      return c.json(errorResponse, 401);
    }

    // データベースからユーザー情報を取得
    const user = await c.env.DB.prepare(
      `SELECT id, email, username, bio, skills, avatar_url, created_at, updated_at 
       FROM users WHERE id = ?`
    ).bind(payload.userId).first();

    if (!user) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "ユーザーが見つかりません",
        error: "User not found"
      };
      return c.json(errorResponse, 401);
    }

    // コンテキストにユーザー情報を設定
    c.set('user', {
      id: user.id as number,
      email: user.email as string,
      username: user.username as string,
      bio: (user.bio as string) || undefined,
      skills: user.skills ? JSON.parse(user.skills as string) : [],
      avatar_url: (user.avatar_url as string) || undefined,
      created_at: user.created_at as string,
      updated_at: user.updated_at as string
    } as User);
    
    c.set('userId', user.id as number);

    await next();
  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "認証エラー",
      error: error instanceof Error ? error.message : "Unknown auth error"
    };
    return c.json(errorResponse, 401);
  }
};

// オプショナル認証ミドルウェア（ログインしていなくても続行）
export const optionalAuthMiddleware = async (c: Context<AppContext>, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await verify(token, c.env.JWT_SECRET);
      
      if (payload.userId) {
        const user = await c.env.DB.prepare(
          `SELECT id, email, username, bio, skills, avatar_url, created_at, updated_at 
           FROM users WHERE id = ?`
        ).bind(payload.userId).first();

        if (user) {
          c.set('user', {
            id: user.id as number,
            email: user.email as string,
            username: user.username as string,
            bio: (user.bio as string) || undefined,
            skills: user.skills ? JSON.parse(user.skills as string) : [],
            avatar_url: (user.avatar_url as string) || undefined,
            created_at: user.created_at as string,
            updated_at: user.updated_at as string
          } as User);
          
          c.set('userId', user.id as number);
        }
      }
    }

    await next();
  } catch (error) {
    // オプショナル認証なのでエラーでも続行
    await next();
  }
};

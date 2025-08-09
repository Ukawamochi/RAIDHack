import { Hono } from "hono";
import { sign } from "hono/jwt";
import { 
  AppContext, 
  User, 
  AuthResponse, 
  ErrorResponse,
  LoginRequest,
  RegisterRequest 
} from "../types";
import { authMiddleware } from "../middleware/auth";

export const authRoutes = new Hono<AppContext>();

// ユーザー登録
authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json() as RegisterRequest;
    const { email, username, password, bio, skills } = body;

    // バリデーション
    if (!email || !username || !password) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "メール、ユーザー名、パスワードは必須です",
        error: "Missing required fields"
      };
      return c.json(errorResponse, 400);
    }

    // メールアドレスの重複チェック
    const existingUser = await c.env.DB.prepare(
      "SELECT id FROM users WHERE email = ? OR username = ?"
    ).bind(email, username).first();

    if (existingUser) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "このメールアドレスまたはユーザー名は既に使用されています",
        error: "Email or username already exists"
      };
      return c.json(errorResponse, 409);
    }

    // パスワードハッシュ化（本番環境では適切なハッシュ化ライブラリを使用）
    // ここでは簡単な例として、実際の実装では bcrypt などを使用してください
    const hashedPassword = btoa(password); // 本番では使用しないでください

    // ユーザー作成
    const skillsJson = skills ? JSON.stringify(skills) : null;
    const result = await c.env.DB.prepare(
      `INSERT INTO users (email, username, password_hash, bio, skills) 
       VALUES (?, ?, ?, ?, ?) RETURNING id`
    ).bind(email, username, hashedPassword, bio || null, skillsJson).first();

    if (!result) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "ユーザーの作成に失敗しました",
        error: "Failed to create user"
      };
      return c.json(errorResponse, 500);
    }

    const userId = result.id as number;

    // JWTトークン生成
    const token = await sign(
      { 
        userId: userId, 
        email: email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7日間有効
      },
      c.env.JWT_SECRET
    );

    // ユーザー情報を取得
    const user: User = {
      id: userId,
      email,
      username,
      bio: bio || undefined,
      skills: skills || [],
      avatar_url: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const response: AuthResponse = {
      success: true,
      message: "ユーザーが正常に作成されました",
      user,
      token
    };

    return c.json(response, 201);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "ユーザー登録中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// ユーザーログイン
authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json() as LoginRequest;
    const { email, password } = body;

    // バリデーション
    if (!email || !password) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "メールアドレスとパスワードは必須です",
        error: "Missing required fields"
      };
      return c.json(errorResponse, 400);
    }

    // ユーザー検索
    const user = await c.env.DB.prepare(
      `SELECT id, email, username, password_hash, bio, skills, avatar_url, created_at, updated_at 
      FROM users WHERE email = ?`
    ).bind(email).first();

    if (!user) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "メールアドレスまたはパスワードが正しくありません",
        error: "Invalid credentials"
      };
      return c.json(errorResponse, 401);
    }

    // パスワード検証（本番環境では適切な検証を行ってください）
    const hashedPassword = btoa(password);
    if (user.password_hash !== hashedPassword) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "メールアドレスまたはパスワードが正しくありません",
        error: "Invalid credentials"
      };
      return c.json(errorResponse, 401);
    }

    // JWTトークン生成
    const token = await sign(
      { 
        userId: user.id, 
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7日間有効
      },
      c.env.JWT_SECRET
    );

    // レスポンス用ユーザー情報
    let skills: string[] = [];
    try {
      skills = user.skills ? JSON.parse(user.skills as string) : [];
    } catch (error) {
      console.warn('Failed to parse skills JSON:', user.skills, error);
      skills = [];
    }

    const userData: User = {
      id: user.id as number,
      email: user.email as string,
      username: user.username as string,
      bio: (user.bio as string) || undefined,
      skills: skills,
      avatar_url: (user.avatar_url as string) || undefined,
      created_at: user.created_at as string,
      updated_at: user.updated_at as string
    };

    const response: AuthResponse = {
      success: true,
      message: "ログインに成功しました",
      user: userData,
      token
    };

    return c.json(response);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "ログイン中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// 現在のユーザー情報取得（認証必須）
authRoutes.get('/me', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as User;
    
    if (!user) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "認証が必要です",
        error: "Authentication required"
      };
      return c.json(errorResponse, 401);
    }

    const response = {
      success: true,
      message: "ユーザー情報を取得しました",
      user
    };

    return c.json(response);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "ユーザー情報の取得中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

// プロフィール更新（認証必須）
authRoutes.put('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as User;
    
    if (!user) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "認証が必要です",
        error: "Authentication required"
      };
      return c.json(errorResponse, 401);
    }

    const body = await c.req.json();
    const { username, bio, skills } = body;

    // バリデーション
    if (username !== undefined) {
      if (!username.trim() || username.length < 3) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "ユーザー名は3文字以上で入力してください",
          error: "Invalid username"
        };
        return c.json(errorResponse, 400);
      }

      // ユーザー名の重複チェック（自分以外）
      const existingUser = await c.env.DB.prepare(
        "SELECT id FROM users WHERE username = ? AND id != ?"
      ).bind(username, user.id).first();

      if (existingUser) {
        const errorResponse: ErrorResponse = {
          success: false,
          message: "このユーザー名は既に使用されています",
          error: "Username already exists"
        };
        return c.json(errorResponse, 409);
      }
    }

    // プロフィール更新
    const skillsJson = skills ? JSON.stringify(skills) : null;
    await c.env.DB.prepare(
      `UPDATE users 
       SET username = COALESCE(?, username), 
           bio = COALESCE(?, bio), 
           skills = COALESCE(?, skills),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`
    ).bind(
      username || null, 
      bio !== undefined ? (bio || null) : null, 
      skillsJson, 
      user.id
    ).run();

    // 更新されたユーザー情報を取得
    const updatedUser = await c.env.DB.prepare(
      `SELECT id, email, username, bio, skills, avatar_url, created_at, updated_at 
       FROM users WHERE id = ?`
    ).bind(user.id).first();

    if (!updatedUser) {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "ユーザー情報の取得に失敗しました",
        error: "Failed to fetch updated user"
      };
      return c.json(errorResponse, 500);
    }

    const userData: User = {
      id: updatedUser.id as number,
      email: updatedUser.email as string,
      username: updatedUser.username as string,
      bio: (updatedUser.bio as string) || undefined,
      skills: updatedUser.skills ? JSON.parse(updatedUser.skills as string) : [],
      avatar_url: (updatedUser.avatar_url as string) || undefined,
      created_at: updatedUser.created_at as string,
      updated_at: updatedUser.updated_at as string
    };

    const response = {
      success: true,
      message: "プロフィールを更新しました",
      user: userData
    };

    return c.json(response);

  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "プロフィール更新中にエラーが発生しました",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

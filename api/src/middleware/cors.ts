import { cors } from "hono/cors";

// CORS設定を一元管理
export const corsMiddleware = cors({
  origin: (origin) => {
    // 開発環境のURL
    const devOrigins = [
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    // 本番・PR環境のURL
    const prodOrigins = [
      'https://raidhack-web.pages.dev'
    ];
    
    // PR環境やその他のサブドメインをチェック
    const pagesDevPattern = /^https:\/\/.*\.raidhack-web\.pages\.dev$/;
    
    if (!origin) return origin; // Same-originリクエストを許可
    
    // 許可されたoriginの場合はそのまま返す、そうでなければnull
    if (devOrigins.includes(origin) || 
        prodOrigins.includes(origin) || 
        pagesDevPattern.test(origin)) {
      return origin;
    }
    
    return null;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
});

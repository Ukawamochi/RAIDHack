import { cors } from "hono/cors";

// CORS設定を一元管理
export const corsMiddleware = cors({
  origin: [
    'http://localhost:3000',          // ローカル開発（React）
    'http://localhost:5173',          // ローカル開発（Vite）
    'https://raidhack-web.pages.dev'  // 本番環境
  ],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
});

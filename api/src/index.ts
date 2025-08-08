import { Hono } from "hono";
import { cors } from "hono/cors";
import { AppContext } from "./types";
import { apiRouter } from "./routes";

const app = new Hono<AppContext>();

// CORS設定
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://raidhack-web.pages.dev'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ルートの設定
app.route("/", apiRouter);

// エラーハンドラー
app.onError((error, c) => {
  console.error('API Error:', error);
  return c.json({
    success: false,
    message: "内部サーバーエラーが発生しました",
    error: error.message
  }, 500);
});

export default app;

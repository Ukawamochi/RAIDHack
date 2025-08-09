import { Hono } from "hono";
import { AppContext } from "./types";
import { apiRouter } from "./routes";
import { corsMiddleware } from "./middleware/cors";

const app = new Hono<AppContext>();

// CORS設定
app.use('*', corsMiddleware);

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

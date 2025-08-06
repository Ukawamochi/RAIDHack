import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/error";
import { apiRouter } from "./routes";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// ミドルウェアの適用
app.use('*', corsMiddleware);

// ルートの設定
app.route("/", apiRouter);

// エラーハンドラーの設定
app.onError(errorHandler);

export default app;

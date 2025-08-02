import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// CORS設定を追加
app.use('*', cors());

app.get("/message", (c) => {
  return c.text("Hello from RAIDHack API! CI/CD is working!");
});
// メッセージエンドポイント (/api/message)
app.get("/api/message", (c) => {
  return c.text("Hello from RAIDHack API!");
});

export default app;

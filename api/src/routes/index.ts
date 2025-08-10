import { Hono } from "hono";
import { AppContext } from "../types";
import { authRoutes } from "./auth";
import { ideaRoutes } from "./ideas";
import { applicationRoutes } from "./applications";
import { teamRoutes } from "./teams";
import { workRoutes } from "./works";
import { notificationsRoutes } from "./notifications";
import adminRoutes from "./admin";
import { messageRouter } from "./message";
import { projectRoutes } from "./projects";

const apiRouter = new Hono<AppContext>();

// API v1 ルートの登録
apiRouter.route("/api/auth", authRoutes);
apiRouter.route("/api/ideas", ideaRoutes);
apiRouter.route("/api/applications", applicationRoutes);
apiRouter.route("/api/teams", teamRoutes);
apiRouter.route("/api/works", workRoutes);
apiRouter.route("/api/notifications", notificationsRoutes);
apiRouter.route("/api/admin", adminRoutes);
apiRouter.route("/api/projects", projectRoutes);

apiRouter.route("/message", messageRouter);

// ヘルスチェック
apiRouter.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "RAIDHack API"
  });
});

export { apiRouter };

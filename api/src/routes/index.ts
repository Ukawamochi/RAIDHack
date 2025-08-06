import { Hono } from "hono";
import { messageRouter } from "./message";
import { healthRouter } from "./health";

const apiRouter = new Hono();

// ルートの登録
apiRouter.route("/message", messageRouter);
apiRouter.route("/health", healthRouter);


export { apiRouter };

import { Hono } from "hono";
import { ApiResponse } from "../types";

const healthRouter = new Hono();

healthRouter.get("/", (c) => {
  // Cloudflare Workers環境では process.uptime は利用できないため、起動時間を固定値で返す
  const response: ApiResponse = {
    success: true,
    message: "API is healthy",
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: "cloudflare-workers"
    }
  };
  return c.json(response);
});

export { healthRouter };

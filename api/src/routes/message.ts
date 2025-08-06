import { Hono } from "hono";
import { ApiResponse, ErrorResponse } from "../types";

const messageRouter = new Hono();

messageRouter.get("/", (c) => {
  try {
    const response: ApiResponse = {
      success: true,
      message: "Hello from RAIDHack API! CI/CD is working!",
      data: {
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      }
    };
    return c.json(response);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    };
    return c.json(errorResponse, 500);
  }
});

export { messageRouter };

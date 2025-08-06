import { ErrorHandler } from "hono";
import { ErrorResponse } from "../types";

// グローバルエラーハンドラー
export const errorHandler: ErrorHandler = (err, c) => {
  // エラーログ出力（Cloudflare Workers のログに記録される）
console.error('API Error:', {
    message: err.message,
    stack: err.stack,
    url: c.req.url,
    method: c.req.method,
    timestamp: new Date().toISOString()
  });
  
  const errorResponse: ErrorResponse = {
    success: false,
    message: "Something went wrong",
    error: err.message
  };
  
  return c.json(errorResponse, 500);
};

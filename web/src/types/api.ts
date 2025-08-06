export interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface ApiError {
  message: string;
  status?: number;
}
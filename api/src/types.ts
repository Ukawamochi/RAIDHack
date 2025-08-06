export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}
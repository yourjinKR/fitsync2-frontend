import { authApi } from "../../../shared/apis/http";
import type { LoginRequest, LoginResponse } from "../types/member";

export const loginUser = async (request: LoginRequest) => {
  const response = await authApi.post<LoginResponse>("/api/auth/login", request);
  return response.data;
};

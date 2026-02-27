import { api } from "../../../shared/apis/http";
import type { UserRequest, UserResponse } from "../types/member";

export const createUser = async (request: UserRequest) => {
  const response = await api.post<UserResponse>("/api/users", request);
  return response.data;
};

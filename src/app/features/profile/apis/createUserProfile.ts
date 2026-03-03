import { api } from "../../../shared/apis/http";
import type { UserProfileRequest, UserProfileResponse } from "../types/profile";

export const createUserProfile = async (request: UserProfileRequest) => {
  const response = await api.post<UserProfileResponse>("/api/users/me/profile", request);
  return response.data;
};

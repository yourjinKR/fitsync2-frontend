import { api } from "../../../shared/apis/http";
import type { UserProfileRequest, UserProfileDetailResponse } from "../types/profile";

export const createUserProfile = async (request: UserProfileRequest) => {
  const response = await api.post<UserProfileDetailResponse>("/api/users/me/profile", request);
  return response.data;
};

import { api, ApiError } from "../../../shared/apis/http";
import type { UserProfileDetailResponse } from "../../../types/profile";

export const createUserProfile = async (request : UserProfileDetailResponse) => {
  try {
    const response = await api.post(
      `/api/user/profile/`,
      request
    );
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(error);
    }
  }
}
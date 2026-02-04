import { api, ApiError } from "../../../shared/apis/http";

export const getUserMyProfile = async (userId: number) => {
  try {
    const response = await api.get(`/api/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {

      if (error.code === "NOT_FOUND") {
        console.log("못 찾음");
      }
    }
  }
}
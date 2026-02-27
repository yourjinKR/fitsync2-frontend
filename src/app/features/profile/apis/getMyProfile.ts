import { api } from "../../../shared/apis/http";
import type { UserWithProfileResponse } from "../types/profile";

/**
 * 현재 인증된 사용자의 프로필 조회
 * 로그인한 사용자 본인의 프로필만 조회 가능
 *
 * @returns 사용자 및 프로필 정보
 * @throws ApiError 프로필이 없거나 인증되지 않은 경우
 */
export const getUserMyProfile = async (): Promise<UserWithProfileResponse> => {
  const response = await api.get<UserWithProfileResponse>("/api/users/me/profile");
  return response.data;
};

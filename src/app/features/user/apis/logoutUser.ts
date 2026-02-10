import { api } from "../../../shared/apis/http";

/**
 * 로그아웃 API 호출
 * 서버에서 현재 사용자의 Refresh 토큰을 삭제합니다.
 */
export const logoutUser = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

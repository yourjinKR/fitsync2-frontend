import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../apis/logoutUser";
import { tokenStore } from "../tokenStore";

/**
 * 로그아웃 mutation hook
 * 서버에 로그아웃 요청을 보내고, 성공 시 로컬 토큰을 삭제합니다.
 *
 * @returns {Object} 로그아웃 mutation 객체
 *   - mutate: 로그아웃 실행 함수
 *   - isPending: 로그아웃 진행 중 여부
 *   - isError: 로그아웃 에러 여부
 *   - error: 에러 정보
 */
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      // 서버 로그아웃 성공 후, 클라이언트의 토큰 삭제
      tokenStore.clear();
    },
  });
};

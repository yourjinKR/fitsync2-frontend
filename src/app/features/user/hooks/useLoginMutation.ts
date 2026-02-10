import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../apis/loginUser";
import type { LoginRequest } from "../types/member";
import { tokenStore } from "../tokenStore";

/**
 * 로그인 mutation hook
 * 서버에 로그인 요청을 보내고, 성공 시 토큰을 발급받아 로컬 스토리지에 저장합니다.
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (request: LoginRequest) => loginUser(request),
    onSuccess: (data) => {
      // 토큰 저장
      tokenStore.setAccess(data.accessToken);
      if (data.refreshToken) {
        tokenStore.setRefresh(data.refreshToken);
      }
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../apis/loginUser";
import type { LoginRequest } from "../types/member";

const tokenStore = {
  setAccess: (token: string) => localStorage.setItem("accessToken", token),
  setRefresh: (token: string) => localStorage.setItem("refreshToken", token),
};

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

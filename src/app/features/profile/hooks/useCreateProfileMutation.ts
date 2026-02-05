import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserProfile } from "../apis/createUserProfile";
import { profileQueryKeys } from "./useMyProfileQuery";
import type { UserProfileRequest } from "../types/profile";

export const useCreateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UserProfileRequest) => createUserProfile(request),
    onSuccess: (data, variables) => {
      // 프로필 생성 후 내 프로필 쿼리 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.my(variables.userId),
      });
    },
  });
};

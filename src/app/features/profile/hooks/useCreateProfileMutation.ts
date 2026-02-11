import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserProfile } from "../apis/createUserProfile";
import type { UserProfileRequest } from "../types/profile";
import { profileQueryKeys } from "../profileQueryKeys";

/**
 * 프로필 생성 mutation hook
 * 프로필을 생성하고 성공 시 프로필 쿼리 캐시를 무효화
 *
 * @returns {Object} 프로필 생성 mutation 객체
 *   - mutate: 프로필 생성 실행 함수
 *   - isPending: 생성 중 여부
 *   - isError: 에러 발생 여부
 *   - error: 에러 정보
 */
export const useCreateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UserProfileRequest) => createUserProfile(request),
    onSuccess: () => {
      // 프로필 생성 후 현재 사용자의 프로필 쿼리 캐시 무효화
      // 다음 useMyProfileQuery 호출 시 서버에서 최신 데이터 조회
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.myProfile(),
      });
    },
  });
};

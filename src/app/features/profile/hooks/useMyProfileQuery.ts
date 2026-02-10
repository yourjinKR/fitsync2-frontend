import { useQuery } from "@tanstack/react-query";
import { getUserMyProfile } from "../apis/getMyProfile";
import { ApiError } from "../../../shared/apis/http";
import { profileQueryKeys } from "../profileQueryKeys";

/**
 * 현재 인증된 사용자의 프로필 조회 hook
 * 로그인한 사용자 본인의 프로필 정보를 React Query로 관리
 *
 * @returns {Object} 프로필 쿼리 결과
 *   - data: 사용자 및 프로필 정보
 *   - isLoading: 로딩 중 여부
 *   - isError: 에러 발생 여부
 *   - error: 에러 정보 (404일 경우 retry하지 않음)
 */
export const useMyProfileQuery = () => {
  return useQuery({
    queryKey: profileQueryKeys.myProfile(),
    queryFn: () => getUserMyProfile(),
    retry: (failureCount, error) => {
      // 404 에러 (프로필 미존재)는 재시도하지 않음
      if (error instanceof ApiError && error.status === 404 && error.code === "NOT_FOUND") {
        return false;
      }
      return failureCount < 2;
    },
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInBodyRecord } from "../apis/createInBodyRecord";
import type { InBodyRecordRequest } from "../types/profile";
import { profileQueryKeys } from "../profileQueryKeys";

/**
 * 인바디 기록 생성 mutation hook
 * 사용자의 체성분 측정 데이터를 추가하고 성공 시 프로필 캐시 무효화
 *
 * @returns {Object} 인바디 기록 생성 mutation 객체
 *   - mutate: 인바디 기록 생성 실행 함수
 *   - isPending: 생성 중 여부
 *   - isError: 에러 발생 여부
 *   - error: 에러 정보
 */
export const useCreateInBodyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: InBodyRecordRequest) => createInBodyRecord(request),
    onSuccess: () => {
      // 인바디 기록 생성 후 현재 사용자의 프로필 쿼리 캐시 무효화
      // 다음 useMyProfileQuery 호출 시 서버에서 최신 데이터(업데이트된 체성분) 조회
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.myProfile(),
      });
    },
  });
};

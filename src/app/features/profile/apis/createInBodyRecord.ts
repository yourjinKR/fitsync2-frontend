import { api } from "../../../shared/apis/http";
import type { InBodyRecordRequest } from "../types/profile";

export interface InBodyRecordResponse {
  id: number;
}

/**
 * 인바디 기록 생성
 * 사용자의 새로운 체성분 측정 데이터를 저장
 *
 * @param request 인바디 기록 요청 정보
 * @returns 생성된 인바디 기록의 ID
 * @throws ApiError 요청 실패 또는 검증 오류
 */
export const createInBodyRecord = async (
  request: InBodyRecordRequest
): Promise<InBodyRecordResponse> => {
  const response = await api.post<InBodyRecordResponse>(
    "/api/user/profile/inbody",
    request
  );
  return response.data;
};

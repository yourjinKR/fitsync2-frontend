import { api } from "../../../shared/apis/http";
import type { BodyDetailPartListResponse } from "../types/exercise";

export const getBodyDetailPartList = async (): Promise<BodyDetailPartListResponse[]> => {
  const response = await api.get<BodyDetailPartListResponse[]>("/api/exercises/body-detail-parts");
  return response.data;
};


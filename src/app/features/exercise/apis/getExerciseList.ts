import { api } from "../../../shared/apis/http";
import type { ExerciseListRequest, ExerciseListResponse } from "../types/exercise";

export const getExerciseList = async (
  params?: ExerciseListRequest,
): Promise<ExerciseListResponse> => {
  const response = await api.get<ExerciseListResponse>("/api/exercises", { params });
  return response.data;
};

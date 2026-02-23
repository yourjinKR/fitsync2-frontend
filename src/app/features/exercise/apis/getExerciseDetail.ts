import { api } from "../../../shared/apis/http";
import type { ExerciseDetailResponse } from "../types/exercise";

export const getExerciseDetail = async (exerciseId: number): Promise<ExerciseDetailResponse> => {
  const response = await api.get<ExerciseDetailResponse>(`/api/exercises/${exerciseId}`);
  return response.data;
};


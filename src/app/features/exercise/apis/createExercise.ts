import { api } from "../../../shared/apis/http";
import type { ExerciseRequest, ExerciseResponse } from "../types/exercise";

export const createExercise = async (request: ExerciseRequest): Promise<ExerciseResponse> => {
  const response = await api.post<ExerciseResponse>("/api/exercises", request);
  return response.data;
};


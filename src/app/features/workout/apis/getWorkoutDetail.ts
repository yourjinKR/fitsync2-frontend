import { api } from "../../../shared/apis/http";
import type { WorkoutDetailResponse } from "../types/workout";

export const getWorkoutDetail = async (workoutId: number): Promise<WorkoutDetailResponse> => {
  const response = await api.get<WorkoutDetailResponse>(`/api/workouts/${workoutId}`);
  return response.data;
};

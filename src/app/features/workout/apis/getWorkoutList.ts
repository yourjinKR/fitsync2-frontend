import { api } from "../../../shared/apis/http";
import type { WorkoutListRequest, WorkoutListResponse } from "../types/workout";

export const getWorkoutList = async (
  params?: WorkoutListRequest,
): Promise<WorkoutListResponse> => {
  const response = await api.get<WorkoutListResponse>("/api/workouts", { params });
  return response.data;
};

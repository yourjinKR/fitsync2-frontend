import { api } from "../../../shared/apis/http";
import type { WorkoutRequest, WorkoutResponse } from "../types/workout";

export const createWorkout = async (request: WorkoutRequest): Promise<WorkoutResponse> => {
  const response = await api.post<WorkoutResponse>("/api/workouts", request);
  return response.data;
};


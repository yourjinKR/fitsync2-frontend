import { api } from "../../../shared/apis/http";
import type { WorkoutListRequest, WorkoutListResponse } from "../types/workout";

const toSearchParams = (params?: WorkoutListRequest): URLSearchParams => {
  const searchParams = new URLSearchParams();
  if (!params) return searchParams;

  if (typeof params.ownerId === "number") searchParams.set("ownerId", String(params.ownerId));
  if (typeof params.page === "number") searchParams.set("page", String(params.page));
  if (typeof params.size === "number") searchParams.set("size", String(params.size));

  const sorts = Array.isArray(params.sort) ? params.sort : params.sort ? [params.sort] : [];
  sorts.forEach((sort) => searchParams.append("sort", sort));

  return searchParams;
};

export const getWorkoutList = async (
  params?: WorkoutListRequest,
): Promise<WorkoutListResponse> => {
  const response = await api.get<WorkoutListResponse>("/api/workouts", {
    params: toSearchParams(params),
  });
  return response.data;
};

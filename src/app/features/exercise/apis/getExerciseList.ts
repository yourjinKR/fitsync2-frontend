import { api } from "../../../shared/apis/http";
import type { ExerciseListRequest, ExerciseListResponse } from "../types/exercise";

const toSearchParams = (params?: ExerciseListRequest): URLSearchParams => {
  const searchParams = new URLSearchParams();
  if (!params) return searchParams;

  if (params.category) searchParams.set("category", params.category);
  if (typeof params.hidden === "boolean") searchParams.set("hidden", String(params.hidden));
  if (typeof params.page === "number") searchParams.set("page", String(params.page));
  if (typeof params.size === "number") searchParams.set("size", String(params.size));

  const sorts = Array.isArray(params.sort) ? params.sort : params.sort ? [params.sort] : [];
  sorts.forEach((sort) => searchParams.append("sort", sort));

  return searchParams;
};

export const getExerciseList = async (
  params?: ExerciseListRequest,
): Promise<ExerciseListResponse> => {
  const response = await api.get<ExerciseListResponse>("/api/exercises", {
    params: toSearchParams(params),
  });
  return response.data;
};

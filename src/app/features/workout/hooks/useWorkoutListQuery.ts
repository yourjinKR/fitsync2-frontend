import { useQuery } from "@tanstack/react-query";
import { getWorkoutList } from "../apis/getWorkoutList";
import { workoutQueryKeys } from "../workoutQueryKeys";
import type { WorkoutListRequest } from "../types/workout";

export const useWorkoutListQuery = (params?: WorkoutListRequest) => {
  return useQuery({
    queryKey: workoutQueryKeys.list(params),
    queryFn: () => getWorkoutList(params),
  });
};


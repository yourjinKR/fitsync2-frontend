import { useQuery } from "@tanstack/react-query";
import { getWorkoutDetail } from "../apis/getWorkoutDetail";
import { workoutQueryKeys } from "../workoutQueryKeys";

export const useWorkoutDetailQuery = (workoutId: number) => {
  return useQuery({
    queryKey: workoutQueryKeys.detail(workoutId),
    queryFn: () => getWorkoutDetail(workoutId),
    enabled: Number.isFinite(workoutId) && workoutId > 0,
  });
};


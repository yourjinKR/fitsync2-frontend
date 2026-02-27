import { useQuery } from "@tanstack/react-query";
import { getExerciseDetail } from "../apis/getExerciseDetail";
import { exerciseQueryKeys } from "../exerciseQueryKeys";

export const useExerciseDetailQuery = (exerciseId: number) => {
  return useQuery({
    queryKey: exerciseQueryKeys.detail(exerciseId),
    queryFn: () => getExerciseDetail(exerciseId),
    enabled: Number.isFinite(exerciseId) && exerciseId > 0,
  });
};


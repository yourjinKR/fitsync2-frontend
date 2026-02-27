import { useQuery } from "@tanstack/react-query";
import { getExerciseList } from "../apis/getExerciseList";
import { exerciseQueryKeys } from "../exerciseQueryKeys";
import type { ExerciseListRequest } from "../types/exercise";

export const useExerciseListQuery = (params?: ExerciseListRequest) => {
  return useQuery({
    queryKey: exerciseQueryKeys.list(params),
    queryFn: () => getExerciseList(params),
  });
};


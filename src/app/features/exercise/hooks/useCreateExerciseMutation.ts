import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExercise } from "../apis/createExercise";
import { exerciseQueryKeys } from "../exerciseQueryKeys";
import type { ExerciseRequest } from "../types/exercise";

export const useCreateExerciseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ExerciseRequest) => createExercise(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.all });
    },
  });
};


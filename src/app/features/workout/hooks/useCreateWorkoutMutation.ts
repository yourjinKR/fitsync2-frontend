import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkout } from "../apis/createWorkout";
import { workoutQueryKeys } from "../workoutQueryKeys";
import type { WorkoutRequest } from "../types/workout";

export const useCreateWorkoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: WorkoutRequest) => createWorkout(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all });
    },
  });
};


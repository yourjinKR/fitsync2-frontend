export const workoutQueryKeys = {
  all: ["workout"] as const,
  list: (params?: Record<string, unknown>) => ["workout", "list", params ?? {}] as const,
  detail: (workoutId: number) => ["workout", "detail", workoutId] as const,
};


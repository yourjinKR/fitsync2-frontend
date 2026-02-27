export const exerciseQueryKeys = {
  all: ["exercise"] as const,
  bodyDetailParts: () => ["exercise", "body-detail-parts"] as const,
  list: (params?: Record<string, unknown>) => ["exercise", "list", params ?? {}] as const,
  detail: (exerciseId: number) => ["exercise", "detail", exerciseId] as const,
};

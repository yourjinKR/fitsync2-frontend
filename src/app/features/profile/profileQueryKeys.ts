export const profileQueryKeys = {
  all : ["profile"] as const,
  my : (userId: number) => [...profileQueryKeys.all, "my", userId] as const,
};
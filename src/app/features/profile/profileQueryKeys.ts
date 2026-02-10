/**
 * React Query를 위한 프로필 관련 query key factory
 * Query key는 쿼리 캐시를 관리하고 무효화할 때 사용됨
 */
export const profileQueryKeys = {
  all: ["profile"] as const,
  // 현재 사용자(본인)의 프로필
  myProfile: () => [...profileQueryKeys.all, "me"] as const,
} as const;
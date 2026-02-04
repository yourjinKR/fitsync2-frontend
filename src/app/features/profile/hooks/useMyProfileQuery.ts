import { useQuery } from "@tanstack/react-query";
import { getUserMyProfile } from "../apis/getMyProfile";
import { ApiError } from "../../../shared/apis/http";

export const profileQueryKeys = {
  all : ["profile"] as const,
  my : (userId: number) => [...profileQueryKeys.all, "my", userId] as const,
};

export const useMyProfileQuery = (userId?: number) => {
  return useQuery({
    queryKey: userId ? profileQueryKeys.my(userId) : profileQueryKeys.all,
    queryFn: () => getUserMyProfile(userId as number),
    enabled: typeof userId === "number",
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404 && error.code == "NOT_FOUND") {
        return false
      }
      return failureCount < 2;
    }
  })
};
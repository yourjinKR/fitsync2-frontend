import { useQuery } from "@tanstack/react-query";
import { getUserMyProfile } from "../apis/getMyProfile";
import { ApiError } from "../../../shared/apis/http";
import { profileQueryKeys } from "../profileQueryKeys";

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
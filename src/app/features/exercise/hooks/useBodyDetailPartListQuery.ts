import { useQuery } from "@tanstack/react-query";
import { getBodyDetailPartList } from "../apis/getBodyDetailPartList";
import { exerciseQueryKeys } from "../exerciseQueryKeys";

export const useBodyDetailPartListQuery = () => {
  return useQuery({
    queryKey: exerciseQueryKeys.bodyDetailParts(),
    queryFn: () => getBodyDetailPartList(),
  });
};


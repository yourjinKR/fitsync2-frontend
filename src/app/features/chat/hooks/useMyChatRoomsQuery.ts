import { useQuery } from "@tanstack/react-query";
import { getMyChatRooms } from "../apis/getMyChatRooms";
import { chatQueryKeys } from "../chatQueryKeys";

export const useMyChatRoomsQuery = () => {
  return useQuery({
    queryKey: chatQueryKeys.rooms(),
    queryFn: () => getMyChatRooms(),
  });
};

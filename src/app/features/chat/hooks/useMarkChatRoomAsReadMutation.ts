import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markChatRoomAsRead } from "../apis/markChatRoomAsRead";
import { chatQueryKeys } from "../chatQueryKeys";

export const useMarkChatRoomAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: number) => markChatRoomAsRead(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

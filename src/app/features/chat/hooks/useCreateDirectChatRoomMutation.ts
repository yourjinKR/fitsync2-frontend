import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDirectChatRoom } from "../apis/createDirectChatRoom";
import { chatQueryKeys } from "../chatQueryKeys";
import type { DirectChatRoomCreateRequest } from "../types/chat";

export const useCreateDirectChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DirectChatRoomCreateRequest) => createDirectChatRoom(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

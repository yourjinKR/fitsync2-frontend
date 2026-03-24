import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupChatRoom } from "../apis/createGroupChatRoom";
import { chatQueryKeys } from "../chatQueryKeys";
import type { GroupChatRoomCreateRequest } from "../types/chat";

export const useCreateGroupChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: GroupChatRoomCreateRequest) => createGroupChatRoom(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

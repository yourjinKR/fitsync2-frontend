import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteToGroupChatRoom } from "../apis/inviteToGroupChatRoom";
import { chatQueryKeys } from "../chatQueryKeys";
import type { ChatRoomInviteRequest } from "../types/chat";

type InviteArgs = {
  roomId: number;
  request: ChatRoomInviteRequest;
};

export const useInviteToGroupChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, request }: InviteArgs) => inviteToGroupChatRoom(roomId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

import { api } from "../../../shared/apis/http";
import type { ChatRoomInviteRequest, ChatRoomResponse } from "../types/chat";

export const inviteToGroupChatRoom = async (
  roomId: number,
  request: ChatRoomInviteRequest,
): Promise<ChatRoomResponse> => {
  const response = await api.post<ChatRoomResponse>(`/api/chat/rooms/${roomId}/invite`, request);
  return response.data;
};

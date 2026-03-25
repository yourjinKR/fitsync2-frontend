import { api } from "../../../shared/apis/http";
import type { ChatRoomResponse, GroupChatRoomCreateRequest } from "../types/chat";

export const createGroupChatRoom = async (
  request: GroupChatRoomCreateRequest,
): Promise<ChatRoomResponse> => {
  const response = await api.post<ChatRoomResponse>("/api/chat/rooms/group", request);
  return response.data;
};

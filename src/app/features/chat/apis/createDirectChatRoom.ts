import { api } from "../../../shared/apis/http";
import type { ChatRoomResponse, DirectChatRoomCreateRequest } from "../types/chat";

export const createDirectChatRoom = async (
  request: DirectChatRoomCreateRequest,
): Promise<ChatRoomResponse> => {
  const response = await api.post<ChatRoomResponse>("/api/chat/rooms/direct", request);
  return response.data;
};

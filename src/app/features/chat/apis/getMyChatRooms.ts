import { api } from "../../../shared/apis/http";
import type { ChatRoomListResponse } from "../types/chat";

export const getMyChatRooms = async (): Promise<ChatRoomListResponse[]> => {
  const response = await api.get<ChatRoomListResponse[]>("/api/chat/rooms");
  return response.data;
};

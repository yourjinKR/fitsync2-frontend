import { api } from "../../../shared/apis/http";

export const markChatRoomAsRead = async (roomId: number): Promise<void> => {
  await api.post(`/api/chat/rooms/${roomId}/read`);
};

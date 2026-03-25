import { api } from "../../../shared/apis/http";
import type { ChatMessageResponse, PageResponse } from "../types/chat";

type ChatMessagesRequest = {
  roomId: number;
  page?: number;
  size?: number;
  sort?: string;
};

export const getChatMessages = async ({
  roomId,
  page = 0,
  size = 30,
  sort = "createdAt,desc",
}: ChatMessagesRequest): Promise<PageResponse<ChatMessageResponse>> => {
  const response = await api.get<PageResponse<ChatMessageResponse>>(
    `/api/chat/rooms/${roomId}/messages`,
    {
      params: { page, size, sort },
    },
  );
  return response.data;
};

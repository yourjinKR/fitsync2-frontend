import { useQuery } from "@tanstack/react-query";
import { getChatMessages } from "../apis/getChatMessages";
import { chatQueryKeys } from "../chatQueryKeys";

export const useChatMessagesQuery = (roomId?: number, page = 0, size = 30) => {
  return useQuery({
    queryKey: chatQueryKeys.messages(roomId, page, size),
    queryFn: () => getChatMessages({ roomId: roomId as number, page, size }),
    enabled: typeof roomId === "number",
  });
};

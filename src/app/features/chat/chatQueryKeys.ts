import type { QueryKey } from "@tanstack/react-query";

export const chatQueryKeys = {
  all: ["chat"] as const,
  rooms: () => [...chatQueryKeys.all, "rooms"] as const,
  messages: (roomId?: number, page = 0, size = 30): QueryKey =>
    [...chatQueryKeys.all, "messages", roomId ?? "none", page, size] as const,
};

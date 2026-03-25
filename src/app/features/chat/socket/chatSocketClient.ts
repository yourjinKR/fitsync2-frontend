import { Client } from "@stomp/stompjs";
import type { ChatMessageResponse, ChatNotificationResponse } from "../types/chat";

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL ?? "http://localhost:8080";

export const toWsEndpoint = (baseUrl: string): string => {
  const normalized = baseUrl.replace(/\/+$/, "");
  if (normalized.startsWith("https://")) {
    return `${normalized.replace("https://", "wss://")}/ws-chat`;
  }
  if (normalized.startsWith("http://")) {
    return `${normalized.replace("http://", "ws://")}/ws-chat`;
  }
  return `${normalized}/ws-chat`;
};

type ConnectChatSocketParams = {
  accessToken: string;
  roomId?: number;
  onMessage: (message: ChatMessageResponse) => void;
  onNotification: (notification: ChatNotificationResponse) => void;
  onConnectStateChange: (connected: boolean) => void;
};

export const connectChatSocket = ({
  accessToken,
  roomId,
  onMessage,
  onNotification,
  onConnectStateChange,
}: ConnectChatSocketParams): Client => {
  const wsEndpoint = toWsEndpoint(BACKEND_API_BASE_URL);
  const client = new Client({
    reconnectDelay: 3000,
    brokerURL: wsEndpoint,
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    onConnect: () => {
      onConnectStateChange(true);
      client.subscribe("/user/queue/notifications", (frame) => {
        const payload = JSON.parse(frame.body) as ChatNotificationResponse;
        onNotification(payload);
      });

      if (typeof roomId === "number") {
        client.subscribe(`/sub/chat.rooms.${roomId}`, (frame) => {
          const payload = JSON.parse(frame.body) as ChatMessageResponse;
          onMessage(payload);
        });
      }
    },
    onStompError: () => {
      onConnectStateChange(false);
    },
    onWebSocketClose: () => {
      onConnectStateChange(false);
    },
    onWebSocketError: () => {
      onConnectStateChange(false);
    },
  });

  client.activate();
  return client;
};

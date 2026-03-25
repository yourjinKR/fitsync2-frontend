export type ChatRoomType = "DIRECT" | "GROUP";
export type ChatMessageType = "TEXT" | "ENTER" | "LEAVE";

export type ChatRoomResponse = {
  roomId: number;
};

export type ChatRoomListResponse = {
  roomId: number;
  type: ChatRoomType;
  name?: string | null;
  participantUserIds: number[];
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
};

export type ChatMessageResponse = {
  id: number;
  roomId: number;
  senderUserId: number;
  senderName: string;
  type: ChatMessageType;
  content?: string | null;
  createdAt: string;
};

export type ChatSendRequest = {
  roomId: number;
  type: ChatMessageType;
  content?: string;
};

export type DirectChatRoomCreateRequest = {
  targetUserId: number;
};

export type GroupChatRoomCreateRequest = {
  name: string;
  participantUserIds: number[];
};

export type ChatRoomInviteRequest = {
  participantUserIds: number[];
};

export type ChatNotificationType = "INVITE" | "NEW_MESSAGE";

export type ChatNotificationResponse = {
  type: ChatNotificationType;
  roomId: number;
  roomName?: string | null;
  senderName?: string | null;
  message: string;
  createdAt: string;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

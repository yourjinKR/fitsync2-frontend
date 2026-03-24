// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatPage } from "./ChatPage";
import type { ChatMessageResponse } from "../features/chat/types/chat";

const mocks = vi.hoisted(() => {
  let onMessageHandler: ((message: ChatMessageResponse) => void) | null = null;
  let onConnectStateChangeHandler: ((connected: boolean) => void) | null = null;

  const publishMock = vi.fn();
  const deactivateMock = vi.fn();
  const refetchMock = vi.fn();
  const directMutateAsyncMock = vi.fn();
  const groupMutateAsyncMock = vi.fn();
  const inviteMutateAsyncMock = vi.fn();
  const markReadMutateMock = vi.fn((_roomId: number, options?: { onSuccess?: () => void }) => {
    options?.onSuccess?.();
  });
  const connectChatSocketMock = vi.fn((params: {
    onMessage: (message: ChatMessageResponse) => void;
    onNotification: (notification: unknown) => void;
    onConnectStateChange: (connected: boolean) => void;
  }) => {
    onMessageHandler = params.onMessage;
    onConnectStateChangeHandler = params.onConnectStateChange;
    params.onConnectStateChange(true);
    return {
      publish: publishMock,
      deactivate: deactivateMock,
    };
  });

  const triggerMessage = (message: ChatMessageResponse) => {
    onMessageHandler?.(message);
  };

  const setConnected = (connected: boolean) => {
    onConnectStateChangeHandler?.(connected);
  };

  return {
    roomsQueryMock: vi.fn(),
    messagesQueryMock: vi.fn(),
    useCreateDirectChatRoomMutationMock: vi.fn(),
    useCreateGroupChatRoomMutationMock: vi.fn(),
    useInviteToGroupChatRoomMutationMock: vi.fn(),
    useMarkChatRoomAsReadMutationMock: vi.fn(),
    refetchMock,
    directMutateAsyncMock,
    groupMutateAsyncMock,
    inviteMutateAsyncMock,
    markReadMutateMock,
    connectChatSocketMock,
    publishMock,
    deactivateMock,
    triggerMessage,
    setConnected,
  };
});

vi.mock("../features/chat/hooks/useMyChatRoomsQuery", () => ({
  useMyChatRoomsQuery: () => mocks.roomsQueryMock(),
}));

vi.mock("../features/chat/hooks/useChatMessagesQuery", () => ({
  useChatMessagesQuery: (...args: unknown[]) => mocks.messagesQueryMock(...args),
}));

vi.mock("../features/chat/hooks/useCreateDirectChatRoomMutation", () => ({
  useCreateDirectChatRoomMutation: () => mocks.useCreateDirectChatRoomMutationMock(),
}));

vi.mock("../features/chat/hooks/useCreateGroupChatRoomMutation", () => ({
  useCreateGroupChatRoomMutation: () => mocks.useCreateGroupChatRoomMutationMock(),
}));

vi.mock("../features/chat/hooks/useInviteToGroupChatRoomMutation", () => ({
  useInviteToGroupChatRoomMutation: () => mocks.useInviteToGroupChatRoomMutationMock(),
}));

vi.mock("../features/chat/hooks/useMarkChatRoomAsReadMutation", () => ({
  useMarkChatRoomAsReadMutation: () => mocks.useMarkChatRoomAsReadMutationMock(),
}));

vi.mock("../features/chat/socket/chatSocketClient", () => ({
  connectChatSocket: (args: unknown) => mocks.connectChatSocketMock(args as {
    onMessage: (message: ChatMessageResponse) => void;
    onNotification: (notification: unknown) => void;
    onConnectStateChange: (connected: boolean) => void;
  }),
}));

describe("ChatPage smoke checklist", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    localStorage.setItem("accessToken", "test-access-token");

    mocks.publishMock.mockReset();
    mocks.deactivateMock.mockReset();
    mocks.refetchMock.mockReset();
    mocks.directMutateAsyncMock.mockReset();
    mocks.groupMutateAsyncMock.mockReset();
    mocks.inviteMutateAsyncMock.mockReset();
    mocks.markReadMutateMock.mockReset();
    mocks.connectChatSocketMock.mockClear();

    mocks.roomsQueryMock.mockReset();
    mocks.messagesQueryMock.mockReset();
    mocks.useCreateDirectChatRoomMutationMock.mockReset();
    mocks.useCreateGroupChatRoomMutationMock.mockReset();
    mocks.useInviteToGroupChatRoomMutationMock.mockReset();
    mocks.useMarkChatRoomAsReadMutationMock.mockReset();

    mocks.roomsQueryMock.mockReturnValue({
      data: [
        {
          roomId: 1,
          type: "DIRECT",
          name: null,
          participantUserIds: [1, 2],
          lastMessage: "안녕하세요",
          lastMessageAt: "2026-03-24T00:00:00",
          unreadCount: 0,
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: mocks.refetchMock,
    });

    mocks.messagesQueryMock.mockReturnValue({
      data: {
        content: [],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    mocks.useCreateDirectChatRoomMutationMock.mockReturnValue({
      mutateAsync: mocks.directMutateAsyncMock,
      isPending: false,
    });

    mocks.useCreateGroupChatRoomMutationMock.mockReturnValue({
      mutateAsync: mocks.groupMutateAsyncMock,
      isPending: false,
    });

    mocks.useInviteToGroupChatRoomMutationMock.mockReturnValue({
      mutateAsync: mocks.inviteMutateAsyncMock,
      isPending: false,
    });

    mocks.useMarkChatRoomAsReadMutationMock.mockReturnValue({
      mutate: mocks.markReadMutateMock,
      isPending: false,
    });
  });

  it("SMOKE-CHAT-001: 방 생성 + 방 입장 플로우가 동작한다", async () => {
    mocks.directMutateAsyncMock.mockResolvedValue({ roomId: 2 });

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("1:1 대상 userId"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "1:1 생성" }));

    await waitFor(() => {
      expect(mocks.directMutateAsyncMock).toHaveBeenCalledWith({ targetUserId: 2 });
      expect(mocks.refetchMock).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText(/room-1/).closest("button") as HTMLButtonElement);

    expect(screen.getByText(/채팅방 #1/)).toBeTruthy();
    expect(mocks.connectChatSocketMock).toHaveBeenCalled();
  });

  it("SMOKE-CHAT-002: 실시간 송수신이 동작한다", async () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/room-1/).closest("button") as HTMLButtonElement);

    await waitFor(() => {
      expect(mocks.connectChatSocketMock).toHaveBeenCalled();
    });

    mocks.triggerMessage({
      id: 99,
      roomId: 1,
      senderUserId: 2,
      senderName: "target",
      type: "TEXT",
      content: "실시간 수신 메시지",
      createdAt: "2026-03-24T12:00:00",
    });

    await waitFor(() => {
      expect(screen.getByText("실시간 수신 메시지")).toBeTruthy();
    });

    fireEvent.change(screen.getByPlaceholderText("메시지를 입력하세요"), { target: { value: "보내는 메시지" } });
    fireEvent.click(screen.getByRole("button", { name: "전송" }));

    expect(mocks.publishMock).toHaveBeenCalledTimes(1);
    expect(mocks.publishMock.mock.calls[0][0]).toMatchObject({
      destination: "/pub/chat.send",
    });
  });

  it("SMOKE-CHAT-003: 연결 상태 변경(재연결 포함)을 표시한다", async () => {
    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/room-1/).closest("button") as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.getByText("실시간 연결됨")).toBeTruthy();
    });

    mocks.setConnected(false);
    await waitFor(() => {
      expect(screen.getByText("연결 중/끊김")).toBeTruthy();
    });

    mocks.setConnected(true);
    await waitFor(() => {
      expect(screen.getByText("실시간 연결됨")).toBeTruthy();
    });
  });
});

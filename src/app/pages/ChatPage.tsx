import { useEffect, useMemo, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { PageShell } from "../shared/components/ui/PageShell";
import { ErrorState } from "../shared/components/state/ErrorState";
import { LoadingState } from "../shared/components/state/LoadingState";
import { EmptyState } from "../shared/components/state/EmptyState";
import { useMyChatRoomsQuery } from "../features/chat/hooks/useMyChatRoomsQuery";
import { useChatMessagesQuery } from "../features/chat/hooks/useChatMessagesQuery";
import { useCreateDirectChatRoomMutation } from "../features/chat/hooks/useCreateDirectChatRoomMutation";
import { useCreateGroupChatRoomMutation } from "../features/chat/hooks/useCreateGroupChatRoomMutation";
import { connectChatSocket } from "../features/chat/socket/chatSocketClient";
import type { ChatMessageResponse } from "../features/chat/types/chat";

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.section`
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px;
`;

const RoomList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 12px 0 0 0;
  display: grid;
  gap: 8px;
`;

const RoomButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  border: 1px solid ${({ $active }) => ($active ? "var(--color-primary)" : "var(--color-border)")};
  background: ${({ $active }) => ($active ? "var(--color-surface-elevated)" : "var(--color-surface)")};
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const Input = styled.input`
  flex: 1;
  min-width: 120px;
`;

const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  max-height: 420px;
  overflow: auto;
`;

const MessageItem = styled.li`
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 8px;
`;

const Meta = styled.div`
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
`;

export function ChatPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<number>();
  const [directTargetUserId, setDirectTargetUserId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupParticipantIdsText, setGroupParticipantIdsText] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessageResponse[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const socketClientRef = useRef<Client | null>(null);

  const accessToken = localStorage.getItem("accessToken") ?? "";

  const roomsQuery = useMyChatRoomsQuery();
  const messagesQuery = useChatMessagesQuery(selectedRoomId, 0, 30);

  const createDirectMutation = useCreateDirectChatRoomMutation();
  const createGroupMutation = useCreateGroupChatRoomMutation();

  useEffect(() => {
    if (!selectedRoomId || !accessToken) return;

    const client = connectChatSocket({
      accessToken,
      roomId: selectedRoomId,
      onConnectStateChange: setIsSocketConnected,
      onMessage: (message) => {
        setLiveMessages((prev) => {
          if (prev.some((item) => item.id === message.id)) return prev;
          return [...prev, message];
        });
      },
    });

    socketClientRef.current = client;

    return () => {
      client.deactivate();
      setIsSocketConnected(false);
      socketClientRef.current = null;
    };
  }, [selectedRoomId, accessToken]);

  const roomItems = useMemo(() => roomsQuery.data ?? [], [roomsQuery.data]);

  const selectedRoom = useMemo(
    () => roomItems.find((room) => room.roomId === selectedRoomId),
    [roomItems, selectedRoomId],
  );

  const realtimeMessages = useMemo(() => {
    const history = messagesQuery.data?.content ?? [];
    const byId = new Map<number, ChatMessageResponse>();

    [...history, ...liveMessages].forEach((message) => byId.set(message.id, message));

    return [...byId.values()].sort((a, b) => a.id - b.id);
  }, [messagesQuery.data, liveMessages]);

  const handleCreateDirectRoom = async () => {
    const targetUserId = Number(directTargetUserId);
    if (!Number.isFinite(targetUserId) || targetUserId <= 0) return;

    const created = await createDirectMutation.mutateAsync({ targetUserId });
    setSelectedRoomId(created.roomId);
    setLiveMessages([]);
    setDirectTargetUserId("");
    roomsQuery.refetch();
  };

  const handleCreateGroupRoom = async () => {
    const participantUserIds = groupParticipantIdsText
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item) && item > 0);

    if (!groupName.trim() || participantUserIds.length < 2) return;

    const created = await createGroupMutation.mutateAsync({
      name: groupName.trim(),
      participantUserIds,
    });
    setSelectedRoomId(created.roomId);
    setLiveMessages([]);
    setGroupName("");
    setGroupParticipantIdsText("");
    roomsQuery.refetch();
  };

  const handleSendMessage = () => {
    if (!socketClientRef.current || !selectedRoomId || !messageInput.trim()) return;

    socketClientRef.current.publish({
      destination: "/pub/chat.send",
      body: JSON.stringify({
        roomId: selectedRoomId,
        type: "TEXT",
        content: messageInput.trim(),
      }),
    });

    setMessageInput("");
  };

  return (
    <PageShell title="실시간 채팅">
      <Row>
        <Link to="/">홈으로</Link>
      </Row>

      <Wrap>
        <Panel>
          <h3>채팅방</h3>

          <Row>
            <Input
              value={directTargetUserId}
              onChange={(e) => setDirectTargetUserId(e.target.value)}
              placeholder="1:1 대상 userId"
              type="number"
            />
            <button type="button" onClick={handleCreateDirectRoom} disabled={createDirectMutation.isPending}>
              1:1 생성
            </button>
          </Row>

          <Row>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="그룹 이름"
            />
          </Row>
          <Row>
            <Input
              value={groupParticipantIdsText}
              onChange={(e) => setGroupParticipantIdsText(e.target.value)}
              placeholder="그룹 userIds (예: 2,3)"
            />
            <button type="button" onClick={handleCreateGroupRoom} disabled={createGroupMutation.isPending}>
              그룹 생성
            </button>
          </Row>

          {roomsQuery.isLoading ? <LoadingState message="채팅방 목록 조회 중..." /> : null}
          {roomsQuery.isError ? <ErrorState message="채팅방 목록 조회 실패" error={roomsQuery.error} /> : null}

          {!roomsQuery.isLoading && !roomsQuery.isError ? (
            roomItems.length ? (
              <RoomList>
                {roomItems.map((room) => (
                  <li key={room.roomId}>
                    <RoomButton
                      type="button"
                      onClick={() => {
                        setSelectedRoomId(room.roomId);
                        setLiveMessages([]);
                      }}
                      $active={room.roomId === selectedRoomId}
                    >
                      <strong>{room.type === "DIRECT" ? "1:1" : "GROUP"}</strong>{" "}
                      {room.name ?? `room-${room.roomId}`}
                      <div>{room.lastMessage ?? "메시지 없음"}</div>
                    </RoomButton>
                  </li>
                ))}
              </RoomList>
            ) : (
              <EmptyState message="참여 중인 채팅방이 없습니다." />
            )
          ) : null}
        </Panel>

        <Panel>
          <h3>
            {selectedRoom ? `채팅방 #${selectedRoom.roomId}` : "채팅방을 선택하세요"}
            {" "}
            {selectedRoomId ? `(${isSocketConnected ? "연결됨" : "연결 중/끊김"})` : ""}
          </h3>

          {selectedRoomId ? (
            <>
              {messagesQuery.isLoading ? <LoadingState message="메시지 조회 중..." /> : null}
              {messagesQuery.isError ? <ErrorState message="메시지 조회 실패" error={messagesQuery.error} /> : null}

              {!messagesQuery.isLoading && !messagesQuery.isError ? (
                realtimeMessages.length ? (
                  <MessageList>
                    {realtimeMessages.map((message) => (
                      <MessageItem key={message.id}>
                        <Meta>
                          {message.senderName} (#{message.senderUserId}) · {new Date(message.createdAt).toLocaleString()}
                        </Meta>
                        <div>{message.content}</div>
                      </MessageItem>
                    ))}
                  </MessageList>
                ) : (
                  <EmptyState message="메시지가 없습니다." />
                )
              ) : null}

              <Row>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="메시지를 입력하세요"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
                <button type="button" onClick={handleSendMessage} disabled={!isSocketConnected}>
                  전송
                </button>
              </Row>
            </>
          ) : (
            <EmptyState message="좌측에서 채팅방을 선택해 주세요." />
          )}
        </Panel>
      </Wrap>
    </PageShell>
  );
}

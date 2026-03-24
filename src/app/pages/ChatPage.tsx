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
import { useInviteToGroupChatRoomMutation } from "../features/chat/hooks/useInviteToGroupChatRoomMutation";
import { useMarkChatRoomAsReadMutation } from "../features/chat/hooks/useMarkChatRoomAsReadMutation";
import { connectChatSocket } from "../features/chat/socket/chatSocketClient";
import type {
  ChatMessageResponse,
  ChatNotificationResponse,
  ChatRoomListResponse,
} from "../features/chat/types/chat";

const Root = styled.div`
  display: grid;
  gap: 14px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const StatusChip = styled.span<{ $connected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 13px;
  color: ${({ $connected }) => ($connected ? "var(--color-success)" : "var(--color-warning)")};
  background: color-mix(in oklab, ${({ $connected }) => ($connected ? "var(--color-success)" : "var(--color-warning)")} 16%, transparent);
`;

const Dot = styled.i<{ $connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $connected }) => ($connected ? "var(--color-success)" : "var(--color-warning)")};
`;

const Layout = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;

  @media (min-width: 980px) {
    grid-template-columns: 320px 1fr;
  }
`;

const Panel = styled.section`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-1);
  padding: 14px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  margin-bottom: 10px;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 120px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  background: var(--color-surface);
`;

const ActionButton = styled.button`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font-size: 14px;
  background: var(--color-surface-elevated);
`;

const PrimaryButton = styled(ActionButton)`
  border-color: var(--color-brand);
  background: color-mix(in oklab, var(--color-brand) 18%, var(--color-surface));
`;

const NotificationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
`;

const NotificationItem = styled.li`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-elevated);
  padding: 10px;
  font-size: 13px;
`;

const RoomList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  max-height: 360px;
  overflow: auto;
`;

const RoomButton = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  border: 1px solid ${({ $active }) => ($active ? "var(--color-brand)" : "var(--color-border)")};
  background: ${({ $active }) => ($active ? "var(--color-surface-elevated)" : "var(--color-surface)")};
  border-radius: var(--radius-sm);
  padding: 10px;
`;

const RoomMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
`;

const Badge = styled.span`
  min-width: 22px;
  text-align: center;
  font-size: 12px;
  border-radius: 999px;
  padding: 2px 7px;
  background: color-mix(in oklab, var(--color-brand) 18%, transparent);
  color: var(--color-brand-strong);
`;

const MessageList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  max-height: 460px;
  overflow: auto;
`;

const MessageItem = styled.li`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px;
  background: var(--color-surface);
`;

const MetaText = styled.div`
  margin-bottom: 4px;
  color: var(--color-text-secondary);
  font-size: 12px;
`;

const Footer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
`;

const parseIds = (input: string): number[] =>
  input
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v) && v > 0);

export function ChatPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<number>();
  const [directTargetUserId, setDirectTargetUserId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupParticipantIdsText, setGroupParticipantIdsText] = useState("");
  const [inviteIdsText, setInviteIdsText] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessageResponse[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [notifications, setNotifications] = useState<ChatNotificationResponse[]>([]);

  const socketClientRef = useRef<Client | null>(null);
  const refetchRoomsRef = useRef<() => Promise<unknown>>(async () => undefined);

  const accessToken = localStorage.getItem("accessToken") ?? "";

  const roomsQuery = useMyChatRoomsQuery();
  const messagesQuery = useChatMessagesQuery(selectedRoomId, 0, 30);
  const createDirectMutation = useCreateDirectChatRoomMutation();
  const createGroupMutation = useCreateGroupChatRoomMutation();
  const inviteMutation = useInviteToGroupChatRoomMutation();
  const markReadMutation = useMarkChatRoomAsReadMutation();

  const rooms = useMemo(() => roomsQuery.data ?? [], [roomsQuery.data]);
  const selectedRoom = useMemo(
    () => rooms.find((room) => room.roomId === selectedRoomId),
    [rooms, selectedRoomId],
  );
  const unreadTotal = useMemo(
    () => rooms.reduce((sum, room) => sum + (room.unreadCount ?? 0), 0),
    [rooms],
  );

  useEffect(() => {
    refetchRoomsRef.current = roomsQuery.refetch;
  }, [roomsQuery.refetch]);

  const realtimeMessages = useMemo(() => {
    const history = messagesQuery.data?.content ?? [];
    const byId = new Map<number, ChatMessageResponse>();
    [...history, ...liveMessages].forEach((m) => byId.set(m.id, m));
    return [...byId.values()].sort((a, b) => a.id - b.id);
  }, [messagesQuery.data, liveMessages]);

  useEffect(() => {
    if (!accessToken) return;

    const client = connectChatSocket({
      accessToken,
      roomId: selectedRoomId,
      onConnectStateChange: setIsSocketConnected,
      onMessage: (message) => {
        setLiveMessages((prev) => (prev.some((item) => item.id === message.id) ? prev : [...prev, message]));
      },
      onNotification: (notification) => {
        if (notification.type === "NEW_MESSAGE" && notification.roomId === selectedRoomId) {
          return;
        }
        setNotifications((prev) => [notification, ...prev].slice(0, 8));
        refetchRoomsRef.current();
      },
    });

    socketClientRef.current = client;

    return () => {
      client.deactivate();
      socketClientRef.current = null;
      setIsSocketConnected(false);
    };
  }, [accessToken, selectedRoomId]); // selected room 변경 시 room 구독 전환

  const enterRoom = (room: ChatRoomListResponse) => {
    setSelectedRoomId(room.roomId);
    setLiveMessages([]);
    markReadMutation.mutate(room.roomId, { onSuccess: () => roomsQuery.refetch() });
  };

  const handleCreateDirect = async () => {
    const targetUserId = Number(directTargetUserId);
    if (!Number.isFinite(targetUserId) || targetUserId <= 0) return;
    const created = await createDirectMutation.mutateAsync({ targetUserId });
    setDirectTargetUserId("");
    roomsQuery.refetch();
    const room = rooms.find((item) => item.roomId === created.roomId);
    if (room) enterRoom(room);
    else setSelectedRoomId(created.roomId);
  };

  const handleCreateGroup = async () => {
    const participantUserIds = parseIds(groupParticipantIdsText);
    if (!groupName.trim() || participantUserIds.length < 2) return;
    const created = await createGroupMutation.mutateAsync({
      name: groupName.trim(),
      participantUserIds,
    });
    setGroupName("");
    setGroupParticipantIdsText("");
    roomsQuery.refetch();
    const room = rooms.find((item) => item.roomId === created.roomId);
    if (room) enterRoom(room);
    else setSelectedRoomId(created.roomId);
  };

  const handleInvite = async () => {
    if (!selectedRoomId) return;
    const participantUserIds = parseIds(inviteIdsText);
    if (!participantUserIds.length) return;
    await inviteMutation.mutateAsync({ roomId: selectedRoomId, request: { participantUserIds } });
    setInviteIdsText("");
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
    markReadMutation.mutate(selectedRoomId, { onSuccess: () => roomsQuery.refetch() });
  };

  return (
    <PageShell title="실시간 채팅">
      <Root>
        <TopBar>
          <Link to="/">홈으로</Link>
          <StatusChip $connected={isSocketConnected}>
            <Dot $connected={isSocketConnected} />
            {isSocketConnected ? "실시간 연결됨" : "연결 중/끊김"}
          </StatusChip>
        </TopBar>

        <Panel>
          <SectionTitle>알림 센터 {unreadTotal > 0 ? `· unread ${unreadTotal}` : ""}</SectionTitle>
          {notifications.length ? (
            <NotificationList>
              {notifications.map((n, idx) => (
                <NotificationItem key={`${n.roomId}-${n.createdAt}-${idx}`}>
                  <strong>{n.type === "INVITE" ? "초대 알림" : "새 메시지"}</strong> · room #{n.roomId}
                  <div>{n.message}</div>
                </NotificationItem>
              ))}
            </NotificationList>
          ) : (
            <EmptyState message="새 알림이 없습니다." />
          )}
        </Panel>

        <Layout>
          <Panel>
            <SectionTitle>채팅방</SectionTitle>

            <FieldRow>
              <Input
                value={directTargetUserId}
                onChange={(e) => setDirectTargetUserId(e.target.value)}
                placeholder="1:1 대상 userId"
                type="number"
              />
              <PrimaryButton type="button" onClick={handleCreateDirect} disabled={createDirectMutation.isPending}>
                1:1 생성
              </PrimaryButton>
            </FieldRow>

            <FieldRow>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="그룹 이름"
              />
            </FieldRow>
            <FieldRow>
              <Input
                value={groupParticipantIdsText}
                onChange={(e) => setGroupParticipantIdsText(e.target.value)}
                placeholder="그룹 userIds (예: 2,3)"
              />
              <PrimaryButton type="button" onClick={handleCreateGroup} disabled={createGroupMutation.isPending}>
                그룹 생성
              </PrimaryButton>
            </FieldRow>

            {roomsQuery.isLoading ? <LoadingState message="채팅방 목록 조회 중..." /> : null}
            {roomsQuery.isError ? <ErrorState message="채팅방 목록 조회 실패" error={roomsQuery.error} /> : null}

            {!roomsQuery.isLoading && !roomsQuery.isError ? (
              rooms.length ? (
                <RoomList>
                  {rooms.map((room) => (
                    <li key={room.roomId}>
                      <RoomButton type="button" onClick={() => enterRoom(room)} $active={room.roomId === selectedRoomId}>
                        <RoomMeta>
                          <strong>{room.type === "DIRECT" ? "1:1" : "GROUP"} · {room.name ?? `room-${room.roomId}`}</strong>
                          {room.unreadCount > 0 ? <Badge>{room.unreadCount}</Badge> : null}
                        </RoomMeta>
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
            <SectionTitle>{selectedRoom ? `채팅방 #${selectedRoom.roomId}` : "채팅방을 선택하세요"}</SectionTitle>

            {selectedRoom?.type === "GROUP" ? (
              <FieldRow>
                <Input
                  value={inviteIdsText}
                  onChange={(e) => setInviteIdsText(e.target.value)}
                  placeholder="초대 userIds (예: 4,5)"
                />
                <ActionButton type="button" onClick={handleInvite} disabled={inviteMutation.isPending}>
                  초대
                </ActionButton>
              </FieldRow>
            ) : null}

            {selectedRoomId ? (
              <>
                {messagesQuery.isLoading ? <LoadingState message="메시지 조회 중..." /> : null}
                {messagesQuery.isError ? <ErrorState message="메시지 조회 실패" error={messagesQuery.error} /> : null}

                {!messagesQuery.isLoading && !messagesQuery.isError ? (
                  realtimeMessages.length ? (
                    <MessageList>
                      {realtimeMessages.map((message) => (
                        <MessageItem key={message.id}>
                          <MetaText>
                            {message.senderName} · {new Date(message.createdAt).toLocaleTimeString()}
                          </MetaText>
                          <div>{message.content}</div>
                        </MessageItem>
                      ))}
                    </MessageList>
                  ) : (
                    <EmptyState message="메시지가 없습니다." />
                  )
                ) : null}

                <Footer>
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <PrimaryButton type="button" onClick={handleSendMessage} disabled={!isSocketConnected}>
                    전송
                  </PrimaryButton>
                </Footer>
              </>
            ) : (
              <EmptyState message="좌측에서 채팅방을 선택해 주세요." />
            )}
          </Panel>
        </Layout>
      </Root>
    </PageShell>
  );
}

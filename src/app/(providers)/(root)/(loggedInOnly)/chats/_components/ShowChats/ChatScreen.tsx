"use client";

import clientApi from "@/api/clientSide/api";
import socket from "@/socket/socket";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ChatForm from "./ChatForm";
import ChatLogs from "./ChatLogs/ChatLogs";

interface ChatScreenProps {
  showChatUserId: string;
}

function ChatScreen({ showChatUserId }: ChatScreenProps) {
  const messageEndRef = useRef<HTMLUListElement | null>(null);
  const user = useAuthStore((state) => state.currentUser);
  const queryClient = useQueryClient();
  const [roomId, setRoomId] = useState(null);

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfiles", { userId: user?.userId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(user?.userId!),
  });

  const { data: targetProfile, isLoading: isTargetProfileLoading } = useQuery({
    queryKey: ["userProfiles", { userId: showChatUserId }],
    queryFn: () => clientApi.profiles.getProfileByUserId(showChatUserId),
  });

  const { data: chatLogs, isLoading: isChatLoading } = useQuery({
    queryKey: ["chats", { targetUserId: showChatUserId }],
    queryFn: () =>
      clientApi.chats.getChatsByUserIdAndTargetUserId({
        targetUserId: showChatUserId,
        userId: user?.userId!,
      }),
  });

  const handleScrollAtBottom = () => {
    if (!messageEndRef || !messageEndRef.current) return;
    messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
  };

  useEffect(() => {
    if (!targetProfile || !userProfile || !socket.connected) return;
    handleScrollAtBottom();
    if (socket.connected) {
      socket.emit(
        "enterRoom",
        user?.userId,
        targetProfile!.userId,
        userProfile!.nickname,
        () => {
          console.log("entered Room");
        }
      );
    }

    socket.on("returnRoomId", (roomId) => {
      setRoomId(roomId);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    });

    socket.on("newMessage", (targetUserId) => {
      queryClient.invalidateQueries({
        queryKey: ["chats", { targetUserId }],
      });

      handleScrollAtBottom();
    });

    return () => {
      console.log("leavedRoom");
      socket.off("disconnecting");
    };
  }, [userProfile, targetProfile, socket, chatLogs]);

  if (isChatLoading || isTargetProfileLoading || isUserProfileLoading)
    return <span>채팅 기록을 불러오는 중 ...</span>;

  return (
    <div className="grow border border-black h-[450px] relative">
      <header className="border-b border-black px-5 py-3 flex gap-x-4 items-center">
        {targetProfile?.profileImageUrl ? (
          <Image
            height={100}
            width={100}
            src={targetProfile!.profileImageUrl}
            alt="profile image"
            className="w-10 aspect-square rounded-xl"
          />
        ) : (
          <div className="w-10 aspect-square rounded-xl bg-gray-300" />
        )}
        <div className="flex flex-col">
          <span className="font-extrabold text-lg">
            {targetProfile?.nickname}
          </span>
          <span className="text-xs">{targetProfile?.email}</span>
        </div>
      </header>
      <ChatLogs
        messageEndRef={messageEndRef}
        userId={user?.userId!}
        chatLogs={chatLogs!}
        targetProfile={targetProfile!}
      />
      <ChatForm
        handlehandleScrollAtBottom={handleScrollAtBottom}
        roomId={roomId!}
        targetUserId={showChatUserId}
        userId={user?.userId!}
      />
    </div>
  );
}

export default ChatScreen;

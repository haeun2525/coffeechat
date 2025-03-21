'use client';

import { useState } from 'react';
import Image from 'next/image';
import ChatDetail from '@/components/ChatDetail';
import type { ChatRoom } from '@/types/chat';

// 임시 채팅 데이터
const CHATS: ChatRoom[] = [
  {
    id: '1',
    userId: 'user1',
    name: '김민수',
    profileImage: '/images/profile1.jpg',
    lastMessage: '안녕하세요! 커피챗 요청 수락해주셔서 감사합니다.',
    timestamp: '오전 10:30',
    unread: 2,
  },
  {
    id: '2',
    userId: 'user2',
    name: '이지원',
    profileImage: '/images/profile2.jpg',
    lastMessage: '내일 점심시간에 만나서 이야기해요!',
    timestamp: '어제',
    unread: 0,
  },
  {
    id: '3',
    userId: 'user3',
    name: '박서연',
    profileImage: '/images/profile3.jpg',
    lastMessage: '네, 알겠습니다. 그때 뵐게요!',
    timestamp: '3일 전',
    unread: 0,
  },
];

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // 모바일 화면에서 채팅방 선택 시 채팅 목록을 숨기고 채팅 상세 화면만 표시
  const handleChatSelect = (chat: ChatRoom) => {
    setActiveChat(chat);
    if (window.innerWidth < 768) {
      setIsMobileView(true);
    }
  };

  // 채팅 상세 화면에서 뒤로가기 버튼 클릭 시 채팅 목록으로 돌아감
  const handleBackToList = () => {
    if (isMobileView) {
      setIsMobileView(false);
    } else {
      setActiveChat(null);
    }
  };

  return (
    <main className="min-h-screen p-4 bg-gradient-to-b from-primary/30 to-black">
      <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)]">
        <div className="flex h-full gap-6">
          {/* 채팅 목록 (모바일에서는 채팅방 선택 시 숨김) */}
          {(!isMobileView || !activeChat) && (
            <div className="w-full md:w-1/3 bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-xl">
              {CHATS.length > 0 ? (
                <div className="divide-y divide-white/10 h-full overflow-y-auto">
                  {CHATS.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-center p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                        activeChat?.id === chat.id ? 'bg-white/10' : ''
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 relative rounded-full overflow-hidden">
                          <Image
                            src={chat.profileImage}
                            alt={chat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {chat.unread > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {chat.unread}
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-white">{chat.name}</h3>
                          <span className="text-xs text-white/60">{chat.timestamp}</span>
                        </div>
                        <p className={`text-sm ${chat.unread > 0 ? 'text-white' : 'text-white/70'} truncate`}>
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-white/30 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-white/60">아직 채팅이 없습니다.</p>
                  <p className="text-white/40 text-sm mt-2">
                    커피챗을 신청하거나 수락하면 채팅이 시작됩니다.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 채팅 상세 화면 */}
          {activeChat ? (
            <div className={`${isMobileView ? 'w-full' : 'w-full md:w-2/3'}`}>
              <ChatDetail chatRoom={activeChat} onClose={handleBackToList} />
            </div>
          ) : (
            !isMobileView && (
              <div className="hidden md:flex md:w-2/3 bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-xl items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-white/30 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-white/60">채팅방을 선택해주세요</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
} 
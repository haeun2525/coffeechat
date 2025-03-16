'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import NotificationDropdown from '@/components/NotificationDropdown';
import type { Notification } from '@/types/notification';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

// 임시 알림 데이터
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'coffee_chat_request',
    message: '김민수님이 커피챗을 제안했습니다.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    isRead: false,
    userId: '1',
    profileImage: '/images/profile1.jpg',
  },
  {
    id: '2',
    type: 'coffee_chat_accepted',
    message: '이지원님이 커피챗 제안을 수락했습니다.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    isRead: false,
    userId: '2',
    profileImage: '/images/profile2.jpg',
  },
  {
    id: '3',
    type: 'new_message',
    message: '박서연님이 새로운 메시지를 보냈습니다.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    isRead: true,
    userId: '3',
    profileImage: '/images/profile3.jpg',
  },
  {
    id: '4',
    type: 'new_favorite',
    message: '정다운님이 회원님을 찜했습니다.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2일 전
    isRead: true,
    userId: '4',
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // 읽지 않은 알림 개수 계산
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 모든 알림을 읽음으로 표시
  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // 알림 클릭 처리
  const handleNotificationClick = (notification: Notification) => {
    // 알림을 읽음으로 표시
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // 알림 타입에 따라 다른 페이지로 이동
    switch (notification.type) {
      case 'coffee_chat_request':
      case 'coffee_chat_accepted':
        router.push('/chat');
        break;
      case 'new_message':
        router.push('/chat');
        break;
      case 'new_favorite':
        router.push('/search');
        break;
    }

    // 알림 드롭다운 닫기
    setIsNotificationOpen(false);
  };

  return (
    <html lang="ko">
      <body className={`${inter.className} bg-trendy-gradient min-h-screen text-white`}>
        <div className="noise"></div>
        
        {/* 상단 바 */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-black/60 backdrop-blur-md z-40 border-b border-white/10">
          <div className="max-w-screen-xl mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                ☕️ 커피챗
              </Link>
            </div>
            <div className="relative">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="알림"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                
                {/* 읽지 않은 알림 배지 */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border border-black">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* 알림 드롭다운 */}
              <NotificationDropdown
                isOpen={isNotificationOpen}
                notifications={notifications}
                onClose={() => setIsNotificationOpen(false)}
                onMarkAllAsRead={handleMarkAllAsRead}
                onNotificationClick={handleNotificationClick}
              />
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="pt-14 pb-16 relative z-10">{children}</div>

        {/* 하단 네비게이션 바 */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-md z-40 border-t border-white/10">
          <div className="grid grid-cols-5 h-full">
            <Link
              href="/"
              className="flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-xs mt-1">홈</span>
            </Link>
            <Link
              href="/search"
              className="flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-xs mt-1">찾기</span>
            </Link>
            <Link
              href="/schedule"
              className="flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs mt-1">시간표</span>
            </Link>
            <Link
              href="/chat"
              className="flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-xs mt-1">채팅</span>
            </Link>
            <Link
              href="/profile"
              className="flex flex-col items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-xs mt-1">프로필</span>
            </Link>
          </div>
        </nav>
      </body>
    </html>
  );
}

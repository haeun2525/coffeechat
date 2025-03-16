// 알림 타입에 읽음 상태 추가
interface Notification {
  id: string;
  type: 'message' | 'request' | 'system';
  content: string;
  timestamp: string;
  isRead: boolean; // 읽음 상태 추가
  sender?: {
    name: string;
    profileImage: string;
  };
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  // 알림 상태 관리
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      content: '새로운 메시지가 도착했습니다.',
      timestamp: '방금 전',
      isRead: false,
      sender: {
        name: '김민수',
        profileImage: '/images/profile1.jpg',
      },
    },
    {
      id: '2',
      type: 'request',
      content: '커피챗 요청을 보냈습니다.',
      timestamp: '10분 전',
      isRead: false,
      sender: {
        name: '이지원',
        profileImage: '/images/profile2.jpg',
      },
    },
    // 기타 알림 데이터...
  ]);

  // 알림 읽음 처리 함수
  const handleReadNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* 알림 패널 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 z-50 w-full max-w-sm bg-card-gradient backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">알림</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-white/5 transition-colors cursor-pointer relative"
                      onClick={() => handleReadNotification(notification.id)}
                    >
                      <div className="flex">
                        {notification.sender && (
                          <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                            <Image
                              src={notification.sender.profileImage}
                              alt={notification.sender.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-white">
                              {notification.sender?.name || '시스템'}
                            </p>
                            <span className="text-xs text-white/60">{notification.timestamp}</span>
                          </div>
                          <p className="text-sm text-white/80 mt-1">{notification.content}</p>
                        </div>
                        
                        {/* 읽지 않은 알림 표시 */}
                        {!notification.isRead && (
                          <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-white/60">새로운 알림이 없습니다.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 
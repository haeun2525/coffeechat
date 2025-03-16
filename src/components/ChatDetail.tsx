import { FC, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ChatMessage, ChatRoom } from '@/types/chat';
import { scheduleToImage } from '@/utils/scheduleToImage';
import { useScheduleStore } from '@/store/scheduleStore';

interface ChatDetailProps {
  chatRoom: ChatRoom;
  onClose: () => void;
}

// 임시 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
const CURRENT_USER_ID = 'current-user';

// 임시 메시지 데이터
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: 'other-user',
    content: '안녕하세요! 커피챗 요청 수락해주셔서 감사합니다.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    type: 'text',
  },
  {
    id: '2',
    senderId: CURRENT_USER_ID,
    content: '네, 반갑습니다! 어떤 주제로 이야기하고 싶으신가요?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1시간 전
    type: 'text',
  },
  {
    id: '3',
    senderId: 'other-user',
    content: '전공 과목 선택에 대해 조언을 듣고 싶어요.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    type: 'text',
  },
];

const ChatDetail: FC<ChatDetailProps> = ({ chatRoom, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      senderId: CURRENT_USER_ID,
      content: inputMessage,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 실제 구현에서는 이미지를 서버에 업로드하고 URL을 받아와야 함
    // 여기서는 임시로 File URL을 사용
    const imageUrl = URL.createObjectURL(file);

    const newMessage: ChatMessage = {
      id: uuidv4(),
      senderId: CURRENT_USER_ID,
      content: '이미지를 보냈습니다',
      timestamp: new Date(),
      type: 'image',
      imageUrl,
    };

    setMessages([...messages, newMessage]);
    setIsOptionsOpen(false);
  };

  const handleSendSchedule = async () => {
    try {
      // 현재 학기의 시간표 가져오기
      const { semesters, currentSemesterIndex } = useScheduleStore.getState();
      const currentSemester = semesters[currentSemesterIndex];
      
      if (!currentSemester || currentSemester.courses.length === 0) {
        alert('현재 학기에 등록된 과목이 없습니다.');
        return;
      }
      
      // 시간표를 이미지로 변환
      const scheduleImage = await scheduleToImage(currentSemester.courses);
      
      const newMessage: ChatMessage = {
        id: uuidv4(),
        senderId: CURRENT_USER_ID,
        content: '시간표를 보냈습니다',
        timestamp: new Date(),
        type: 'schedule',
        scheduleImage,
      };
      
      setMessages([...messages, newMessage]);
      setIsOptionsOpen(false);
    } catch (error) {
      console.error('시간표 보내기 실패:', error);
      alert('시간표 보내기에 실패했습니다.');
    }
  };

  const formatMessageTime = (date: Date) => {
    return format(date, 'a h:mm', { locale: ko });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-primary/30 to-black/80 rounded-3xl overflow-hidden border border-white/10">
      {/* 채팅방 헤더 - 스크롤해도 고정되도록 sticky 적용 */}
      <div className="sticky top-0 z-10 flex items-center p-4 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors mr-2"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex items-center">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image
              src={chatRoom.profileImage}
              alt={chatRoom.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-white">{chatRoom.name}</h3>
            <p className="text-xs text-white/60">온라인</p>
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === CURRENT_USER_ID ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.senderId !== CURRENT_USER_ID && (
              <div className="w-8 h-8 relative rounded-full overflow-hidden mr-2 mt-1">
                <Image
                  src={chatRoom.profileImage}
                  alt={chatRoom.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="max-w-[70%]">
              {message.type === 'text' && (
                <div
                  className={`rounded-2xl px-4 py-2 inline-block ${
                    message.senderId === CURRENT_USER_ID
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white/10 backdrop-blur-sm text-white rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              )}

              {message.type === 'image' && message.imageUrl && (
                <div
                  className={`rounded-2xl overflow-hidden ${
                    message.senderId === CURRENT_USER_ID ? 'rounded-tr-none' : 'rounded-tl-none'
                  }`}
                >
                  <div className="relative w-60 h-60">
                    <Image
                      src={message.imageUrl}
                      alt="Shared image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {message.type === 'schedule' && message.scheduleImage && (
                <div
                  className={`rounded-2xl overflow-hidden ${
                    message.senderId === CURRENT_USER_ID ? 'rounded-tr-none' : 'rounded-tl-none'
                  }`}
                >
                  <div className="relative w-60 h-40">
                    <Image
                      src={message.scheduleImage}
                      alt="Schedule"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div
                    className={`px-3 py-2 text-sm ${
                      message.senderId === CURRENT_USER_ID
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    시간표
                  </div>
                </div>
              )}

              <div
                className={`text-xs mt-1 text-white/60 ${
                  message.senderId === CURRENT_USER_ID ? 'text-right' : 'text-left'
                }`}
              >
                {formatMessageTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <div className="p-3 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>

            {/* 옵션 메뉴 */}
            {isOptionsOpen && (
              <div className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-xl shadow-xl border border-white/10 overflow-hidden">
                <div className="w-48">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 text-white flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    사진 보내기
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={handleSendSchedule}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 text-white flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 text-white/80"
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
                    시간표 보내기
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 bg-white/10 rounded-full px-4 py-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지 입력..."
              className="w-full bg-transparent text-white outline-none"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === ''}
            className={`p-2 rounded-full ${
              inputMessage.trim() === ''
                ? 'text-white/40 cursor-not-allowed'
                : 'text-white bg-primary hover:bg-primary-light'
            } transition-colors`}
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail; 
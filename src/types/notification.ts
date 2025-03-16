export type NotificationType = 
  | 'coffee_chat_request' 
  | 'coffee_chat_accepted' 
  | 'new_message' 
  | 'new_favorite';

export interface Notification {
  id: string;
  type: 'coffee_chat_request' | 'coffee_chat_accepted' | 'new_message' | 'new_favorite';
  message: string;
  timestamp: Date;
  isRead: boolean;
  userId: string; // 알림과 관련된 사용자 ID
  profileImage?: string; // 관련 사용자의 프로필 이미지
} 
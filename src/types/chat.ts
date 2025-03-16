export interface ChatRoom {
  id: string;
  userId: string;
  name: string;
  profileImage: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'schedule';
  imageUrl?: string;
  scheduleImage?: string;
} 
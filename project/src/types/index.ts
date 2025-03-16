export interface User {
  id: string;
  email: string;
  full_name: string;
  department: string;
  year: number;
  interests: string[];
  experiences: string[];
  avatar_url?: string;
  created_at: string;
}

export interface TimeSlot {
  id: string;
  user_id: string;
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
  start_time: string;
  end_time: string;
  semester: string;
}

export interface Course {
  id: string;
  user_id: string;
  name: string;
  professor?: string;
  location?: string;
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
  start_time: string;
  end_time: string;
  semester: string;
  created_at: string;
}

export interface ChatRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  proposed_time: string;
  message: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_request_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export type Semester = {
  year: number;
  term: '1' | 'S' | '2' | 'W';
  label: string;
};
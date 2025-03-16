export interface User {
  id: string;
  name: string;
  major: string;
  year: number;
  bio: string;
  interests: string[];
  profileImage: string;
  availability: {
    day: string;
    slots: string[];
  }[];
  department: string;
  studentId: string;
  hasSentRequest?: boolean;
} 
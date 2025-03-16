export interface Course {
  id: string;
  name: string;
  professor?: string;
  location?: string;
  dayOfWeek: number; // 0-5 (월-토)
  startTime: string; // 형식: "09:00", "14:30" 등
  endTime: string; // 형식: "10:30", "16:00" 등
  color: string;
}

export interface Semester {
  id: string;
  name: string; // 예: "2024년 1학기"
  courses: Course[];
} 
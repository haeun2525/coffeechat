export interface Course {
  id: string;
  name: string;
  professor?: string;
  location?: string;
  dayOfWeek: number; // 0-4 (월-금)
  startTime: number; // 9-22 (시간)
  duration: number; // 시간 단위
  color: string;
}

export interface Semester {
  id: string;
  name: string; // 예: "2024년 1학기"
  courses: Course[];
} 
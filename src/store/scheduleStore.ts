import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Course, Semester } from '@/types/schedule';

// 초기 학기 데이터
const INITIAL_SEMESTERS: Semester[] = [
  {
    id: '2024-1',
    name: '2024년 1학기',
    courses: []
  },
  {
    id: '2024-2',
    name: '2024년 2학기',
    courses: []
  }
];

interface ScheduleState {
  semesters: Semester[];
  currentSemesterIndex: number;
  selectedCourse: Course | null;
  
  // 액션
  setSemesters: (semesters: Semester[]) => void;
  setCurrentSemesterIndex: (index: number) => void;
  setSelectedCourse: (course: Course | null) => void;
  
  // 과목 관리
  addCourse: (semesterIndex: number, course: Omit<Course, 'id'>) => void;
  updateCourse: (semesterIndex: number, courseId: string, course: Omit<Course, 'id'>) => void;
  deleteCourse: (semesterIndex: number, courseId: string) => void;
  
  // 학기 관리
  addSemester: (semester: Omit<Semester, 'id'>) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  semesters: INITIAL_SEMESTERS,
  currentSemesterIndex: 0,
  selectedCourse: null,
  
  setSemesters: (semesters) => set({ semesters }),
  setCurrentSemesterIndex: (index) => set({ currentSemesterIndex: index }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  
  addCourse: (semesterIndex, courseData) => set((state) => {
    const newCourse = {
      ...courseData,
      id: uuidv4(),
    };
    
    const updatedSemesters = [...state.semesters];
    updatedSemesters[semesterIndex] = {
      ...updatedSemesters[semesterIndex],
      courses: [...updatedSemesters[semesterIndex].courses, newCourse],
    };
    
    return { semesters: updatedSemesters };
  }),
  
  updateCourse: (semesterIndex, courseId, courseData) => set((state) => {
    const updatedSemesters = [...state.semesters];
    updatedSemesters[semesterIndex] = {
      ...updatedSemesters[semesterIndex],
      courses: updatedSemesters[semesterIndex].courses.map((course) =>
        course.id === courseId ? { ...courseData, id: courseId } : course
      ),
    };
    
    return { semesters: updatedSemesters };
  }),
  
  deleteCourse: (semesterIndex, courseId) => set((state) => {
    const updatedSemesters = [...state.semesters];
    updatedSemesters[semesterIndex] = {
      ...updatedSemesters[semesterIndex],
      courses: updatedSemesters[semesterIndex].courses.filter(
        (course) => course.id !== courseId
      ),
    };
    
    return { semesters: updatedSemesters };
  }),
  
  addSemester: (semesterData) => set((state) => {
    const newSemester = {
      ...semesterData,
      id: uuidv4(),
    };
    
    return { 
      semesters: [newSemester, ...state.semesters],
      currentSemesterIndex: 0
    };
  }),
})); 
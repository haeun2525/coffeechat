'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, addMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import TimeTable from '@/components/TimeTable';
import CourseFormModal from '@/components/CourseFormModal';
import type { Course, Semester } from '@/types/schedule';

// 임시 데이터
const INITIAL_SEMESTERS: Semester[] = [
  {
    id: '2024-1',
    name: '2024년 1학기',
    courses: [
      {
        id: '1',
        name: '웹 프로그래밍',
        professor: '김교수',
        location: '공학관 401',
        dayOfWeek: 1,
        startTime: 9,
        duration: 2,
        color: '#4F46E5',
      },
      {
        id: '2',
        name: '데이터베이스',
        professor: '이교수',
        location: '공학관 505',
        dayOfWeek: 3,
        startTime: 14,
        duration: 3,
        color: '#EC4899',
      },
      {
        id: '3',
        name: '인공지능 개론',
        professor: '박교수',
        location: '과학관 302',
        dayOfWeek: 0,
        startTime: 13,
        duration: 2,
        color: '#10B981',
      },
      {
        id: '4',
        name: '컴퓨터 네트워크',
        professor: '최교수',
        location: '공학관 201',
        dayOfWeek: 2,
        startTime: 10,
        duration: 2,
        color: '#F59E0B',
      },
    ],
  },
  {
    id: '2023-2',
    name: '2023년 2학기',
    courses: [
      {
        id: '5',
        name: '자료구조',
        professor: '정교수',
        location: '공학관 301',
        dayOfWeek: 1,
        startTime: 10,
        duration: 2,
        color: '#3B82F6',
      },
      {
        id: '6',
        name: '알고리즘',
        professor: '한교수',
        location: '공학관 402',
        dayOfWeek: 3,
        startTime: 13,
        duration: 2,
        color: '#8B5CF6',
      },
    ],
  },
];

export default function SchedulePage() {
  const [semesters, setSemesters] = useState<Semester[]>(INITIAL_SEMESTERS);
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [isSemesterListOpen, setIsSemesterListOpen] = useState(false);
  const [currentDate] = useState(new Date());

  const currentSemester = semesters[currentSemesterIndex];

  const handleAddCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse = {
      ...courseData,
      id: uuidv4(),
    };

    setSemesters(prev => {
      const updated = [...prev];
      updated[currentSemesterIndex] = {
        ...updated[currentSemesterIndex],
        courses: [...updated[currentSemesterIndex].courses, newCourse],
      };
      return updated;
    });
    setIsModalOpen(false);
  };

  const handleEditCourse = (courseData: Omit<Course, 'id'>) => {
    if (!selectedCourse) return;

    setSemesters(prev => {
      const updated = [...prev];
      updated[currentSemesterIndex] = {
        ...updated[currentSemesterIndex],
        courses: updated[currentSemesterIndex].courses.map(course =>
          course.id === selectedCourse.id
            ? { ...courseData, id: course.id }
            : course
        ),
      };
      return updated;
    });
    setIsModalOpen(false);
    setSelectedCourse(undefined);
  };

  const handleDeleteCourse = () => {
    if (!selectedCourse) return;
    
    if (confirm('이 과목을 삭제하시겠습니까?')) {
      setSemesters(prev => {
        const updated = [...prev];
        updated[currentSemesterIndex] = {
          ...updated[currentSemesterIndex],
          courses: updated[currentSemesterIndex].courses.filter(
            course => course.id !== selectedCourse.id
          ),
        };
        return updated;
      });
      setIsModalOpen(false);
      setSelectedCourse(undefined);
    }
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleChangeSemester = (index: number) => {
    setCurrentSemesterIndex(index);
    setIsSemesterListOpen(false);
  };

  const handleAddSemester = () => {
    const now = new Date();
    const nextMonth = addMonths(now, 4);
    const year = format(nextMonth, 'yyyy');
    const semester = parseInt(format(nextMonth, 'M')) <= 6 ? '1' : '2';
    
    const newSemester: Semester = {
      id: `${year}-${semester}`,
      name: `${year}년 ${semester}학기`,
      courses: [],
    };
    
    setSemesters(prev => [newSemester, ...prev]);
    setCurrentSemesterIndex(0);
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-glass backdrop-blur-glass rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative">
              <button
                onClick={() => setIsSemesterListOpen(!isSemesterListOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors rounded-xl px-4 py-2"
              >
                <h1 className="text-xl font-bold text-white">
                  {currentSemester.name}
                </h1>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isSemesterListOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 학기 선택 드롭다운 */}
              {isSemesterListOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 rounded-xl shadow-xl z-10 border border-white/10 overflow-hidden">
                  <div className="p-2">
                    <button
                      onClick={handleAddSemester}
                      className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
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
                      새 학기 추가
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {semesters.map((semester, index) => (
                      <button
                        key={semester.id}
                        onClick={() => handleChangeSemester(index)}
                        className={`w-full text-left px-4 py-3 hover:bg-white/10 ${
                          index === currentSemesterIndex
                            ? 'bg-primary/30'
                            : ''
                        }`}
                      >
                        <div className="font-medium">{semester.name}</div>
                        <div className="text-xs text-white/60">
                          {semester.courses.length}개 과목
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-white/60">
                {format(currentDate, 'yyyy년 MM월 dd일', { locale: ko })}
              </div>
              <button
                onClick={() => {
                  setSelectedCourse(undefined);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-xl 
                          transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
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
                과목 추가
              </button>
            </div>
          </div>
        </div>

        {/* 시간표 */}
        <div className="bg-glass backdrop-blur-glass rounded-2xl p-6 border border-white/10">
          <TimeTable
            courses={currentSemester.courses}
            onCourseClick={handleCourseClick}
            currentDate={currentDate}
          />
        </div>
      </div>

      {/* 과목 추가/수정 모달 */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourse(undefined);
        }}
        onSubmit={selectedCourse ? handleEditCourse : handleAddCourse}
        onDelete={selectedCourse ? handleDeleteCourse : undefined}
        initialData={selectedCourse}
      />
    </main>
  );
} 
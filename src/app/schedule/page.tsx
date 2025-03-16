'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, addMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import TimeTable from '@/components/TimeTable';
import CourseFormModal from '@/components/CourseFormModal';
import type { Course } from '@/types/schedule';
import { useScheduleStore } from '@/store/scheduleStore';

export default function SchedulePage() {
  const { 
    semesters, 
    currentSemesterIndex, 
    setCurrentSemesterIndex,
    addCourse,
    updateCourse,
    deleteCourse,
    addSemester
  } = useScheduleStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [isSemesterListOpen, setIsSemesterListOpen] = useState(false);
  const [currentDate] = useState(new Date());

  const currentSemester = semesters[currentSemesterIndex];

  const handleAddCourse = (courseData: Omit<Course, 'id'>) => {
    addCourse(currentSemesterIndex, courseData);
    setIsModalOpen(false);
  };

  const handleEditCourse = (courseData: Omit<Course, 'id'>) => {
    if (!selectedCourse) return;
    updateCourse(currentSemesterIndex, selectedCourse.id, courseData);
    setIsModalOpen(false);
    setSelectedCourse(undefined);
  };

  const handleDeleteCourse = () => {
    if (!selectedCourse) return;
    
    if (confirm('이 과목을 삭제하시겠습니까?')) {
      deleteCourse(currentSemesterIndex, selectedCourse.id);
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
    
    addSemester({
      name: `${year}년 ${semester}학기`,
      courses: [],
    });
    
    setIsSemesterListOpen(false);
  };

  return (
    <main className="min-h-screen p-4 bg-gradient-to-b from-primary/30 to-black">
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
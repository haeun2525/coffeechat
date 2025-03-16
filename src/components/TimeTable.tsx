import { FC, useMemo } from 'react';
import type { Course } from '@/types/schedule';

interface TimeTableProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
}

const DAYS = ['월', '화', '수', '목', '금', '토'];

// 시간 슬롯 생성 (5분 단위)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const TimeTable: FC<TimeTableProps> = ({ courses, onCourseClick }) => {
  // 표시할 최대 시간 계산 (기본값: 18:00, 과목이 있으면 해당 과목의 종료 시간까지)
  const maxDisplayTime = useMemo(() => {
    if (courses.length === 0) {
      return '18:00'; // 기본값
    }
    
    // 모든 과목 중 가장 늦은 종료 시간 찾기
    let latestEndTime = '18:00';
    courses.forEach(course => {
      if (course.endTime > latestEndTime) {
        latestEndTime = course.endTime;
      }
    });
    
    return latestEndTime;
  }, [courses]);
  
  // 표시할 시간 슬롯 필터링
  const displayTimeSlots = useMemo(() => {
    return TIME_SLOTS.filter(slot => slot <= maxDisplayTime);
  }, [maxDisplayTime]);

  // 특정 시간 슬롯과 요일에 해당하는 과목 찾기
  const getCoursesForTimeSlot = (timeSlot: string, dayOfWeek: number) => {
    return courses.filter(course => {
      // 시간 슬롯이 과목의 시작 시간과 종료 시간 사이에 있는지 확인
      return course.dayOfWeek === dayOfWeek && 
             course.startTime <= timeSlot && 
             course.endTime > timeSlot;
    });
  };

  // 과목 블록의 높이 계산 (분 단위로 계산)
  const calculateCourseHeight = (course: Course) => {
    const [startHour, startMinute] = course.startTime.split(':').map(Number);
    const [endHour, endMinute] = course.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    
    // 30분당 높이 계산 (기본 셀 높이가 60px이라고 가정)
    return (durationMinutes / 30) * 60;
  };

  // 과목 블록의 상단 위치 계산
  const calculateCourseTop = (course: Course, slotTime: string) => {
    const [slotHour, slotMinute] = slotTime.split(':').map(Number);
    const [courseHour, courseMinute] = course.startTime.split(':').map(Number);
    
    const slotTotalMinutes = slotHour * 60 + slotMinute;
    const courseTotalMinutes = courseHour * 60 + courseMinute;
    
    // 시간 슬롯 시작점부터의 오프셋 계산 (분 단위)
    const offsetMinutes = courseTotalMinutes - slotTotalMinutes;
    
    // 30분당 높이 계산 (기본 셀 높이가 60px이라고 가정)
    return (offsetMinutes / 30) * 60;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          <div className="h-12 flex items-center justify-center text-white/60 font-medium">
            시간
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="h-12 flex items-center justify-center bg-white/5 rounded-lg text-white font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 시간표 그리드 */}
        {displayTimeSlots.map((timeSlot, index) => (
          <div key={timeSlot} className="grid grid-cols-7 gap-1 mb-1">
            {/* 시간 레이블 */}
            <div className="h-[60px] flex items-center justify-center text-white/60 text-sm">
              {timeSlot}
            </div>

            {/* 각 요일 셀 */}
            {DAYS.map((_, dayIndex) => {
              const coursesAtTime = getCoursesForTimeSlot(timeSlot, dayIndex);
              const isFirstSlotOfCourse = coursesAtTime.some(
                course => course.startTime.startsWith(timeSlot.split(':')[0]) && 
                          parseInt(course.startTime.split(':')[1]) >= parseInt(timeSlot.split(':')[1]) && 
                          parseInt(course.startTime.split(':')[1]) < parseInt(timeSlot.split(':')[1]) + 30
              );

              return (
                <div
                  key={`${timeSlot}-${dayIndex}`}
                  className="h-[60px] bg-white/5 rounded-lg relative"
                >
                  {coursesAtTime.map((course) => {
                    // 해당 시간 슬롯이 과목의 시작 시간과 일치하는 경우에만 과목 블록 렌더링
                    if (
                      course.startTime.startsWith(timeSlot.split(':')[0]) && 
                      parseInt(course.startTime.split(':')[1]) >= parseInt(timeSlot.split(':')[1]) && 
                      parseInt(course.startTime.split(':')[1]) < parseInt(timeSlot.split(':')[1]) + 30
                    ) {
                      const height = calculateCourseHeight(course);
                      const top = calculateCourseTop(course, timeSlot);
                      
                      return (
                        <div
                          key={course.id}
                          className="absolute inset-x-0 rounded-lg p-2 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] hover:z-10"
                          style={{
                            backgroundColor: course.color,
                            height: `${height}px`,
                            top: `${top}px`,
                            zIndex: 5,
                          }}
                          onClick={() => onCourseClick(course)}
                        >
                          <div className="text-white font-medium text-sm truncate">
                            {course.name}
                          </div>
                          {course.professor && (
                            <div className="text-white/80 text-xs truncate">
                              {course.professor}
                            </div>
                          )}
                          {course.location && (
                            <div className="text-white/80 text-xs truncate">
                              {course.location}
                            </div>
                          )}
                          <div className="text-white/80 text-xs mt-1">
                            {course.startTime} - {course.endTime}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTable; 
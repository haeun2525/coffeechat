import { FC } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Course } from '@/types/schedule';

interface TimeTableProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
  currentDate?: Date;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 9); // 9시부터 22시까지

const TimeTable: FC<TimeTableProps> = ({ 
  courses, 
  onCourseClick,
  currentDate = new Date()
}) => {
  // 현재 주의 시작일(월요일)을 구함
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // 요일 헤더 생성
  const weekDays = Array.from({ length: 5 }).map((_, index) => {
    const day = addDays(weekStart, index);
    const dayNumber = format(day, 'd');
    const dayName = format(day, 'EEE', { locale: ko });
    const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    
    return { dayNumber, dayName, isToday, date: day };
  });

  // 특정 시간, 요일에 해당하는 수업 찾기
  const getCoursesForTimeSlot = (hour: number, dayIndex: number) => {
    return courses.filter(
      course => course.dayOfWeek === dayIndex && 
                course.startTime <= hour && 
                (course.startTime + course.duration) > hour
    );
  };

  // 수업이 시작되는 시간인지 확인
  const isStartHour = (course: Course, hour: number) => {
    return course.startTime === hour;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px]">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-[60px_repeat(5,1fr)] mb-2">
          <div className="h-16 flex flex-col items-center justify-center">
            <span className="text-xs text-white/50">시간</span>
          </div>
          
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`h-16 flex flex-col items-center justify-center rounded-xl ${
                day.isToday ? 'bg-primary/30 backdrop-blur-sm' : ''
              }`}
            >
              <span className={`text-2xl font-bold ${day.isToday ? 'text-white' : 'text-white/80'}`}>
                {day.dayNumber}
              </span>
              <span className={`text-sm ${day.isToday ? 'text-white/90' : 'text-white/60'}`}>
                {day.dayName}
              </span>
            </div>
          ))}
        </div>

        {/* 시간표 그리드 */}
        <div className="relative">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_repeat(5,1fr)] mb-2">
              {/* 시간 라벨 */}
              <div className="flex items-center justify-center h-16">
                <span className="text-sm text-white/60">{hour}:00</span>
              </div>

              {/* 요일별 시간 슬롯 */}
              {Array.from({ length: 5 }).map((_, dayIndex) => {
                const coursesInSlot = getCoursesForTimeSlot(hour, dayIndex);
                
                return (
                  <div key={dayIndex} className="h-16 px-1 relative">
                    {/* 배경 셀 */}
                    <div className="absolute inset-0 mx-1 rounded-lg bg-white/5"></div>
                    
                    {/* 수업 블록 */}
                    {coursesInSlot.map((course) => (
                      isStartHour(course, hour) && (
                        <div
                          key={course.id}
                          className="absolute left-1 right-1 rounded-xl p-2 cursor-pointer shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02]"
                          style={{
                            backgroundColor: `${course.color}CC`, // 약간 투명하게
                            height: `${course.duration * 4.2}rem`,
                            zIndex: 10
                          }}
                          onClick={() => onCourseClick(course)}
                        >
                          <div className="h-full flex flex-col">
                            <h4 className="font-bold text-white text-sm mb-1 truncate">
                              {course.name}
                            </h4>
                            {course.professor && (
                              <p className="text-xs text-white/90 truncate">
                                {course.professor}
                              </p>
                            )}
                            {course.location && (
                              <p className="text-xs text-white/80 truncate mt-auto">
                                {course.location}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTable; 
import { FC, useState, useEffect, useRef } from 'react';
import type { Course } from '@/types/schedule';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Omit<Course, 'id'>) => void;
  onDelete?: () => void;
  initialData?: Course;
}

const DAYS = ['월', '화', '수', '목', '금', '토'];

// 시간 옵션 생성 (5분 단위)
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 9; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

const COLORS = [
  '#4F46E5', // 인디고
  '#7C3AED', // 퍼플
  '#EC4899', // 핑크
  '#F59E0B', // 앰버
  '#10B981', // 에메랄드
  '#3B82F6', // 블루
  '#EF4444', // 레드
  '#8B5CF6', // 바이올렛
];

const CourseFormModal: FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
}) => {
  const [formData, setFormData] = useState<Omit<Course, 'id'>>({
    name: '',
    professor: '',
    location: '',
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '10:00',
    color: COLORS[0],
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  // 시작 시간이 변경될 때 종료 시간이 시작 시간보다 이전이면 자동으로 조정
  useEffect(() => {
    if (formData.startTime >= formData.endTime) {
      // 시작 시간의 인덱스를 찾고 최소 1시간 후의 시간을 종료 시간으로 설정
      const startIndex = TIME_OPTIONS.indexOf(formData.startTime);
      const endIndex = Math.min(startIndex + 12, TIME_OPTIONS.length - 1); // 기본적으로 1시간 후 (12 * 5분)
      setFormData(prev => ({
        ...prev,
        endTime: TIME_OPTIONS[endIndex]
      }));
    }
  }, [formData.startTime]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // 새 과목 추가 시 기본값으로 초기화
      setFormData({
        name: '',
        professor: '',
        location: '',
        dayOfWeek: 0,
        startTime: '09:00',
        endTime: '10:00',
        color: COLORS[0],
      });
    }
  }, [initialData, isOpen]);

  // 모달 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseAttempt();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, formData]);

  // 시간 선택 스크롤 초기화
  useEffect(() => {
    if (isOpen && startTimeRef.current && endTimeRef.current) {
      const startIndex = TIME_OPTIONS.indexOf(formData.startTime);
      const endIndex = TIME_OPTIONS.indexOf(formData.endTime);
      
      const startScrollPosition = Math.max(0, (startIndex - 2) * 40);
      const endScrollPosition = Math.max(0, (endIndex - 2) * 40);
      
      startTimeRef.current.scrollTop = startScrollPosition;
      endTimeRef.current.scrollTop = endScrollPosition;
    }
  }, [isOpen, formData.startTime, formData.endTime]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCloseAttempt = () => {
    // 폼이 비어있지 않은지 확인
    const isFormFilled = 
      formData.name.trim() !== '' || 
      (formData.professor && formData.professor.trim() !== '') || 
      (formData.location && formData.location.trim() !== '');
    
    if (isFormFilled) {
      setIsConfirmOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setIsConfirmOpen(false);
    onClose();
  };

  const handleContinueEditing = () => {
    setIsConfirmOpen(false);
  };

  const handleTimeSelect = (type: 'start' | 'end', time: string) => {
    if (type === 'start') {
      setFormData({ ...formData, startTime: time });
    } else {
      setFormData({ ...formData, endTime: time });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 text-white">
          {initialData ? '과목 수정' : '과목 추가'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* 과목명 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/80 mb-1">
              과목명 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          {/* 교수명 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/80 mb-1">
              교수명
            </label>
            <input
              type="text"
              value={formData.professor}
              onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* 강의실 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/80 mb-1">
              강의실
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* 요일 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/80 mb-1">
              요일 *
            </label>
            <select
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              {DAYS.map((day, index) => (
                <option key={day} value={index}>
                  {day}요일
                </option>
              ))}
            </select>
          </div>

          {/* 시간 선택 (스크롤 방식) */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            {/* 시작 시간 */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                시작 시간 *
              </label>
              <div className="relative">
                <div 
                  ref={startTimeRef}
                  className="w-full h-40 overflow-y-auto bg-gray-700 border border-gray-600 rounded-lg text-white scrollbar-thin scrollbar-thumb-gray-500"
                >
                  <div className="py-2">
                    {TIME_OPTIONS.map((time) => (
                      <div
                        key={`start-${time}`}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-600 ${
                          formData.startTime === time ? 'bg-primary text-white' : ''
                        }`}
                        onClick={() => handleTimeSelect('start', time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-gray-700 to-transparent pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-700 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* 종료 시간 */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                종료 시간 *
              </label>
              <div className="relative">
                <div 
                  ref={endTimeRef}
                  className="w-full h-40 overflow-y-auto bg-gray-700 border border-gray-600 rounded-lg text-white scrollbar-thin scrollbar-thumb-gray-500"
                >
                  <div className="py-2">
                    {TIME_OPTIONS.map((time) => (
                      <div
                        key={`end-${time}`}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-600 ${
                          formData.endTime === time ? 'bg-primary text-white' : ''
                        } ${
                          time <= formData.startTime ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => time > formData.startTime && handleTimeSelect('end', time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-gray-700 to-transparent pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-700 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* 색상 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-2">
              색상 *
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-between">
            {initialData && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                삭제
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={handleCloseAttempt}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors"
              >
                {initialData ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </form>

        {/* 취소 확인 모달 */}
        {isConfirmOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm border border-white/10 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-3">정말 취소하시겠습니까?</h3>
              <p className="text-white/70 mb-6">입력하신 내용이 저장되지 않습니다.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleContinueEditing}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  계속 입력
                </button>
                <button
                  onClick={handleConfirmClose}
                  className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseFormModal; 
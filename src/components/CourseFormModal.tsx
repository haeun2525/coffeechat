import { FC, useState, useEffect } from 'react';
import type { Course } from '@/types/schedule';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Omit<Course, 'id'>) => void;
  onDelete?: () => void;
  initialData?: Course;
}

const DAYS = ['월', '화', '수', '목', '금'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 9);
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
    startTime: 9,
    duration: 1,
    color: COLORS[0],
  });

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
        startTime: 9,
        duration: 1,
        color: COLORS[0],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-xl">
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

          {/* 시작 시간 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/80 mb-1">
              시작 시간 *
            </label>
            <select
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              {HOURS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>

          {/* 수업 시간 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/80 mb-1">
              수업 시간 *
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            >
              {[1, 2, 3].map((duration) => (
                <option key={duration} value={duration}>
                  {duration}시간
                </option>
              ))}
            </select>
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
                onClick={onClose}
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
      </div>
    </div>
  );
};

export default CourseFormModal; 
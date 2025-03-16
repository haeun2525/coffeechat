'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User } from '@/types/user';
import { useScheduleStore } from '@/store/scheduleStore';
import { Course } from '@/types/schedule';

interface ProfileCardProps {
  user: User;
  onSkip: () => void;
  onFavorite: () => void;
  onProposeCoffeeChat: () => void;
  isVisible: boolean;
  exitDirection?: 'left' | 'right';
  isFavorite: boolean;
}

// 시간 문자열을 분으로 변환하는 함수 (예: "14:30" -> 870)
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// 두 시간이 겹치는지 확인하는 함수
const isTimeOverlapping = (
  courseStartTime: string,
  courseEndTime: string,
  slotTime: string
): boolean => {
  // 슬롯 시간은 시작 시간만 주어지므로, 1시간 동안 지속된다고 가정
  const slotStartMinutes = timeToMinutes(slotTime);
  const slotEndMinutes = slotStartMinutes + 60; // 1시간 추가
  
  const courseStartMinutes = timeToMinutes(courseStartTime);
  const courseEndMinutes = timeToMinutes(courseEndTime);
  
  // 두 시간 범위가 겹치는지 확인
  return !(slotEndMinutes <= courseStartMinutes || slotStartMinutes >= courseEndMinutes);
};

// 요일 문자열을 숫자로 변환 (월=0, 화=1, ...)
const dayToIndex = (day: string): number => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return days.indexOf(day);
};

const ProfileCard: FC<ProfileCardProps> = ({
  user,
  onSkip,
  onFavorite,
  onProposeCoffeeChat,
  isVisible,
  exitDirection,
  isFavorite,
}) => {
  const [availableSlots, setAvailableSlots] = useState<Array<{ day: string; slots: string[] }>>([]);
  const { semesters, currentSemesterIndex } = useScheduleStore();
  
  useEffect(() => {
    // 현재 사용자의 시간표 가져오기
    const currentUserCourses = semesters[currentSemesterIndex]?.courses || [];
    
    // 추천된 사용자와 현재 사용자의 시간표를 비교하여 겹치는 빈 시간 찾기
    const overlappingFreeSlots = user.availability.map(daySlot => {
      // 해당 요일에 대한 현재 사용자의 수업들
      const dayIndex = dayToIndex(daySlot.day);
      const userCoursesOnDay = currentUserCourses.filter(
        course => course.dayOfWeek === dayIndex
      );
      
      // 추천된 사용자의 슬롯 중 현재 사용자의 수업과 겹치지 않는 슬롯만 필터링
      const availableSlotsForDay = daySlot.slots.filter(slot => {
        // 현재 사용자의 모든 수업과 겹치지 않는지 확인
        return !userCoursesOnDay.some(course => 
          isTimeOverlapping(course.startTime, course.endTime, slot)
        );
      });
      
      return {
        day: daySlot.day,
        slots: availableSlotsForDay
      };
    }).filter(daySlot => daySlot.slots.length > 0); // 빈 슬롯이 있는 요일만 유지
    
    setAvailableSlots(overlappingFreeSlots);
  }, [user, semesters, currentSemesterIndex]);

  // 카드 애니메이션 변수
  const variants = {
    visible: { opacity: 1, scale: 1, x: 0 },
    hidden: { opacity: 0, scale: 0.8 },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.3 }
    })
  };

  return (
    <motion.div
      className="w-full max-w-sm relative"
      initial="hidden"
      animate={isVisible ? "visible" : "exit"}
      variants={variants}
      custom={exitDirection}
    >
      {/* 뒤에 있는 카드 효과 */}
      <div className="absolute -bottom-2 -right-2 w-full h-full bg-card-gradient backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg z-0"></div>
      <div className="absolute -bottom-1 -right-1 w-full h-full bg-card-gradient backdrop-blur-sm rounded-3xl border border-white/15 shadow-lg z-0"></div>
      
      <div className="bg-card-gradient backdrop-blur-sm rounded-3xl overflow-hidden border border-white/30 shadow-2xl relative z-10">
        {/* 프로필 카드 상단 버튼 */}
        <div className="flex justify-between mb-4 p-4">
          <button
            onClick={onSkip}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex gap-3">
            <button
              onClick={onFavorite}
              className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
                isFavorite ? 'bg-pink-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            <button
              onClick={onProposeCoffeeChat}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary-light text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 1v3M10 1v3M14 1v3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 프로필 이미지 - 그라데이션 오버레이 추가 */}
        <div className="relative h-64 w-full">
          <Image
            src={user.profileImage}
            alt={user.name}
            fill
            className="object-cover"
          />
          {/* 이미지 위에 그라데이션 오버레이 추가 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
          
          {/* 이미지 위에 프로필 정보 배치 */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full text-white">
                {user.studentId.substring(0, 2)}학번
              </span>
            </div>
            <p className="text-white/80">{user.department}</p>
          </div>
        </div>

        {/* 프로필 정보 - 이미지 위에 표시된 기본 정보는 제외 */}
        <div className="p-6 pt-2">
          <p className="text-white/80 mb-4">{user.bio}</p>

          {/* 관심사 태그 */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white/60 mb-2">관심사</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-white"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* 가능한 시간 - 겹치는 빈 시간만 표시 */}
          {availableSlots.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-2">가능한 시간</h3>
              <div className="space-y-2">
                {availableSlots.map((daySlot, dayIndex) => (
                  <div key={dayIndex} className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center bg-primary/20 rounded-full text-white mr-2">
                      {daySlot.day}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {daySlot.slots.map((slot, slotIndex) => (
                        <span
                          key={slotIndex}
                          className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {availableSlots.length === 0 && (
            <div className="text-white/60 text-sm italic">
              현재 겹치는 빈 시간이 없습니다.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard; 
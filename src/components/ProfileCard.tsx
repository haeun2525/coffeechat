'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User } from '@/types/user';

interface ProfileCardProps {
  user: User;
  onFavorite?: () => void;
  onProposeCoffeeChat?: () => void;
  onSkip?: () => void;
  isVisible?: boolean;
  exitDirection?: 'left' | 'right';
  isFavorite?: boolean;
}

export default function ProfileCard({
  user,
  onFavorite,
  onProposeCoffeeChat,
  onSkip,
  isVisible = true,
  exitDirection,
  isFavorite = false,
}: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 카드 애니메이션 변수
  const variants = {
    enter: { x: 0, opacity: 1 },
    exit: {
      x: exitDirection === 'left' ? -300 : exitDirection === 'right' ? 300 : 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
    hidden: { opacity: 0 },
  };

  // 스와이프 제스처 핸들러
  const handleSwipe = (event: any, info: any) => {
    if (info.offset.x < -100 && onSkip) {
      onSkip();
    } else if (info.offset.x > 100 && onFavorite) {
      onFavorite();
    }
  };

  // 카드 확장 토글
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 스와이프 기능이 있는 경우와 없는 경우 분기
  if (onFavorite && onSkip) {
    return (
      <motion.div
        className={`w-full max-w-sm bg-card-gradient backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 shadow-xl`}
        initial="hidden"
        animate={isVisible ? 'enter' : 'exit'}
        variants={variants}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleSwipe}
        whileTap={{ scale: 0.98 }}
      >
        {/* 프로필 이미지 */}
        <div className="relative h-80 w-full">
          <Image
            src={user.profileImage}
            alt={user.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-white/80">
              {user.major} {user.year}학년
            </p>
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-white">소개</h3>
            <p className="text-white/80">{user.bio}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-white">관심사</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/20 text-white rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-white">가능한 시간</h3>
            <div className="grid grid-cols-3 gap-2">
              {user.availability.map((avail, index) => (
                <div
                  key={index}
                  className="bg-black/30 p-2 rounded-lg text-center"
                >
                  <div className="font-medium text-white">{avail.day}</div>
                  <div className="text-xs text-white/70">
                    {avail.slots.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-between gap-4">
            <button
              onClick={onSkip}
              className="flex-1 py-3 px-4 rounded-xl bg-black/30 text-white border border-white/10 hover:bg-black/50 transition-colors"
            >
              건너뛰기
            </button>
            <button
              onClick={onFavorite}
              className={`flex-1 py-3 px-4 rounded-xl ${
                isFavorite
                  ? 'bg-pink-600 text-white'
                  : 'bg-black/30 text-white border border-white/10 hover:bg-black/50'
              } transition-colors`}
            >
              {isFavorite ? '찜됨' : '찜하기'}
            </button>
            <button
              onClick={onProposeCoffeeChat}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              커피챗 제안
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // 스와이프 기능이 없는 일반 카드
  return (
    <motion.div
      className="bg-card-gradient backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center p-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border border-white/20">
          <Image
            src={user.profileImage}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{user.name}</h3>
          <p className="text-sm text-white/70">
            {user.major} {user.year}학년
          </p>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {user.interests.slice(0, 3).map((interest, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/20 text-white/90 rounded-full text-xs"
            >
              {interest}
            </span>
          ))}
        </div>

        <p className="text-sm text-white/80 mb-4 line-clamp-2">{user.bio}</p>

        <div className="flex justify-between">
          <button
            onClick={onFavorite}
            className="py-2 px-4 rounded-lg bg-black/30 text-white text-sm border border-white/10 hover:bg-black/50 transition-colors"
          >
            프로필 보기
          </button>
          <button
            onClick={onProposeCoffeeChat}
            className="py-2 px-4 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 transition-colors"
          >
            커피챗 제안
          </button>
        </div>
      </div>
    </motion.div>
  );
} 
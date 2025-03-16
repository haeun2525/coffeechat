'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { User } from '@/types/user';

interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onProposeCoffeeChat: () => void;
}

export default function ProfileDetailModal({
  isOpen,
  onClose,
  user,
  onProposeCoffeeChat,
}: ProfileDetailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card-gradient backdrop-blur-md rounded-2xl border border-white/10 shadow-xl w-full max-w-md overflow-hidden relative">
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-10"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* 프로필 이미지 */}
              <div className="relative h-64 w-full">
                <Image
                  src={user.profileImage}
                  alt={user.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-white mr-2">{user.name}</h2>
                    <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full text-white">
                      {user.studentId.substring(0, 2)}학번
                    </span>
                  </div>
                  <p className="text-white/80 mb-6">{user.department}</p>
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
                <div className="flex justify-end">
                  <button
                    onClick={onProposeCoffeeChat}
                    className="py-3 px-6 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    커피챗 제안
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 
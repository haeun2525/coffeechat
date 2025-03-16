'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface FavoriteCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoriteCompleteModal({
  isOpen,
  onClose,
}: FavoriteCompleteModalProps) {
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
            <div className="bg-card-gradient backdrop-blur-md rounded-2xl border border-white/10 shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
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
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">
                찜 목록에 추가되었습니다!
              </h2>
              <p className="text-white/70 mb-6">
                마이페이지에서 찜한 친구들을 확인할 수 있어요.
              </p>
              
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 
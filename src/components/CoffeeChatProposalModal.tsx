'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoffeeChatProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
  recipientName: string;
}

export default function CoffeeChatProposalModal({
  isOpen,
  onClose,
  onConfirm,
  recipientName,
}: CoffeeChatProposalModalProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(message);
  };

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
            <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">
                  {recipientName}님에게 커피챗 제안하기
                </h2>
                <p className="text-white/70 mt-1">
                  간단한 메시지를 남겨보세요 (선택사항).
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
                    메시지 (선택사항)
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="자기소개나 대화하고 싶은 주제를 적어보세요."
                    rows={5}
                    className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-white/40 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-black/30 text-white border border-white/10 hover:bg-black/50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    제안하기
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 
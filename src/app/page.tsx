'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from '@/components/ProfileCard';
import CoffeeChatProposalModal from '@/components/CoffeeChatProposalModal';
import FavoriteCompleteModal from '@/components/FavoriteCompleteModal';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';

// 임시 사용자 데이터
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: '김민수',
    major: '컴퓨터공학과',
    year: 3,
    bio: '알고리즘과 웹 개발에 관심이 많습니다. 스터디 메이트를 찾고 있어요!',
    interests: ['알고리즘', '웹개발', '인공지능'],
    profileImage: '/images/profile1.jpg',
    availability: [
      { day: '월', slots: ['10:00', '14:00'] },
      { day: '수', slots: ['13:00', '16:00'] },
      { day: '금', slots: ['11:00', '15:00'] },
    ],
    department: '컴퓨터공학과',
    studentId: '2021123456',
  },
  {
    id: '2',
    name: '이지원',
    major: '경영학과',
    year: 2,
    bio: '스타트업과 마케팅에 관심이 많아요. 다양한 전공의 친구들과 이야기하고 싶습니다.',
    interests: ['마케팅', '스타트업', '경영전략'],
    profileImage: '/images/profile2.jpg',
    availability: [
      { day: '화', slots: ['11:00', '15:00'] },
      { day: '목', slots: ['13:00', '17:00'] },
    ],
    department: '경영학과',
    studentId: '2022123456',
  },
  {
    id: '3',
    name: '박서연',
    major: '디자인학과',
    year: 4,
    bio: 'UI/UX 디자인을 공부하고 있어요. 포트폴리오 준비 중입니다.',
    interests: ['UI/UX', '그래픽디자인', '브랜딩'],
    profileImage: '/images/profile3.jpg',
    availability: [
      { day: '월', slots: ['13:00', '17:00'] },
      { day: '수', slots: ['10:00', '14:00'] },
      { day: '금', slots: ['15:00', '18:00'] },
    ],
    department: '디자인학과',
    studentId: '2020123456',
  },
  {
    id: '4',
    name: '정다운',
    major: '심리학과',
    year: 3,
    bio: '인지심리학을 전공하고 있어요. 다양한 사람들과 대화하는 것을 좋아합니다.',
    interests: ['인지심리', '상담심리', '실험설계'],
    profileImage: '/images/profile4.jpg',
    availability: [
      { day: '화', slots: ['10:00', '13:00'] },
      { day: '목', slots: ['14:00', '17:00'] },
      { day: '금', slots: ['11:00', '15:00'] },
    ],
    department: '심리학과',
    studentId: '2021987654',
  },
];

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | undefined>(undefined);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [isUnfavoriteModalOpen, setIsUnfavoriteModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 실제 API 호출을 시뮬레이션
    const fetchUsers = async () => {
      setIsLoading(true);
      // 실제 구현에서는 API 호출로 대체
      setTimeout(() => {
        setUsers(MOCK_USERS);
        setIsLoading(false);
      }, 1000);
    };

    fetchUsers();
  }, []);

  const handleSkip = () => {
    // 카드 왼쪽으로 사라지는 애니메이션
    setExitDirection('left');
    setIsCardVisible(false);

    // 애니메이션이 끝난 후 다음 카드로 전환
    setTimeout(() => {
      if (currentProfileIndex < MOCK_USERS.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
        setIsCardVisible(true);
        setExitDirection(undefined);
      } else {
        // 모든 프로필을 다 본 경우
        router.push('/search');
      }
    }, 300);
  };

  const handleFavorite = () => {
    const currentProfile = MOCK_USERS[currentProfileIndex];
    
    // 이미 찜한 상태인지 확인
    if (favorites.has(currentProfile.id)) {
      // 찜하기 취소 확인 모달 표시
      setIsUnfavoriteModalOpen(true);
    } else {
      // 찜하기 추가
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        newFavorites.add(currentProfile.id);
        return newFavorites;
      });

      // 찜 완료 모달 표시
      setIsFavoriteModalOpen(true);
    }
    
    // 카드는 그대로 유지 (사라지지 않음)
  };

  // 찜하기 취소
  const handleConfirmUnfavorite = () => {
    const currentProfile = MOCK_USERS[currentProfileIndex];
    
    // 찜하기 목록에서 제거
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.delete(currentProfile.id);
      return newFavorites;
    });
    
    // 모달 닫기
    setIsUnfavoriteModalOpen(false);
  };

  const handleProposeCoffeeChat = () => {
    setIsModalOpen(true);
  };

  const handleConfirmProposal = (message: string) => {
    // 실제 구현에서는 API 호출로 커피챗 제안 처리
    console.log('커피챗 제안:', { message });
    
    // 모달 닫기
    setIsModalOpen(false);
    
    // 다음 카드로 이동 (프로필 카드 사라지게 하기)
    handleSkip();
    
    // 성공 메시지 표시 (실제 구현에서는 토스트 메시지 등으로 대체)
    alert(`커피챗 제안을 보냈습니다.`);
  };

  return (
    <main className="min-h-screen px-4 py-6">
      {/* 헤더 섹션 제거 */}
      {/* <section className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            학교 친구들과 커피챗
          </h1>
          <p className="text-white/80 mb-6">
            같은 관심사를 가진 학우들과 편하게 대화해보세요
          </p>
        </motion.div>
      </section> */}

      {/* 프로필 카드 섹션 */}
      <section className="mb-8 flex justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : currentProfileIndex < MOCK_USERS.length ? (
          <ProfileCard
            user={MOCK_USERS[currentProfileIndex]}
            onSkip={handleSkip}
            onFavorite={handleFavorite}
            onProposeCoffeeChat={handleProposeCoffeeChat}
            isVisible={isCardVisible}
            exitDirection={exitDirection}
            isFavorite={favorites.has(MOCK_USERS[currentProfileIndex].id)}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card-gradient backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-lg text-center max-w-sm"
          >
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">
              오늘 3명의 사용자를 모두 확인했어요!
            </h3>
            <p className="text-white/70 mb-6">내일은 또 어떤 사람들이 도착할까요?</p>
            <Link href="/search">
              <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors w-full flex items-center justify-center gap-2">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                찾기 페이지로 이동
              </button>
            </Link>
          </motion.div>
        )}
      </section>

      {/* 빠른 액션 버튼 */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link href="/search">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card-gradient backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg flex flex-col items-center justify-center h-32"
            >
              <svg
                className="w-8 h-8 mb-2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="font-medium text-white">친구 찾기</span>
              <span className="text-xs text-white/70 mt-1">관심사로 검색</span>
            </motion.div>
          </Link>
          <Link href="/schedule">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card-gradient backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg flex flex-col items-center justify-center h-32"
            >
              <svg
                className="w-8 h-8 mb-2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium text-white">시간표 관리</span>
              <span className="text-xs text-white/70 mt-1">가능한 시간 설정</span>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* 최근 활동 섹션 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-white">최근 활동</h2>
        <div className="space-y-4">
          {isLoading ? (
            // 로딩 상태
            [...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-sm animate-pulse h-20 rounded-xl border border-white/10"
              ></div>
            ))
          ) : (
            // 최근 활동 목록
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card-gradient backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white">
                    <span className="font-medium">김민수</span>님과의 커피챗이 확정되었습니다.
                  </p>
                  <p className="text-xs text-white/70">오늘 14:00, 학생회관 카페</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card-gradient backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-white">
                    <span className="font-medium">이지원</span>님이 회원님의 프로필을 확인했습니다.
                  </p>
                  <p className="text-xs text-white/70">어제</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card-gradient backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
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
                <div>
                  <p className="text-sm text-white">
                    <span className="font-medium">박서연</span>님이 회원님을 찜했습니다.
                  </p>
                  <p className="text-xs text-white/70">2일 전</p>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* 커피챗 제안 모달 */}
      <CoffeeChatProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmProposal}
        recipientName={currentProfileIndex < MOCK_USERS.length ? MOCK_USERS[currentProfileIndex].name : ''}
      />

      {/* 찜하기 완료 모달 */}
      <FavoriteCompleteModal
        isOpen={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
      />

      {/* 찜하기 취소 확인 모달 */}
      <AnimatePresence>
        {isUnfavoriteModalOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsUnfavoriteModalOpen(false)}
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
                <h2 className="text-xl font-bold text-white mb-4">
                  찜하기를 취소하겠습니까?
                </h2>
                
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsUnfavoriteModalOpen(false)}
                    className="px-6 py-2 rounded-lg bg-black/30 text-white border border-white/10 hover:bg-black/50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmUnfavorite}
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
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from '@/components/ProfileCard';
import ProfileDetailModal from '@/components/ProfileDetailModal';
import CoffeeChatProposalModal from '@/components/CoffeeChatProposalModal';
import { User } from '@/types/user';
import Image from 'next/image';

// 임시 데이터 - 관심사 목록
const INTERESTS = [
  '프로그래밍', '인공지능', '창업', '마케팅', '스타트업', 
  '독서', 'UX/UI', '브랜딩', '일러스트', '데이터분석',
  '여행', '음악', '영화', '사진', '요리'
];

// 임시 데이터 - 사용자 목록
const MOCK_USERS = [
  {
    id: '1',
    name: '김민수',
    studentId: '2020123456',
    department: '컴퓨터공학과',
    profileImage: '/images/profile1.jpg',
    interests: ['프로그래밍', '인공지능', '창업'],
    hasSentRequest: false,
    major: '컴퓨터공학과',
    year: 3,
    bio: '알고리즘과 웹 개발에 관심이 많습니다. 스터디 메이트를 찾고 있어요!',
    availability: [
      { day: '월', slots: ['10:00', '14:00'] },
      { day: '수', slots: ['13:00', '16:00'] },
      { day: '금', slots: ['11:00', '15:00'] },
    ],
  },
  {
    id: '2',
    name: '이지원',
    studentId: '2021987654',
    department: '경영학과',
    profileImage: '/images/profile2.jpg',
    interests: ['마케팅', '스타트업', '독서'],
    hasSentRequest: true,
    major: '경영학과',
    year: 2,
    bio: '스타트업과 마케팅에 관심이 많아요. 다양한 전공의 친구들과 이야기하고 싶습니다.',
    availability: [
      { day: '화', slots: ['11:00', '15:00'] },
      { day: '목', slots: ['13:00', '17:00'] },
    ],
  },
  {
    id: '3',
    name: '박서연',
    studentId: '2019345678',
    department: '디자인학과',
    profileImage: '/images/profile3.jpg',
    interests: ['UX/UI', '브랜딩', '일러스트'],
    hasSentRequest: false,
    major: '디자인학과',
    year: 4,
    bio: 'UI/UX 디자인을 공부하고 있어요. 포트폴리오 준비 중입니다.',
    availability: [
      { day: '월', slots: ['13:00', '17:00'] },
      { day: '수', slots: ['10:00', '14:00'] },
      { day: '금', slots: ['15:00', '18:00'] },
    ],
  },
  {
    id: '4',
    name: '정다운',
    studentId: '2022567890',
    department: '통계학과',
    profileImage: '/images/profile1.jpg',
    interests: ['데이터분석', '프로그래밍', '독서'],
    hasSentRequest: false,
    major: '통계학과',
    year: 1,
    bio: '인지심리학을 전공하고 있어요. 다양한 사람들과 대화하는 것을 좋아합니다.',
    availability: [
      { day: '화', slots: ['10:00', '13:00'] },
      { day: '목', slots: ['14:00', '17:00'] },
      { day: '금', slots: ['11:00', '15:00'] },
    ],
  },
];

// 사용자의 관심사 (예시)
const MY_INTERESTS = ['웹개발', '알고리즘', '인공지능'];

// 모든 관심사 목록
const ALL_INTERESTS = [
  '웹개발', '알고리즘', '인공지능', '마케팅', '스타트업', '경영전략', 
  'UI/UX', '그래픽디자인', '브랜딩', '인지심리', '상담심리', '실험설계',
  '데이터분석', '모바일앱', '게임개발', '블록체인', '사진', '영상편집'
];

// 더미 프로필 이미지 배열 추가
const dummyProfileImages = [
  '/images/profile1.jpg',
  '/images/profile2.jpg',
  '/images/profile3.jpg',
  '/images/profile4.jpg',
  '/images/profile5.jpg',
];

// 랜덤 더미 이미지를 가져오는 함수
const getRandomProfileImage = () => {
  const randomIndex = Math.floor(Math.random() * dummyProfileImages.length);
  return dummyProfileImages[randomIndex];
};

export default function SearchPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // 모달 상태 관리
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoffeeChatModalOpen, setIsCoffeeChatModalOpen] = useState(false);

  // 찜한 사용자 목록 (실제로는 API에서 가져와야 함)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['1', '3']));

  // 사용자 데이터 로드
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      // 실제 구현에서는 API 호출로 대체
      setTimeout(() => {
        // 사용자 데이터 로드 (목업 데이터)
        const mockUsers: User[] = [
          {
            id: '1',
            name: '김철수',
            major: '컴퓨터공학',
            year: 3,
            bio: '알고리즘과 웹 개발에 관심이 많습니다.',
            interests: ['알고리즘', '웹개발', '인공지능'],
            profileImage: '',  // 빈 문자열로 설정
            availability: [
              { day: '월요일', slots: ['10:00', '11:00', '12:00'] },
              { day: '수요일', slots: ['14:00', '15:00', '16:00'] },
            ],
            department: '컴퓨터공학과',
            studentId: '20210001',
          },
          {
            id: '2',
            name: '이지원',
            studentId: '2021987654',
            department: '경영학과',
            profileImage: '/images/profile2.jpg',
            interests: ['마케팅', '스타트업', '독서'],
            hasSentRequest: true,
            major: '경영학과',
            year: 2,
            bio: '스타트업과 마케팅에 관심이 많아요. 다양한 전공의 친구들과 이야기하고 싶습니다.',
            availability: [
              { day: '화', slots: ['11:00', '15:00'] },
              { day: '목', slots: ['13:00', '17:00'] },
            ],
          },
          {
            id: '3',
            name: '박서연',
            studentId: '2019345678',
            department: '디자인학과',
            profileImage: '/images/profile3.jpg',
            interests: ['UX/UI', '브랜딩', '일러스트'],
            hasSentRequest: false,
            major: '디자인학과',
            year: 4,
            bio: 'UI/UX 디자인을 공부하고 있어요. 포트폴리오 준비 중입니다.',
            availability: [
              { day: '월', slots: ['13:00', '17:00'] },
              { day: '수', slots: ['10:00', '14:00'] },
              { day: '금', slots: ['15:00', '18:00'] },
            ],
          },
          {
            id: '4',
            name: '정다운',
            studentId: '2022567890',
            department: '통계학과',
            profileImage: '/images/profile1.jpg',
            interests: ['데이터분석', '프로그래밍', '독서'],
            hasSentRequest: false,
            major: '통계학과',
            year: 1,
            bio: '인지심리학을 전공하고 있어요. 다양한 사람들과 대화하는 것을 좋아합니다.',
            availability: [
              { day: '화', slots: ['10:00', '13:00'] },
              { day: '목', slots: ['14:00', '17:00'] },
              { day: '금', slots: ['11:00', '15:00'] },
            ],
          },
        ];

        // 각 사용자에게 랜덤 더미 이미지 할당 (profileImage가 비어있는 경우)
        const usersWithImages = mockUsers.map(user => {
          if (!user.profileImage) {
            return {
              ...user,
              profileImage: getRandomProfileImage()
            };
          }
          return user;
        });

        setUsers(usersWithImages);
        setFilteredUsers(usersWithImages);
        setIsLoading(false);
      }, 1000);
    };

    fetchUsers();
  }, []);

  // 검색어와 관심사 필터링
  useEffect(() => {
    let result = [...users];
    
    // 검색어로 필터링
    if (searchTerm) {
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 선택된 관심사로 필터링
    if (selectedInterests.length > 0) {
      result = result.filter(user => 
        selectedInterests.some(interest => user.interests.includes(interest))
      );
    }
    
    // 찜한 사용자만 필터링
    if (showFavoritesOnly) {
      result = result.filter(user => favorites.has(user.id));
    }
    
    setFilteredUsers(result);
  }, [searchTerm, selectedInterests, users, showFavoritesOnly, favorites]);

  // 관심사 토글
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // 찜 필터 토글
  const toggleFavorites = () => {
    setShowFavoritesOnly(prev => !prev);
  };

  // 관심사 토글 버튼 애니메이션
  const toggleVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 }
  };

  // 프로필 보기 버튼 클릭 핸들러
  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  // 커피챗 제안 버튼 클릭 핸들러
  const handleProposeCoffeeChat = (user: User) => {
    setSelectedUser(user);
    setIsCoffeeChatModalOpen(true);
  };

  // 커피챗 제안 확인 핸들러
  const handleConfirmProposal = (message: string) => {
    if (!selectedUser) return;
    
    // 실제 구현에서는 API 호출로 커피챗 제안 처리
    console.log('커피챗 제안:', { user: selectedUser?.name, message });
    
    // 사용자 상태 업데이트 - 요청 상태 변경
    setUsers(prev => 
      prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, hasSentRequest: true } 
          : user
      )
    );
    
    // 모달 닫기
    setIsCoffeeChatModalOpen(false);
    
    // 성공 메시지 표시 (실제 구현에서는 토스트 메시지 등으로 대체)
    alert(`${selectedUser?.name}님에게 커피챗 제안을 보냈습니다.`);
  };

  // 학번에서 입학년도 추출 (예: "2020123456" -> "20학번")
  const getAdmissionYear = (studentId: string) => `${studentId.substring(0, 2)}학번`;

  return (
    <main className="min-h-screen px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-white">친구 찾기</h1>
      
      {/* 검색 입력 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="이름, 학과, 키워드로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-white/40"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60"
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
        </div>
      </div>
      
      {/* 관심사 필터 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">관심사</h2>
          <motion.button
            onClick={() => setShowAllInterests(!showAllInterests)}
            animate={showAllInterests ? "open" : "closed"}
            variants={toggleVariants}
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* 찜한 사용자 필터 */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
              showFavoritesOnly
                ? 'bg-pink-500 text-white'
                : 'bg-black/30 text-white/80 hover:bg-black/50'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill={showFavoritesOnly ? "currentColor" : "none"}
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
            찜한 친구
          </button>
          
          {/* 내 관심사만 표시 */}
          {MY_INTERESTS.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedInterests.includes(interest)
                  ? 'bg-primary text-white'
                  : 'bg-black/30 text-white/80 hover:bg-black/50'
              }`}
            >
              {interest}
            </button>
          ))}
          
          {/* 모든 관심사 표시 (토글 시) */}
          <AnimatePresence>
            {showAllInterests && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full flex flex-wrap gap-2 mt-2"
              >
                {ALL_INTERESTS.filter(interest => !MY_INTERESTS.includes(interest)).map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedInterests.includes(interest)
                        ? 'bg-primary text-white'
                        : 'bg-black/30 text-white/80 hover:bg-black/50'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* 검색 결과 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          검색 결과 ({filteredUsers.length})
        </h2>
      </div>
      
      {isLoading ? (
        // 로딩 상태
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-black/30 backdrop-blur-sm animate-pulse h-48 rounded-xl border border-white/10"
            ></div>
          ))}
        </div>
      ) : filteredUsers.length > 0 ? (
        // 검색 결과 있음
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-card-gradient backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-lg"
            >
              <div className="flex items-center p-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border border-white/20">
                  <Image
                    src={user.profileImage || getRandomProfileImage()}
                    alt={user.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full text-white/90">
                      {user.studentId.substring(0, 2)}학번
                    </span>
                  </div>
                  <p className="text-sm text-white/70">{user.department}</p>
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
                  {favorites.has(user.id) && (
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      찜함
                    </span>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(user)}
                  >
                    프로필 보기
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={user.hasSentRequest}
                    onClick={() => handleProposeCoffeeChat(user)}
                  >
                    {user.hasSentRequest ? '요청됨' : '커피챗 제안'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 검색 결과 없음
        <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 text-center">
          <p className="text-white/80">검색 결과가 없습니다.</p>
          <p className="text-white/60 text-sm mt-1">다른 키워드로 검색해보세요.</p>
        </div>
      )}

      {/* 프로필 상세 모달 */}
      {selectedUser && (
        <ProfileDetailModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={selectedUser}
          onProposeCoffeeChat={() => {
            setIsProfileModalOpen(false);
            setIsCoffeeChatModalOpen(true);
          }}
        />
      )}

      {/* 커피챗 제안 모달 */}
      {selectedUser && (
        <CoffeeChatProposalModal
          isOpen={isCoffeeChatModalOpen}
          onClose={() => setIsCoffeeChatModalOpen(false)}
          onConfirm={handleConfirmProposal}
          recipientName={selectedUser.name}
        />
      )}
    </main>
  );
} 
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 임시 데이터 - 관심사 목록
const INTERESTS = [
  '프로그래밍', '인공지능', '창업', '마케팅', '스타트업', 
  '독서', 'UX/UI', '브랜딩', '일러스트', '데이터분석',
  '여행', '음악', '영화', '사진', '요리'
];

// 임시 데이터 - 사용자 목록
const USERS = [
  {
    id: '1',
    name: '김민수',
    studentId: '2020123456',
    department: '컴퓨터공학과',
    profileImage: '/images/profile1.jpg',
    interests: ['프로그래밍', '인공지능', '창업'],
    hasSentRequest: false,
  },
  {
    id: '2',
    name: '이지원',
    studentId: '2021987654',
    department: '경영학과',
    profileImage: '/images/profile2.jpg',
    interests: ['마케팅', '스타트업', '독서'],
    hasSentRequest: true,
  },
  {
    id: '3',
    name: '박서연',
    studentId: '2019345678',
    department: '디자인학과',
    profileImage: '/images/profile3.jpg',
    interests: ['UX/UI', '브랜딩', '일러스트'],
    hasSentRequest: false,
  },
  {
    id: '4',
    name: '정다운',
    studentId: '2022567890',
    department: '통계학과',
    profileImage: '/images/profile1.jpg',
    interests: ['데이터분석', '프로그래밍', '독서'],
    hasSentRequest: false,
  },
];

export default function SearchPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>(['2']);

  // 관심사 선택/해제 처리
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // 선택된 관심사에 따라 사용자 필터링
  const filteredUsers = selectedInterests.length > 0
    ? USERS.filter(user => 
        user.interests.some(interest => selectedInterests.includes(interest))
      )
    : USERS;

  // 학번에서 입학년도만 추출 (예: "2020123456" -> "20")
  const getAdmissionYear = (studentId: string) => studentId.substring(0, 2);

  return (
    <main className="min-h-screen p-4 bg-gradient-radial from-primary/30 via-black to-black">
      <div className="max-w-4xl mx-auto">
        {/* 커피챗 요청 섹션 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">내게 온 커피챗 요청</h2>
          
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {pendingRequests.length > 0 ? (
                USERS.filter(user => pendingRequests.includes(user.id)).map(user => (
                  <div 
                    key={user.id}
                    className="flex-shrink-0 w-16 h-16 relative rounded-full overflow-hidden border-2 border-primary"
                  >
                    <Image
                      src={user.profileImage}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="text-white/60 py-4">
                  아직 받은 커피챗 요청이 없습니다.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <div className="h-px bg-white/10 my-6"></div>

        {/* 관심사 필터 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">관심사로 찾기</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedInterests.includes(interest)
                    ? 'bg-primary text-white'
                    : 'bg-black/40 text-white/80 border border-white/20'
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </section>

        {/* 사용자 목록 */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            {selectedInterests.length > 0 
              ? `${selectedInterests.join(', ')}에 관심있는 사용자`
              : '모든 사용자'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map(user => (
              <div 
                key={user.id}
                className="bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-lg"
              >
                <div className="flex p-4">
                  <div className="w-16 h-16 relative rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={user.profileImage}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-white/70 text-sm">
                      {user.department} {getAdmissionYear(user.studentId)}학번
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.interests.map(interest => (
                        <span
                          key={interest}
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            selectedInterests.includes(interest)
                              ? 'bg-primary/70 text-white'
                              : 'bg-white/10 text-white/80'
                          }`}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    className={`px-3 py-1 rounded-full text-sm self-start flex-shrink-0 ${
                      user.hasSentRequest
                        ? 'bg-gray-600 text-white/60'
                        : 'bg-primary text-white'
                    }`}
                    disabled={user.hasSentRequest}
                  >
                    {user.hasSentRequest ? '요청됨' : '커피챗'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 
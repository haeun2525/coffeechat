'use client';

import { useState } from 'react';
import Image from 'next/image';

// 임시 사용자 데이터
const USER = {
  name: '김하은',
  studentId: '2020123456',
  department: '컴퓨터공학과',
  profileImage: '/images/profile1.jpg',
  bio: '새로운 기술과 사람들을 만나는 것을 좋아하는 개발자입니다.',
  interests: ['프로그래밍', '인공지능', '창업', '독서', '여행'],
  email: 'user@example.com',
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  // 학번에서 입학년도만 추출 (예: "2020123456" -> "20")
  const admissionYear = USER.studentId.substring(0, 2);

  return (
    <main className="min-h-screen p-4 bg-gradient-radial from-primary/30 via-black to-black">
      <div className="max-w-2xl mx-auto">
        <div className="bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-xl">
          {/* 프로필 헤더 */}
          <div className="relative h-48 bg-gradient-to-r from-primary to-primary-dark">
            <div className="absolute -bottom-16 left-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black/40">
                <Image
                  src={USER.profileImage}
                  alt={USER.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
              >
                {isEditing ? '취소' : '프로필 편집'}
              </button>
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="pt-20 px-6 pb-6">
            <h1 className="text-2xl font-bold text-white">{USER.name}</h1>
            <p className="text-white/70 mb-4">
              {USER.department} {admissionYear}학번
            </p>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">소개</h2>
              <p className="text-white/80">{USER.bio}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">관심사</h2>
              <div className="flex flex-wrap gap-2">
                {USER.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-primary/30 text-white rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-2">연락처</h2>
              <p className="text-white/80">{USER.email}</p>
            </div>
          </div>
        </div>

        {/* 활동 내역 */}
        <div className="mt-8 bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">활동 내역</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <h3 className="font-semibold text-white">커피챗 참여</h3>
              <p className="text-white/70 text-sm">총 3회 참여</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <h3 className="font-semibold text-white">찜한 프로필</h3>
              <p className="text-white/70 text-sm">2명</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <h3 className="font-semibold text-white">받은 평가</h3>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= 4 ? 'text-yellow-400' : 'text-white/20'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-white/70 text-sm">4.0 / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
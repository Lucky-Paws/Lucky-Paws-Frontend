'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // localStorage에서 사용자 정보 확인 (일반 로그인)
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      setUserData(user);
      setIsAuthenticated(true);
      return;
    }
    
    // NextAuth 세션 확인 (소셜 로그인)
    if (status === 'loading') return;
    
    if (session) {
      setUserData(session.user);
      setIsAuthenticated(true);
    } else if (!token) {
      router.push('/landing');
    }
  }, [session, status, router]);

  const handleLogout = () => {
    // localStorage 클리어
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // NextAuth 로그아웃
    if (session) {
      signOut({ callbackUrl: '/landing' });
    } else {
      router.push('/landing');
    }
  };

  if (status === 'loading' || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const user = userData;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Content with top padding for fixed header */}
      <div className="px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center space-x-4">
            {/* Profile Image */}
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-600">
                  {user.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {user.name || user.nickname || '사용자'}
              </h2>
              <p className="text-gray-600">
                {user.email || '이메일 정보 없음'}
              </p>
              {user.schoolLevel && (
                <p className="text-sm text-gray-500">
                  {user.schoolLevel} 교사 {user.careerYear}년차
                </p>
              )}
              {user.provider && (
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user.provider === 'kakao' ? '카카오' : 
                     user.provider === 'google' ? '구글' : 
                     user.provider} 로그인
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Account Settings */}
          <div className="border-b border-gray-100">
            <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 text-gray-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-gray-900">계정 설정</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Privacy Settings */}
          <div className="border-b border-gray-100">
            <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 text-gray-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-gray-900">개인정보 설정</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Help & Support */}
          <div className="border-b border-gray-100">
            <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 text-gray-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-900">도움말 및 지원</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Logout */}
          <div>
            <button 
              onClick={handleLogout}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors text-red-600"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 text-red-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="text-red-600 font-medium">로그아웃</span>
              </div>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Lucky Paws v1.0.0
          </p>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
} 
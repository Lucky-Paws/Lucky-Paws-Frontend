'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Landing() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // 소셜 로그인 사용자는 항상 메인 페이지로 이동
      const user = session.user as any;
      console.log('랜딩 페이지 - 세션 정보:', user);
      
      if (user?.provider) {
        console.log('소셜 로그인 사용자, 메인 페이지로 이동');
        router.push('/');
      } else {
        // 일반 로그인 사용자도 메인 페이지로
        console.log('일반 로그인 사용자, 메인 페이지로 이동');
        router.push('/');
      }
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* 로고 */}
      <div className="mb-8">
        <img 
          src="/logo.svg" 
          alt="Lucky Paws" 
          className="w-32 h-32 mx-auto"
        />
        <h1 className="text-2xl font-bold text-gray-800 text-center mt-4">Lucky Paws</h1>
        <p className="text-sm text-gray-600 text-center mt-2">교사 커뮤니티 플랫폼</p>
      </div>

      {/* 로그인 버튼들 */}
      <div className="w-full max-w-xs space-y-3">
        {/* 카카오 로그인 */}
        <button
          onClick={() => signIn('kakao')}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
            <span className="text-yellow-400 text-xs font-bold">K</span>
          </div>
          카카오로 시작하기
        </button>

        {/* 구글 로그인 */}
        <button
          onClick={() => signIn('google')}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-lg border border-gray-300 flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          구글로 시작하기
        </button>

        {/* 전통적인 로그인 */}
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          아이디/비밀번호로 로그인
        </button>
      </div>
    </div>
  );
} 
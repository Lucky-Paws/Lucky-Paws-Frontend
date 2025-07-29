import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://43.200.175.153:8080/api';

export interface SignupRequestDto {
  email: string;
  password: string;
  name: string;
  nickname: string;
  careerYear: number;
  schoolLevel: string;
}

export interface SignupResponseDto {
  id: number;
  email: string;
  name: string;
  nickname: string;
  careerYear: number;
  schoolLevel: string;
}

export interface KakaoLoginRequestDto {
  accessToken: string;
  provider: string;
}

export interface LoginResponseDto {
  id: number;
  email: string;
  name: string;
  nickname: string;
  careerYear: number;
  schoolLevel: string;
  token: string;
  expiresIn: number;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API 요청 URL:', url);

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    console.log('API 요청 설정:', {
      method: config.method,
      headers: config.headers,
      body: config.body ? JSON.parse(config.body as string) : undefined
    });

    try {
      const response = await fetch(url, config);
      console.log('API 응답 상태:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('API 응답 데이터:', data);

      // 스프링 부트 응답 형식에 맞춰 처리
      if (response.ok) {
        // 성공 응답
        return {
          success: true,
          data: data.data || data, // data 필드가 있으면 사용, 없으면 전체 응답
          message: data.message
        };
      } else {
        // 에러 응답
        console.error('API 에러 응답:', data);
        return {
          success: false,
          error: {
            code: data.code || 'ERROR',
            message: data.message || data.error || '요청에 실패했습니다.'
          }
        };
      }
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: '네트워크 오류가 발생했습니다.'
        }
      };
    }
  }

  // 카카오 로그인
  async kakaoLogin(accessToken: string): Promise<ApiResponse<LoginResponseDto>> {
    console.log('카카오 로그인 API 호출:', { accessToken: accessToken.substring(0, 10) + '...' });
    return this.request<LoginResponseDto>('/auth/kakao/login', {
      method: 'POST',
      body: JSON.stringify({
        accessToken,
        provider: 'kakao'
      }),
    });
  }

  // 구글 로그인
  async googleLogin(accessToken: string): Promise<ApiResponse<LoginResponseDto>> {
    console.log('구글 로그인 API 호출:', { accessToken: accessToken.substring(0, 10) + '...' });
    return this.request<LoginResponseDto>('/auth/google/login', {
      method: 'POST',
      body: JSON.stringify({
        accessToken,
        provider: 'google'
      }),
    });
  }

  // 회원가입
  async signUp(userData: SignupRequestDto): Promise<ApiResponse<SignupResponseDto>> {
    return this.request<SignupResponseDto>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 일반 로그인
  async login(credentials: LoginRequestDto): Promise<ApiResponse<LoginResponseDto>> {
    return this.request<LoginResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}

export const authService = new AuthService(); 
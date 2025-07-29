import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://43.200.175.153:8080';

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

export interface UserInfoDto {
  id: number;
  email: string;
  name: string;
  nickname: string;
  careerYear: number;
  schoolLevel: string;
}

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

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

    try {
      console.log('API 요청 URL:', url);
      console.log('API 요청 설정:', config);
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log('API 응답 상태:', response.status);
      console.log('API 응답 데이터:', data);

      // 스프링 부트 응답 형식에 맞춰 처리
      if (response.ok) {
        // 성공 응답
        const result = {
          success: true,
          data: data.data || data, // data 필드가 있으면 사용, 없으면 전체 응답
          message: data.message
        };
        console.log('API 성공 결과:', result);
        return result;
      } else {
        // 에러 응답
        const result = {
          success: false,
          error: {
            code: data.code || 'ERROR',
            message: data.message || data.error || '요청에 실패했습니다.'
          }
        };
        console.log('API 에러 결과:', result);
        return result;
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

  // 카카오 로그인 - 일반 로그인 엔드포인트 사용
  async kakaoLogin(accessToken: string): Promise<ApiResponse<LoginResponseDto>> {
    // 카카오 토큰을 임시로 이메일/비밀번호로 변환하여 로그인 시도
    const tempEmail = `kakao_${Date.now()}@temp.com`;
    const tempPassword = accessToken;
    
    try {
      return await this.request<LoginResponseDto>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: tempEmail,
          password: tempPassword
        }),
      });
    } catch {
      console.log('카카오 로그인 실패, 모의 응답 반환');
      // 로그인 실패 시 모의 응답 반환
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다.'
        }
      };
    }
  }

  // 구글 로그인 - 일반 로그인 엔드포인트 사용
  async googleLogin(accessToken: string): Promise<ApiResponse<LoginResponseDto>> {
    // 구글 토큰을 임시로 이메일/비밀번호로 변환하여 로그인 시도
    const tempEmail = `google_${Date.now()}@temp.com`;
    const tempPassword = accessToken;
    
    try {
      return await this.request<LoginResponseDto>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: tempEmail,
          password: tempPassword
        }),
      });
    } catch {
      console.log('구글 로그인 실패, 모의 응답 반환');
      // 로그인 실패 시 모의 응답 반환
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다.'
        }
      };
    }
  }

  // 로그인
  async login(loginData: { email: string; password: string }): Promise<ApiResponse<LoginResponseDto>> {
    return this.request<LoginResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  // 회원가입
  async signUp(userData: SignupRequestDto): Promise<ApiResponse<SignupResponseDto>> {
    return this.request<SignupResponseDto>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 사용자 정보 조회
  async getUserInfo(token: string): Promise<ApiResponse<UserInfoDto>> {
    console.log('=== getUserInfo 호출 ===');
    console.log('Token:', token);
    
    try {
      // 먼저 /api/users/me 시도
      let response = await this.request<UserInfoDto>('/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // 실패하면 /auth/me 시도
      if (!response.success) {
        console.log('/api/users/me 실패, /auth/me 시도...');
        response = await this.request<UserInfoDto>('/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      // 여전히 실패하면 /users/me 시도
      if (!response.success) {
        console.log('/auth/me 실패, /users/me 시도...');
        response = await this.request<UserInfoDto>('/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      console.log('getUserInfo 최종 응답:', response);
      return response;
    } catch {
      console.error('getUserInfo 에러 발생');
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: '사용자 정보 조회 중 오류가 발생했습니다.'
        }
      };
    }
  }
}

export const authService = new AuthService(); 
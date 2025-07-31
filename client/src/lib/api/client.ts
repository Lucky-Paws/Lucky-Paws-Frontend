import { API_BASE_URL } from './config';

interface RequestOptions extends RequestInit {
  params?: any;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    }
    
    // NextAuth 세션에서 토큰 가져오기 (폴백)
    try {
      const session = await fetch('/api/auth/session').then(res => res.json()) as { accessToken?: string };
      return session?.accessToken || null;
    } catch {
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...restOptions } = options;
    
    // 모의 엔드포인트 처리
    if (endpoint.startsWith('/mock/')) {
      return this.handleMockRequest<T>(endpoint, options);
    }
    
    // URL 파라미터 처리
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      url += `?${queryString}`;
    }

    // 인증 토큰 추가
    const token = await this.getAuthToken();
    const finalHeaders: HeadersInit = {
      ...this.defaultHeaders,
      ...headers,
    };

    if (token) {
      (finalHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log('API 요청:', url, finalHeaders);
      
      const response = await fetch(url, {
        ...restOptions,
        headers: finalHeaders,
      });

      console.log('API 응답 상태:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' })) as { message?: string };
        console.error('API 에러:', error);
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      // 204 No Content 처리
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      console.log('API 응답 데이터:', data);
      return data;
    } catch {
      console.error('API request failed');
      throw new Error('API request failed');
    }
  }

  private async handleMockRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    console.log('모의 API 호출:', endpoint, options);
    
    // 모의 데이터 반환
    if (endpoint.includes('/mock/posts')) {
      if (endpoint.includes('/comments')) {
        return this.getMockComments() as T;
      } else {
        return this.getMockPosts() as T;
      }
    } else if (endpoint.includes('/mock/chat')) {
      return this.getMockChatData() as T;
    } else if (endpoint.includes('/mock/users')) {
      return this.getMockUsers() as T;
    } else if (endpoint.includes('/mock/search')) {
      return this.getMockSearchResults() as T;
    }
    
    return {} as T;
  }

  private getMockPosts() {
    return {
      posts: [
        {
          id: '1',
          title: '학생 지도에 대한 조언이 필요합니다',
          content: '초등학교 3학년 담임을 맡고 있는데, 특별히 말썽이 많은 학생이 있어서 고민입니다...',
          author: { id: '1', name: '김선생님', avatar: null },
          category: '학생지도',
          tags: ['초등학교', '학생지도'],
          likes: 5,
          comments: 3,
          createdAt: new Date().toISOString(),
          isAnswered: false
        },
        {
          id: '2',
          title: '학부모와의 소통 방법',
          content: '학부모님과의 소통이 어려워서 고민입니다. 어떤 방법들이 있을까요?',
          author: { id: '2', name: '이선생님', avatar: null },
          category: '학부모상담',
          tags: ['학부모상담', '소통'],
          likes: 8,
          comments: 5,
          createdAt: new Date().toISOString(),
          isAnswered: true
        }
      ],
      total: 2,
      page: 1,
      totalPages: 1
    };
  }

  private getMockComments() {
    return {
      comments: [
        {
          id: '1',
          content: '정말 좋은 조언이네요!',
          author: { id: '3', name: '박선생님', avatar: null },
          likes: 2,
          createdAt: new Date().toISOString()
        }
      ],
      total: 1
    };
  }

  private getMockChatData() {
    return [
      {
        id: '1',
        participants: [
          { id: '1', name: '김선생님', avatar: null, type: 'mentor' },
          { id: '2', name: '이선생님', avatar: null, type: 'mentee' }
        ],
        lastMessage: { content: '안녕하세요!', sentAt: new Date() },
        unreadCount: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private getMockUsers() {
    return [
      { id: '1', name: '김선생님', email: 'kim@school.com', avatar: null }
    ];
  }

  private getMockSearchResults() {
    return {
      posts: [],
      total: 0,
      page: 1,
      totalPages: 0
    };
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://43.200.175.153:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  // 백엔드에서 제공하지 않는 엔드포인트들은 임시로 비활성화
  USERS: {
    LIST: '/mock/users',
    BY_ID: (id: string) => `/mock/users/${id}`,
    UPDATE: (id: string) => `/mock/users/${id}`,
    DELETE: (id: string) => `/mock/users/${id}`,
  },
  POSTS: {
    LIST: '/mock/posts',
    CREATE: '/mock/posts',
    BY_ID: (id: string) => `/mock/posts/${id}`,
    UPDATE: (id: string) => `/mock/posts/${id}`,
    DELETE: (id: string) => `/mock/posts/${id}`,
    LIKE: (id: string) => `/mock/posts/${id}/like`,
    UNLIKE: (id: string) => `/mock/posts/${id}/unlike`,
  },
  COMMENTS: {
    LIST: (postId: string) => `/mock/posts/${postId}/comments`,
    CREATE: (postId: string) => `/mock/posts/${postId}/comments`,
    UPDATE: (postId: string, commentId: string) => `/mock/posts/${postId}/comments/${commentId}`,
    DELETE: (postId: string, commentId: string) => `/mock/posts/${postId}/comments/${commentId}`,
    LIKE: (postId: string, commentId: string) => `/mock/posts/${postId}/comments/${commentId}/like`,
  },
  REACTIONS: {
    ADD: (postId: string) => `/mock/posts/${postId}/reactions`,
    REMOVE: (postId: string, reactionId: string) => `/mock/posts/${postId}/reactions/${reactionId}`,
  },
  CHAT: {
    ROOMS: '/mock/chat/rooms',
    ROOM_BY_ID: (id: string) => `/mock/chat/rooms/${id}`,
    MESSAGES: (roomId: string) => `/mock/chat/rooms/${roomId}/messages`,
    SEND_MESSAGE: (roomId: string) => `/mock/chat/rooms/${roomId}/messages`,
  },
  SEARCH: {
    POSTS: '/mock/search/posts',
    USERS: '/mock/search/users',
  },
} as const;
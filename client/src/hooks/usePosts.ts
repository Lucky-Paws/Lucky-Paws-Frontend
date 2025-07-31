'use client';

import { useState, useEffect } from 'react';
import { Post, PostCategory, TeacherLevel, ExperienceYears } from '@/types';
import { postService, PostQueryParams } from '@/services/postService';

interface UsePostsOptions {
  category?: PostCategory;
  teacherLevel?: TeacherLevel;
  experienceYears?: ExperienceYears;
  isAnswered?: boolean;
  sortBy?: 'latest' | 'popular';
  searchQuery?: string;
}

// Mock data generator
const generateMockPosts = (): Post[] => {
  const categories: PostCategory[] = ['학생지도', '수업운영', '평가/과제', '학부모상담', '학부모'];
  const levels: TeacherLevel[] = ['초등학교', '중학교', '고등학교'];
  const experiences: ExperienceYears[] = ['1년차', '2년차', '3년차', '4년차', '5년차', '6-10년차', '11-20년차', '20년차 이상'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `오늘 아이가 어떠구 ${i + 1}`,
    content: '내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용내용...',
    author: {
      id: `user-${i % 10}`,
      name: `${i % 2 === 0 ? 'OOO 멘티' : 'OOO 멘토'}`,
      type: i % 2 === 0 ? 'mentee' : 'mentor',
      teacherType: levels[i % 3],
      yearsOfExperience: parseInt(experiences[i % 8])
    },
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    viewCount: Math.floor(Math.random() * 1000),
    likeCount: Math.floor(Math.random() * 100),
    commentCount: Math.floor(Math.random() * 50),
    tags: [levels[i % 3] + ' 선생님', experiences[i % 8]],
    category: categories[i % 5],
    isAnswered: i % 3 !== 0,
    isHot: Math.random() > 0.8
  }));
};

export function usePosts(options: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // API 호출 파라미터 준비
        const queryParams: PostQueryParams = {
          category: options.category,
          teacherLevel: options.teacherLevel,
          isAnswered: options.isAnswered,
          sortBy: options.sortBy,
          page: page,
          pageSize: 10
        };
        
        console.log('API 호출 파라미터:', queryParams);
        
        // 실제 API 호출
        try {
          const response = await postService.getPosts(queryParams);
          console.log('API 응답:', response);
          
          // 날짜 문자열을 Date 객체로 변환
          const postsWithDates = response.posts.map(post => ({
            ...post,
            createdAt: new Date(post.createdAt as any)
          }));
          
          setPosts(postsWithDates);
          setTotal(response.totalCount);
        } catch (apiError) {
          console.error('API 호출 실패:', apiError);
          console.log('목 데이터로 폴백합니다.');
          
          // API 호출 실패 시 목 데이터 사용
          let allPosts = generateMockPosts();
          
          // Apply filters
          if (options.category) {
            allPosts = allPosts.filter(post => post.category === options.category);
          }
          
          if (options.teacherLevel) {
            allPosts = allPosts.filter(post => post.author.teacherType === options.teacherLevel);
          }
          
          if (options.isAnswered !== undefined) {
            allPosts = allPosts.filter(post => post.isAnswered === options.isAnswered);
          }
          
          if (options.searchQuery) {
            const query = options.searchQuery.toLowerCase();
            allPosts = allPosts.filter(post => 
              post.title.toLowerCase().includes(query) || 
              post.content.toLowerCase().includes(query)
            );
          }
          
          // Apply sorting
          if (options.sortBy === 'popular') {
            allPosts.sort((a, b) => b.likeCount - a.likeCount);
          } else {
            allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          }
          
          setPosts(allPosts);
          setTotal(allPosts.length);
        }
      } catch {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [options.category, options.teacherLevel, options.experienceYears, options.isAnswered, options.sortBy, options.searchQuery, page]);

  return { posts, loading, error, total, page, setPage };
}
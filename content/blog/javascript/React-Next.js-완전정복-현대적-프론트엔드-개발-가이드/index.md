---
templateKey: blog-post
title: React와 Next.js 완전정복 - 현대적 프론트엔드 개발 실전 가이드
date: 2025-11-15T00:00:00.000Z
category: javascript
description:
  React Hooks 심화, Server Components, Next.js 14 App Router, React Query, 상태 관리 라이브러리 비교, 성능 최적화까지 현대적 React/Next.js 개발의 모든 것을 실전 예제와 함께 정리합니다.
tags:
  - React
  - Next.js
  - React Hooks
  - Server Components
  - React Query
  - 프론트엔드
  - 웹 개발
  - JavaScript
  - TypeScript
  - 상태 관리
---

# React와 Next.js 완전정복 - 현대적 프론트엔드 개발 실전 가이드

React는 현재 가장 인기 있는 프론트엔드 라이브러리이며, Next.js는 React 기반의 풀스택 프레임워크로 빠르게 성장하고 있다. 2024년 기준 React 생태계는 Hooks, Server Components, Suspense 등 혁신적인 기능들로 무장했다. 이 글은 React와 Next.js를 활용한 현대적 프론트엔드 개발의 모든 것을 실전 예제와 함께 다룬다.

## 1. React Hooks 심화

### 1-1. useState와 useReducer 고급 활용

#### useState의 함수형 업데이트

```typescript
import { useState, useCallback } from 'react';

// ❌ 잘못된 사용: 클로저 문제
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    // 여러 번 호출 시 예상과 다르게 동작
    setCount(count + 1);
    setCount(count + 1); // count는 여전히 0
  };
  
  return <button onClick={increment}>Count: {count}</button>;
}

// ✅ 올바른 사용: 함수형 업데이트
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // 이전 값을 기반으로 업데이트
  }, []);
  
  return <button onClick={increment}>Count: {count}</button>;
}
```

#### useReducer로 복잡한 상태 관리

```typescript
import { useReducer, useCallback } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type TodoAction =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: number }
  | { type: 'DELETE_TODO'; id: number }
  | { type: 'CLEAR_COMPLETED' };

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodoState = {
  todos: [],
  filter: 'all'
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.text,
            completed: false
          }
        ]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
    
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };
    
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  const addTodo = useCallback((text: string) => {
    dispatch({ type: 'ADD_TODO', text });
  }, []);
  
  const toggleTodo = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE_TODO', id });
  }, []);
  
  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });
  
  return (
    <div>
      <input
        type="text"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            addTodo(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
        placeholder="할 일 입력..."
      />
      <div>
        {filteredTodos.map(todo => (
          <div key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 1-2. useEffect와 의존성 배열 완벽 이해

```typescript
import { useEffect, useState, useRef } from 'react';

function DataFetcher({ userId }: { userId: number }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  useEffect(() => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setLoading(true);
    
    fetch(`/api/users/${userId}`, { signal })
      .then(res => res.json())
      .then(data => {
        if (!signal.aborted) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          setLoading(false);
        }
      });
    
    // 클린업 함수: 컴포넌트 언마운트 또는 userId 변경 시 실행
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [userId]); // userId가 변경될 때만 재실행
  
  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### 1-3. 커스텀 Hooks 패턴

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

// API 호출을 위한 커스텀 Hook
function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const refetch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setLoading(true);
    setError(null);
    
    fetch(url, { ...options, signal })
      .then(async res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!signal.aborted) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError' && !signal.aborted) {
          setError(err);
          setLoading(false);
        }
      });
  }, [url, options]);
  
  useEffect(() => {
    refetch();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [refetch]);
  
  return { data, loading, error, refetch };
}

// 사용 예시
function UserProfile({ userId }: { userId: number }) {
  const { data, loading, error, refetch } = useFetch<User>(
    `/api/users/${userId}`
  );
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;
  
  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={refetch}>새로고침</button>
    </div>
  );
}

// 로컬 스토리지 동기화 Hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue] as const;
}

// 사용 예시
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
```

### 1-4. useMemo와 useCallback 최적화

```typescript
import { useMemo, useCallback, memo } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

function ProductList({ products, filter, onProductClick }: {
  products: Product[];
  filter: string;
  onProductClick: (id: number) => void;
}) {
  // 필터링된 제품 목록을 메모이제이션
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(product =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);
  
  // 정렬된 제품 목록
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => a.price - b.price);
  }, [filteredProducts]);
  
  // 총 가격 계산
  const totalPrice = useMemo(() => {
    return sortedProducts.reduce((sum, product) => sum + product.price, 0);
  }, [sortedProducts]);
  
  return (
    <div>
      <div>총 {sortedProducts.length}개 제품</div>
      <div>총 가격: {totalPrice.toLocaleString()}원</div>
      {sortedProducts.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
}

// 메모이제이션된 자식 컴포넌트
const ProductItem = memo(({ product, onClick }: {
  product: Product;
  onClick: (id: number) => void;
}) => {
  const handleClick = useCallback(() => {
    onClick(product.id);
  }, [product.id, onClick]);
  
  return (
    <div onClick={handleClick}>
      <h3>{product.name}</h3>
      <p>{product.price.toLocaleString()}원</p>
    </div>
  );
});
```

## 2. React Server Components와 Next.js 14 App Router

### 2-1. Server Components vs Client Components

Next.js 13+에서는 기본적으로 모든 컴포넌트가 Server Component다. 클라이언트 기능이 필요할 때만 `'use client'` 지시어를 사용한다.

```typescript
// app/components/ServerComponent.tsx
// Server Component (기본값)
import { db } from '@/lib/db';

async function ServerComponent() {
  // 서버에서 직접 데이터베이스 접근
  const data = await db.query('SELECT * FROM products');
  
  return (
    <div>
      <h1>Server Component</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

// app/components/ClientComponent.tsx
'use client'; // 클라이언트 컴포넌트로 명시

import { useState } from 'react';

export function ClientComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
```

### 2-2. Next.js 14 App Router 구조

```
app/
  layout.tsx          # 루트 레이아웃
  page.tsx            # 홈 페이지
  loading.tsx         # 로딩 UI
  error.tsx           # 에러 UI
  not-found.tsx       # 404 페이지
  
  products/
    layout.tsx        # products 레이아웃
    page.tsx          # /products 페이지
    [id]/
      page.tsx        # /products/[id] 동적 라우트
      loading.tsx      # 로딩 UI
      error.tsx        # 에러 UI
    
  api/
    users/
      route.ts        # API 라우트
```

### 2-3. App Router 실전 예제

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js 14 App Router Example',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <nav>
          <a href="/">Home</a>
          <a href="/products">Products</a>
        </nav>
        {children}
      </body>
    </html>
  );
}

// app/products/page.tsx
import { Suspense } from 'react';
import { ProductList } from '@/components/ProductList';
import { ProductListSkeleton } from '@/components/ProductListSkeleton';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  );
}

// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id: parseInt(id) }
  });
  
  if (!product) {
    notFound();
  }
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>가격: {product.price.toLocaleString()}원</p>
    </div>
  );
}

// app/products/[id]/loading.tsx
export default function Loading() {
  return <div>제품 정보를 불러오는 중...</div>;
}

// app/products/[id]/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  
  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}
```

### 2-4. Streaming과 Suspense

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { RevenueChart } from '@/components/RevenueChart';
import { SalesTable } from '@/components/SalesTable';
import { StatsCards } from '@/components/StatsCards';

export default function DashboardPage() {
  return (
    <div>
      <h1>대시보드</h1>
      
      {/* 즉시 렌더링 */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>
      
      {/* 병렬 로딩 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        
        <Suspense fallback={<TableSkeleton />}>
          <SalesTable />
        </Suspense>
      </div>
    </div>
  );
}

// app/components/RevenueChart.tsx
async function RevenueChart() {
  // 느린 데이터베이스 쿼리
  await new Promise(resolve => setTimeout(resolve, 2000));
  const data = await fetchRevenueData();
  
  return <div>차트 렌더링...</div>;
}
```

## 3. 데이터 페칭과 상태 관리

### 3-1. React Query (TanStack Query) 완전 정리

React Query는 서버 상태 관리를 위한 강력한 라이브러리다.

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            gcTime: 5 * 60 * 1000, // 5분 (이전 cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
  price: number;
}

// 제품 목록 조회
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json() as Promise<Product[]>;
    },
  });
}

// 단일 제품 조회
export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return res.json() as Promise<Product>;
    },
    enabled: !!id, // id가 있을 때만 실행
  });
}

// 제품 생성
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newProduct: Omit<Product, 'id'>) => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('Failed to create product');
      return res.json() as Promise<Product>;
    },
    onSuccess: () => {
      // 제품 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// 제품 업데이트
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: number }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update product');
      return res.json() as Promise<Product>;
    },
    onSuccess: (data) => {
      // 특정 제품 캐시 업데이트
      queryClient.setQueryData(['products', data.id], data);
      // 제품 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// 사용 예시
'use client';

import { useProducts, useCreateProduct } from '@/hooks/useProducts';

function ProductsPage() {
  const { data: products, isLoading, error } = useProducts();
  const createProduct = useCreateProduct();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  const handleCreate = () => {
    createProduct.mutate(
      { name: 'New Product', price: 10000 },
      {
        onSuccess: () => {
          console.log('Product created!');
        },
        onError: (error) => {
          console.error('Failed to create:', error);
        },
      }
    );
  };
  
  return (
    <div>
      <button onClick={handleCreate} disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Creating...' : 'Create Product'}
      </button>
      <ul>
        {products?.map(product => (
          <li key={product.id}>
            {product.name} - {product.price}원
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 3-2. Infinite Queries (무한 스크롤)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostsResponse {
  posts: Post[];
  nextCursor: number | null;
}

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/posts?cursor=${pageParam}&limit=10`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json() as Promise<PostsResponse>;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
}

// 사용 예시
'use client';

import { useInfinitePosts } from '@/hooks/useInfinitePosts';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useRef } from 'react';

function InfinitePostsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });
  
  const posts = data?.pages.flatMap(page => page.posts) ?? [];
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
      
      <div ref={loadMoreRef}>
        {isFetchingNextPage && <div>Loading more...</div>}
        {!hasNextPage && <div>No more posts</div>}
      </div>
    </div>
  );
}
```

### 3-3. Optimistic Updates

```typescript
export function useLikePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to like post');
      return res.json();
    },
    onMutate: async (postId) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });
      
      // 이전 값 백업
      const previousPost = queryClient.getQueryData(['posts', postId]);
      
      // 낙관적 업데이트
      queryClient.setQueryData(['posts', postId], (old: any) => ({
        ...old,
        likes: old.likes + 1,
        isLiked: true,
      }));
      
      return { previousPost };
    },
    onError: (err, postId, context) => {
      // 에러 시 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(['posts', postId], context.previousPost);
      }
    },
    onSettled: (data, error, postId) => {
      // 최종적으로 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });
}
```

## 4. 상태 관리 라이브러리 비교

### 4-1. Zustand - 가벼운 상태 관리

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface BearState {
  bears: number;
  increase: (by: number) => void;
  decrease: (by: number) => void;
}

export const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
        decrease: (by) => set((state) => ({ bears: state.bears - by })),
      }),
      {
        name: 'bear-storage', // localStorage 키
      }
    ),
    { name: 'BearStore' } // Redux DevTools 이름
  )
);

// 사용 예시
function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  const increase = useBearStore((state) => state.increase);
  
  return (
    <div>
      <h1>{bears} bears around here...</h1>
      <button onClick={() => increase(1)}>Add bear</button>
    </div>
  );
}
```

### 4-2. Jotai - 원자적 상태 관리

```typescript
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 기본 atom
const countAtom = atom(0);

// 파생 atom
const doubledCountAtom = atom((get) => get(countAtom) * 2);

// 비동기 atom
const userAtom = atom(async () => {
  const res = await fetch('/api/user');
  return res.json();
});

// localStorage와 동기화
const themeAtom = atomWithStorage('theme', 'light');

// 사용 예시
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const doubled = useAtomValue(doubledCountAtom);
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

## 5. 성능 최적화

### 5-1. 코드 스플리팅과 레이지 로딩

```typescript
import { lazy, Suspense } from 'react';

// 동적 import로 컴포넌트 레이지 로딩
const HeavyComponent = lazy(() => import('./HeavyComponent'));
const ChartComponent = lazy(() => import('./ChartComponent'));

function App() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <Suspense fallback={<div>Loading component...</div>}>
        <HeavyComponent />
      </Suspense>
      
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <ChartComponent />
        </Suspense>
      )}
      
      <button onClick={() => setShowChart(true)}>Show Chart</button>
    </div>
  );
}
```

### 5-2. 이미지 최적화

```typescript
import Image from 'next/image';

function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority // 우선 로딩
      placeholder="blur" // 블러 플레이스홀더
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

### 5-3. 번들 분석

```bash
# Next.js 번들 분석
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js 설정
});

# 분석 실행
ANALYZE=true npm run build
```

## 6. Next.js API Routes와 Server Actions

### 6-1. API Routes

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const users = await db.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const user = await db.user.create({
    data: body,
  });
  
  return NextResponse.json(user, { status: 201 });
}
```

### 6-2. Server Actions

```typescript
// app/actions/user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function createUser(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
  };
  
  // 유효성 검사
  const validatedData = createUserSchema.parse(rawData);
  
  // 데이터베이스에 저장
  const user = await db.user.create({
    data: validatedData,
  });
  
  // 캐시 무효화
  revalidatePath('/users');
  
  return { success: true, user };
}

// 사용 예시
'use client';

import { createUser } from '@/app/actions/user';
import { useTransition } from 'react';

function UserForm() {
  const [isPending, startTransition] = useTransition();
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createUser(formData);
      if (result.success) {
        console.log('User created:', result.user);
      }
    });
  }
  
  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

## 7. 결론

React와 Next.js는 현대적 웹 개발의 핵심 기술이다. 이 글에서 다룬 내용:

1. **React Hooks 심화**: useState, useReducer, useEffect, 커스텀 Hooks
2. **Next.js 14 App Router**: Server Components, Streaming, Suspense
3. **데이터 페칭**: React Query를 활용한 서버 상태 관리
4. **상태 관리**: Zustand, Jotai 등 현대적 라이브러리
5. **성능 최적화**: 코드 스플리팅, 이미지 최적화, 번들 분석

이러한 기술들을 조합하면 확장 가능하고 유지보수하기 쉬운 프론트엔드 애플리케이션을 구축할 수 있다.

## 참고 자료

- [React 공식 문서](https://react.dev/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)



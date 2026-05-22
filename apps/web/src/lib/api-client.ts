import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

// Advanced caching layer
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds
const pendingRequests = new Map<string, Promise<any>>();

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
  headers: { 
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
  },
  timeout: 10000, // 10 second timeout
  decompress: true,
});

// Request interceptor - attach token and implement caching
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // Only cache GET requests
  if (config.method === 'get') {
    const cacheKey = `${config.url}?${JSON.stringify(config.params || {})}`;
    
    // Check if there's a pending request for the same endpoint
    if (pendingRequests.has(cacheKey)) {
      // Return the pending request instead of making a new one (request deduplication)
      config.adapter = () => pendingRequests.get(cacheKey)!;
    }
    
    // Check cache for fresh data
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      // Return cached data immediately
      config.adapter = () => Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK (Cached)',
        headers: {},
        config,
      });
    }
  }
  
  return config;
});

// Response interceptor - handle 401 with refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const handleLogout = async () => {
  try {
    await useAuthStore.getState().logout();
  } catch (logoutError) {
    console.error('Logout failed:', logoutError);
    useAuthStore.setState({
      user: null,
      accessToken: null,
      tenantId: null,
      isAuthenticated: false,
    });
  }
  window.location.href = '/login';
};

apiClient.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get' && response.status === 200) {
      const cacheKey = `${response.config.url}?${JSON.stringify(response.config.params || {})}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
      
      // Clean up pending request
      pendingRequests.delete(cacheKey);
      
      // Limit cache size to 100 entries
      if (requestCache.size > 100) {
        const firstKey = requestCache.keys().next().value;
        requestCache.delete(firstKey);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Clean up pending request on error
    if (originalRequest?.method === 'get') {
      const cacheKey = `${originalRequest.url}?${JSON.stringify(originalRequest.params || {})}`;
      pendingRequests.delete(cacheKey);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshed = await useAuthStore.getState().refreshToken();
        if (refreshed) {
          const newToken = useAuthStore.getState().accessToken;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } else {
          processQueue(error, null);
          await handleLogout();
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        await handleLogout();
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 404) {
      console.error('API endpoint not found:', error.config?.url);
    }
    return Promise.reject(error);
  },
);

// Helper function to clear cache
export const clearApiCache = () => {
  requestCache.clear();
  pendingRequests.clear();
};

// Helper function to prefetch data
export const prefetchData = async (url: string, params?: any) => {
  const cacheKey = `${url}?${JSON.stringify(params || {})}`;
  if (!requestCache.has(cacheKey) && !pendingRequests.has(cacheKey)) {
    const request = apiClient.get(url, { params });
    pendingRequests.set(cacheKey, request);
    try {
      await request;
    } catch (error) {
      console.error('Prefetch failed:', error);
    }
  }
};

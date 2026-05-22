import { apiClient } from './api-client';

export const api = {
  // Auth
  auth: {
    login: (email: string, password: string, tenantId?: string) =>
      apiClient.post('/auth/login', { email, password, tenantId }),
    register: (data: any) => apiClient.post('/auth/register', data),
    refresh: () => apiClient.post('/auth/refresh', {}),
    logout: () => apiClient.post('/auth/logout', {}),
  },

  // Users
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data: any) => apiClient.put('/users/profile', data),
    getById: (id: string) => apiClient.get(`/users/${id}`),
    list: (params?: any) => apiClient.get('/users', { params }),
    search: (query: string) => apiClient.get('/users/search', { params: { q: query } }),
  },

  // Feed
  feed: {
    getPosts: (params?: any) => apiClient.get('/feed/posts', { params }),
    createPost: (data: any) => apiClient.post('/feed/posts', data),
    getPost: (id: string) => apiClient.get(`/feed/posts/${id}`),
    updatePost: (id: string, data: any) => apiClient.put(`/feed/posts/${id}`, data),
    deletePost: (id: string) => apiClient.delete(`/feed/posts/${id}`),
    likePost: (id: string) => apiClient.post(`/feed/posts/${id}/like`, {}),
    unlikePost: (id: string) => apiClient.delete(`/feed/posts/${id}/like`),
    getComments: (postId: string) => apiClient.get(`/feed/posts/${postId}/comments`),
    addComment: (postId: string, data: any) => apiClient.post(`/feed/posts/${postId}/comments`, data),
  },

  // Announcements
  announcements: {
    list: (params?: any) => apiClient.get('/announcements', { params }),
    getById: (id: string) => apiClient.get(`/announcements/${id}`),
    create: (data: any) => apiClient.post('/announcements', data),
    update: (id: string, data: any) => apiClient.put(`/announcements/${id}`, data),
    delete: (id: string) => apiClient.delete(`/announcements/${id}`),
    acknowledge: (id: string) => apiClient.post(`/announcements/${id}/acknowledge`, {}),
  },

  // Knowledge
  knowledge: {
    getCategories: () => apiClient.get('/knowledge/categories'),
    getArticles: (params?: any) => apiClient.get('/knowledge/articles', { params }),
    getArticle: (id: string) => apiClient.get(`/knowledge/articles/${id}`),
    createArticle: (data: any) => apiClient.post('/knowledge/articles', data),
    updateArticle: (id: string, data: any) => apiClient.put(`/knowledge/articles/${id}`, data),
    deleteArticle: (id: string) => apiClient.delete(`/knowledge/articles/${id}`),
    search: (query: string) => apiClient.get('/knowledge/search', { params: { q: query } }),
  },

  // Documents
  documents: {
    list: (params?: any) => apiClient.get('/documents', { params }),
    getById: (id: string) => apiClient.get(`/documents/${id}`),
    upload: (formData: FormData) =>
      apiClient.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    delete: (id: string) => apiClient.delete(`/documents/${id}`),
  },

  // Recognition
  recognition: {
    list: (params?: any) => apiClient.get('/recognition', { params }),
    give: (data: any) => apiClient.post('/recognition', data),
    getLeaderboard: () => apiClient.get('/recognition/leaderboard'),
    getBadges: () => apiClient.get('/recognition/badges'),
  },

  // Events
  events: {
    list: (params?: any) => apiClient.get('/events', { params }),
    getById: (id: string) => apiClient.get(`/events/${id}`),
    create: (data: any) => apiClient.post('/events', data),
    update: (id: string, data: any) => apiClient.put(`/events/${id}`, data),
    delete: (id: string) => apiClient.delete(`/events/${id}`),
    rsvp: (id: string, status: string) => apiClient.post(`/events/${id}/rsvp`, { status }),
  },

  // Search
  search: {
    global: (query: string, params?: any) =>
      apiClient.get('/search', { params: { q: query, ...params } }),
  },

  // Notifications
  notifications: {
    list: (params?: any) => apiClient.get('/notifications', { params }),
    markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`, {}),
    markAllAsRead: () => apiClient.put('/notifications/read-all', {}),
    delete: (id: string) => apiClient.delete(`/notifications/${id}`),
  },

  // AI
  ai: {
    chat: (message: string) => apiClient.post('/ai/chat', { message }),
    generateSummary: (content: string) => apiClient.post('/ai/summarize', { content }),
    generateDigest: () => apiClient.post('/ai/digest', {}),
  },

  // Departments
  departments: {
    list: () => apiClient.get('/departments'),
    getById: (id: string) => apiClient.get(`/departments/${id}`),
  },

  // Admin
  admin: {
    getStats: () => apiClient.get('/admin/stats'),
    getUsers: (params?: any) => apiClient.get('/admin/users', { params }),
    updateUser: (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
    getTenantSettings: () => apiClient.get('/admin/settings'),
    updateTenantSettings: (data: any) => apiClient.put('/admin/settings', data),
  },
};

import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { username, email, password });
    return data;
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
};

// Posts API
export const postsAPI = {
  getAll: async () => {
    const { data } = await api.get('/posts');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/posts/${id}`);
    return data;
  },
  create: async (post: any) => {
    const { data } = await api.post('/posts', post);
    return data;
  },
  update: async (id: string, post: any) => {
    const { data } = await api.put(`/posts/${id}`, post);
    return data;
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/posts/${id}`);
    return data;
  },
  getPublicPosts: async () => {
    const { data } = await api.get('/posts/public');
    return data;
  },
  getPublicPostBySlug: async (slug: string) => {
    const { data } = await api.get(`/posts/public/${slug}`);
    return data;
  },
};

export default api;

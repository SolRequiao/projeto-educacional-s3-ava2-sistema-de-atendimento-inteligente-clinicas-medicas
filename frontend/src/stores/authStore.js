import { defineStore } from 'pinia';
import api from '../services/api';

const tokenKey = 'clinica_token';
const userKey = 'clinica_user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(tokenKey) || '',
    user: JSON.parse(localStorage.getItem(userKey) || 'null'),
    loading: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    persistAuth(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(userKey, JSON.stringify(user));
    },
    clearAuth() {
      this.token = '';
      this.user = null;
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
    },
    async login(payload) {
      this.loading = true;
      try {
        const { data } = await api.post('/auth/login', payload);
        this.persistAuth(data.token, data.user);
        return data;
      } finally {
        this.loading = false;
      }
    },
    async register(payload) {
      this.loading = true;
      try {
        const { data } = await api.post('/auth/register', payload);
        this.persistAuth(data.token, data.user);
        return data;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      if (!this.token) return null;
      this.loading = true;
      try {
        const { data } = await api.get('/auth/me');
        this.user = data.user;
        localStorage.setItem(userKey, JSON.stringify(data.user));
        return data.user;
      } catch (error) {
        this.clearAuth();
        throw error;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.clearAuth();
    }
  }
});

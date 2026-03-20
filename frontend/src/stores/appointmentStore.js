import { defineStore } from 'pinia';
import api from '../services/api';

export const useAppointmentStore = defineStore('appointments', {
  state: () => ({
    myAppointments: [],
    allAppointments: [],
    dashboard: null,
    loading: false
  }),
  actions: {
    async fetchMyAppointments() {
      this.loading = true;
      try {
        const { data } = await api.get('/appointments/my');
        this.myAppointments = data.appointments;
        return data.appointments;
      } finally {
        this.loading = false;
      }
    },
    async createAppointment(payload) {
      const { data } = await api.post('/appointments', payload);
      await this.fetchMyAppointments();
      return data;
    },
    async updateAppointment(id, payload) {
      const { data } = await api.put(`/appointments/${id}`, payload);
      return data;
    },
    async deleteAppointment(id) {
      const { data } = await api.delete(`/appointments/${id}`);
      return data;
    },
    async fetchAllAppointments(filters = {}) {
      this.loading = true;
      try {
        const { data } = await api.get('/appointments', { params: filters });
        this.allAppointments = data.appointments;
        return data;
      } finally {
        this.loading = false;
      }
    },
    async fetchDashboard() {
      this.loading = true;
      try {
        const { data } = await api.get('/appointments/dashboard');
        this.dashboard = data;
        return data;
      } finally {
        this.loading = false;
      }
    },
    async updateStatus(id, status) {
      const { data } = await api.patch(`/appointments/${id}/status`, { status });
      return data;
    }
  }
});

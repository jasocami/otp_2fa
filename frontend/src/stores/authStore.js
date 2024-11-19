import { defineStore } from 'pinia'
import { coreServices } from '@/stores/coreServices'
import axios from 'axios';


export const useAuthStore = defineStore({
  id: 'auth',
  actions: {
    async login(data) {
      return coreServices().post('/users/login/', data, '');
    },
    async logout(data) {
      return coreServices().post('/users/logout/', data, '');
    },
    async verifyOtp(data) {
      return coreServices().post('/users/verify-otp/', data, '');
    },
    async resendOtp() {
      return coreServices().post('/users/resend-otp/', {}, '');
    },
    validateToken(token) {
      // TODO: change to coreServices
      axios.get('/api/users/me/', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(response => {
        commit('setUser', response.data);
        commit('setAppLoaded');
      }).catch(error => {
        console.error("Token validation failed", error);
        this.$router.push('/login');
      });
    },
  },
});

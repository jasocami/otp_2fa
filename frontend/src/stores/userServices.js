import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { coreServices } from '@/stores/coreServices'


export const userServicesStore = defineStore('userServices', () => {
  
  const login = async (data) => {
    const url = '/users/login/';
    return coreServices().post(url, data, '');
  }

  return { login }
});

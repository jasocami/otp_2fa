import { defineStore } from 'pinia';
import { coreServices } from '@/stores/coreServices'


export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({}),
    actions: {
        async getMe() {
            return coreServices().get('/users/me/');
        },
        async getBlocked() {
            return coreServices().get('/users/blocked/');
        },
    }
});
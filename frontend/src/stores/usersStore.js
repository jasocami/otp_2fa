import { defineStore } from 'pinia';
import { coreServices } from '@/stores/coreServices'


export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({}),
    actions: {
        getMe() {
            return coreServices().get('/users/me/');
        },
        getBlocked() {
            return coreServices().get('/users/blocked/');
        },
    }
});
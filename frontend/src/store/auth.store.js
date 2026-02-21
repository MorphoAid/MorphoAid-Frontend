import { defineStore } from 'pinia';
import { authService } from '@/services/auth.service';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: null,
        role: null,
    }),
    actions: {
        async login(email, password) {
            try {
                const response = await authService.login(email, password);
                const token = response.data.token || response.data.accessToken;

                // Save token
                this.token = token;
                localStorage.setItem('token', token);

                // Fetch user context
                await this.fetchMe();
            } catch (error) {
                this.logout();
                throw error;
            }
        },

        async fetchMe() {
            if (!this.token) return;
            try {
                const response = await authService.me();
                this.user = response.data;
                this.role = response.data.role; // e.g. 'DATA_USE', 'DATA_PREP', 'ADMIN'
            } catch (error) {
                this.logout();
                throw error;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            this.role = null;
            localStorage.removeItem('token');
        }
    }
});

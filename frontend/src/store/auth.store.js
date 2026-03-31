import { defineStore } from 'pinia';
import { authService } from '@/services/auth.service';
import { getToken, setToken, clearToken } from '@/services/tokenStorage';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: getToken(),
        user: null,
        role: null,
        isHydrated: false,
    }),
    actions: {
        async init() {
            if (this.isHydrated) return;
            if (this.token && !this.user) {
                try {
                    await this.fetchMe();
                } catch (error) {
                    console.error("Auth hydration failed", error);
                }
            }
            this.isHydrated = true;
        },
        async login(email, password, rememberMe) {
            try {
                const response = await authService.login(email, password, rememberMe);
                const token = response.data.token || response.data.accessToken;

                // Save token
                this.token = token;
                setToken(token, rememberMe);

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
                // Only logout on 401 Unauthorized — not on network errors (connection refused, timeout, etc.)
                if (error?.response?.status === 401) {
                    this.logout();
                }
                throw error;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            this.role = null;
            clearToken();
        }
    }
});

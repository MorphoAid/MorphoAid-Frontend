import http from '@/services/http';

export const authService = {
    async registerDataUse(data) {
        return http.post('/auth/register/data-use', data);
    },

    async registerDataPrep(data) {
        return http.post('/auth/register/data-prep', data);
    },

    async login(email, password) {
        return http.post('/auth/login', { email, password });
    },

    async me() {
        return http.get('/auth/me');
    }
};

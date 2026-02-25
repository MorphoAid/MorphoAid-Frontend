import http from '@/services/http';

export const authService = {
    async registerDataUse(data) {
        return http.post('/auth/register', data);
    },

    async registerDataPrep(data) {
        return http.post('/auth/register/dataprep', data);
    },

    async login(email, password, rememberMe) {
        return http.post('/auth/login', { email, password, rememberMe });
    },

    async me() {
        return http.get('/auth/me');
    }
};

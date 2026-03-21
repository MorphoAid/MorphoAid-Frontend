import http from '@/services/http';

export const userService = {
    async uploadProfilePicture(file) {
        const formData = new FormData();
        formData.append('file', file);
        return http.post('/users/me/profile-picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

import http from '@/services/http';

export const adminService = {
    async getUsers() {
        return http.get('/admin/users');
    },

    async getPendingUsers() {
        return http.get('/admin/users/pending');
    },

    async updateUserRole(id, role) {
        return http.patch(`/admin/users/${id}`, { role });
    },

    async deleteUser(id) {
        return http.delete(`/admin/users/${id}/reject`);
    },

    async getActivities() {
        return http.get('/admin/activities');
    },

    async approveUser(id) {
        return http.patch(`/admin/users/${id}/approve`);
    },

    async rejectUser(id) {
        return http.delete(`/admin/users/${id}/reject`);
    }
};

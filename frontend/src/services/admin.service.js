import http from '@/services/http';

export const adminService = {
    async getUsers() {
        return http.get('/admin/users');
    },

    async updateUserRole(id, role) {
        return http.patch(`/admin/users/${id}`, { role });
    },

    async deleteUser(id) {
        return http.delete(`/admin/users/${id}/reject`);
    },

    async getActivities() {
        return http.get('/admin/activities');
    }
};

const AdminLayout = () => import('@/layouts/AdminLayout.vue');

export default [
    {
        path: '/admin',
        redirect: '/admin/dashboard',
        meta: { requiresAuth: true, roles: ['ADMIN'], layout: 'AdminLayout' }
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: () => import('@/features/admin/views/AdminDashboard.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'], layout: 'AdminLayout' }
    },
    {
        path: '/admin/users',
        name: 'UserManagement',
        component: () => import('@/features/admin/views/UserManagement.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'], layout: 'AdminLayout' }
    },
    {
        path: '/admin/activity-log',
        name: 'ActivityLog',
        component: () => import('@/features/admin/views/ActivityLog.vue'),
        meta: { requiresAuth: true, roles: ['ADMIN'], layout: 'AdminLayout' }
    }
];

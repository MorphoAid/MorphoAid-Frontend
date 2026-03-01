import AdminLayout from '@/layouts/AdminLayout.vue';

export default [
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, roles: ['ADMIN'] },
        children: [
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: () => import('@/features/admin/views/AdminDashboard.vue')
            },
            {
                path: 'users',
                name: 'UserManagement',
                component: () => import('@/features/admin/views/UserManagement.vue')
            }
        ]
    }
];

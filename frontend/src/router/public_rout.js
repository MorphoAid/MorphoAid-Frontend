import PublicLayout from '@/layouts/PublicLayout.vue';

export default [
    {
        path: '/public',
        component: PublicLayout,
        children: [
            {
                path: 'welcome',
                name: 'AuthLanding',
                component: () => import('@/features/auth/views/AuthLanding.vue')
            },
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/features/auth/views/Login.vue'),
                meta: { guestOnly: true }
            },
            {
                path: 'register/data-use',
                name: 'RegisterDataUse',
                component: () => import('@/features/auth/views/RegisterDataUse.vue'),
                meta: { guestOnly: true }
            },
            {
                path: 'register/data-prep',
                name: 'RegisterDataPrep',
                component: () => import('@/features/auth/views/RegisterDataPrep.vue'),
                meta: { guestOnly: true }
            },
            {
                path: '403',
                name: 'Forbidden',
                component: () => import('@/features/auth/views/Forbidden.vue')
            }
        ]
    },
    // Aliases for root level access if needed, or redirect from root
    { path: '/login', redirect: '/public/login' },
    { path: '/register/data-use', redirect: '/public/register/data-use' },
    { path: '/register/data-prep', redirect: '/public/register/data-prep' },
    { path: '/forbidden', redirect: '/public/403' },
    { path: '/403', redirect: '/public/403' }
];

import PublicLayout from '@/layouts/PublicLayout.vue';

export default [
    {
        path: '/',
        component: PublicLayout,
        children: [
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
    }
];

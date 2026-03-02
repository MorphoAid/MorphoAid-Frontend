const PublicLayout = () => import('@/layouts/PublicLayout.vue');

export default [
    {
        path: '/welcome',
        name: 'AuthLanding',
        component: () => import('@/features/auth/views/AuthLanding.vue'),
        meta: { layout: 'PublicLayout' }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/features/auth/views/Login.vue'),
        meta: { guestOnly: true, layout: 'PublicLayout' }
    },
    {
        path: '/register',
        name: 'RegisterSelection',
        component: () => import('@/features/auth/views/RegisterSelection.vue'),
        meta: { guestOnly: true, layout: 'PublicLayout' }
    },
    {
        path: '/register/data-use',
        name: 'RegisterDataUse',
        component: () => import('@/features/auth/views/RegisterDataUse.vue'),
        meta: { guestOnly: true, layout: 'PublicLayout' }
    },
    {
        path: '/register/data-prep',
        name: 'RegisterDataPrep',
        component: () => import('@/features/auth/views/RegisterDataPrep.vue'),
        meta: { guestOnly: true, layout: 'PublicLayout' }
    },
    {
        path: '/403',
        name: 'Forbidden',
        component: () => import('@/features/auth/views/Forbidden.vue'),
        meta: { layout: 'PublicLayout' }
    }
];

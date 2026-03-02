const DataUseLayout = () => import('@/layouts/DataUseLayout.vue');

export default [
    {
        path: '/data-use',
        redirect: '/data-use/dashboard',
        meta: { requiresAuth: true, roles: ['DATA_USE'], layout: 'DataUseLayout' }
    },
    {
        path: '/data-use/dashboard',
        name: 'DataUseDashboard',
        component: () => import('@/features/case-management/views/TestHub.vue'),
        meta: { requiresAuth: true, roles: ['DATA_USE'], layout: 'DataUseLayout' }
    },
    {
        path: '/data-use/cases',
        name: 'DataUseCaseList',
        component: () => import('@/features/case-management/views/CaseListTest.vue'),
        meta: { requiresAuth: true, roles: ['DATA_USE'], layout: 'DataUseLayout' }
    },
    {
        path: '/data-use/cases/new',
        name: 'DataUseCaseUpload',
        component: () => import('@/features/case-management/views/UploadImage.vue'),
        meta: { requiresAuth: true, roles: ['DATA_USE'], layout: 'DataUseLayout' }
    },
    {
        path: '/data-use/cases/:caseId',
        name: 'DataUseCaseDetail',
        component: () => import('@/features/case-management/views/ResultDetail.vue'),
        meta: { requiresAuth: true, roles: ['DATA_USE'], layout: 'DataUseLayout' }
    },
    {
        path: '/data-use/cases/:caseId/raw',
        name: 'DataUseCaseRaw',
        component: () => import('@/features/case-management/views/CaseDetailTest.vue'),
        meta: { requiresAuth: true, roles: ['DATA_USE'], layout: 'DataUseLayout' }
    }
];

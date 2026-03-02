const DataUseLayout = () => import('@/layouts/DataUseLayout.vue');

export default [
    {
        path: '/data-use',
        component: DataUseLayout,
        meta: { requiresAuth: true, roles: ['DATA_USE'], layout: 'DataUseLayout' },
        children: [
            {
                path: '',
                redirect: '/data-use/dashboard'
            },
            {
                path: 'dashboard',
                name: 'DataUseDashboard',
                component: () => import('@/features/case-management/views/TestHub.vue')
            },
            {
                path: 'cases',
                name: 'DataUseCaseList',
                component: () => import('@/features/case-management/views/CaseListTest.vue')
            },
            {
                path: 'cases/new',
                name: 'DataUseCaseUpload',
                component: () => import('@/features/case-management/views/UploadImage.vue')
            },
            {
                path: 'cases/:caseId',
                name: 'DataUseCaseDetail',
                component: () => import('@/features/case-management/views/ResultDetail.vue')
            },
            {
                path: 'cases/:caseId/raw',
                name: 'DataUseCaseRaw',
                component: () => import('@/features/case-management/views/CaseDetailTest.vue')
            }
        ]
    }
];

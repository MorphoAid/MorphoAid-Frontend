import DataUseLayout from '@/layouts/DataUseLayout.vue';

export default [
    {
        path: '/data-use',
        component: DataUseLayout,
        meta: { requiresAuth: true, roles: ['DATA_USE'] },
        children: [
            {
                path: 'dashboard',
                name: 'DataUseDashboard',
                component: () => import('@/features/case-management/views/UploadImage.vue') // Primary entry is upload
            },
            {
                path: 'case/:id',
                name: 'ClinicalCaseDetail',
                component: () => import('@/features/case-management/views/CaseDetailTest.vue')
            }
        ]
    }
];

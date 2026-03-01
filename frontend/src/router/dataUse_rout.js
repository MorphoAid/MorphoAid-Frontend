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
                component: () => import('@/features/case-management/views/CaseListTest.vue') // Placeholder dashboard
            },
            {
                path: 'upload',
                name: 'ClinicalUpload',
                component: () => import('@/features/case-management/views/UploadImage.vue')
            },
            {
                path: 'case/:id',
                name: 'ClinicalCaseDetail',
                component: () => import('@/features/case-management/views/CaseDetailTest.vue')
            }
        ]
    }
];

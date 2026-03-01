import DataPrepLayout from '@/layouts/DataPrepLayout.vue';

export default [
    {
        path: '/data-prep',
        component: DataPrepLayout,
        meta: { requiresAuth: true, roles: ['DATA_PREP'] },
        children: [
            {
                path: 'dashboard',
                name: 'DataPrepDashboard',
                component: () => import('@/features/dataprep/views/DataPrepDashboard.vue')
            },
            {
                path: 'review-queue',
                name: 'ReviewQueue',
                component: () => import('@/features/lab-review/views/ReviewResult.vue')
            },
            {
                path: 'review/:id',
                name: 'ReviewDetail',
                component: () => import('@/features/lab-review/views/VotePanel.vue')
            },
            {
                path: 'cases',
                name: 'AdminCaseList',
                component: () => import('@/features/case-management/views/CaseListTest.vue')
            }
        ]
    }
];

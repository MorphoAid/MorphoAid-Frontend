const DataPrepLayout = () => import('@/layouts/DataPrepLayout.vue');

export default [
    {
        path: '/data-prep',
        redirect: '/data-prep/dashboard',
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    },
    {
        path: '/data-prep/dashboard',
        name: 'DataPrepDashboard',
        component: () => import('@/features/dataprep/views/DataPrepDashboard.vue'),
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    },
    {
        path: '/data-prep/cases/new',
        name: 'DataPrepAnonymizedUpload',
        component: () => import('@/features/case-management/views/UploadImage.vue'),
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    },
    {
        path: '/data-prep/review-queue',
        name: 'DataPrepReviewQueue',
        component: () => import('@/features/lab-review/views/ReviewResult.vue'),
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    },
    {
        path: '/data-prep/review/:caseId',
        name: 'DataPrepReviewDetail',
        component: () => import('@/features/lab-review/views/VotePanel.vue'),
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    },
    {
        path: '/data-prep/review/:caseId/annotate',
        name: 'DataPrepAnnotate',
        component: () => import('@/features/lab-review/views/VotePanel.vue'),
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    },
    {
        path: '/data-prep/review/:caseId/vote',
        name: 'DataPrepVote',
        component: () => import('@/features/lab-review/views/VotePanel.vue'),
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    },
    {
        path: '/data-prep/review/:caseId/submit',
        name: 'DataPrepSubmit',
        component: () => import('@/features/lab-review/views/VotePanel.vue'),
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    },
    {
        path: '/data-prep/review/:caseId/export',
        name: 'DataPrepExport',
        component: () => import('@/features/lab-review/views/VotePanel.vue'),
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    },
    {
        path: '/data-prep/tracking',
        name: 'DataPrepTracking',
        component: () => import('@/features/dataprep/views/DataPrepDashboard.vue'),
        meta: { requiresAuth: true, roles: ['DATA_PREP'], layout: 'DataPrepLayout' }
    }
];

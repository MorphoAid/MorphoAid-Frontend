import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/features/auth/views/Login.vue')
    },
    {
        path: '/register/data-use',
        name: 'RegisterDataUse',
        component: () => import('@/features/auth/views/RegisterDataUse.vue')
    },
    {
        path: '/register/data-prep',
        name: 'RegisterDataPrep',
        component: () => import('@/features/auth/views/RegisterDataPrep.vue')
    },
    {
        path: '/forbidden',
        name: 'Forbidden',
        component: () => import('@/features/auth/views/Forbidden.vue')
    },
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: () => import('@/features/admin/views/AdminDashboard.vue')
    },
    {
        path: '/dataprep',
        name: 'DataPrepDashboard',
        component: () => import('@/features/dataprep/views/DataPrepDashboard.vue')
    },
    {
        path: '/__test',
        component: () => import('@/layouts/TestLayout.vue'),
        children: [
            {
                path: '',
                name: 'TestHub',
                component: () => import('@/features/case-management/views/TestHub.vue'),
            },
            {
                path: 'upload',
                name: 'TestUpload',
                component: () => import('@/features/case-management/views/UploadImage.vue'),
            },
            {
                path: 'cases',
                name: 'TestCasesList',
                component: () => import('@/features/case-management/views/CaseListTest.vue'),
            },
            {
                path: 'cases/:id',
                name: 'TestCaseDetail',
                component: () => import('@/features/case-management/views/CaseDetailTest.vue'),
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router

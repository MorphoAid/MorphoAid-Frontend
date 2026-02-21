import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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

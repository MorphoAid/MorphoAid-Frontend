import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const routes = [
    {
        path: '/',
        redirect: '/__auth'
    },
    {
        path: '/__auth',
        name: 'AuthLanding',
        component: () => import('@/features/auth/views/AuthLanding.vue')
    },
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
        component: () => import('@/features/admin/views/AdminDashboard.vue'),
        meta: { requiresAuth: true, requiresRole: ['ADMIN'] }
    },
    {
        path: '/admin/users',
        name: 'UserManagement',
        component: () => import('@/features/admin/views/UserManagement.vue'),
        meta: { requiresAuth: true, requiresRole: ['ADMIN'] }
    },
    {
        path: '/dataprep',
        name: 'DataPrepDashboard',
        component: () => import('@/features/dataprep/views/DataPrepDashboard.vue'),
        meta: { requiresAuth: true, requiresRole: ['DATA_PREP', 'ADMIN'] }
    },
    {
        path: '/__test',
        component: () => import('@/layouts/TestLayout.vue'),
        meta: { requiresAuth: true },
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
            },
            {
                path: 'visualization',
                name: 'TestVisualization',
                component: () => import('@/features/visualization/views/ThailandHeatmap.vue'),
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore()

    if (!authStore.isHydrated) {
        await authStore.init()
    }

    // Public whitelist - ensuring these pages are never blocked
    const publicPages = ['/login', '/register/data-use', '/register/data-prep', '/__auth', '/forbidden', '/'];
    const isPublic = publicPages.includes(to.path) || !to.meta.requiresAuth;

    if (!isPublic && !authStore.token) {
        return '/login'
    }

    if (to.meta.requiresRole) {
        if (!authStore.role || !to.meta.requiresRole.includes(authStore.role)) {
            return '/forbidden'
        }
    }

    return true
})

export default router

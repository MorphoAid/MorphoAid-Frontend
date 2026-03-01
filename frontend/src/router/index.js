import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

import publicRoutes from './public_rout'
import adminRoutes from './admin_rout'
import dataPrepRoutes from './dataPrep_rout'
import dataUseRoutes from './dataUse_rout'

const routes = [
    {
        path: '/',
        name: 'Root',
        redirect: (to) => {
            const authStore = useAuthStore()
            if (!authStore.token) return '/login'

            // Precise role-based dashboard mapping
            switch (authStore.role) {
                case 'ADMIN': return '/admin/dashboard';
                case 'DATA_PREP': return '/data-prep/dashboard';
                case 'DATA_USE': return '/data-use/dashboard';
                default: return '/login';
            }
        }
    },
    ...publicRoutes,
    ...adminRoutes,
    ...dataPrepRoutes,
    ...dataUseRoutes,
    // Catch-all: Hardened redirect to root
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore()

    // Auth hydration
    if (!authStore.isHydrated) {
        await authStore.init()
    }

    const { token, role } = authStore
    const isAuthenticated = !!token

    // Role-based dashboard utility for redirects
    const getDashboardPath = (userRole) => {
        if (userRole === 'ADMIN') return '/admin/dashboard'
        if (userRole === 'DATA_PREP') return '/data-prep/dashboard'
        if (userRole === 'DATA_USE') return '/data-use/dashboard'
        return '/login'
    }

    // 1. Guest Only (Login/Register) vs Auth Session
    if (to.meta.guestOnly && isAuthenticated) {
        return getDashboardPath(role)
    }

    // 2. Requires Auth
    if (to.meta.requiresAuth && !isAuthenticated) {
        return {
            path: '/login',
            query: { redirect: to.fullPath }
        }
    }

    // 3. Role Authorization check
    const requiredRoles = to.matched.flatMap(record => record.meta.roles || [])
    if (requiredRoles.length > 0) {
        if (!isAuthenticated) {
            return {
                path: '/login',
                query: { redirect: to.fullPath }
            }
        }
        if (!requiredRoles.includes(role)) {
            return '/403' // Normalized forbidden path
        }
    }

    return true
})

export default router

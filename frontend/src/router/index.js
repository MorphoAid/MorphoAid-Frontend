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
        meta: { requiresAuth: true }
    },
    ...publicRoutes,
    ...adminRoutes,
    ...dataPrepRoutes,
    ...dataUseRoutes,
    // Catch-all for undefined routes
    {
        path: '/:pathMatch(.*)*',
        redirect: '/public/403'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

/**
 * Get the dashboard path based on user role
 * @param {string} role 
 * @returns {string}
 */
const getDashboardByRole = (role) => {
    switch (role) {
        case 'ADMIN': return '/admin/dashboard';
        case 'DATA_PREP': return '/data-prep/dashboard';
        case 'DATA_USE': return '/data-use/dashboard';
        default: return '/public/login';
    }
}

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore()

    // Ensure store is hydrated
    if (!authStore.isHydrated) {
        await authStore.init()
    }

    const { token, role } = authStore
    const isAuthenticated = !!token

    // 1. Root "/" auto-redirect based on role
    if (to.path === '/') {
        if (!isAuthenticated) return '/public/login'
        return getDashboardByRole(role)
    }

    // 2. Logged in users visiting login/register -> redirect to dashboard
    if (to.meta.guestOnly && isAuthenticated) {
        return getDashboardByRole(role)
    }

    // 3. Auth Guard
    if (to.meta.requiresAuth && !isAuthenticated) {
        return {
            path: '/public/login',
            query: { redirect: to.fullPath }
        }
    }

    // 4. Role Guard
    // Check if the route OR any of its parent routes require a specific role
    const requiredRoles = to.matched.flatMap(record => record.meta.roles || [])
    if (requiredRoles.length > 0) {
        if (!isAuthenticated) {
            return {
                path: '/public/login',
                query: { redirect: to.fullPath }
            }
        }
        if (!requiredRoles.includes(role)) {
            return '/public/403' // Consistent forbidden path
        }
    }

    return true
})

export default router

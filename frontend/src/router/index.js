import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

import publicRoutes from './public_rout'
import adminRoutes from './admin_rout'
import dataPrepRoutes from './dataPrep_rout'
import dataUseRoutes from './dataUse_rout'

const routes = [
  { path: '/', name: 'Root', meta: { requiresAuth: true } },
  ...publicRoutes,
  ...adminRoutes,
  ...dataPrepRoutes,
  ...dataUseRoutes,
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const getDashboardByRole = (role) => {
  switch (role) {
    case 'ADMIN': return '/admin/dashboard'
    case 'DATA_PREP': return '/data-prep/dashboard'
    case 'DATA_USE': return '/data-use/dashboard'
    default: return '/login'
  }
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.isHydrated) await authStore.init()

  const { token, role } = authStore
  const isAuthenticated = !!token

  const publicWhitelist = [
    '/login',
    '/register/data-use',
    '/register/data-prep',
    '/forbidden',
    '/public/welcome',
    '/public/login',
    '/public/register/data-use',
    '/public/register/data-prep',
    '/public/403',
  ]

  const isPublicPage =
    publicWhitelist.includes(to.path) ||
    to.matched.some((record) => record.meta.guestOnly)

  if (to.path === '/') {
    if (!isAuthenticated) return '/login'
    return getDashboardByRole(role)
  }

  if (isPublicPage && isAuthenticated) {
    return getDashboardByRole(role)
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (requiresAuth && !isAuthenticated && !isPublicPage) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  const requiredRoles = []
  to.matched.forEach((record) => {
    const { roles, requiresRole } = record.meta || {}
    if (roles) requiredRoles.push(...(Array.isArray(roles) ? roles : [roles]))
    if (requiresRole) requiredRoles.push(...(Array.isArray(requiresRole) ? requiresRole : [requiresRole]))
  })

  if (requiredRoles.length > 0 && isAuthenticated) {
    if (!requiredRoles.includes(role)) return '/forbidden'
  }

  return true
})

export default router
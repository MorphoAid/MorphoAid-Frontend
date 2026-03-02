import { createRouter, createWebHistory } from 'vue-router'

import publicRoutes from './public_rout'
import adminRoutes from './admin_rout'
import dataPrepRoutes from './dataPrep_rout'
import dataUseRoutes from './dataUse_rout'

import publicRoutes from './public_rout'
import adminRoutes from './admin_rout'
import dataPrepRoutes from './dataPrep_rout'
import dataUseRoutes from './dataUse_rout'

const getDashboardByRole = (role) => {
  switch (role) {
    case 'ADMIN': return '/admin/dashboard'
    case 'DATA_PREP': return '/data-prep/dashboard'
    case 'DATA_USE': return '/data-use/dashboard'
    default: return '/login'
  }
}

const routes = [
  { path: '/', name: 'Root' },
  ...publicRoutes,
  ...adminRoutes,
  ...dataPrepRoutes,
  ...dataUseRoutes,
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.isHydrated) await authStore.init()

  const { token, role } = authStore
  const isAuthenticated = !!token

  // public pages (ต้องมีจริงตาม public_rout)
  const publicWhitelist = [
    '/',
    '/login',
    '/register/data-use',
    '/register/data-prep',
    '/forbidden',
    '/__auth' // ใส่เฉพาะถ้ามีจริง
  ]

  const isPublicPage =
    publicWhitelist.includes(to.path) ||
    to.matched.some(r => r.meta.guestOnly)

  // Root redirect
  if (to.path === '/') {
    if (!isAuthenticated) return '/login'
    return getDashboardByRole(role)
  }

  // logged-in cannot go to guest pages
  if (isPublicPage && isAuthenticated) {
    return getDashboardByRole(role)
  }

  // Auth guard
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth === true)
  if (requiresAuth && !isAuthenticated && !isPublicPage) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  // Role guard (support both meta.roles and meta.requiresRole)
  const requiredRoles = []
  to.matched.forEach(r => {
    const { roles, requiresRole } = r.meta || {}
    if (Array.isArray(roles)) requiredRoles.push(...roles)
    else if (roles) requiredRoles.push(roles)

    if (Array.isArray(requiresRole)) requiredRoles.push(...requiresRole)
    else if (requiresRole) requiredRoles.push(requiresRole)
  })

  if (requiredRoles.length > 0 && isAuthenticated) {
    if (!requiredRoles.includes(role)) return '/forbidden'
  }

  return true
})

export default router

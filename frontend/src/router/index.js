import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

// Layouts (มีจริงตาม tree)
const PublicLayout = () => import('@/layouts/PublicLayout.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const DataPrepLayout = () => import('@/layouts/DataPrepLayout.vue')
const DataUseLayout = () => import('@/layouts/DataUseLayout.vue')
const TestLayout = () => import('@/layouts/TestLayout.vue')

// ADMIN VIEWS
const AdminDashboard = () => import('@/features/admin/views/AdminDashboard.vue')
const UserManagement = () => import('@/features/admin/views/UserManagement.vue')
const ActivityLog = () => import('@/features/admin/views/ActivityLog.vue')

// DATA PREP
const DataPrepDashboard = () => import('@/features/dataprep/views/DataPrepDashboard.vue')

// DATA USE (อยู่ใน case-management)
const TestHub = () => import('@/features/case-management/views/TestHub.vue')
const UploadImage = () => import('@/features/case-management/views/UploadImage.vue')
const CaseList = () => import('@/features/case-management/views/CaseListTest.vue')
const CaseDetail = () => import('@/features/case-management/views/CaseDetailTest.vue')
const ResultDetail = () => import('@/features/case-management/views/ResultDetail.vue')
const Insight = () => import('@/features/visualization/views/Insight.vue')

// AUTH
const AuthLanding = () => import('@/features/auth/views/AuthLanding.vue')
const Login = () => import('@/features/auth/views/Login.vue')
const RegisterDataUse = () => import('@/features/auth/views/RegisterDataUse.vue')
const RegisterDataPrep = () => import('@/features/auth/views/RegisterDataPrep.vue')
const RegisterSelection = () => import('@/features/auth/views/RegisterSelection.vue')
const Forbidden = () => import('@/features/auth/views/Forbidden.vue')

function getRoleHome(role) {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'DATA_PREP') return '/dataprep'
  if (role === 'DATA_USE') return '/data-use'
  return '/__auth'
}

const routes = [
  { path: '/', redirect: '/__auth' },

  // PUBLIC
  {
    path: '/__auth',
    component: PublicLayout,
    meta: { guestOnly: true },
    children: [{ path: '', component: AuthLanding }]
  },
  {
    path: '/login',
    component: PublicLayout,
    meta: { guestOnly: true },
    children: [{ path: '', component: Login }]
  },
  {
    path: '/register',
    component: PublicLayout,
    meta: { guestOnly: true },
    children: [
      { path: 'data-use', component: RegisterDataUse },
      { path: 'data-prep', component: RegisterDataPrep },
      { path: 'selection', component: RegisterSelection }
    ]
  },
  {
    path: '/forbidden',
    component: PublicLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', component: Forbidden }]
  },

  // ADMIN (wrap ด้วย AdminLayout)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: UserManagement },
      { path: 'activity-log', component: ActivityLog }
    ]
  },

  // DATA PREP
  {
    path: '/dataprep',
    component: DataPrepLayout,
    meta: { requiresAuth: true, roles: ['DATA_PREP', 'ADMIN'] },
    children: [
      { path: '', component: DataPrepDashboard }
    ]
  },

  // DATA USE (ใช้ case-management views)
{
  path: '/data-use',
  component: DataUseLayout,
  meta: { requiresAuth: true, roles: ['DATA_USE'] },
  children: [
    { path: '', component: TestHub },

    // ✅ Create new case route (static) — MUST be before cases/:id
    { path: 'cases/new', component: UploadImage },

    { path: 'upload', component: UploadImage }, // (optional) you can keep for now
    { path: 'cases', component: CaseList },

    // ✅ Detail route (dynamic)
    { path: 'cases/:id', component: CaseDetail, props: true },

    { path: 'result/:id', component: ResultDetail, props: true },
    { path: 'insights', component: Insight }
  ]
},

  // TEST
  {
    path: '/__test',
    component: TestLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: TestHub }
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.isHydrated) {
    await authStore.init()
  }

  const isAuthed = Boolean(authStore.token)
  const role = authStore.role

  if (to.meta?.guestOnly) {
    if (isAuthed) return getRoleHome(role)
    return true
  }

  if (to.meta?.requiresAuth && !isAuthed) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  const roles = to.meta?.roles
  if (Array.isArray(roles) && roles.length > 0) {
    if (!role || !roles.includes(role)) return '/forbidden'
  }

  return true
})

export default router
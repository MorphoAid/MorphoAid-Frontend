import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

// Layouts (มีจริงตาม tree)
const PublicLayout = () => import('@/layouts/PublicLayout.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
// const DataPrepLayout = () => import('@/layouts/DataPrepLayout.vue')
// const SimplifiedDataPrepLayout = () => import('@/layouts/SimplifiedDataPrepLayout.vue')
const DataUseLayout = () => import('@/layouts/DataUseLayout.vue')
const TestLayout = () => import('@/layouts/TestLayout.vue')

// ADMIN VIEWS
const AdminDashboard = () => import('@/features/admin/views/AdminDashboard.vue')
const UserManagement = () => import('@/features/admin/views/UserManagement.vue')
const ActivityLog = () => import('@/features/admin/views/ActivityLog.vue')
const InvitationManagement = () => import('@/features/admin/views/InvitationManagement.vue')
const UserApprovals = () => import('@/features/admin/views/UserApprovals.vue')

// // DATA PREP
// const DataPrepDashboard = () => import('@/features/dataprep/views/DataPrepDashboard.vue')
// const DataPrepImages = () => import('@/features/dataprep/views/Images.vue')
// const DataPrepImageDetail = () => import('@/features/dataprep/views/ImageDetail.vue')
// const DataPrepSettings = () => import('@/features/dataprep/views/Settings.vue')
// const DataPrepExport = () => import('@/features/dataprep/views/Export.vue')
// // LAB module (dedicated components)
// const ReviewQueue = () => import('@/features/dataprep/views/ReviewQueue.vue')
// const ReviewDetail = () => import('@/features/dataprep/views/ReviewDetail.vue')
// const ExportPage = () => import('@/features/dataprep/views/ExportPage.vue')

// DATA USE (อยู่ใน case-management)
const TestHub = () => import('@/features/case-management/views/TestHub.vue')
const UploadImage = () => import('@/features/case-management/views/UploadImage.vue')
const CaseList = () => import('@/features/case-management/views/CaseListTest.vue')
const CaseDetail = () => import('@/features/case-management/views/CaseDetailTest.vue')
const ResultDetail = () => import('@/features/case-management/views/ResultDetail.vue')
const Insight = () => import('@/features/visualization/views/Insight.vue')
const AccountManagement = () => import('@/features/case-management/views/AccountManagement.vue')
const DiagnosticReport = () => import('@/features/case-management/views/DiagnosticReport.vue')
const AboutUs = () => import('@/views/AboutUs.vue')
const PrivacyPolicy = () => import('@/views/PrivacyPolicy.vue')
const TermsOfUse = () => import('@/views/TermsOfUse.vue')

// CLINICAL (Feature 2)
const ClinicalUpload = () => import('@/features/clinical/views/ClinicalUpload.vue')
const ClinicalCaseDetail = () => import('@/features/clinical/views/ClinicalCaseDetail.vue')

// AUTH
const AuthLanding = () => import('@/features/auth/views/AuthLanding.vue')
const Login = () => import('@/features/auth/views/Login.vue')
const RegisterDataUse = () => import('@/features/auth/views/RegisterDataUse.vue')
// const RegisterDataPrep = () => import('@/features/auth/views/RegisterDataPrep.vue')
const RegisterSelection = () => import('@/features/auth/views/RegisterSelection.vue')
const Forbidden = () => import('@/features/auth/views/Forbidden.vue')
const VerificationPending = () => import('@/features/auth/views/VerificationPending.vue')

function getRoleHome(role) {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'DATA_PREP') return '/forbidden'
  if (role === 'DATA_USE') return '/data-use'
  return '/__auth'
}

const routes = [
  { path: '/', redirect: '/login' },

  // PUBLIC
  {
    path: '/__auth',
    component: PublicLayout,
    meta: { guestOnly: true },
    children: [
      { path: '', component: AuthLanding },
      { path: 'privacy', component: PrivacyPolicy },
      { path: 'terms', component: TermsOfUse }
    ]
  },
  {
    path: '/privacy',
    component: PublicLayout,
    children: [{ path: '', component: PrivacyPolicy }]
  },
  {
    path: '/terms',
    component: PublicLayout,
    children: [{ path: '', component: TermsOfUse }]
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
      // { path: 'data-prep', component: RegisterDataPrep },
      { path: 'selection', component: RegisterSelection }
    ]
  },
  {
    path: '/forbidden',
    component: PublicLayout,
    meta: { requiresAuth: true },
    children: [{ path: '', component: Forbidden }]
  },
  {
    path: '/verification-pending',
    component: VerificationPending,
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
      { path: 'invitations', component: InvitationManagement },
      { path: 'activity-log', component: ActivityLog },
      { path: 'approvals', component: UserApprovals },
      { path: 'account', component: AccountManagement },
      { path: 'about', component: AboutUs }
    ]
  },

  // DATA PREP (/dataprep — legacy, kept intact)
  // {
  //   path: '/dataprep',
  //   component: DataPrepLayout,
  //   meta: { requiresAuth: true, roles: ['DATA_PREP', 'ADMIN'] },
  //   children: [
  //     { path: '', component: DataPrepDashboard },
  //     { path: 'images', component: DataPrepImages },
  //     { path: 'images/:id', component: DataPrepImageDetail, props: true },
  //     { path: 'settings', component: DataPrepSettings },
  //   ]
  // },

  // DATA PREP SIMPLIFIED UPLOAD (Isolated Flow)
  // {
  //   path: '/dataprep/cases',
  //   component: SimplifiedDataPrepLayout,
  //   meta: { requiresAuth: true, roles: ['DATA_PREP', 'ADMIN'] },
  //   children: [
  //     { path: 'new', component: () => import('@/features/dataprep/views/DataPrepUploadCase.vue') },
  //     { path: ':id/result', component: () => import('@/features/dataprep/views/DataPrepResult.vue'), props: true }
  //   ]
  // },

  // LAB (/lab — aligned with SRS, DATA_PREP only)
  // {
  //   path: '/lab',
  //   component: DataPrepLayout,
  //   meta: { requiresAuth: true, roles: ['DATA_PREP'] },
  //   redirect: '/lab/review',
  //   children: [
  //     { path: 'review', component: ReviewQueue },
  //     { path: 'review/:id', component: ReviewDetail, props: true },
  //     { path: 'export', component: ExportPage },
  //   ]
  // },

  // DATA USE (ใช้ case-management views)
  {
    path: '/data-use',
    component: DataUseLayout,
    meta: { requiresAuth: true, roles: ['DATA_USE'] },
    children: [
      { path: '', component: TestHub },

      // CLINICAL Feature 2
      { path: 'clinical/upload', name: 'ClinicalUpload', component: ClinicalUpload },
      { path: 'clinical/cases/:id', name: 'ClinicalCaseDetail', component: ClinicalCaseDetail },

      // ✅ Create new case route (static) — MUST be before cases/:id
      { path: 'cases/new', component: UploadImage },

      { path: 'upload', component: UploadImage }, // (optional) you can keep for now
      { path: 'cases', component: CaseList },

      // ✅ Detail routes (dynamic)
      { path: 'cases/:id', component: CaseDetail, props: true },
      // { path: 'clinical/cases/:id', name: 'ClinicalCaseDetail', component: ClinicalCaseDetail },

      { path: 'result/:id', component: ResultDetail, props: true },
      { path: 'insights', component: Insight },
      { path: 'account', component: AccountManagement },
      { path: 'about', component: AboutUs }
    ]
  },

  { path: '/data-use/cases/:id/report', name: 'CaseReport', component: DiagnosticReport, props: true, meta: { requiresAuth: true } },
  
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

  // Redirect unapproved DATA_USE users to verification pending page
  if (isAuthed && role === 'DATA_USE' && authStore.user?.approved === false) {
    if (to.path !== '/verification-pending') {
      return '/verification-pending'
    }
    return true
  }

  const roles = to.meta?.roles
  if (Array.isArray(roles) && roles.length > 0) {
    if (!role || !roles.includes(role)) return '/forbidden'
  }

  return true
})

export default router
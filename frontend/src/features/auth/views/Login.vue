<template>
  <div class="w-full max-w-md z-10">
    <div class="bg-surface-container-lowest p-8 sm:p-10 rounded-xl shadow-[0_32px_64px_-12px_rgba(25,28,32,0.06)]">
      <!-- Header Section -->
      <div class="mb-10 text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-surface-container-high mb-6 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
            <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
          </svg>
        </div>
        <h1 class="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">MorphoAid</h1>
        <p class="text-on-surface-variant text-sm font-medium">AI-Based Malaria Treatment Supporting Platform Environment</p>
      </div>

      <!-- Dev Quick Login (Consolidated into same theme) -->
      <div v-if="isDev" class="mb-8 rounded-lg bg-surface-container-low p-4 border border-outline-variant/15">
        <p class="mb-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">Dev Quick Access</p>
        <div class="flex flex-wrap justify-between gap-2">
          <button type="button" @click="fillDevAdmin" class="flex-1 rounded-lg bg-surface-container-high py-2 text-xs font-semibold text-primary transition hover:bg-primary/10">Admin</button>
          <button type="button" @click="fillDevDataUse" class="flex-1 rounded-lg bg-surface-container-high py-2 text-xs font-semibold text-primary transition hover:bg-primary/10">DataUse</button>
          <button type="button" @click="fillDevDataPrep" class="flex-1 rounded-lg bg-surface-container-high py-2 text-xs font-semibold text-primary transition hover:bg-primary/10">DataPrep</button>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMsg" class="mb-6 flex gap-3 rounded-lg bg-error-container p-4 border border-error/10">
        <span class="material-symbols-outlined text-error text-xl">error</span>
        <p class="text-[13px] font-medium text-on-error-container">{{ errorMsg }}</p>
      </div>

      <!-- Login Form -->
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant" for="email">Email</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl group-focus-within:text-primary transition-colors" data-icon="alternate_email">alternate_email</span>
            <input 
              class="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-transparent rounded-lg transition-all focus:bg-surface-container-lowest placeholder:text-outline/60 text-sm" 
              :class="errors.email ? 'border-error/40 focus:border-error' : ''"
              id="email" 
              v-model.trim="form.email"
              placeholder="doctor@clinic.ai" 
              type="email"
            />
          </div>
          <p v-if="errors.email" class="text-[11px] text-error font-medium mt-1">{{ errors.email }}</p>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between items-end">
            <label class="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant" for="password">Password</label>
          </div>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl group-focus-within:text-primary transition-colors" data-icon="lock">lock</span>
            <input 
              class="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-transparent rounded-lg transition-all focus:bg-surface-container-lowest placeholder:text-outline/60 text-sm" 
              :class="errors.password ? 'border-error/40 focus:border-error' : ''"
              id="password" 
              v-model="form.password"
              placeholder="••••••••" 
              type="password"
            />
          </div>
          <p v-if="errors.password" class="text-[11px] text-error font-medium mt-1">{{ errors.password }}</p>
        </div>

        <button 
          class="w-full clinical-gradient text-on-primary font-semibold py-3.5 rounded-lg shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
          type="submit"
          :disabled="loading"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <!-- Legal Links -->
      <div class="mt-6 text-center">
         <p class="text-[11px] text-on-surface-variant/70 leading-relaxed px-4">
          By continuing, you agree to our 
          <button type="button" @click="isPrivacyModalOpen = true" class="font-bold underline underline-offset-2 hover:text-primary focus:outline-none">Privacy Notice</button> 
          and 
          <button type="button" @click="isTermsModalOpen = true" class="font-bold underline underline-offset-2 hover:text-primary focus:outline-none">Terms of Use</button>.
        </p>
      </div>

      <div class="mt-8 pt-8 border-t border-outline-variant/15">
        <p class="text-center text-sm text-on-surface-variant">
          Don't have an account? 
          <router-link class="font-semibold text-primary hover:underline" to="/register/data-use">Register</router-link>
        </p>
      </div>
    </div>
    

    <!-- Modals -->
    <PolicyModal :is-open="isPrivacyModalOpen" title="Privacy Notice" @close="isPrivacyModalOpen = false">
      <LegalContent :sections="privacySections" />
    </PolicyModal>
    <PolicyModal :is-open="isTermsModalOpen" title="Terms of Use" @close="isTermsModalOpen = false">
      <LegalContent :sections="termsSections" />
    </PolicyModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'
import PolicyModal from '@/components/legal/PolicyModal.vue'
import LegalContent from '@/components/legal/LegalContent.vue'
import { privacySections, termsSections } from '@/data/legalPolicies'

const router = useRouter()
const authStore = useAuthStore()

const isPrivacyModalOpen = ref(false)
const isTermsModalOpen = ref(false)

const loading = ref(false)
const errorMsg = ref('')
const isDev = import.meta.env.DEV

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

function validateForm() {
  errors.email = ''
  errors.password = ''
  errorMsg.value = ''

  let isValid = true

  if (!form.email) {
    errors.email = 'Email is required.'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email is invalid.'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required.'
    isValid = false
  }

  return isValid
}

function fillDevAdmin() {
  form.email = 'admin@test.com'
  form.password = 'Admin123!'
}

function fillDevDataUse() {
  form.email = 'demo@morphoaid.com'
  form.password = 'demopass'
}

function fillDevDataPrep() {
  form.email = 'dataprep101@example.com'
  form.password = 'demopass'
}

async function handleLogin() {
  if (!validateForm()) return

  try {
    loading.value = true
    errorMsg.value = ''

    await authStore.login(form.email, form.password)

    const user = authStore.user
    if (!user) {
      errorMsg.value = 'Login failed. Please try again later.'
      return
    }

    // Role-based redirection logic (SRS-25 to SRS-29)
    if (user.role === 'DATA_USE') {
      if (!user.approved) {
        // SRS-25/26: Pending doctor accounts
        router.push('/verification-pending')
      } else {
        // SRS-28: Approved Data Use
        router.push('/data-use')
      }
    } else if (user.role === 'ADMIN') {
      // SRS-29: Admin user
      router.push('/admin/dashboard')
    } else if (user.role === 'DATA_PREP') {
      // Align with STC expectations: Redirect unauthorized role to forbidden page
      router.push('/forbidden')
    } else {
      // Fallback
      router.push('/')
    }

  } catch (err) {
    const status = err?.response?.status
    if (status === 401) {
      // SRS-23: Incorrect credentials
      errorMsg.value = 'Invalid email or password.'
    } else if (status === 403) {
      // SRS-24: Inactive/blocked/deleted
      errorMsg.value = 'This account is not allowed to access the system.'
    } else {
      // SRS-30: System or server error
      errorMsg.value = 'Login failed. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}
</script>
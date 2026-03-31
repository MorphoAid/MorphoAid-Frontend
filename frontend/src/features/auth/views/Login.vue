<template>
  <div class="flex min-h-screen w-full bg-surface-container-lowest overflow-hidden">
    <!-- Brand/Info Panel (Desktop) -->
    <div class="hidden lg:flex lg:w-[40%] clinical-gradient relative overflow-hidden p-16 flex-col justify-between text-on-primary">
      <!-- Decorative Elements -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>

      <div class="relative z-10">
        <!-- Logo -->
        <div class="flex items-center gap-4 mb-16">
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center p-2.5 border border-white/20 shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
            </svg>
          </div>
          <h2 class="text-3xl font-black tracking-tight font-headline">MorphoAid</h2>
        </div>

        <h1 class="text-5xl font-black leading-[1.1] mb-8 tracking-tighter max-w-sm">
          AI-Assisted Malaria Diagnostic Support.
        </h1>
        <p class="text-lg opacity-95 max-w-sm font-semibold leading-relaxed mb-12">
          Bridging the gap between microscopic imagery and clinical action with verified AI precision.
        </p>

        <!-- Feature List -->
        <div class="space-y-8">
          <div class="flex items-start gap-5 group">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 transition-all group-hover:bg-white/20">
              <span class="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <p class="text-xs font-bold opacity-90 uppercase tracking-[0.2em] mb-1">AI-Driven Discovery</p>
              <p class="text-sm opacity-90 leading-relaxed max-w-xs font-medium">Fast and accurate parasite identification using state-of-the-art neural networks.</p>
            </div>
          </div>
          <div class="flex items-start gap-5 group">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 transition-all group-hover:bg-white/20">
              <span class="material-symbols-outlined text-xl">biotech</span>
            </div>
            <div>
              <p class="text-xs font-bold opacity-90 uppercase tracking-[0.2em] mb-1">Clinical Precision</p>
              <p class="text-sm opacity-90 leading-relaxed max-w-xs font-medium">Integrated case management workflows designed for medical researchers and practitioners.</p>
            </div>
          </div>
          <div class="flex items-start gap-5 group">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 transition-all group-hover:bg-white/20">
              <span class="material-symbols-outlined text-xl">map</span>
            </div>
            <div>
              <p class="text-xs font-bold opacity-90 uppercase tracking-[0.2em] mb-1">Regional Insights</p>
              <p class="text-sm opacity-90 leading-relaxed max-w-xs font-medium">Real-time epidemiological mapping and data-driven decision support for public health units.</p>
            </div>
          </div>
          <div class="flex items-start gap-5 group">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 transition-all group-hover:bg-white/20">
              <span class="material-symbols-outlined text-xl">verified_user</span>
            </div>
            <div>
              <p class="text-xs font-bold opacity-90 uppercase tracking-[0.2em] mb-1">Verified Security</p>
              <p class="text-sm opacity-90 leading-relaxed max-w-xs font-medium">Enterprise-grade data protection, HIPAA-aligned encryption, and secure medical record storage.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="relative z-10 pt-10 border-t border-white/10 flex items-center justify-between">
        <p class="text-xs font-bold opacity-60 uppercase tracking-widest">© 2026 AI-BASED PLATFORM</p>
        <div class="flex gap-4">
           <span class="material-symbols-outlined text-white/40 text-lg">shield</span>
           <span class="material-symbols-outlined text-white/40 text-lg">lock</span>
        </div>
      </div>
    </div>

    <!-- Form Panel -->
    <div class="flex-1 flex flex-col justify-center p-8 sm:p-16 lg:p-24 bg-surface-container-lowest relative">
      <!-- Mobile Hero (hidden on desktop) -->
      <div class="lg:hidden mb-12 flex flex-col items-center">
         <div class="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center p-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
              <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
            </svg>
         </div>
         <h1 class="text-3xl font-black tracking-tight text-on-surface">MorphoAid</h1>
         <p class="text-on-surface-variant font-bold text-xs uppercase tracking-widest mt-2">Clinical Intelligence Hub</p>
      </div>

      <div class="max-w-md w-full mx-auto">
        <!-- Header Section -->
        <div class="mb-10 lg:mb-12">
          <h2 class="text-4xl font-headline font-black tracking-tight text-on-surface mb-3">Sign In</h2>
          <p class="text-on-surface-variant font-medium">Access your medical workspace and insights.</p>
        </div>


        <!-- Error Alert -->
        <div v-if="errorMsg" class="mb-8 flex gap-4 rounded-2xl bg-error-container/40 p-5 border border-error/10 items-start">
          <span class="material-symbols-outlined text-error text-2xl">error</span>
          <p class="text-sm font-bold text-on-error-container">{{ errorMsg }}</p>
        </div>

        <!-- Login Form -->
        <form class="space-y-8" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <label class="block text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="email">Medical Email</label>
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl group-focus-within:text-primary transition-colors">alternate_email</span>
              <input 
                class="w-full pl-12 pr-5 py-4 bg-surface-container-low border border-transparent rounded-2xl transition-all focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 placeholder:text-outline/40 text-sm font-bold" 
                :class="errors.email ? 'border-error/40 focus:border-error focus:ring-error/5' : ''"
                id="email" 
                v-model.trim="form.email"
                placeholder="doctor@clinic.ai" 
                type="email"
              />
            </div>
            <p v-if="errors.email" class="text-[11px] text-error font-bold mt-1.5 ml-1 uppercase tracking-tight">{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="password">Password</label>
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl group-focus-within:text-primary transition-colors">lock</span>
              <input 
                class="w-full pl-12 pr-5 py-4 bg-surface-container-low border border-transparent rounded-2xl transition-all focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 placeholder:text-outline/40 text-sm font-bold" 
                :class="errors.password ? 'border-error/40 focus:border-error focus:ring-error/5' : ''"
                id="password" 
                v-model="form.password"
                placeholder="••••••••" 
                type="password"
              />
            </div>
            <p v-if="errors.password" class="text-[11px] text-error font-bold mt-1.5 ml-1 uppercase tracking-tight">{{ errors.password }}</p>
          </div>

          <button 
            class="w-full bg-primary text-on-primary font-black py-5 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" 
            type="submit"
            :disabled="loading"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            {{ loading ? 'Authenticating...' : 'Enter Workspace' }}
          </button>
        </form>

        <!-- Terms Footer -->
        <div class="mt-12 text-center">
           <p class="text-[10px] text-on-surface-variant font-bold leading-relaxed px-8 uppercase tracking-wider">
            MorphoAid uses end-to-end encryption. By signing in, you acknowledge the 
            <button type="button" @click="isPrivacyModalOpen = true" class="font-bold underline underline-offset-2 hover:text-primary transition-colors">Privacy Notice</button> 
            and 
            <button type="button" @click="isTermsModalOpen = true" class="font-bold underline underline-offset-2 hover:text-primary transition-colors">Terms of Use</button>.
          </p>
        </div>

        <!-- Registration Link -->
        <div class="mt-12 pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm font-bold text-on-surface-variant flex items-center gap-2">
            New clinical partner?
          </p>
          <router-link 
            class="px-6 py-2.5 rounded-xl border-2 border-primary/10 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all text-center" 
            to="/register/data-use"
          >
            Create Account
          </router-link>
        </div>
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
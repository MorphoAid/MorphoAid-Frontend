<template>
  <div
    class="w-full max-w-md rounded-2xl border border-white/60 bg-stone-50/90 px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:px-8 sm:py-9"
  >
    <div class="text-center">
      <h1 class="text-3xl font-bold leading-tight text-[#2E2E2E] sm:text-4xl">
        Login
      </h1>
      <p class="mt-3 text-sm leading-6 text-[#5C5C5C] sm:text-base">
        Welcome back to MorphoAid.
      </p>
    </div>

    <!-- Dev Quick Login -->
    <div
      v-if="isDev"
      class="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4"
    >
      <p class="mb-3 text-sm font-semibold text-amber-800">Dev Quick Login</p>
      <div class="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          @click="fillDevAdmin"
          class="rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 transition hover:bg-purple-200"
        >
          Admin
        </button>
        <button
          type="button"
          @click="fillDevDataUse"
          class="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition hover:bg-green-200"
        >
          DataUse
        </button>
        <button
          type="button"
          @click="fillDevDataPrep"
          class="rounded-lg bg-sky-100 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-200"
        >
          DataPrep
        </button>
      </div>
    </div>

    <div
      v-if="errorMsg"
      class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
    >
      {{ errorMsg }}
    </div>

    <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
      <div>
        <label
          for="email"
          class="mb-2 block text-sm font-medium text-[#2E2E2E]"
        >
          Email
        </label>
        <input
          id="email"
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          placeholder="Email address"
          class="h-12 w-full rounded-[10px] border border-neutral-200 bg-white px-4 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
          :class="errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
        />
        <p v-if="errors.email" class="mt-2 text-sm text-red-500">
          {{ errors.email }}
        </p>
      </div>

      <div>
        <label
          for="password"
          class="mb-2 block text-sm font-medium text-[#2E2E2E]"
        >
          Password
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          placeholder="Password"
          class="h-12 w-full rounded-[10px] border border-neutral-200 bg-white px-4 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
          :class="errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
        />
        <p v-if="errors.password" class="mt-2 text-sm text-red-500">
          {{ errors.password }}
        </p>
      </div>


      <button
        type="submit"
        :disabled="loading"
        class="flex h-12 w-full items-center justify-center rounded-[10px] bg-[#48B7CB] px-4 text-sm font-semibold text-white transition hover:bg-[#368998] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          v-if="loading"
          class="mr-2 h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>

      <p class="text-center text-[12px] text-[#5C5C5C] px-2">
        By continuing, you agree to our 
        <button type="button" @click="isPrivacyModalOpen = true" class="text-[#2F8EA2] hover:underline focus:outline-none">Privacy Notice</button> 
        and 
        <button type="button" @click="isTermsModalOpen = true" class="text-[#2F8EA2] hover:underline focus:outline-none">Terms of Use</button>.
      </p>

      <div class="flex items-center justify-center pt-2 text-sm">
        <router-link
          to="/register/data-use"
          class="font-medium text-[#2F8EA2] transition hover:text-[#368998]"
        >
          Register
        </router-link>

        <!-- <router-link
          to="/register/data-prep"
          class="font-medium text-[#2F8EA2] transition hover:text-[#368998]"
        >
          Join (Data Prep)
        </router-link> -->
      </div>
    </form>
    <PolicyModal 
      :is-open="isPrivacyModalOpen" 
      title="Privacy Notice" 
      @close="isPrivacyModalOpen = false"
    >
      <LegalContent :sections="privacySections" />
    </PolicyModal>

    <PolicyModal 
      :is-open="isTermsModalOpen" 
      title="Terms of Use" 
      @close="isTermsModalOpen = false"
    >
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
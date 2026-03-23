<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#48B7CB] to-[#2F8EA2] p-4">
    <div class="bg-white rounded-[28px] shadow-2xl px-8 py-10 w-full max-w-sm text-center">
      <!-- Icon -->
      <div class="relative inline-flex mb-6">
        <div class="w-20 h-20 rounded-full bg-[#E0F5F8] flex items-center justify-center">
          <svg class="w-10 h-10 text-[#2F8EA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <!-- Clock badge -->
        <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
          <svg class="w-4 h-4 text-[#48B7CB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-[28px] font-bold text-[#1A3A40] mb-3">Verification Pending</h1>

      <!-- Body -->
      <p class="text-[14px] text-[#5C5C5C] leading-relaxed mb-8">
        We have successfully received your information.
        Our team is currently reviewing your medical license and credentials.
        Please allow <strong>1-2 business days</strong> for the approval process.
        We will notify you via email once your account is ready to use.
      </p>

      <!-- Divider dot (decorative) -->
      <div class="flex justify-center mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
      </div>

      <!-- Check Status Button -->
      <button
        @click="checkStatus"
        :disabled="checking"
        class="w-full h-[50px] rounded-full bg-[#2F8EA2] hover:bg-[#247080] text-white font-bold text-[16px] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <svg v-if="checking" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
        {{ checking ? 'Checking...' : 'Check Status' }}
      </button>

      <!-- Approved Banner (shown when user is now approved) -->
      <div v-if="justApproved" class="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
        Your account has been approved! Redirecting...
      </div>

      <!-- Return link -->
      <div class="mt-5">
        <button @click="logout" class="text-[13px] text-[#5C5C5C] hover:text-[#2F8EA2] transition-colors">
          Return to Log in page
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const checking = ref(false)
const justApproved = ref(false)

async function checkStatus() {
  checking.value = true
  try {
    await authStore.fetchMe()
    if (authStore.user?.approved) {
      justApproved.value = true
      setTimeout(() => {
        router.replace('/data-use')
      }, 1500)
    }
  } catch (e) {
    console.error('Status check failed', e)
  } finally {
    checking.value = false
  }
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

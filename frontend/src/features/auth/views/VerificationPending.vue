<template>
    <div class="flex min-h-screen w-full bg-surface-container-lowest overflow-hidden">
    <!-- Brand/Info Panel (Consistent across Auth) -->
    <div class="hidden lg:flex lg:w-[40%] clinical-gradient relative overflow-hidden p-16 flex-col justify-between text-on-primary">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>

      <div class="relative z-10">
        <div class="flex items-center gap-4 mb-16">
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center p-2.5 border border-white/20 shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
            </svg>
          </div>
          <h2 class="text-3xl font-black tracking-tight font-headline">MorphoAid</h2>
        </div>

        <h2 class="text-xs font-black tracking-[0.3em] uppercase text-white/50 mb-4 leading-none">Security Status</h2>
        <h1 class="text-5xl font-black leading-[1.1] mb-8 tracking-tighter max-w-sm">
          Credential Review in Progress.
        </h1>
        <p class="text-lg opacity-95 max-w-sm font-semibold leading-relaxed mb-12">
          Your medical expertise is our priority. We are currently validating your information to ensure clinical integrity.
        </p>

        <!-- Status Highlights -->
        <div class="space-y-8">
          <div class="flex items-start gap-5 group">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
              <span class="material-symbols-outlined text-xl">verified</span>
            </div>
            <div>
              <p class="text-xs font-bold opacity-90 uppercase tracking-[0.2em] mb-1">Trusted Network</p>
              <p class="text-sm opacity-95 leading-relaxed max-w-xs font-medium">All users are verified medical professionals.</p>
            </div>
          </div>
          <div class="flex items-start gap-5 group">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
              <span class="material-symbols-outlined text-xl">security</span>
            </div>
            <div>
              <p class="text-xs font-bold opacity-90 uppercase tracking-[0.2em] mb-1">Secure Environment</p>
              <p class="text-sm opacity-95 leading-relaxed max-w-xs font-medium">Data protection is active during the entire review.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="relative z-10 pt-10 border-t border-white/10 flex items-center justify-between">
        <p class="text-xs font-bold opacity-95 uppercase tracking-widest">© 2026 CLINICAL HUB</p>
        <div class="flex gap-4 text-white/40">
           <span class="material-symbols-outlined text-lg">admin_panel_settings</span>
        </div>
      </div>
    </div>

    <!-- Status Panel -->
    <div class="flex-1 flex flex-col justify-center p-8 sm:p-16 lg:p-24 bg-surface-container-lowest relative">
      <div class="max-w-md w-full mx-auto text-center lg:text-left">
        
        <!-- Icon/Animation area -->
        <div class="relative inline-flex mb-10 lg:mb-12">
          <div class="w-24 h-24 rounded-[2rem] bg-primary/5 flex items-center justify-center p-6 lg:-ml-2">
            <span class="material-symbols-outlined text-primary text-5xl animate-pulse" data-icon="shield_person">shield_person</span>
          </div>
          <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 border border-outline-variant/10">
            <span class="material-symbols-outlined text-primary text-xl animate-spin-slow">schedule</span>
          </div>
        </div>

        <h1 class="text-4xl lg:text-5xl font-headline font-black tracking-tight text-on-surface mb-6">Verification Pending</h1>
        
        <div class="space-y-6 text-on-surface-variant font-bold text-sm leading-relaxed mb-12">
          <p>
            We have successfully received your clinical information. 
            Our team is currently reviewing your medical license and affiliated institutions.
          </p>
          <div class="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/20 text-xs flex gap-4 items-start text-left">
             <span class="material-symbols-outlined text-primary">info</span>
             <p>Please allow 1-2 business days for the approval process. You will receive a secure notification once your workspace is ready.</p>
          </div>
        </div>

        <!-- Approved Banner -->
        <Transition name="fade">
          <div v-if="justApproved" class="mb-8 flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm font-bold text-emerald-800 animate-scale-in">
            <span class="material-symbols-outlined text-emerald-500">check_circle</span>
            Authentication success! Redirecting to workspace...
          </div>
        </Transition>

        <div class="space-y-4">
          <button 
            @click="logout" 
            class="w-full py-4 text-xs font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-lg">logout</span>
            Return to Welcome Screen
          </button>
        </div>

        <!-- Help Link -->
        <div class="mt-16 text-center lg:text-left">
           <p class="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest leading-loose">
            Questions about your review? <br/>
            Contact us at <span class="text-primary hover:underline cursor-pointer">support@morphoaid.ai</span>
          </p>
        </div>
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
  try {
    authStore.logout()
    router.push('/login')
  } catch (err) {
    console.error('Logout failed', err)
    alert('Logout failed. Please try again later.')
  }
}
</script>

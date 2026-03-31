<template>
    <div class="flex min-h-screen w-full bg-surface-container-lowest overflow-hidden">
    <!-- Brand/Info Panel (Consistent across Auth) -->
    <div class="hidden lg:flex lg:w-[40%] clinical-gradient relative overflow-hidden p-16 flex-col justify-between text-on-primary shrink-0">
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

        <div v-if="step === 1">
          <h2 class="text-xs font-black tracking-[0.3em] uppercase text-white/50 mb-4 leading-none">Onboarding Phase I</h2>
          <h1 class="text-5xl font-black leading-[1.1] mb-8 tracking-tighter max-w-sm">
            Begin Your Clinical Journey.
          </h1>
          <p class="text-lg opacity-95 max-w-sm font-semibold leading-relaxed mb-12">
            Establish your professional account and join a network of malaria treatment specialists.
          </p>
        </div>
        <div v-else>
          <h2 class="text-xs font-black tracking-[0.3em] uppercase text-white/50 mb-4 leading-none">Onboarding Phase II</h2>
          <h1 class="text-5xl font-black leading-[1.1] mb-8 tracking-tighter max-w-sm">
            Professional Verification.
          </h1>
          <p class="text-lg opacity-95 max-w-sm font-semibold leading-relaxed mb-12">
            To maintain clinical integrity, we verify all medical credentials through a secure, encrypted process.
          </p>
        </div>

        <!-- Progress Indicators -->
        <div class="space-y-6">
          <div class="flex items-center gap-6 group">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500" 
                 :class="step >= 1 ? 'bg-white text-primary border-white shadow-lg' : 'bg-transparent text-white/40 border-white/10'">
              <span class="font-black text-lg">1</span>
            </div>
            <div :class="step >= 1 ? 'opacity-100' : 'opacity-60'">
              <p class="font-bold text-base mb-0.5">Account Credentials</p>
              <p class="text-sm opacity-90 leading-relaxed font-semibold">Verify your medical email and set security protocols.</p>
            </div>
          </div>
          <div class="h-8 w-0.5 bg-white/10 ml-[23px]"></div>
          <div class="flex items-center gap-6 group">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500"
                 :class="step >= 2 ? 'bg-white text-primary border-white shadow-lg' : 'bg-transparent text-white/40 border-white/10'">
              <span class="font-black text-lg">2</span>
            </div>
            <div :class="step >= 2 ? 'opacity-100' : 'opacity-60'">
              <p class="font-bold text-base mb-0.5">Medical Identity</p>
              <p class="text-sm opacity-90 leading-relaxed font-semibold">Validation of medical license and facility affiliation.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="relative z-10 pt-10 border-t border-white/10 flex items-center justify-between">
        <p class="text-xs font-bold opacity-90 uppercase tracking-widest leading-none">MorphoAid Protocol v4.2</p>
        <div class="flex gap-4">
           <span class="material-symbols-outlined text-white/40 text-lg">verified</span>
           <span class="material-symbols-outlined text-white/40 text-lg">encrypted</span>
        </div>
      </div>
    </div>

    <!-- Form Area -->
    <div class="flex-1 flex flex-col p-8 sm:p-16 lg:p-24 overflow-y-auto bg-surface-container-lowest">
      
      <!-- Mobile Hero (hidden on desktop) -->
      <div class="lg:hidden mb-12 flex flex-col items-center">
         <div class="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center p-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
              <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
            </svg>
         </div>
         <h1 class="text-2xl font-black tracking-tight text-on-surface">Medical Registration</h1>
         <p class="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest mt-2">Step {{ step }} of 2</p>
      </div>

      <div class="max-w-2xl w-full mx-auto my-auto py-8">
        
        <!-- ── STEP 1: Account Creation ─────────────────────────────────────────── -->
        <Transition name="fade" mode="out-in">
          <div v-if="step === 1" key="step1">
            <div class="mb-12">
              <h2 class="text-4xl font-headline font-black tracking-tight text-on-surface mb-3">Create Clinical Account</h2>
              <p class="text-on-surface-variant font-bold text-sm leading-relaxed max-w-md">Enter your professional details to begin the onboarding process.</p>
            </div>

            <form class="space-y-8" @submit.prevent="goNext">
              <!-- Name Row -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div class="md:col-span-3 space-y-2">
                  <label class="block text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="title">Title</label>
                  <div class="relative">
                    <select v-model="form.title" class="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 px-5 text-sm font-bold text-on-surface appearance-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 cursor-pointer" :class="errors.title ? 'border-error/40' : ''">
                      <option value="" disabled>Select</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                      <option value="Assoc. Prof.">Assoc. Prof.</option>
                      <option value="Asst. Prof.">Asst. Prof.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                  <p v-if="errors.title" class="text-[10px] text-error font-bold uppercase ml-1">{{ errors.title }}</p>
                </div>
                <div class="md:col-span-9 space-y-2">
                  <label class="block text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="first_name">Full Legal First Name</label>
                  <input v-model.trim="form.firstName" class="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 px-5 text-sm font-bold text-on-surface focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 placeholder:text-outline/40" :class="errors.firstName ? 'border-error/40' : ''" placeholder="As shown on medical license" type="text" />
                  <p v-if="errors.firstName" class="text-[10px] text-error font-bold uppercase ml-1">{{ errors.firstName }}</p>
                </div>
              </div>

              <!-- Last Name -->
              <div class="space-y-2">
                <label class="block text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="last_name">Full Legal Last Name</label>
                <input v-model.trim="form.lastName" class="w-full bg-surface-container-low border border-transparent rounded-2xl py-4 px-5 text-sm font-bold text-on-surface focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 placeholder:text-outline/40" :class="errors.lastName ? 'border-error/40' : ''" placeholder="Enter last name" type="text" />
                <p v-if="errors.lastName" class="text-[10px] text-error font-bold uppercase ml-1">{{ errors.lastName }}</p>
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <label class="block text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="email">Institutional Medical Email</label>
                <div class="relative group">
                  <input v-model.trim="form.email" class="w-full pl-12 pr-12 py-4 bg-surface-container-low border border-transparent rounded-2xl text-sm font-bold text-on-surface focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 placeholder:text-outline/40 transition-all font-mono tracking-tight" :class="errors.email ? 'border-error/40' : emailValid ? 'border-emerald-500/30' : ''" placeholder="email@institution.edu" type="email" />
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl group-focus-within:text-primary transition-colors">mail</span>
                  <span v-if="emailValid" class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 text-xl animate-scale-in">check_circle</span>
                </div>
                <p v-if="errors.email" class="text-[10px] text-error font-bold uppercase ml-1">{{ errors.email }}</p>
              </div>

              <!-- Passwords -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="password">Security Password</label>
                  <div class="relative">
                    <input v-model="form.password" class="w-full pl-12 pr-5 py-4 bg-surface-container-low border border-transparent rounded-2xl text-sm font-bold text-on-surface focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 placeholder:text-outline/40" :class="errors.password ? 'border-error/40' : ''" placeholder="••••••••" type="password" />
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                  </div>
                  <p v-if="errors.password" class="text-[10px] text-error font-bold uppercase ml-1">{{ errors.password }}</p>
                </div>
                <div class="space-y-2">
                  <label class="block text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="confirm_password">Confirm Password</label>
                  <div class="relative">
                    <input v-model="form.confirmPassword" class="w-full pl-12 pr-5 py-4 bg-surface-container-low border border-transparent rounded-2xl text-sm font-bold text-on-surface focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 placeholder:text-outline/40" :class="errors.confirmPassword ? 'border-error/40' : ''" placeholder="••••••••" type="password" />
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">enhanced_encryption</span>
                  </div>
                  <p v-if="errors.confirmPassword" class="text-[10px] text-error font-bold uppercase ml-1">{{ errors.confirmPassword }}</p>
                </div>
              </div>

              <!-- Agreements -->
              <div class="flex items-start gap-4 p-5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/20">
                <input v-model="form.agree" class="mt-1 h-5 w-5 rounded-lg border-outline text-primary focus:ring-primary bg-white cursor-pointer" id="terms" type="checkbox" />
                <label class="text-[11px] text-on-surface-variant font-bold leading-relaxed uppercase tracking-wider" for="terms">
                  I certify that I am a licensed healthcare professional and agree to the 
                  <button type="button" @click="isTermsModalOpen = true" class="text-primary underline hover:text-primary-container transition-colors">Terms of Use</button> 
                  and 
                  <button type="button" @click="isPrivacyModalOpen = true" class="text-primary underline hover:text-primary-container transition-colors">Privacy Notice</button>.
                </label>
              </div>
              <p v-if="errors.agree" class="text-[10px] text-error font-bold uppercase ml-1">{{ errors.agree }}</p>

              <!-- Progress Button -->
              <div class="pt-4">
                <button 
                  class="w-full bg-primary text-on-primary font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex justify-center items-center gap-3 group disabled:opacity-50 text-xs uppercase tracking-[0.2em]" 
                  type="submit" :disabled="loading"
                >
                  <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>{{ loading ? 'Verifying...' : 'Proceed to Step 2' }}</span>
                  <span v-if="!loading" class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
              </div>

              <div class="text-center">
                <p class="text-xs font-bold text-on-surface-variant">
                  Already registered? 
                  <router-link to="/login" class="text-primary hover:underline underline-offset-4 decoration-2">Sign in to workspace</router-link>
                </p>
              </div>
            </form>
          </div>

          <!-- ── STEP 2: Identity Verification ─────────────────────────────────────────── -->
          <div v-else key="step2">
            <div class="mb-12">
              <h2 class="text-4xl font-headline font-black tracking-tight text-on-surface mb-3">Identity Review</h2>
              <p class="text-on-surface-variant font-bold text-sm leading-relaxed max-w-md">Validation of clinical credentials ensures a secure environment for all users.</p>
            </div>

            <form class="space-y-8" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- Medical License Number -->
                  <div class="space-y-2">
                    <label class="block text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="license">Medical License ID</label>
                    <div class="relative group">
                      <input v-model.trim="form.licenseNumber" class="w-full bg-surface-container-low border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-on-surface focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-outline/40 font-mono" :class="errors.licenseNumber ? 'border-error/40' : ''" id="license" placeholder="e.g. 10293847" type="text" />
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl" data-icon="badge">badge</span>
                    </div>
                    <p v-if="errors.licenseNumber" class="text-[10px] text-error font-bold uppercase ml-1">{{ errors.licenseNumber }}</p>
                  </div>

                  <!-- Affiliated Hospital -->
                  <div class="space-y-2">
                    <label class="block text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1" for="hospital">Primary Clinical Facility</label>
                    <div class="relative group">
                      <input v-model.trim="form.hospital" class="w-full bg-surface-container-low border border-transparent rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-on-surface focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-outline/40" :class="errors.hospital ? 'border-error/40' : ''" id="hospital" placeholder="Facility Name" type="text" />
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl" data-icon="domain">domain</span>
                    </div>
                    <p v-if="errors.hospital" class="text-[10px] text-error font-bold uppercase ml-1">{{ errors.hospital }}</p>
                  </div>
              </div>

              <!-- Upload Area -->
              <div class="space-y-3">
                <label class="block text-[11px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1">Evidence of Medical Certification</label>
                <div 
                  class="border-3 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden"
                  :class="isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-low'"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="$refs.fileInput.click()"
                >
                  <input ref="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" class="hidden" @change="handleFileChange" />
                  
                  <div v-if="!form.document" class="flex flex-col items-center relative z-10">
                    <div class="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                       <span class="material-symbols-outlined text-primary text-4xl" data-icon="upload_file">upload_file</span>
                    </div>
                    <p class="text-base font-black text-on-surface mb-2">Drop certification here</p>
                    <p class="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">PDF, JPG, or PNG (MAX. 10MB)</p>
                    <div class="mt-8 px-8 py-3 bg-white text-primary rounded-xl text-xs font-black shadow-sm border border-outline-variant/20 uppercase tracking-widest group-hover:shadow-md transition-all">Select File</div>
                  </div>
                  
                  <div v-else class="flex flex-col items-center gap-4 relative z-10 animate-scale-in">
                    <div class="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                       <span class="material-symbols-outlined text-white text-4xl">task</span>
                    </div>
                    <div class="text-center">
                       <p class="text-sm font-black text-on-surface">{{ form.document.name }}</p>
                       <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{{ (form.document.size / 1024 / 1024).toFixed(2) }} MB • SECURED</p>
                    </div>
                    <button type="button" @click.stop="form.document = null" class="mt-4 text-xs font-black text-error hover:underline uppercase tracking-widest px-4 py-2 bg-red-50 rounded-lg">Remove Evidence</button>
                  </div>
                </div>
                <p v-if="errors.document" class="text-[10px] text-error font-bold uppercase ml-1 text-center mt-2">{{ errors.document }}</p>
              </div>

              <!-- Instructions Panel -->
              <div class="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 flex gap-5 items-start">
                 <span class="material-symbols-outlined text-amber-500 bg-white p-2 rounded-xl shadow-sm text-xl border border-amber-100/50">info</span>
                 <p class="text-[11px] text-amber-800 font-bold leading-relaxed uppercase tracking-wider">
                   Verification usually takes 1-2 business days. You will be notified via email once your medical credentials have been legitimized by our clinical review board.
                 </p>
              </div>

              <!-- Action Bar -->
              <div class="flex flex-col gap-4">
                <button 
                  class="w-full bg-primary text-on-primary py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50" 
                  type="submit"
                  :disabled="loading"
                >
                  <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  {{ loading ? 'Synchronizing Data...' : 'Submit Verification' }}
                </button>
                <button @click="step = 1" class="w-full py-4 text-xs font-black text-on-surface-variant/60 hover:text-on-surface transition-colors uppercase tracking-[0.2em]" type="button">
                  ← Previous Stage
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>

      <!-- Desktop Shell Footer -->
      <div class="mt-auto pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6 text-on-surface-variant/40">
        <div class="text-[10px] font-black uppercase tracking-[0.2em]">© 2026 MorphoAid Research Unit</div>
        <div class="flex gap-8">
           <button @click="isPrivacyModalOpen = true" class="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Privacy</button>
           <button @click="isTermsModalOpen = true" class="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Terms</button>
        </div>
      </div>
    </div>

    <!-- Modals (Kept for functionality) -->
    <PolicyModal :is-open="isPrivacyModalOpen" title="Privacy Notice" @close="isPrivacyModalOpen = false">
      <LegalContent :sections="privacySections" />
    </PolicyModal>
    <PolicyModal :is-open="isTermsModalOpen" title="Terms of Use" @close="isTermsModalOpen = false">
      <LegalContent :sections="termsSections" />
    </PolicyModal>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import PolicyModal from '@/components/legal/PolicyModal.vue'
import LegalContent from '@/components/legal/LegalContent.vue'
import { privacySections, termsSections } from '@/data/legalPolicies'

const router = useRouter()

const isPrivacyModalOpen = ref(false)
const isTermsModalOpen = ref(false)

const step = ref(1)
const loading = ref(false)
const isDragging = ref(false)

const form = reactive({
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
  // Step 2
  licenseNumber: '',
  hospital: '',
  document: null,
})

const errors = reactive({
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: '',
  licenseNumber: '',
  hospital: '',
  document: '',
})

const emailValid = computed(() => form.email && /\S+@\S+\.\S+/.test(form.email) && !errors.email)

// Watch email change to clear server-side "already exists" error
watch(() => form.email, () => {
  if (errors.email === 'This email already exists.') {
    errors.email = ''
  }
})

function clearErrors() {
  Object.keys(errors).forEach(k => errors[k] = '')
}

function validateStep1() {
  clearErrors()
  let ok = true

  if (!form.title) { errors.title = 'Title is required.'; ok = false }
  if (!form.firstName) { errors.firstName = 'First name is required.'; ok = false }
  if (!form.lastName) { errors.lastName = 'Last name is required.'; ok = false }
  if (!form.email) { errors.email = 'Email is required.'; ok = false }
  else if (!/\S+@\S+\.\S+/.test(form.email)) { errors.email = 'Email is invalid.'; ok = false }
  
  if (!form.password) { errors.password = 'Password is required.'; ok = false }
  else if (form.password.length < 8) { errors.password = 'Password must be at least 8 characters.'; ok = false }
  else if (form.password.length > 20) { errors.password = 'Password must not exceed 20 characters.'; ok = false }
  
  if (!form.confirmPassword) { errors.confirmPassword = 'Confirm password is required.'; ok = false }
  else if (form.confirmPassword !== form.password) { errors.confirmPassword = 'Password does not match.'; ok = false }
  
  if (!form.agree) { errors.agree = 'You must agree to the terms and privacy policy to continue.'; ok = false }

  return ok
}

function validateStep2() {
  clearErrors()
  let ok = true

  if (!form.licenseNumber) { errors.licenseNumber = 'Medical license number is required.'; ok = false }
  if (!form.hospital) { errors.hospital = 'Affiliated hospital or clinic is required.'; ok = false }
  if (!form.document) { 
    errors.document = 'Verification document is required.'; 
    ok = false 
  } else {
    // SRS-14: Validate file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(form.document.type)) {
      errors.document = 'Unsupported file format. Please upload a valid verification document.'
      ok = false
    }
  }

  return ok
}

async function goNext() {
  if (validateStep1()) {
    try {
      loading.value = true
      await authService.checkEmail(form.email)
      step.value = 2
    } catch (err) {
      if (err.response?.status === 409) {
        errors.email = 'This email already exists.'
      } else {
        errors.email = 'Failed to verify email. Please try again later.'
      }
    } finally {
      loading.value = false
    }
  }
}

function handleFileChange(e) {
  const f = e.target.files[0]
  if (f) form.document = f
}

function handleDrop(e) {
  isDragging.value = false
  const f = e.dataTransfer.files[0]
  if (f) form.document = f
}

async function handleSubmit() {
  if (!validateStep2()) return
  try {
    loading.value = true
    
    // Prepare form data for upload if necessary (Step 2 has document)
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('firstName', form.firstName)
    formData.append('lastName', form.lastName)
    formData.append('email', form.email)
    formData.append('password', form.password)
    formData.append('confirmPassword', form.confirmPassword)
    formData.append('agreeTerms', form.agree)
    formData.append('licenseNumber', form.licenseNumber)
    formData.append('hospital', form.hospital)
    if (form.document) {
      formData.append('verificationDocument', form.document)
    }

    await authService.registerDataUse(formData)
    router.push('/login')
  } catch (err) {
    const status = err?.response?.status
    const message = err?.response?.data?.message
    
    if (status === 409 || message?.toLowerCase().includes('already exists')) {
      errors.email = 'This email already exists.'
      step.value = 1
    } else if (err?.response?.data?.errors) {
      Object.assign(errors, err.response.data.errors)
      if (err.response.data.errors.email) step.value = 1
    } else {
      // SRS-18: System or database error
      errors.licenseNumber = 'Registration failed. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}
</script>
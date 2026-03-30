<template>
  <div class="w-full flex items-center justify-center transition-all duration-500" :class="step === 1 ? 'max-w-xl' : 'max-w-4xl'">
    
    <!-- ── STEP 1: Account Creation ─────────────────────────────────────────── -->
    <section v-if="step === 1" class="w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
      <!-- Header & Progress Indicator -->
      <div class="p-8 pb-4">
        <div class="flex justify-between items-end mb-6">
          <div>
            <span class="text-primary font-semibold text-xs tracking-widest uppercase mb-2 block">Registration Phase</span>
            <h1 class="text-3xl font-extrabold text-on-surface tracking-tight leading-tight">Create Medical Account</h1>
          </div>
          <div class="text-right">
            <p class="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-tighter">Step 1 of 2</p>
            <div class="flex gap-1">
              <div class="h-1.5 w-12 bg-primary rounded-full"></div>
              <div class="h-1.5 w-12 bg-surface-container-high rounded-full"></div>
            </div>
          </div>
        </div>
        <p class="text-on-surface-variant text-sm max-w-md">Please provide your professional credentials to initiate the clinical onboarding process for MorphoAid.</p>
      </div>

      <!-- Form Area -->
      <div class="p-8 pt-4">
        <form class="space-y-6" @submit.prevent="goNext">
          <!-- Row 1: Title & First Name -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2" for="title">Title</label>
              <div class="relative">
                <select 
                  v-model="form.title"
                  class="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary appearance-none text-sm" 
                  :class="errors.title ? 'ring-2 ring-error/50' : ''"
                  id="title"
                >
                  <option value="" disabled>Select</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof.">Prof.</option>
                  <option value="Assoc. Prof.">Assoc. Prof.</option>
                  <option value="Asst. Prof.">Asst. Prof.</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
              <p v-if="errors.title" class="mt-1 text-[10px] font-bold text-error uppercase">{{ errors.title }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2" for="first_name">First name</label>
              <input 
                v-model.trim="form.firstName"
                class="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary text-sm placeholder:text-outline/50" 
                :class="errors.firstName ? 'ring-2 ring-error/50' : ''"
                id="first_name" 
                placeholder="Enter first name" 
                type="text"
              />
              <p v-if="errors.firstName" class="mt-1 text-[10px] font-bold text-error uppercase">{{ errors.firstName }}</p>
            </div>
          </div>

          <!-- Row 2: Last Name -->
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2" for="last_name">Last name</label>
            <input 
              v-model.trim="form.lastName"
              class="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary text-sm placeholder:text-outline/50" 
              :class="errors.lastName ? 'ring-2 ring-error/50' : ''"
              id="last_name" 
              placeholder="Enter last name" 
              type="text"
            />
            <p v-if="errors.lastName" class="mt-1 text-[10px] font-bold text-error uppercase">{{ errors.lastName }}</p>
          </div>

          <!-- Row 3: Email -->
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2" for="email">Medical Email Address</label>
            <div class="relative">
              <input 
                v-model.trim="form.email"
                class="w-full bg-surface-container-low border-none rounded-lg py-3 pl-10 pr-4 text-on-surface focus:ring-2 focus:ring-primary text-sm placeholder:text-outline/50" 
                :class="errors.email ? 'ring-2 ring-error/50' : emailValid ? 'ring-2 ring-emerald-500/30' : ''"
                id="email" 
                placeholder="email@institution.edu" 
                type="email"
              />
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">mail</span>
              <span v-if="emailValid" class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">check_circle</span>
            </div>
            <p v-if="errors.email" class="mt-1 text-[10px] font-bold text-error uppercase">{{ errors.email }}</p>
          </div>

          <!-- Row 4: Password Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2" for="password">Password</label>
              <div class="relative">
                <input 
                  v-model="form.password"
                  class="w-full bg-surface-container-low border-none rounded-lg py-3 pl-10 pr-4 text-on-surface focus:ring-2 focus:ring-primary text-sm placeholder:text-outline/50" 
                  :class="errors.password ? 'ring-2 ring-error/50' : ''"
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                />
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">lock</span>
              </div>
              <p v-if="errors.password" class="mt-1 text-[10px] font-bold text-error uppercase">{{ errors.password }}</p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2" for="confirm_password">Confirm Password</label>
              <div class="relative">
                <input 
                  v-model="form.confirmPassword"
                  class="w-full bg-surface-container-low border-none rounded-lg py-3 pl-10 pr-4 text-on-surface focus:ring-2 focus:ring-primary text-sm placeholder:text-outline/50" 
                  :class="errors.confirmPassword ? 'ring-2 ring-error/50' : ''"
                  id="confirm_password" 
                  placeholder="••••••••" 
                  type="password"
                />
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">enhanced_encryption</span>
              </div>
              <p v-if="errors.confirmPassword" class="mt-1 text-[10px] font-bold text-error uppercase">{{ errors.confirmPassword }}</p>
            </div>
          </div>

          <!-- Checkbox -->
          <div class="flex items-start gap-3 py-2">
            <input 
              v-model="form.agree"
              class="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-low" 
              id="terms" 
              type="checkbox"
            />
            <label class="text-xs text-on-surface-variant leading-relaxed" for="terms">
              I agree to the <button type="button" @click="isTermsModalOpen = true" class="text-primary font-medium hover:underline">Terms of Service</button> and <button type="button" @click="isPrivacyModalOpen = true" class="text-primary font-medium hover:underline">Privacy Notice</button>, and confirm I am a licensed healthcare professional.
            </label>
          </div>
          <p v-if="errors.agree" class="text-[10px] font-bold text-error uppercase">{{ errors.agree }}</p>

          <!-- Action Button -->
          <div class="pt-4">
            <button 
              class="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all flex justify-center items-center gap-2 group disabled:opacity-50" 
              type="submit"
              :disabled="loading"
            >
              <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
              <span>{{ loading ? 'Verifying...' : 'Proceed to Step 2' }}</span>
              <span v-if="!loading" class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>

          <div class="text-center">
            <p class="text-[13px] text-on-surface-variant">
              Already have an account? 
              <router-link to="/login" class="font-bold text-primary hover:underline">Log in</router-link>
            </p>
          </div>
        </form>
      </div>

      <!-- Footer Note -->
      <div class="bg-surface-container-low p-6 text-center">
        <p class="text-xs text-on-surface-variant font-medium flex justify-center items-center gap-2">
          <span class="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
          End-to-end encrypted registration protocol active
        </p>
      </div>
    </section>

    <!-- ── STEP 2: Identity Verification ─────────────────────────────────────────── -->
    <section v-else class="w-full grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-2xl shadow-on-background/5 border border-outline-variant/15">
      <!-- Left Side: Informational/Brand Panel -->
      <div class="clinical-gradient p-10 flex flex-col justify-between relative overflow-hidden text-on-primary">
        <div class="relative z-10">
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white mb-6 backdrop-blur-sm border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
            </svg>
          </div>
          <span class="text-xs font-bold tracking-widest uppercase opacity-70 mb-4 block">MorphoAid Identity</span>
          <h2 class="font-headline text-4xl font-extrabold tracking-tight leading-tight mb-6">Medical Identity Verification</h2>
          <p class="text-on-primary-container leading-relaxed opacity-90 max-w-sm">
            To maintain a secure medical environment, we require verification of your clinical credentials. Our AI processes these documents in a HIPAA-compliant workspace.
          </p>
        </div>
        <div class="mt-12 relative z-10 space-y-6">
          <div class="flex items-start gap-4">
            <span class="material-symbols-outlined bg-on-primary/10 p-2 rounded-lg" data-icon="verified_user">verified_user</span>
            <div>
              <p class="font-semibold text-sm">Credential Validation</p>
              <p class="text-xs opacity-70">Cross-referenced with state medical boards.</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <span class="material-symbols-outlined bg-on-primary/10 p-2 rounded-lg" data-icon="lock">lock</span>
            <div>
              <p class="font-semibold text-sm">End-to-End Encryption</p>
              <p class="text-xs opacity-70">Your documents are purged after verification.</p>
            </div>
          </div>
        </div>
        <!-- Abstract Visual -->
        <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-container rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div class="absolute top-1/4 -left-10 w-40 h-40 bg-on-primary rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      </div>

      <!-- Right Side: The Form -->
      <div class="bg-surface-container-lowest p-10 flex flex-col">
        <!-- Progress Indicator -->
        <div class="mb-10">
          <div class="flex justify-between items-center mb-2">
            <span class="text-[10px] font-bold tracking-widest text-primary uppercase">Step 2 of 2</span>
            <span class="text-[10px] font-medium text-on-surface-variant">Identity Review</span>
          </div>
          <div class="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-primary w-full rounded-full"></div>
          </div>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Medical License Number -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-on-surface-variant tracking-tight" for="license">Medical License Number</label>
            <div class="relative group">
              <input 
                v-model.trim="form.licenseNumber"
                class="w-full bg-surface-container-low border-0 rounded-lg pr-4 pl-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" 
                :class="errors.licenseNumber ? 'ring-2 ring-error/40' : ''"
                id="license" 
                placeholder="e.g. 1234567" 
                type="text"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant text-lg group-focus-within:text-primary transition-colors" data-icon="badge">badge</span>
            </div>
            <p v-if="errors.licenseNumber" class="text-[10px] font-bold text-error uppercase">{{ errors.licenseNumber }}</p>
          </div>

          <!-- Affiliated Hospital -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-on-surface-variant tracking-tight" for="hospital">Affiliated Hospital or Clinic</label>
            <div class="relative group">
              <input 
                v-model.trim="form.hospital"
                class="w-full bg-surface-container-low border-0 rounded-lg pr-4 pl-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" 
                :class="errors.hospital ? 'ring-2 ring-error/40' : ''"
                id="hospital" 
                placeholder="Enter facility name" 
                type="text"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant text-lg group-focus-within:text-primary transition-colors" data-icon="domain">domain</span>
            </div>
            <p v-if="errors.hospital" class="text-[10px] font-bold text-error uppercase">{{ errors.hospital }}</p>
          </div>

          <!-- Drag and Drop Upload -->
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-on-surface-variant tracking-tight">Verification Document Upload</label>
            <div 
              class="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
              :class="isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40 hover:bg-surface-container-low'"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="$refs.fileInput.click()"
            >
              <input ref="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" class="hidden" @change="handleFileChange" />
              <div v-if="!form.document" class="flex flex-col items-center">
                <span class="material-symbols-outlined text-outline mb-3 group-hover:text-primary transition-colors text-3xl" data-icon="upload_file">upload_file</span>
                <p class="text-sm font-medium text-on-surface">Drag and drop file here</p>
                <p class="text-[10px] text-on-surface-variant mt-1">PDF, JPG or PNG (max. 10MB)</p>
                <button class="mt-4 text-xs font-bold text-primary hover:underline" type="button">Or browse files</button>
              </div>
              <div v-else class="flex flex-col items-center gap-1">
                <span class="material-symbols-outlined text-emerald-500 text-3xl">task</span>
                <p class="text-xs font-bold text-on-surface">{{ form.document.name }}</p>
                <button type="button" @click.stop="form.document = null" class="text-[10px] font-bold text-error hover:underline uppercase mt-1">Remove File</button>
              </div>
            </div>
            <p v-if="errors.document" class="text-[10px] font-bold text-error uppercase">{{ errors.document }}</p>
          </div>

          <!-- Error Message Example (if registration failed) -->
          <div v-if="errors.licenseNumber && errors.licenseNumber.includes('failed')" class="bg-error-container/40 p-3 rounded-lg flex items-start gap-3 border border-error/10">
            <span class="material-symbols-outlined text-error text-lg" data-icon="error">error</span>
            <div>
              <p class="text-xs font-bold text-on-error-container">Registration Failed</p>
              <p class="text-[10px] text-on-error-container/80 leading-relaxed">{{ errors.licenseNumber }}</p>
            </div>
          </div>

          <!-- Action Button -->
          <div class="space-y-3">
            <button 
              class="w-full bg-clinical-gradient text-on-primary py-4 rounded-lg font-headline font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
              type="submit"
              :disabled="loading"
            >
              <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
              {{ loading ? 'Submitting...' : 'Complete Verification' }}
            </button>
            <button 
              @click="step = 1"
              class="w-full text-center text-xs text-on-surface-variant font-medium hover:text-on-surface py-2 transition-colors uppercase tracking-widest" 
              type="button"
            >
              ← Back to Step 1
            </button>
          </div>
        </form>
      </div>
    </section>

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
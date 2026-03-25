<template>
  <div class="w-full max-w-md sm:max-w-2xl rounded-[24px] border border-white/60 bg-stone-50/85 px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:px-10 sm:py-10">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-[42px] font-bold leading-tight text-[#2E2E2E]">Register</h1>
    </div>

    <!-- Step Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <p class="text-[17px] font-semibold text-[#2E2E2E]">
          {{ step === 1 ? 'Create an account' : 'Verify your Medical Identity' }}
        </p>
        <span class="text-xs font-semibold text-[#5C5C5C] bg-gray-100 px-3 py-1 rounded-full">Step {{ step }} of 2</span>
      </div>
      <!-- Progress Bar -->
      <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-[#48B7CB] rounded-full transition-all duration-500" :style="{ width: step === 1 ? '50%' : '100%' }"></div>
      </div>
    </div>

    <!-- ── STEP 1 ─────────────────────────────────────────── -->
    <form v-if="step === 1" class="space-y-5" @submit.prevent="goNext">

      <!-- Title + First name + Last name -->
      <div class="flex gap-3 items-start">
        <!-- Title Dropdown -->
        <div class="flex-shrink-0" style="width: 110px;">
          <label class="mb-1.5 block text-[14px] font-medium text-[#2E2E2E]">Title</label>
          <div class="relative">
            <select
              v-model="form.title"
              class="h-12 w-full appearance-none rounded-[10px] border border-[#D9DDE3] bg-white pl-3 pr-8 text-[14px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15 cursor-pointer"
              :class="errors.title ? 'border-red-400' : ''"
            >
              <option value="" disabled>Title</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
              <option value="Assoc. Prof.">Assoc. Prof.</option>
              <option value="Asst. Prof.">Asst. Prof.</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
          <p v-if="errors.title" class="mt-1 text-xs text-red-500">{{ errors.title }}</p>
        </div>

        <!-- First Name -->
        <div class="flex-1">
          <label for="firstName" class="mb-1.5 block text-[14px] font-medium text-[#2E2E2E]">First name</label>
          <input
            id="firstName"
            v-model.trim="form.firstName"
            type="text"
            placeholder="First name"
            class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
            :class="errors.firstName ? 'border-red-400' : ''"
          />
          <p v-if="errors.firstName" class="mt-1 text-xs text-red-500">{{ errors.firstName }}</p>
        </div>

        <!-- Last Name -->
        <div class="flex-1">
          <label for="lastName" class="mb-1.5 block text-[14px] font-medium text-[#2E2E2E]">Last name</label>
          <input
            id="lastName"
            v-model.trim="form.lastName"
            type="text"
            placeholder="Last name"
            class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
            :class="errors.lastName ? 'border-red-400' : ''"
          />
          <p v-if="errors.lastName" class="mt-1 text-xs text-red-500">{{ errors.lastName }}</p>
        </div>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="mb-1.5 block text-[14px] font-medium text-[#2E2E2E]">Email</label>
        <div class="relative">
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            placeholder="e.g. doctor@hospital.com"
            class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 pr-11 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
            :class="errors.email ? 'border-red-400' : emailValid ? 'border-emerald-400' : ''"
          />
          <span v-if="emailValid" class="absolute inset-y-0 right-3 flex items-center text-emerald-500">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          </span>
        </div>
        <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="mb-1.5 block text-[14px] font-medium text-[#2E2E2E]">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="At least 6 characters"
          class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
          :class="errors.password ? 'border-red-400' : ''"
        />
        <p class="mt-1 text-[12px] italic text-[#7A8594]">Must contain <strong>letters and numbers</strong></p>
        <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirmPassword" class="mb-1.5 block text-[14px] font-medium text-[#2E2E2E]">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Re-enter password"
          class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
          :class="errors.confirmPassword ? 'border-red-400' : ''"
        />
        <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500 flex items-center gap-1">
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Terms -->
      <div>
        <label class="flex items-start gap-3 text-[14px] text-[#2E2E2E] cursor-pointer">
          <input v-model="form.agree" type="checkbox" class="mt-0.5 h-5 w-5 rounded border-gray-300 text-[#48B7CB] focus:ring-[#48B7CB]" />
          <span class="select-none">
            I agree to all the
            <button type="button" @click="isTermsModalOpen = true" class="font-bold underline underline-offset-2 hover:text-[#48B7CB] transition-colors focus:outline-none">Terms of Use</button>
            and
            <button type="button" @click="isPrivacyModalOpen = true" class="font-bold underline underline-offset-2 hover:text-[#48B7CB] transition-colors focus:outline-none">Privacy Notice</button>
          </span>
        </label>
        <p v-if="errors.agree" class="mt-1 text-xs text-red-500">{{ errors.agree }}</p>
      </div>

      <!-- Legal Modals -->
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

      <!-- Next Button -->
      <div class="pt-1">
        <button
          type="submit"
          class="h-[54px] w-full rounded-[10px] bg-[#48B7CB] text-[18px] font-bold text-white shadow-sm transition hover:bg-[#3aa8bc] flex items-center justify-center gap-2"
        >
          Next
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </button>
      </div>

      <!-- Bottom Link -->
      <div class="text-center text-[14px] text-[#2E2E2E]">
        Already have an account?
        <router-link to="/login" class="font-semibold text-[#2F8EA2] hover:underline">Log in</router-link>
      </div>
    </form>

    <!-- ── STEP 2 ─────────────────────────────────────────── -->
    <form v-else class="space-y-5" @submit.prevent="handleSubmit">

      <!-- Medical License -->
      <div>
        <label for="licenseNumber" class="mb-1.5 block text-[14px] font-medium text-[#2E2E2E]">Medical license number (Thailand)</label>
        <input
          id="licenseNumber"
          v-model.trim="form.licenseNumber"
          type="text"
          placeholder="e.g. 1234567"
          class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-stone-100 px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15 focus:bg-white"
          :class="errors.licenseNumber ? 'border-red-400' : ''"
        />
        <p v-if="errors.licenseNumber" class="mt-1 text-xs text-red-500">{{ errors.licenseNumber }}</p>
      </div>

      <!-- Affiliated Hospital -->
      <div>
        <label for="hospital" class="mb-1.5 block text-[14px] font-medium text-[#2E2E2E]">Affiliated Hospital/Clinical</label>
        <input
          id="hospital"
          v-model.trim="form.hospital"
          type="text"
          placeholder="e.g. Tak Hospital"
          class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-stone-100 px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15 focus:bg-white"
          :class="errors.hospital ? 'border-red-400' : ''"
        />
        <p v-if="errors.hospital" class="mt-1 text-xs text-red-500">{{ errors.hospital }}</p>
      </div>

      <!-- Document Upload -->
      <div>
        <label class="mb-1.5 block text-[14px] font-medium text-[#2E2E2E]">Verification Documents</label>
        <div
          class="relative flex flex-col items-center justify-center gap-3 rounded-[12px] border-2 border-dashed border-[#D9DDE3] bg-white p-8 text-center transition-colors cursor-pointer"
          :class="isDragging ? 'border-[#48B7CB] bg-[#48B7CB]/5' : 'hover:border-[#48B7CB]/60'"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="$refs.fileInput.click()"
        >
          <input ref="fileInput" type="file" accept=".pdf,.jpg,.jpeg,.png" class="hidden" @change="handleFileChange" />
          <div v-if="!form.document" class="flex flex-col items-center gap-2">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <p class="text-[14px] font-semibold text-[#2E2E2E]">Doctor ID Card or Medical License Certificate</p>
            <p class="text-[12px] text-[#7A8594]">Click or drag to upload (PDF or JPG only)</p>
          </div>
          <div v-else class="flex flex-col items-center gap-2">
            <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p class="text-[14px] font-semibold text-emerald-600">{{ form.document.name }}</p>
            <button type="button" @click.stop="form.document = null" class="text-xs text-gray-400 hover:text-red-500">Remove</button>
          </div>
        </div>
        <p v-if="errors.document" class="mt-1 text-xs text-red-500">{{ errors.document }}</p>
      </div>

      <!-- Warning Banner -->
      <div class="flex items-start gap-3 rounded-[10px] bg-red-50 border border-red-200 px-4 py-3">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        <p class="text-[13px] text-red-700">Please ensure the license number matches the document provided</p>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3 pt-1">
        <button
          type="button"
          @click="step = 1"
          class="h-[54px] w-28 rounded-[10px] border border-[#D9DDE3] bg-white text-[15px] font-semibold text-[#2E2E2E] shadow-sm transition hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="h-[54px] flex-1 rounded-[10px] bg-[#48B7CB] text-[18px] font-bold text-white shadow-sm transition hover:bg-[#3aa8bc] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <span v-if="!loading">Submit</span>
          <span v-else>Submitting...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
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

const emailValid = computed(() => form.email && /\S+@\S+\.\S+/.test(form.email))

function clearErrors() {
  Object.keys(errors).forEach(k => errors[k] = '')
}

function validateStep1() {
  clearErrors()
  let ok = true

  if (!form.title) { errors.title = 'Required'; ok = false }
  if (!form.firstName) { errors.firstName = 'Enter first name'; ok = false }
  if (!form.lastName) { errors.lastName = 'Enter last name'; ok = false }
  if (!form.email) { errors.email = 'Enter email'; ok = false }
  else if (!/\S+@\S+\.\S+/.test(form.email)) { errors.email = 'Invalid email'; ok = false }
  if (!form.password) { errors.password = 'Enter password'; ok = false }
  else if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password)) { errors.password = 'Letters and numbers required'; ok = false }
  if (!form.confirmPassword) { errors.confirmPassword = 'Confirm password'; ok = false }
  else if (form.confirmPassword !== form.password) { errors.confirmPassword = 'Password do not match'; ok = false }
  if (!form.agree) { errors.agree = 'You must agree to continue'; ok = false }

  return ok
}

function validateStep2() {
  clearErrors()
  let ok = true

  if (!form.licenseNumber) { errors.licenseNumber = 'Enter medical license number'; ok = false }
  if (!form.hospital) { errors.hospital = 'Enter affiliated hospital'; ok = false }
  if (!form.document) { errors.document = 'Please upload your verification document'; ok = false }

  return ok
}

function goNext() {
  if (validateStep1()) step.value = 2
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
    await authService.registerDataUse({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      agreeTerms: form.agree,
    })
    router.push('/login')
  } catch (err) {
    const serverErrors = err?.response?.data?.errors
    if (serverErrors) {
      Object.assign(errors, serverErrors)
      // If email error, go back to step 1
      if (serverErrors.email) step.value = 1
    } else {
      errors.licenseNumber = err?.response?.data?.message || 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>
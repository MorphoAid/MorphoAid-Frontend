<template>
  <div
class="w-full max-w-md sm:max-w-2xl rounded-[24px] border border-white/60 bg-stone-50/85 px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:px-10 sm:py-10"  >
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-[42px] font-bold leading-tight text-[#2E2E2E]">
        Register
      </h1>
      <p class="mt-3 text-[18px] leading-7 text-[#5C5C5C]">
        Let’s get you all set up so you can access your personal account.
      </p>
    </div>

    <!-- Form -->
    <form class="mt-10 space-y-4" @submit.prevent="handleSubmit">
      <!-- Name Row -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            for="firstName"
            class="mb-2 block text-[16px] font-medium text-[#2E2E2E]"
          >
            Name
          </label>
          <input
            id="firstName"
            v-model.trim="form.firstName"
            type="text"
            placeholder="Text"
            class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
            :class="errors.firstName ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
          />
          <p v-if="errors.firstName" class="mt-2 text-sm text-red-500">
            {{ errors.firstName }}
          </p>
        </div>

        <div>
          <label
            for="lastName"
            class="mb-2 block text-[16px] font-medium text-[#2E2E2E]"
          >
            Lastname
          </label>
          <input
            id="lastName"
            v-model.trim="form.lastName"
            type="text"
            placeholder="Text"
            class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
            :class="errors.lastName ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
          />
          <p v-if="errors.lastName" class="mt-2 text-sm text-red-500">
            {{ errors.lastName }}
          </p>
        </div>
      </div>

      <!-- Email -->
      <div>
        <label
          for="email"
          class="mb-2 block text-[16px] font-medium text-[#2E2E2E]"
        >
          Email
        </label>
        <input
          id="email"
          v-model.trim="form.email"
          type="email"
          placeholder="Morphoaid@gmail.com"
          class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
          :class="errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
        />
        <p v-if="errors.email" class="mt-2 text-sm text-red-500">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <label
          for="password"
          class="mb-2 block text-[16px] font-medium text-[#2E2E2E]"
        >
          Password
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Text"
          class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
          :class="errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
        />
        <p class="mt-2 text-[13px] italic text-[#7A8594]">
          Password must be contain with
          <span class="font-semibold">alphabet and number</span>
        </p>
        <p v-if="errors.password" class="mt-2 text-sm text-red-500">
          {{ errors.password }}
        </p>
      </div>

      <!-- Confirm Password -->
      <div>
        <label
          for="confirmPassword"
          class="mb-2 block text-[16px] font-medium text-[#2E2E2E]"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="Text"
          class="h-12 w-full rounded-[10px] border border-[#D9DDE3] bg-white px-4 text-[15px] text-[#2E2E2E] shadow-sm outline-none transition focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/15"
          :class="errors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''"
        />
        <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-500">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Terms -->
      <div>
        <label class="flex items-start gap-3 text-[15px] text-[#2E2E2E]">
          <input
            v-model="form.agree"
            type="checkbox"
            class="mt-1 h-5 w-5 rounded border-gray-300 text-[#48B7CB] focus:ring-[#48B7CB]"
          />
          <span>
            I agree to all the
            <a href="#" class="font-semibold underline underline-offset-2">
              Terms
            </a>
            and
            <a href="#" class="font-semibold underline underline-offset-2">
              Privacy Policies
            </a>
          </span>
        </label>
        <p v-if="errors.agree" class="mt-2 text-sm text-red-500">
          {{ errors.agree }}
        </p>
      </div>

      <!-- Submit -->
      <div class="pt-2">
        <button
          type="submit"
          class="h-[54px] w-full rounded-[10px] bg-[#48B7CB] text-[22px] font-bold text-white shadow-sm transition hover:bg-[#3aa8bc] disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          <span v-if="!loading">Sign Up</span>
          <span v-else>Creating account...</span>
        </button>
      </div>

      <!-- Bottom Link -->
      <div class="text-center text-[15px] text-[#2E2E2E]">
        Already have an account?
        <router-link
          to="/login"
          class="font-semibold text-[#2F8EA2] hover:underline"
        >
          Log in
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const loading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: '',
})

function validateForm() {
  errors.firstName = ''
  errors.lastName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.agree = ''

  let isValid = true

  if (!form.firstName) {
    errors.firstName = 'Please enter your first name.'
    isValid = false
  }

  if (!form.lastName) {
    errors.lastName = 'Please enter your last name.'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'Please enter your email.'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Please enter your password.'
    isValid = false
  } else if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password)) {
    errors.password = 'Password must contain letters and numbers.'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
    isValid = false
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match.'
    isValid = false
  }

  if (!form.agree) {
    errors.agree = 'You must agree to the terms and privacy policies.'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    loading.value = true

    // TODO: replace with your real register API call
    console.log('Register Data Use:', { ...form })


  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register for Data Prep
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Join using your invitation token.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">

        <div v-if="globalErrorMsg" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert">
          <span class="block sm:inline">{{ globalErrorMsg }}</span>
        </div>


        <div class="rounded-md shadow-sm space-y-4">

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input id="username" name="username" type="text" required v-model="form.username"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': fieldErrors.username }" placeholder="Username">
            <p v-if="fieldErrors.username" class="mt-1 text-xs text-red-600">{{ fieldErrors.username }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input id="firstName" name="firstName" type="text" required v-model="form.firstName"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-500': fieldErrors.firstName }" placeholder="First Name">
              <p v-if="fieldErrors.firstName" class="mt-1 text-xs text-red-600">{{ fieldErrors.firstName }}</p>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input id="lastName" name="lastName" type="text" required v-model="form.lastName"
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-500': fieldErrors.lastName }" placeholder="Last Name">
              <p v-if="fieldErrors.lastName" class="mt-1 text-xs text-red-600">{{ fieldErrors.lastName }}</p>
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input id="email" name="email" type="email" required v-model="form.email"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': fieldErrors.email }" placeholder="Email address">
            <p v-if="fieldErrors.email" class="mt-1 text-xs text-red-600">{{ fieldErrors.email }}</p>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" required v-model="form.password"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': fieldErrors.password }" placeholder="Password">
            <p v-if="fieldErrors.password" class="mt-1 text-xs text-red-600">{{ fieldErrors.password }}</p>
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required v-model="form.confirmPassword"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': fieldErrors.confirmPassword }" placeholder="Confirm Password">
            <p v-if="fieldErrors.confirmPassword" class="mt-1 text-xs text-red-600">{{ fieldErrors.confirmPassword }}
            </p>
          </div>
          <div class="flex items-center">
            <input id="agreeTerms" name="agreeTerms" type="checkbox" required v-model="form.agreeTerms"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              :class="{ 'border-red-500': fieldErrors.agreeTerms }">
            <label for="agreeTerms" class="ml-2 block text-sm text-gray-900">
              I agree to the Terms and Conditions
            </label>
          </div>
          <p v-if="fieldErrors.agreeTerms" class="mt-1 text-xs text-red-600">{{ fieldErrors.agreeTerms }}</p>

          <div>
            <label for="invitationToken" class="block text-sm font-medium text-gray-700">Invitation Token</label>
            <input id="invitationToken" name="invitationToken" type="text" required v-model="form.invitationToken"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-500': fieldErrors.invitationToken }" placeholder="Invitation Token">
            <p v-if="fieldErrors.invitationToken" class="mt-1 text-xs text-red-600">{{ fieldErrors.invitationToken }}
            </p>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </div>

        <div class="text-center text-sm">
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Already have an account? Log in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { authService } from '@/services/auth.service';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const form = reactive({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
  invitationToken: ''
});

onMounted(() => {
  if (route.query.token) {
    form.invitationToken = route.query.token;
  }
});

const fieldErrors = reactive({});
const globalErrorMsg = ref('');
const loading = ref(false);

const validateForm = () => {
  let isValid = true;
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);

  if (!form.invitationToken) {
    fieldErrors.invitationToken = "Invitation token is required.";
    isValid = false;
  }

  if (form.username.length < 3 || form.username.length > 10) {
    fieldErrors.username = "Username must be between 3 and 10 characters.";
    isValid = false;
  }

  const alphaRegex = /^[A-Za-z]+$/;
  if (!alphaRegex.test(form.firstName)) {
    fieldErrors.firstName = "First name must contain only alphabetic characters.";
    isValid = false;
  }

  if (!alphaRegex.test(form.lastName)) {
    fieldErrors.lastName = "Last name must contain only alphabetic characters.";
    isValid = false;
  }

  if (form.password !== form.confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
    isValid = false;
  }

  if (!form.agreeTerms) {
    fieldErrors.agreeTerms = "You must agree to the terms.";
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  globalErrorMsg.value = '';

  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    await authService.registerDataPrep(form);
    
    // Clear form
    Object.keys(form).forEach(key => {
      if (typeof form[key] === 'boolean') form[key] = false;
      else form[key] = '';
    });

    // Show popup and redirect
    window.alert("Registration successful.");
    router.push('/login');
    
  } catch (err) {
    if (err.response?.data?.errors) {
      // Backend returned field-level errors
      Object.assign(fieldErrors, err.response.data.errors);
    } else {
      globalErrorMsg.value = err.response?.data?.message || err.message || "Registration failed.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

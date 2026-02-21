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
        
        <div v-if="errorMsg" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ errorMsg }}</span>
        </div>
        <div v-if="successMsg" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ successMsg }}</span>
        </div>

        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username/Email</label>
            <input id="username" name="username" type="text" required v-model="form.username"
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                   placeholder="Username or Email">
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" required v-model="form.password"
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                   placeholder="Password">
          </div>
          <div>
            <label for="invitationToken" class="sr-only">Invitation Token</label>
            <input id="invitationToken" name="invitationToken" type="text" required v-model="form.invitationToken"
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                   placeholder="Invitation Token">
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
  password: '',
  invitationToken: ''
});

onMounted(() => {
  if (route.query.token) {
    form.invitationToken = route.query.token;
  }
});

const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const handleRegister = async () => {
  errorMsg.value = '';
  successMsg.value = '';

  if (!form.username || !form.password || !form.invitationToken) {
    errorMsg.value = "Please fill in all fields.";
    return;
  }
  if (form.password.length < 6) {
    errorMsg.value = "Password must be at least 6 characters.";
    return;
  }

  loading.value = true;
  try {
    await authService.registerDataPrep(form);
    successMsg.value = "Registration successful! You can now log in.";
    form.username = '';
    form.password = '';
    form.invitationToken = '';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || "Registration failed.";
  } finally {
    loading.value = false;
  }
};
</script>

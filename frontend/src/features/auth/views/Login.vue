<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        
        <div v-if="errorMsg" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ errorMsg }}</span>
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
                   class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                   placeholder="Password">
          </div>
        </div>

        <div>
           <button type="submit" :disabled="loading"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
        
        <div class="flex items-center justify-between mt-4">
           <div class="text-sm">
             <router-link to="/register/data-use" class="font-medium text-blue-600 hover:text-blue-500">
               Register (Data Use)
             </router-link>
           </div>
           <div class="text-sm">
             <router-link to="/register/data-prep" class="font-medium text-blue-600 hover:text-blue-500">
               Join (Data Prep)
             </router-link>
           </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: ''
});
const loading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  errorMsg.value = '';

  if (!form.username || !form.password) {
    errorMsg.value = "Please enter username and password.";
    return;
  }

  loading.value = true;
  try {
    await authStore.login(form.username, form.password);
    
    // Redirect based on role
    const role = authStore.role;
    if (role === 'DATA_USE') {
      router.push('/__test/cases');
    } else if (role === 'DATA_PREP') {
      router.push('/dataprep');
    } else if (role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || "Login failed.";
  } finally {
    loading.value = false;
  }
};
</script>

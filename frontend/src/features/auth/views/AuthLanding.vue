<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Auth Navigation</h2>
      <div class="space-y-4 flex flex-col">
        <button @click="router.push('/login')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">Login</button>
        <button @click="router.push('/register/data-use')" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors">Register DataUse</button>
        <button @click="router.push('/register/data-prep?token=DEMO_TOKEN_HERE')" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors">Register DataPrep</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Page header -->
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-gray-800 font-bold">Invitation Tokens</h1>
        <p class="text-gray-500 mt-1">Generate and manage invitation tokens for MORU/DataPrep registration.</p>
      </div>
      <div>
        <button @click="generateToken" :disabled="generating"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors disabled:opacity-50">
          {{ generating ? 'Generating...' : 'Generate New Token' }}
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between">
      <div>
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>
      <button @click="error = null" class="text-red-700 font-bold">&times;</button>
    </div>

    <!-- New Token Success Card -->
    <div v-if="newToken" class="bg-green-50 border border-green-200 rounded-xl mb-8 p-6 shadow-sm">
      <h3 class="text-lg font-bold text-green-800 mb-2">New Token Created</h3>
      <div class="flex items-center space-x-4">
        <div class="bg-white px-4 py-2 rounded border border-green-300 font-mono text-lg text-gray-800 grow">
          {{ newToken }}
        </div>
        <button @click="copyToClipboard" 
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-colors w-24">
          {{ copySuccess ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500 text-lg">Loading tokens...</p>
    </div>

    <!-- Tokens Table -->
    <div v-else-if="tokens.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Token Code
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="token in tokens" :key="token.code" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
              {{ token.code }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ token.createdAt ? new Date(token.createdAt).toLocaleString() : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                'bg-gray-100 text-gray-800': token.usedAt,
                'bg-green-100 text-green-800': !token.usedAt
              }">
                {{ token.usedAt ? 'Used' : 'Unused' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-10 bg-white shadow rounded-lg border border-gray-200">
      <p class="text-gray-500 text-lg">No invitation tokens found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import http from '@/services/http';

const tokens = ref([]);
const loading = ref(true);
const error = ref(null);
const generating = ref(false);
const newToken = ref(null);
const copySuccess = ref(false);

const fetchTokens = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await http.get('/admin/invitations');
    tokens.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to load invitation tokens';
  } finally {
    loading.value = false;
  }
};

const generateToken = async () => {
  generating.value = true;
  error.value = null;
  newToken.value = null;
  copySuccess.value = false;
  try {
    const response = await http.post('/admin/invitations', {});
    newToken.value = response.data.code;
    await fetchTokens();
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to generate token';
  } finally {
    generating.value = false;
  }
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(newToken.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

onMounted(() => {
  fetchTokens();
});
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
      <button @click="fetchUsers" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors">
        Refresh
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <strong class="font-bold">Error: </strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500 text-lg">Loading users...</p>
    </div>

    <!-- Users Table -->
    <div v-else-if="users.length > 0" class="bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id || user.email" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.email || user.username }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-purple-100 text-purple-800': user.role === 'ADMIN',
                  'bg-green-100 text-green-800': user.role === 'DATA_USE',
                  'bg-blue-100 text-blue-800': user.role === 'DATA_PREP'
                }">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-10 bg-white shadow rounded-lg border border-gray-200">
      <p class="text-gray-500 text-lg">No users found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import http from '@/services/http';

const users = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await http.get('/admin/users');
    users.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to fetch users';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

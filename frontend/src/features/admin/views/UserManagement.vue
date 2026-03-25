<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
      <button @click="fetchUsers"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors font-medium">
        Refresh
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-red-500">error</span>
        <span><strong class="font-bold">Error: </strong>{{ error }}</span>
      </div>
      <button @click="error = null" class="text-red-400 hover:text-red-600 transition-colors">&times;</button>
    </div>

    <!-- Success State -->
    <div v-if="successMsg"
      class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-green-500">check_circle</span>
        <span>{{ successMsg }}</span>
      </div>
      <button @click="successMsg = null" class="text-green-400 hover:text-green-600 transition-colors">&times;</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20 bg-white shadow-sm rounded-2xl border border-gray-100 italic text-gray-400">
      <div class="w-8 h-8 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p>Loading users...</p>
    </div>

    <!-- Users Table -->
    <div v-else-if="users.length > 0" class="bg-white shadow-xl shadow-gray-200/50 overflow-hidden rounded-2xl border border-gray-100">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50/50">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              User Information
            </th>
            <th scope="col" class="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              System Role
            </th>
            <th scope="col" class="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Member Since
            </th>
            <th scope="col" class="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-50">
          <tr v-for="user in users" :key="user.id || user.email" class="hover:bg-gray-50/50 transition-colors group">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {{ (user.email || user.username).charAt(0).toUpperCase() }}
                </div>
                <div class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{{ user.email || user.username }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="px-3 py-1 inline-flex text-[10px] font-black rounded-full uppercase tracking-tight" :class="{
                'bg-purple-50 text-purple-600 border border-purple-100': user.role === 'ADMIN',
                'bg-emerald-50 text-emerald-600 border border-emerald-100': user.role === 'DATA_USE',
              }">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
              {{ user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="handleDeleteUser(user)"
                v-if="user.email !== authStore.user?.email"
                class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ml-auto">
                <span class="material-symbols-outlined text-[18px]">person_remove</span>
                <span class="font-bold text-xs">Delete User</span>
              </button>
              <span v-else class="text-[10px] text-gray-300 font-bold uppercase tracking-tighter bg-gray-50 px-3 py-1.5 rounded-lg">Current User</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 bg-white shadow-xl shadow-gray-200/50 overflow-hidden rounded-2xl border border-gray-100">
      <span class="material-symbols-outlined text-gray-200 text-6xl mb-4">group_off</span>
      <p class="text-gray-400 font-medium">No system users found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminService } from '@/services/admin.service';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'vue-router';

const users = ref([]);
const loading = ref(true);
const error = ref(null);
const successMsg = ref(null);
const router = useRouter();
const authStore = useAuthStore();

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  // successMsg.value = null; // Don't clear success immediately so they see the result of delete
  try {
    const response = await adminService.getUsers();
    users.value = response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      router.push('/login');
    } else if (err.response?.status === 403) {
      error.value = "Admin permission required";
    } else {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch users';
    }
  } finally {
    loading.value = false;
  }
};

const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete user ${user.email}?\nThis action cannot be undone and will remove all their data from the system.`)) return;
    
    error.value = null;
    successMsg.value = null;
    
    try {
        await adminService.deleteUser(user.id);
        successMsg.value = `User ${user.email} has been permanently removed.`;
        await fetchUsers();
    } catch (err) {
        if (err.response?.status === 401) {
            router.push('/login');
        } else if (err.response?.status === 403) {
            error.value = "Admin permission required";
        } else {
            error.value = err.response?.data?.message || err.message || 'Failed to delete user';
        }
    }
};

onMounted(() => {
  fetchUsers();
});
</script>

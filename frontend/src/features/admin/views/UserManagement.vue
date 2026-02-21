<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
      <button @click="fetchUsers"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors">
        Refresh
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between">
      <div>
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>
      <button @click="error = null" class="text-red-700 font-bold">&times;</button>
    </div>

    <!-- Success State -->
    <div v-if="successMsg"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex justify-between">
      <span class="block sm:inline">{{ successMsg }}</span>
      <button @click="successMsg = null" class="text-green-700 font-bold">&times;</button>
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
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id || user.email" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.email || user.username }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
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
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(user)"
                class="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded">
                Edit Role
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-10 bg-white shadow rounded-lg border border-gray-200">
      <p class="text-gray-500 text-lg">No users found.</p>
    </div>

    <!-- Edit Role Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal">
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Edit Role for {{ editingUser?.email || editingUser?.username }}
            </h3>
            <div class="mt-4">
              <label for="role" class="block text-sm font-medium text-gray-700">Select Role</label>
              <select id="role" v-model="selectedRole"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                <option value="ADMIN">ADMIN</option>
                <option value="DATA_USE">DATA_USE</option>
                <option value="DATA_PREP">DATA_PREP</option>
              </select>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="saveRole" :disabled="saving"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <button type="button" @click="closeModal" :disabled="saving"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminService } from '@/services/admin.service';
import { useRouter } from 'vue-router';

const users = ref([]);
const loading = ref(true);
const error = ref(null);
const successMsg = ref(null);
const router = useRouter();

// Modal state
const showModal = ref(false);
const editingUser = ref(null);
const selectedRole = ref('');
const saving = ref(false);

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  successMsg.value = null;
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

const openEditModal = (user) => {
  editingUser.value = user;
  selectedRole.value = user.role;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingUser.value = null;
  selectedRole.value = '';
};

const saveRole = async () => {
  if (!editingUser.value || !selectedRole.value) return;
  saving.value = true;
  error.value = null;
  successMsg.value = null;

  try {
    await adminService.updateUserRole(editingUser.value.id, selectedRole.value);
    successMsg.value = `User role updated successfully to ${selectedRole.value}`;
    closeModal();
    await fetchUsers(); // Refresh list to get truth from backend
  } catch (err) {
    if (err.response?.status === 401) {
      router.push('/login');
    } else if (err.response?.status === 403) {
      error.value = "Admin permission required";
    } else {
      error.value = err.response?.data?.message || err.message || 'Failed to update rule';
    }
    closeModal(); // Optionally keep it open on fail, but closing clears focus
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

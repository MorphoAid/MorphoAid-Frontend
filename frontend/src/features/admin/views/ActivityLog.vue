<template>
  <div class="p-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">System Activity Log</h1>
        <p class="text-sm text-gray-500 mt-1">Audit trail of all administrative and user actions</p>
      </div>
      <div class="flex items-center gap-3 w-full md:w-auto">
        <div class="relative flex-grow md:flex-grow-0">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search email or target..." 
            class="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#368998]/20 focus:border-[#368998] transition-all w-full md:w-64"
          />
        </div>
        <button @click="fetchActivities"
          class="bg-[#368998] hover:bg-[#2B6E7A] text-white px-4 py-2 rounded-xl shadow-md shadow-[#368998]/10 transition-all font-medium flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">refresh</span>
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Role:</span>
        <select v-model="filterRole" class="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#368998]">
          <option value="ALL">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="DATA_USE">DATA_USE</option>
          <option value="SYSTEM">SYSTEM</option>
        </select>
      </div>
      <div class="flex items-center gap-2 pl-4 border-l border-gray-100">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Status:</span>
        <select v-model="filterStatus" class="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#368998]">
          <option value="ALL">All Status</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
      <button 
        @click="resetFilters" 
        class="text-xs text-gray-400 hover:text-[#368998] font-medium transition-colors ml-auto"
      >
        Reset Filters
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20 bg-white shadow-sm rounded-2xl border border-gray-100 italic text-gray-400">
      <div class="w-8 h-8 border-3 border-gray-100 border-t-[#368998] rounded-full animate-spin mx-auto mb-4"></div>
      <p>Fetching activities...</p>
    </div>

    <!-- Activities Table -->
    <div v-else-if="filteredActivities.length > 0" class="bg-white shadow-xl shadow-gray-200/50 overflow-hidden rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-50">
          <thead class="bg-gray-50/50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">System Role</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Target</th>
              <th scope="col" class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-50">
            <tr v-for="activity in filteredActivities" :key="activity.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                <div class="flex flex-col">
                  <span>{{ formatDate(activity.timestamp) }}</span>
                  <span class="text-[10px] font-bold text-[#368998]">{{ formatTime(activity.timestamp) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-[10px] group-hover:bg-[#368998]/10 group-hover:text-[#368998] transition-colors">
                    {{ activity.userEmail.charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ activity.userEmail }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-0.5 inline-flex text-[9px] font-black rounded uppercase" :class="{
                  'bg-purple-50 text-purple-600 border border-purple-100': activity.userRole === 'ADMIN',
                  'bg-emerald-50 text-emerald-600 border border-emerald-100': activity.userRole === 'DATA_USE',
                  'bg-gray-50 text-gray-500 border border-gray-100': activity.userRole === 'SYSTEM',
                }">
                  {{ activity.userRole }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                {{ activity.action }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500 italic max-w-[200px] truncate" :title="activity.target">
                {{ activity.target }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="flex items-center gap-1.5 text-xs font-bold" :class="activity.status.toLowerCase() === 'success' ? 'text-emerald-600' : 'text-red-500'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="activity.status.toLowerCase() === 'success' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ activity.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-24 bg-white shadow-sm rounded-2xl border border-gray-100 animate-in fade-in duration-700">
      <span class="material-symbols-outlined text-gray-100 text-7xl mb-4">history_toggle_off</span>
      <p class="text-gray-400 font-medium">No system activities match your criteria.</p>
      <button @click="resetFilters" class="mt-4 text-[#368998] hover:underline text-sm font-bold">Clear all filters</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminService } from '@/services/admin.service';
import { useRouter } from 'vue-router';

const activities = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const filterRole = ref('ALL');
const filterStatus = ref('ALL');
const router = useRouter();

const fetchActivities = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await adminService.getActivities();
    activities.value = response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      router.push('/login');
    } else if (err.response?.status === 403) {
      error.value = "Admin permission required";
    } else {
      error.value = "Unable to load activity records. Please try again later.";
    }
  } finally {
    loading.value = false;
  }
};

const filteredActivities = computed(() => {
  return activities.value.filter(a => {
    const matchesSearch = 
      a.userEmail.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.target.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.action.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesRole = filterRole.value === 'ALL' || a.userRole === filterRole.value;
    const matchesStatus = filterStatus.value === 'ALL' || a.status === filterStatus.value;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
});

const resetFilters = () => {
  searchQuery.value = '';
  filterRole.value = 'ALL';
  filterStatus.value = 'ALL';
};

const formatDate = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString();
};

const formatTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

onMounted(() => {
  fetchActivities();
});
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
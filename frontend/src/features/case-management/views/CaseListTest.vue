<template>
    <div class="p-6 max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Case List Integration Test</h1>
            <div class="flex gap-4">
                <button @click="fetchCases"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors"
                    :disabled="loading">
                    {{ loading ? 'Refreshing...' : 'Refresh List' }}
                </button>
                <RouterLink to="/data-use/cases/new"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-colors flex items-center">
                    Upload New Case
                </RouterLink>
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong class="font-bold">Error: </strong>
            <span class="block sm:inline">{{ error }}</span>
        </div>

        <!-- Loading State -->
        <div v-if="loading && !cases.length" class="text-center py-10">
            <p class="text-gray-500 text-lg">Loading cases...</p>
        </div>

        <!-- Data Table -->
        <div v-else-if="cases.length > 0" class="overflow-x-auto bg-white rounded shadow">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient Code</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Technician ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created At</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="c in cases" :key="c.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ c.id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ c.patientCode }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ c.technicianId }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ c.location }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                :class="c.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                                {{ c.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new
                            Date(c.createdAt).toLocaleString() }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <RouterLink :to="`/data-use/cases/${c.id}`"
                                class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors">
                                View
                            </RouterLink>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Empty State -->
        <div v-else-if="!loading" class="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300">
            <p class="text-gray-500 text-lg">No cases found in the database.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const cases = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchCases = async () => {
    loading.value = true;
    error.value = null;

    // MOCKED FOR UI MODE - NO API CALL
    setTimeout(() => {
        cases.value = [
            { id: 101, patientCode: 'PT-001', technicianId: 'T-99', location: 'Clinic A', status: 'COMPLETED', createdAt: '2026-03-01T10:00:00Z' },
            { id: 102, patientCode: 'PT-002', technicianId: 'T-42', location: 'Hospital B', status: 'PENDING', createdAt: '2026-03-02T08:30:00Z' },
            { id: 103, patientCode: 'PT-003', technicianId: 'T-99', location: 'Clinic A', status: 'FAILED', createdAt: '2026-03-02T09:15:00Z' }
        ];
        loading.value = false;
    }, 500);
};

onMounted(() => {
    fetchCases();
});
</script>

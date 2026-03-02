<template>
    <div class="p-8 max-w-6xl mx-auto w-full">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
                <h1 class="text-3xl font-bold text-[#2E2E2E] mb-1">Cases</h1>
                <p class="text-[#5C5C5C] font-medium text-sm">Manage and review uploaded blood smears.</p>
            </div>
            <div class="flex gap-3">
                <button @click="fetchCases"
                    class="bg-white border border-gray-200 text-[#2E2E2E] hover:bg-gray-50 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
                    :disabled="loading">
                    <svg :class="{ 'animate-spin': loading }" class="w-4 h-4" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                        </path>
                    </svg>
                    {{ loading ? '...' : 'Refresh' }}
                </button>
                <RouterLink to="/data-use/cases/new"
                    class="bg-[#48B7CB] hover:bg-[#368998] text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    New Case
                </RouterLink>
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error"
            class="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg relative mb-6 shadow-sm">
            <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="block sm:inline">{{ error }}</span>
            </div>
        </div>

        <!-- Data Table Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">

            <!-- Loading Overlay -->
            <div v-if="loading && !cases.length"
                class="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                <svg class="animate-spin h-8 w-8 text-[#48B7CB] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <p class="text-[#5C5C5C] font-medium">Loading cases...</p>
            </div>

            <!-- Empty State -->
            <div v-if="!loading && cases.length === 0"
                class="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div class="w-16 h-16 bg-[#F8F8F8] rounded-full flex items-center justify-center mb-4 text-[#5C5C5C]">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-[#2E2E2E] mb-1">No Cases Found</h3>
                <p class="text-[#5C5C5C] mb-6 max-w-sm">There are currently no cases uploaded to this system. Upload a
                    new case to get started.</p>
                <RouterLink to="/data-use/cases/new"
                    class="text-[#48B7CB] font-medium hover:text-[#368998] transition-colors flex items-center gap-1">
                    Upload first case <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                </RouterLink>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto" v-show="cases.length > 0">
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="py-4 px-6 font-semibold text-[#5C5C5C]">Case ID</th>
                            <th class="py-4 px-6 font-semibold text-[#5C5C5C]">Upload Date</th>
                            <th class="py-4 px-6 font-semibold text-[#5C5C5C]">AI Summary</th>
                            <th class="py-4 px-6 font-semibold text-[#5C5C5C]">Status</th>
                            <th class="py-4 px-6 font-semibold text-[#5C5C5C]">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="c in cases" :key="c.id" class="hover:bg-gray-50/50 transition-colors">
                            <td class="py-4 px-6 font-medium text-[#2E2E2E]">CAS-0{{ c.id }}</td>
                            <td class="py-4 px-6 text-[#5C5C5C]">{{ formatDate(c.createdAt) }}</td>
                            <td class="py-4 px-6 text-[#5C5C5C]">
                                {{ getMockSummary(c.status) }}
                            </td>
                            <td class="py-4 px-6">
                                <StatusPill :status="c.status" :label="c.status" />
                            </td>
                            <td class="py-4 px-6">
                                <RouterLink :to="`/data-use/cases/${c.id}`"
                                    class="text-[#48B7CB] hover:text-[#2B6E7A] font-medium transition-colors">
                                    View
                                </RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatusPill from '@/components/datause/StatusPill.vue'
import { fetchCases as apiFetchCases } from '@/features/case-management/services/case.service'

const cases = ref([])
const loading = ref(false)
const error = ref(null)

const formatDate = (dateString) => {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getMockSummary = (status) => {
    if (status === 'COMPLETED') return 'P. falciparum detected'
    if (status === 'FAILED') return 'Image artifact detected. Unreadable.'
    if (status === 'PENDING') return 'Pending computational analysis'
    return 'Processing...'
}

const fetchCases = async () => {
    loading.value = true
    error.value = null

    try {
        const response = await apiFetchCases()
        // Map into UI table safely
        cases.value = (response.data || []).map(c => ({
            id: c.id,
            patientCode: c.patientCode || 'N/A',
            technicianId: c.technicianId || 'N/A',
            location: c.location || 'N/A',
            status: c.status || 'UNKNOWN',
            createdAt: c.createdAt || new Date().toISOString()
        }))
        // sort by newest
        cases.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (err) {
        console.error("Fetch cases error:", err)
        error.value = 'Failed to load cases: ' + (err.response?.data?.message || err.message)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchCases()
})
</script>

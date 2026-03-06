<template>
    <div class="p-8 max-w-6xl mx-auto w-full">
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-[#2E2E2E]">Case Details</h1>
            <button
                class="bg-[#48B7CB] hover:bg-[#368998] text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
                @click="$router.push('/data-use/cases/new')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                New Case
            </button>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Needs Review" :value="stats.needsReview.toString()" />
            <StatCard title="In Queue" :value="stats.inQueue.toString()" />
            <StatCard title="Completed" :value="stats.completed.toString()" />
            <StatCard title="Failed" :value="stats.failed.toString()" />
        </div>

        <!-- Attention Box -->
        <div v-if="stats.failed > 0" class="border-l-4 border-[#FF4C38] bg-[#FF4C38]/5 rounded-r-lg p-5 mb-8 shadow-sm">
            <div class="flex items-start gap-4">
                <div class="text-[#FF4C38] mt-0.5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                        </path>
                    </svg>
                </div>
                <div>
                    <h3 class="text-[#A92222] font-semibold text-lg mb-1">Attention Required</h3>
                    <p class="text-[#2E2E2E] text-sm">{{ stats.failed }} cases have failed automatic AI analysis and
                        require manual
                        technician review.</p>
                </div>
            </div>
        </div>

        <!-- Recent Cases Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h2 class="text-xl font-bold text-[#2E2E2E]">Recent Cases</h2>
                <button class="text-[#48B7CB] text-sm font-medium hover:text-[#368998] transition-colors"
                    @click="$router.push('/data-use/cases')">View All</button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="py-3 px-6 font-semibold text-[#5C5C5C]">Case ID</th>
                            <th class="py-3 px-6 font-semibold text-[#5C5C5C]">Upload Date</th>
                            <th class="py-3 px-6 font-semibold text-[#5C5C5C]">AI Summary</th>
                            <th class="py-3 px-6 font-semibold text-[#5C5C5C]">Status</th>
                            <th class="py-3 px-6 font-semibold text-[#5C5C5C]">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-if="loading && !recentCases.length">
                            <td colspan="5" class="py-8 text-center text-[#5C5C5C]">Loading cases...</td>
                        </tr>
                        <tr v-else-if="!recentCases.length">
                            <td colspan="5" class="py-8 text-center text-[#5C5C5C]">No cases found.</td>
                        </tr>
                        <tr v-for="caseItem in recentCases" :key="caseItem.id"
                            class="hover:bg-gray-50/50 transition-colors">
                            <td class="py-4 px-6 font-medium text-[#2E2E2E]">CAS-0{{ caseItem.id }}</td>
                            <td class="py-4 px-6 text-[#5C5C5C]">{{ formatDate(caseItem.createdAt) }}</td>
                            <td class="py-4 px-6 text-[#5C5C5C]">
                                {{ getSummary(caseItem) }}
                            </td>
                            <td class="py-4 px-6">
                                <StatusPill :status="caseItem.status" :label="caseItem.status" />
                            </td>
                            <td class="py-4 px-6">
                                <button @click="$router.push(`/data-use/cases/${caseItem.id}`)"
                                    class="text-[#48B7CB] hover:text-[#2B6E7A] font-medium transition-colors">
                                    View
                                </button>
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
import StatCard from '@/components/datause/StatCard.vue'
import StatusPill from '@/components/datause/StatusPill.vue'
import { fetchCases as apiFetchCases } from '@/features/case-management/services/case.service'

const recentCases = ref([])
const loading = ref(false)
const stats = ref({
    needsReview: 0,
    inQueue: 0,
    completed: 0,
    failed: 0
})

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getSummary = (c) => {
    if (c.analysisStatus === 'COMPLETED') return 'P. falciparum detected'
    if (c.analysisStatus === 'FAILED') return 'Image artifact detected. Unreadable.'
    if (c.analysisStatus === 'PENDING' || c.analysisStatus === 'PROCESSING') return 'Pending computational analysis'
    return 'Processing...'
}

const loadDashboardData = async () => {
    loading.value = true
    try {
        const response = await apiFetchCases()
        const allCases = response.data || []

        // Calculate Stats
        stats.value = allCases.reduce((acc, c) => {
            if (c.status === 'ANALYZED') acc.needsReview++

            if (c.analysisStatus === 'PENDING' || c.analysisStatus === 'PROCESSING') acc.inQueue++
            else if (c.analysisStatus === 'COMPLETED') acc.completed++
            else if (c.analysisStatus === 'FAILED') acc.failed++

            return acc
        }, { needsReview: 0, inQueue: 0, completed: 0, failed: 0 })

        // Sort and get recent
        const sorted = [...allCases].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        recentCases.value = sorted.slice(0, 5)
    } catch (err) {
        console.error("Dashboard load error:", err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadDashboardData()
})
</script>

<template>
    <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E] space-y-6">

        <!-- Header -->
        <div>
            <h1 class="text-2xl font-semibold text-[#368998]">Review Queue</h1>
            <p class="text-sm text-[#5C5C5C]">AI-analyzed cases awaiting review.</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-16">
            <svg class="w-8 h-8 animate-spin text-[#368998]" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4A10 10 0 002 12h2z" />
            </svg>
        </div>

        <!-- Error -->
        <div v-else-if="error"
            class="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
            <svg class="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
        </div>

        <template v-else>
            <!-- Filter bar -->
            <div class="flex flex-wrap gap-3 items-center">
                <input v-model="search" type="text" placeholder="Search by case ID..."
                    class="px-4 py-2 text-sm bg-white border border-[#368998]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48B7CB]/40 text-[#2E2E2E] placeholder-[#5C5C5C]/60 min-w-[200px]" />
                <select v-model="filterStatus"
                    class="px-3 py-2 text-sm bg-white border border-[#368998]/20 rounded-lg focus:outline-none text-[#2E2E2E]">
                    <option value="">All Statuses</option>
                    <option value="ANALYZED">Analyzed</option>
                    <option value="REVIEWED">Reviewed</option>
                </select>
                <span class="text-xs text-[#5C5C5C] ml-auto">{{ filtered.length }} records</span>
            </div>

            <!-- Queue list -->
            <div class="space-y-3">
                <div v-for="record in filtered" :key="record.caseId"
                    @click="$router.push('/lab/review/' + record.caseId)"
                    class="bg-white border border-[#368998]/20 rounded-xl p-4 flex items-center gap-5 cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 group">
                    <!-- Thumbnail placeholder -->
                    <div
                        class="w-16 h-16 shrink-0 rounded-lg bg-[#F8F8F8] border border-[#368998]/10 flex items-center justify-center overflow-hidden">
                        <svg class="w-8 h-8 text-[#C6E9EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                            <span class="font-mono text-sm font-medium text-[#368998]">#{{ record.caseId }}</span>
                            <!-- Source badge -->
                            <span :class="sourceBadge(record.source)"
                                class="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase">
                                {{ record.source }}
                            </span>
                            <!-- Case status badge -->
                            <span :class="statusBadge(record.caseStatus)"
                                class="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide">
                                {{ record.caseStatus }}
                            </span>
                        </div>
                        <p class="text-xs text-[#5C5C5C]">{{ formatDate(record.createdAt) }}</p>
                        <p v-if="record.parasiteStage" class="text-xs text-[#368998] mt-0.5 font-medium">
                            {{ record.parasiteStage }}
                            <span v-if="record.confidence" class="text-[#5C5C5C] font-normal">
                                ({{ (record.confidence * 100).toFixed(0) }}%)
                            </span>
                        </p>
                    </div>

                    <!-- Arrow -->
                    <svg class="w-4 h-4 text-[#368998]/40 group-hover:text-[#368998] transition-colors shrink-0"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>

                <p v-if="filtered.length === 0" class="text-center text-sm text-[#5C5C5C] italic py-10">
                    No records match the current filter.
                </p>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { listLabReviews } from '../services/lab.service.js'

const loading = ref(true)
const error = ref(null)
const records = ref([])
const search = ref('')
const filterStatus = ref('')

onMounted(async () => {
    try {
        const res = await listLabReviews()
        records.value = res.data
    } catch (err) {
        error.value = err?.response?.data?.message
            || err?.message
            || 'Failed to load review queue.'
    } finally {
        loading.value = false
    }
})

const filtered = computed(() => {
    return records.value.filter(r => {
        const matchSearch = !search.value
            || String(r.caseId).includes(search.value)
        const matchStatus = !filterStatus.value
            || r.caseStatus === filterStatus.value
        return matchSearch && matchStatus
    })
})

function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString()
}

function sourceBadge(source) {
    return source === 'CLINICAL'
        ? 'bg-[#368998]/10 text-[#2B6E7A]'
        : 'bg-[#C6E9EF]/60 text-[#2B6E7A]/80'
}

function statusBadge(status) {
    if (status === 'ANALYZED') return 'bg-[#407533]/10 text-[#407533]'
    if (status === 'REVIEWED') return 'bg-[#2B6E7A]/10 text-[#2B6E7A]'
    return 'bg-[#5C5C5C]/10 text-[#5C5C5C]'
}
</script>

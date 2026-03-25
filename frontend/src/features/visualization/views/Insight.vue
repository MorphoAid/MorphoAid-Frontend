<template>
    <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E]">
        <div class="max-w-6xl mx-auto space-y-6">

            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-semibold text-[#368998]">Insights Dashboard</h1>
                    <p class="text-sm text-[#5C5C5C]">Comprehensive analysis metrics and clinical trends.</p>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="card in summaryCards" :key="card.title" class="bg-white p-5 rounded-xl border border-[#368998]/10 shadow-sm flex flex-col gap-1 relative overflow-hidden group">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ card.title }}</span>
                        <span class="material-symbols-outlined text-[#368998]/40 group-hover:text-[#368998] transition-colors">{{ card.icon }}</span>
                    </div>
                    <div v-if="loadingSummary" class="h-8 w-16 bg-gray-50 animate-pulse rounded"></div>
                    <div v-else class="text-2xl font-bold text-[#2E2E2E]">{{ card.value }}{{ card.unit }}</div>
                    <div class="text-[10px] text-gray-400 font-medium">{{ card.subValue }}</div>
                </div>
            </div>

            <!-- Tab Navigation -->
            <div class="flex items-center gap-2 border-b border-[#368998]/10 pt-2">
                <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
                    'px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-t-lg transition-all relative -mb-px',
                    activeTab === tab.key
                        ? 'bg-white border-x border-t border-[#368998]/20 text-[#368998] shadow-[0_-2px_4px_rgba(0,0,0,0.02)]'
                        : 'text-[#9CA3AF] hover:text-[#368998] hover:bg-white/50'
                ]">
                    {{ tab.label }}
                    <div v-if="activeTab === tab.key" class="absolute bottom-0 left-0 w-full h-0.5 bg-[#368998]"></div>
                </button>
            </div>

            <!-- Tab Content -->
            <div class="bg-white rounded-xl lg:rounded-tl-none border border-[#368998]/20 shadow-sm overflow-hidden" style="min-height: 520px;">
                <TrendChart v-if="activeTab === 'trend'" />
                <Heatmap v-else-if="activeTab === 'heatmap'" />
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TrendChart from './TrendChart.vue'
import Heatmap from './Heatmap.vue'
import { visualizationService } from '../services/visualization.service'

const activeTab = ref('trend')
const loadingSummary = ref(true)
const summary = ref({
    totalAnalyses: 0,
    avgConfidence: 0,
    topStage: 'N/A',
    activeProvinces: 0
})

const tabs = [
    { key: 'trend', label: 'Case Trend' },
    { key: 'heatmap', label: 'AI Diagnostics' },
]

const summaryCards = computed(() => [
    { title: 'Total Analyses', value: summary.value.totalAnalyses, unit: '', icon: 'analytics', subValue: 'Completed cases' },
    { title: 'Avg Confidence', value: summary.value.avgConfidence, unit: '%', icon: 'verified', subValue: 'Model certainty' },
    { title: 'Top Stage', value: summary.value.topStage, unit: '', icon: 'science', subValue: 'Most frequent stage' },
    { title: 'Coverage', value: summary.value.activeProvinces, unit: '', icon: 'map', subValue: 'Active provinces' },
])

async function fetchSummary() {
    loadingSummary.value = true
    try {
        const data = await visualizationService.getSummary()
        summary.value = data
    } catch (e) {
        console.error("Failed to fetch summary", e);
        alert("Unable to load insight data. Please try again later.");
    } finally {
        setTimeout(() => { loadingSummary.value = false }, 300)
    }
}



onMounted(fetchSummary)
</script>

<style scoped>
@media print {
    div[class*="bg-[#F8F8F8]"] { background-color: white !important; }
    button, nav, .no-print, aside, header { display: none !important; }
    
    body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    
    .max-w-6xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
    .bg-white { border: 1px solid #eee !important; }
    
    /* Ensure the main content takes full width by overriding AppShell's ml-64 */
    :global(main) { 
        margin-left: 0 !important; 
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
    }
    
    /* Ensure the tab content is visible and takes full width */
    .lg\:rounded-tl-none { border-radius: 0.75rem !important; }
}
</style>

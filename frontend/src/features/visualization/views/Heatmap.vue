<template>
    <div class="w-full h-full flex flex-col gap-4 p-4">
        <div>
            <h2 class="text-lg font-semibold text-[#2E2E2E]">AI Model Diagnostics</h2>
            <p class="text-sm text-[#5C5C5C]">Confidence distribution per parasite stage.</p>
        </div>

        <div class="bg-white rounded-xl border border-[#368998]/20 p-6 flex-1 min-h-[350px] flex flex-col items-center justify-center relative">
            <div v-if="loading" class="animate-pulse flex flex-col items-center gap-2">
                <div class="w-10 h-10 border-4 border-[#368998]/20 border-t-[#368998] rounded-full animate-spin"></div>
                <p class="text-xs text-gray-400">Loading diagnostics data...</p>
            </div>

            <div v-else-if="rawData.length === 0" class="flex flex-col items-center gap-2 text-center">
                <span class="material-symbols-outlined text-gray-300 text-4xl">grid_view</span>
                <p class="text-sm text-gray-400">No AI analysis data found.</p>
            </div>

            <div v-else class="w-full flex flex-col h-full">
                <div class="grid grid-cols-[100px_repeat(5,1fr)] gap-2 flex-1">
                    <div></div>
                    <div v-for="stage in stages" :key="stage" class="text-[9px] font-bold text-gray-400 text-center uppercase tracking-wider self-end pb-1">
                        {{ stage }}
                    </div>

                    <template v-for="range in confidenceRanges" :key="range">
                        <div class="text-[10px] font-bold text-gray-400 flex items-center pr-3 text-right justify-end border-r border-gray-100 italic">
                            {{ range }}
                        </div>
                        <div v-for="stage in stages" :key="stage + range" 
                             class="rounded-lg aspect-square flex items-center justify-center text-[10px] font-bold cursor-default relative shadow-sm border group transition-all hover:scale-105"
                             :style="getCellStyle(stage, range)">
                             <span v-if="getCount(stage, range) > 0"
                                   class="z-10 text-center px-0.5 leading-none transition-opacity opacity-0 group-hover:opacity-100 print:opacity-100" 
                                   :style="{ color: getTextColor(stage, range) }">
                                {{ getCount(stage, range) }}
                             </span>
                        </div>
                    </template>
                </div>

                <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                    <div class="flex items-center gap-3 text-xs text-[#5C5C5C]">
                        <span class="font-medium">Density Score:</span>
                        <div class="flex gap-1">
                            <div v-for="level in legendLevels" :key="level.label"
                                :style="{ backgroundColor: level.color }" class="w-8 h-3 rounded-sm">
                            </div>
                        </div>
                        <span class="text-[10px] text-gray-400 italic">(Count proportional to max)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { visualizationService } from '../services/visualization.service'

const rawData = ref([])
const loading = ref(true)

const stages = ['Ring', 'Schiz', 'Troph', 'Drug A', 'Drug B']
const confidenceRanges = ['90% - 100%', '80% - 89%', '70% - 79%', 'Below 70%']

const maxCount = computed(() => {
    if (rawData.value.length === 0) return 0
    return Math.max(...rawData.value.map(d => d.count), 1)
})

function getCount(stage, range) {
    const entry = rawData.value.find(d => d.stage === stage && d.confidenceRange === range)
    return entry ? entry.count : 0
}

function getCellStyle(stage, range) {
    const count = getCount(stage, range)
    if (count === 0) return { backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }
    
    const colors = ['#E0F2F1', '#4DB6AC', '#00897B', '#00695C', '#004D40']
    const index = Math.min(Math.floor((count / maxCount.value) * colors.length), colors.length - 1)
    const activeColor = colors[index]
    
    return {
        backgroundColor: activeColor,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: `1px solid ${activeColor}`,
        fontWeight: 'bold'
    }
}

function getTextColor(stage, range) {
    const count = getCount(stage, range)
    if (count === 0) return '#9CA3AF'
    const index = Math.min(Math.floor((count / maxCount.value) * 5), 4)
    return index > 1 ? 'white' : '#2E2E2E'
}

const legendLevels = [
    { label: 'Low', color: '#E0F2F1' },
    { label: '', color: '#4DB6AC' },
    { label: 'Mid', color: '#00897B' },
    { label: '', color: '#00695C' },
    { label: 'High', color: '#004D40' },
]

onMounted(async () => {
    try {
        const res = await visualizationService.getAiConfidenceData()
        rawData.value = res || []
    } catch (e) {
        console.error("Failed to fetch diag data", e)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
@media print {
    .print\:opacity-100 { opacity: 1 !important; }
}
</style>

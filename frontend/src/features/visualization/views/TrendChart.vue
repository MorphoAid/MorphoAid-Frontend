<template>
    <div class="w-full h-full flex flex-col gap-4 p-4">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 class="text-lg font-semibold text-[#2E2E2E]">Case Trend Analysis</h2>
                <p class="text-sm text-[#5C5C5C]">Track diagnostic volume and trends over time.</p>
            </div>

            <!-- Controls -->
            <div class="flex flex-wrap items-center gap-3">
                <!-- Grouping -->
                <div class="flex bg-gray-100 p-1 rounded-lg">
                    <button v-for="opt in groupOptions" :key="opt.val"
                        @click="selectedGroupBy = opt.val"
                        :class="['px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all', 
                                selectedGroupBy === opt.val ? 'bg-white text-[#368998] shadow-sm' : 'text-gray-400 hover:text-gray-600']">
                        {{ opt.label }}
                    </button>
                </div>
                <!-- Range -->
                <div class="flex bg-gray-100 p-1 rounded-lg">
                    <button v-for="opt in rangeOptions" :key="opt.val"
                        @click="selectedDays = opt.val"
                        :class="['px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all', 
                                selectedDays === opt.val ? 'bg-white text-[#368998] shadow-sm' : 'text-gray-400 hover:text-gray-600']">
                        {{ opt.label }}
                    </button>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl border border-[#368998]/20 p-6 flex-1 min-h-[350px] flex flex-col items-center justify-center relative">
            <!-- Loading Overlay -->
            <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2">
                <div class="w-10 h-10 border-4 border-[#368998]/20 border-t-[#368998] rounded-full animate-spin"></div>
                <p class="text-xs text-[#368998] font-medium">Updating data...</p>
            </div>

            <!-- Empty State -->
            <div v-if="!loading && rawData.length === 0" class="flex flex-col items-center gap-2 text-center">
                <span class="material-symbols-outlined text-gray-300 text-4xl">analytics</span>
                <p class="text-sm text-gray-400 font-medium">No results found for this selection.</p>
                <p class="text-xs text-gray-300">Try adjusting your filters or time range.</p>
            </div>

            <!-- SVG Line Chart -->
            <div v-else-if="rawData.length > 0" class="w-full h-full flex flex-col">
                <div class="flex-1 relative mt-4">
                    <svg :viewBox="`0 0 ${svgW} ${svgH}`" preserveAspectRatio="none" class="w-full h-full min-h-[260px]">
                        <!-- Grid lines -->
                        <line v-for="(y, i) in yGridLines" :key="'grid-' + i" :x1="padding" :y1="y" :x2="svgW - padding"
                            :y2="y" stroke="#F9FAFB" stroke-width="1" />
                        
                        <!-- Y axis labels -->
                        <text v-for="(y, i) in yGridLines" :key="'ylabel-' + i" :x="padding - 15" :y="y + 4"
                            text-anchor="end" class="text-[10px] font-bold" fill="#D1D5DB">{{ yLabelValues[i] }}</text>

                        <!-- Area fill -->
                        <polygon v-if="points.length > 1" :points="areaPoints" fill="#368998" fill-opacity="0.05" />

                        <!-- Line path -->
                        <polyline v-if="points.length > 1" :points="linePoints" fill="none" stroke="#368998" stroke-width="3"
                            stroke-linejoin="round" stroke-linecap="round" />

                        <!-- X axis labels (thinned out & rotated) -->
                        <text v-for="(pt, i) in points" :key="'xlabel-' + i" 
                            v-show="shouldShowLabel(i)"
                            :x="pt.x" :y="svgH - 10" text-anchor="middle"
                            class="text-[10px] font-bold" fill="#9CA3AF"
                            :transform="`rotate(-20, ${pt.x}, ${svgH - 10})`">
                            {{ displayData[i]?.label }}
                        </text>

                        <!-- Data points -->
                        <circle v-for="(pt, i) in points" :key="'pt-' + i" :cx="pt.x" :cy="pt.y" r="5" fill="#368998"
                            stroke="white" stroke-width="2" class="cursor-pointer hover:r-[7px] transition-all"
                            @mouseover="hoveredIndex = i" @mouseleave="hoveredIndex = null">
                            <title>{{ displayData[i].label }}: {{ displayData[i].value }} cases</title>
                        </circle>

                        <!-- Tooltip Overlay (SVG internal) -->
                        <g v-if="hoveredIndex !== null" :transform="`translate(${points[hoveredIndex].x}, ${points[hoveredIndex].y - 35})`" class="pointer-events-none">
                             <rect x="-25" y="-22" width="50" height="22" rx="6" fill="#1F2937" />
                             <text x="0" y="-7" text-anchor="middle" fill="white" font-size="11" font-weight="900">{{ displayData[hoveredIndex].value }}</text>
                             <!-- Tail -->
                             <path d="M-5 0 L0 5 L5 0 Z" fill="#1F2937" />
                        </g>
                    </svg>
                </div>

                <!-- Legend & Summary -->
                <div class="flex items-center justify-between mt-8 pt-4 border-t border-gray-50">
                    <div class="flex items-center gap-3 text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                        <span class="w-4 h-1 bg-[#368998] rounded-full"></span>
                        <span>Completed AI Analysis</span>
                    </div>
                    <div class="text-[10px] text-gray-400 italic">
                        Avg: <span class="font-bold text-[#368998]">{{ avgCount }}</span> / {{ selectedGroupBy }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { visualizationService } from '../services/visualization.service'

const rawData = ref([])
const loading = ref(true)
const hoveredIndex = ref(null)

const selectedDays = ref(30)
const selectedGroupBy = ref('day')

const rangeOptions = [
    { label: '7D', val: 7 },
    { label: '30D', val: 30 },
    { label: '90D', val: 90 },
    { label: 'All', val: 0 },
]

const groupOptions = [
    { label: 'Daily', val: 'day' },
    { label: 'Weekly', val: 'week' },
    { label: 'Monthly', val: 'month' },
]

const displayData = computed(() => {
    return rawData.value.map(d => ({
        label: formatKey(d.date),
        value: d.count
    }))
})

function formatKey(key) {
    if (selectedGroupBy.value === 'month') {
        const [y, m] = key.split('-')
        const date = new Date(y, m - 1)
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }
    if (selectedGroupBy.value === 'week') {
        return key.replace(/.*W/, 'Wk ')
    }
    // Daily
    const date = new Date(key)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function shouldShowLabel(index) {
    const total = displayData.value.length
    if (total <= 12) return true
    if (total <= 25) return index % 2 === 0
    if (total <= 50) return index % 5 === 0
    return index % 10 === 0
}

const svgW = 1000
const svgH = 350
const padding = 70

const maxVal = computed(() => {
    const vals = displayData.value.map(d => d.value)
    const m = Math.max(...vals, 0)
    return Math.ceil((m || 10) * 1.25) // 25% overhead
})

const points = computed(() => {
    if (displayData.value.length === 0) return []
    if (displayData.value.length === 1) {
         return [{ x: svgW / 2, y: svgH / 2 }]
    }
    return displayData.value.map((d, i) => ({
        x: padding + (i / (displayData.value.length - 1)) * (svgW - padding * 2),
        y: (svgH - padding - 40) - (d.value / maxVal.value) * (svgH - padding * 2),
    }))
})

const linePoints = computed(() =>
    points.value.map(p => `${p.x},${p.y}`).join(' ')
)

const areaPoints = computed(() => {
    if (points.value.length < 2) return ''
    const bottom = svgH - padding - 40
    const start = `${points.value[0].x},${bottom}`
    const end = `${points.value[points.value.length - 1].x},${bottom}`
    return `${start} ${linePoints.value} ${end}`
})

const yGridCount = 5
const yGridLines = computed(() =>
    Array.from({ length: yGridCount + 1 }, (_, i) =>
        (svgH - padding - 40) - (i / yGridCount) * (svgH - padding * 2)
    )
)
const yLabelValues = computed(() =>
    Array.from({ length: yGridCount + 1 }, (_, i) =>
        Math.round((i / yGridCount) * maxVal.value)
    )
).value.reverse()

const avgCount = computed(() => {
    if (rawData.value.length === 0) return 0
    const total = rawData.value.reduce((acc, d) => acc + d.count, 0)
    return (total / rawData.value.length).toFixed(1)
})

async function fetchData() {
    loading.value = true
    try {
        const res = await visualizationService.getTrendData(selectedDays.value, selectedGroupBy.value)
        rawData.value = res || []
    } catch (e) {
        console.error("Failed to fetch trend", e)
    } finally {
        // Debounce loading slightly for smooth transition
        setTimeout(() => { loading.value = false }, 200)
    }
}

watch([selectedDays, selectedGroupBy], fetchData)
onMounted(fetchData)
</script>

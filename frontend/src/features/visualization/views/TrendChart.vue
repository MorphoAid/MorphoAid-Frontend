<template>
    <div class="w-full h-full flex flex-col gap-4 p-4">
        <div>
            <h2 class="text-lg font-semibold text-[#2E2E2E]">Case Trend Over Time</h2>
            <p class="text-sm text-[#5C5C5C]">Monthly AI analysis results — no chart libraries used.</p>
        </div>

        <div class="bg-white rounded-xl border border-[#368998]/20 p-6 flex-1">
            <!-- SVG Line Chart (pure, no libraries) -->
            <div class="overflow-x-auto">
                <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="w-full" :style="{ minHeight: '200px' }">
                    <!-- Grid lines -->
                    <line v-for="(y, i) in yGridLines" :key="'grid-' + i" :x1="padding" :y1="y" :x2="svgW - padding"
                        :y2="y" stroke="#E5E7EB" stroke-width="1" />
                    <!-- Y axis labels -->
                    <text v-for="(y, i) in yGridLines" :key="'ylabel-' + i" :x="padding - 8" :y="y + 4"
                        text-anchor="end" class="text-xs" font-size="11" fill="#9CA3AF">{{ yLabelValues[i] }}</text>

                    <!-- Line path -->
                    <polyline :points="linePoints" fill="none" stroke="#368998" stroke-width="2.5"
                        stroke-linejoin="round" stroke-linecap="round" />

                    <!-- Area fill -->
                    <polygon :points="areaPoints" fill="#368998" fill-opacity="0.08" />

                    <!-- Data points -->
                    <circle v-for="(pt, i) in points" :key="'pt-' + i" :cx="pt.x" :cy="pt.y" r="4" fill="#368998"
                        stroke="white" stroke-width="2" />

                    <!-- X axis labels -->
                    <text v-for="(pt, i) in points" :key="'xlabel-' + i" :x="pt.x" :y="svgH - 8" text-anchor="middle"
                        font-size="11" fill="#9CA3AF">{{ months[i] }}</text>
                </svg>
            </div>

            <!-- Legend -->
            <div class="flex items-center gap-2 mt-2 text-xs text-[#5C5C5C]">
                <span class="w-6 h-0.5 bg-[#368998] inline-block rounded"></span>
                <span>AI Analyses Completed</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
const data = [12, 24, 18, 38, 30, 52, 45, 60]

const svgW = 600
const svgH = 260
const padding = 48

const maxVal = Math.max(...data)
const minVal = 0

const points = computed(() =>
    data.map((v, i) => ({
        x: padding + (i / (data.length - 1)) * (svgW - padding * 2),
        y: padding + ((maxVal - v) / (maxVal - minVal)) * (svgH - padding * 2 - 20),
    }))
)

const linePoints = computed(() =>
    points.value.map(p => `${p.x},${p.y}`).join(' ')
)

const areaPoints = computed(() => {
    const bottom = svgH - padding - 20
    const start = `${points.value[0].x},${bottom}`
    const end = `${points.value[points.value.length - 1].x},${bottom}`
    return `${start} ${linePoints.value} ${end}`
})

const yGridCount = 4
const yGridLines = computed(() =>
    Array.from({ length: yGridCount + 1 }, (_, i) =>
        padding + (i / yGridCount) * (svgH - padding * 2 - 20)
    )
)
const yLabelValues = computed(() =>
    Array.from({ length: yGridCount + 1 }, (_, i) =>
        Math.round(maxVal - (i / yGridCount) * maxVal)
    )
)
</script>

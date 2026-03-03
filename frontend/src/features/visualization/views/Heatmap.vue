<template>
    <div class="w-full h-full flex flex-col gap-4 p-4">
        <div>
            <h2 class="text-lg font-semibold text-[#2E2E2E]">Case Intensity Heatmap</h2>
            <p class="text-sm text-[#5C5C5C]">Distribution of detected abnormalities across uploaded cases.</p>
        </div>

        <!-- Mock Heatmap Grid -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-6 flex-1">
            <div class="grid grid-cols-10 gap-1 h-full min-h-[240px]">
                <div v-for="(cell, i) in heatCells" :key="i"
                    :style="{ backgroundColor: cell.color, opacity: cell.opacity }"
                    :title="`Cell ${i + 1}: ${cell.value} cases`"
                    class="rounded-sm cursor-pointer hover:scale-105 transition-transform"></div>
            </div>
            <div class="flex items-center gap-3 mt-4 text-xs text-[#5C5C5C]">
                <span>Low</span>
                <div class="flex gap-1">
                    <div v-for="level in legendLevels" :key="level.label"
                        :style="{ backgroundColor: '#368998', opacity: level.opacity }" class="w-6 h-4 rounded-sm">
                    </div>
                </div>
                <span>High</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const heatCells = computed(() => {
    return Array.from({ length: 80 }, (_, i) => {
        const value = Math.floor(Math.random() * 100)
        return {
            value,
            color: '#368998',
            opacity: (value / 100).toFixed(2)
        }
    })
})

const legendLevels = [
    { label: '20%', opacity: 0.2 },
    { label: '40%', opacity: 0.4 },
    { label: '60%', opacity: 0.6 },
    { label: '80%', opacity: 0.8 },
    { label: '100%', opacity: 1.0 },
]
</script>

<template>
    <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E]">
        <div class="max-w-6xl mx-auto space-y-6">

            <!-- Header -->
            <div>
                <h1 class="text-2xl font-semibold text-[#368998]">Insights</h1>
                <p class="text-sm text-[#5C5C5C]">Visualization of case data and geographic distribution.</p>
            </div>

            <!-- Tab Navigation -->
            <div class="flex gap-2 border-b border-[#368998]/10">
                <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
                    'px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors -mb-px',
                    activeTab === tab.key
                        ? 'bg-white border border-b-white border-[#368998]/20 text-[#368998]'
                        : 'text-[#5C5C5C] hover:text-[#368998]'
                ]">
                    {{ tab.label }}
                </button>
            </div>

            <!-- Tab Content -->
            <div class="bg-white rounded-xl border border-[#368998]/20 overflow-hidden" style="min-height: 480px;">
                <ThailandHeatmap v-if="activeTab === 'thailand'" />
                <TrendChart v-else-if="activeTab === 'trend'" />
                <Heatmap v-else-if="activeTab === 'heatmap'" />
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ThailandHeatmap from './ThailandHeatmap.vue'
import TrendChart from './TrendChart.vue'
import Heatmap from './Heatmap.vue'

const tabs = [
    { key: 'thailand', label: 'Thailand Heatmap' },
    { key: 'trend', label: 'Trend Chart' },
    { key: 'heatmap', label: 'Case Heatmap' },
]

const activeTab = ref('thailand')
</script>

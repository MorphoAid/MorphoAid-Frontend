<template>
  <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E] space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-[#368998]">Data Prep Dashboard</h1>
      <p class="text-sm text-[#5C5C5C]">Monitor dataset quality and geographic distribution.</p>
    </div>

    <!-- Top Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        class="bg-white rounded-xl border border-[#368998]/20 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
        <p class="text-sm text-[#5C5C5C] mb-1">Total Datasets</p>
        <p class="text-3xl font-semibold">128</p>
        <p class="text-xs text-[#407533] mt-1">+4 this week</p>
      </div>
      <div
        class="bg-white rounded-xl border border-[#368998]/20 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
        <p class="text-sm text-[#5C5C5C] mb-1">Processing Queue</p>
        <p class="text-3xl font-semibold">6</p>
        <p class="text-xs text-[#FF4C38] mt-1">2 pending validation</p>
      </div>
      <div
        class="bg-white rounded-xl border border-[#368998]/20 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
        <p class="text-sm text-[#5C5C5C] mb-1">Flagged Entries</p>
        <p class="text-3xl font-semibold">14</p>
        <p class="text-xs text-[#A92222] mt-1">Requires review</p>
      </div>
    </div>

    <!-- Section: Data Quality Overview -->
    <div>
      <h2 class="text-lg font-semibold text-[#2E2E2E] mb-4">Data Quality Overview</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Thailand Heatmap -->
        <div class="bg-white rounded-xl border border-[#368998]/20 overflow-hidden" style="height: 400px;">
          <div class="px-5 pt-4 pb-2 border-b border-[#368998]/10">
            <h3 class="text-sm font-medium text-[#368998]">Geographic Distribution</h3>
          </div>
          <div class="h-[340px] overflow-hidden">
            <ThailandHeatmap />
          </div>
        </div>

        <!-- Trend Chart -->
        <div class="bg-white rounded-xl border border-[#368998]/20 overflow-hidden" style="height: 400px;">
          <div class="px-5 pt-4 pb-2 border-b border-[#368998]/10">
            <h3 class="text-sm font-medium text-[#368998]">Upload Trends</h3>
          </div>
          <div class="h-[340px] overflow-hidden flex items-center">
            <TrendChart />
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import ThailandHeatmap from '@/features/visualization/views/ThailandHeatmap.vue'
import TrendChart from '@/features/visualization/views/TrendChart.vue'
</script>

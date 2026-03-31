<template>
  <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E] space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-semibold text-[#368998]">Dashboard</h1>
      <p class="text-sm text-[#5C5C5C]">Overview of submitted images and AI status.</p>
    </div>

    <!-- Read-Only Notice -->
    <div class="flex items-start gap-3 bg-[#C6E9EF]/30 border border-[#368998]/20 rounded-xl px-5 py-4">
      <svg class="w-5 h-5 text-[#368998] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm text-[#2B6E7A]">
        This module is <strong>read-only</strong>. Training is handled externally by MORU.
      </p>
    </div>

    <!-- Top Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in metrics" :key="card.label"
        class="bg-white rounded-xl border border-[#368998]/20 p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
        <p class="text-sm text-[#5C5C5C] mb-1">{{ card.label }}</p>
        <p class="text-3xl font-semibold text-[#2E2E2E]">{{ card.value }}</p>
        <p :class="card.trendClass" class="text-xs mt-1">{{ card.trend }}</p>
      </div>
    </div>

    <!-- Recent Images Table -->
    <div class="bg-white rounded-xl border border-[#368998]/20 overflow-hidden">
      <div class="px-6 py-4 border-b border-[#368998]/10">
        <h2 class="text-base font-medium text-[#368998]">Recent Images</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-[#F8F8F8] text-[#5C5C5C] border-b border-[#368998]/10">
            <tr>
              <th class="py-3 px-6 font-medium">Case ID</th>
              <th class="py-3 px-6 font-medium">Uploaded</th>
              <th class="py-3 px-6 font-medium">AI Status</th>
              <th class="py-3 px-6 font-medium">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#368998]/10 text-[#2E2E2E]">
            <tr v-for="row in recentImages" :key="row.id" class="hover:bg-[#F8F8F8]/50 transition-colors">
              <td class="py-3 px-6 font-mono text-xs text-[#368998]">#{{ row.id }}</td>
              <td class="py-3 px-6 text-[#5C5C5C]">{{ row.uploaded }}</td>
              <td class="py-3 px-6">
                <span :class="statusStyle(row.status)" class="px-2 py-0.5 rounded text-xs font-medium">
                  {{ row.status }}
                </span>
              </td>
              <td class="py-3 px-6">
                <button @click="$router.push('/dataprep/images/' + row.id)"
                  class="text-xs font-medium text-[#368998] hover:text-[#2B6E7A] transition-colors">
                  View →
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
import { useRouter } from 'vue-router'

const metrics = [
  { label: 'New Images Today', value: 14, trend: '+3 since yesterday', trendClass: 'text-[#407533]' },
  { label: 'Pending AI Results', value: 7, trend: 'Awaiting processing', trendClass: 'text-[#FF4C38]' },
  { label: 'Reviewed (7 days)', value: 83, trend: 'Stable', trendClass: 'text-[#5C5C5C]' },
  { label: 'Failed AI Jobs', value: 2, trend: 'Requires attention', trendClass: 'text-[#A92222]' },
]

const recentImages = [
  { id: '1042', uploaded: '03 Mar 2026, 14:22', status: 'Completed' },
  { id: '1041', uploaded: '03 Mar 2026, 11:05', status: 'Pending' },
  { id: '1040', uploaded: '03 Mar 2026, 09:48', status: 'Completed' },
  { id: '1039', uploaded: '02 Mar 2026, 16:30', status: 'Failed' },
  { id: '1038', uploaded: '02 Mar 2026, 14:10', status: 'Completed' },
]

function statusStyle(status) {
  if (status === 'Completed') return 'bg-[#407533]/10 text-[#407533]'
  if (status === 'Pending') return 'bg-[#FF4C38]/10 text-[#FF4C38]'
  return 'bg-[#A92222]/10 text-[#A92222]'
}
</script>

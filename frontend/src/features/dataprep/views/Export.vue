<template>
    <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E] space-y-6">

        <!-- Header -->
        <div>
            <h1 class="text-2xl font-semibold text-[#368998]">Export</h1>
            <p class="text-sm text-[#5C5C5C]">Download reviewed datasets for external use.</p>
        </div>

        <!-- Notice -->
        <div class="flex items-start gap-3 bg-[#C6E9EF]/30 border border-[#368998]/20 rounded-xl px-5 py-4">
            <svg class="w-5 h-5 text-[#368998] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-[#2B6E7A]">
                Export functionality is <strong>read-only</strong>. Data generation is handled externally by MORU.
            </p>
        </div>

        <!-- Export Options -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-6 space-y-4">
            <h2 class="text-base font-medium text-[#368998] border-b border-[#368998]/10 pb-3">Available Exports</h2>
            <div class="space-y-3">
                <div v-for="item in exportOptions" :key="item.label"
                    class="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-lg border border-[#368998]/10">
                    <div>
                        <p class="text-sm font-medium text-[#2E2E2E]">{{ item.label }}</p>
                        <p class="text-xs text-[#5C5C5C] mt-0.5">{{ item.description }}</p>
                    </div>
                    <button disabled
                        class="px-4 py-2 text-sm font-medium text-white bg-[#368998]/40 rounded-lg cursor-not-allowed">
                        Export (coming soon)
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
const exportOptions = [
    { label: 'Reviewed Images (CSV)', description: 'Export all reviewed image metadata as CSV.' },
    { label: 'AI Results Summary', description: 'Export AI analysis results for reviewed cases.' },
    { label: 'Full Dataset (ZIP)', description: 'Download images + metadata as a ZIP archive.' },
]
</script>

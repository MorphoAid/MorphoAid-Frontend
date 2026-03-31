<template>
    <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E] space-y-6">

        <!-- Header -->
        <div>
            <h1 class="text-2xl font-semibold text-[#368998]">Export</h1>
            <p class="text-sm text-[#5C5C5C]">Generate a dataset package for external annotation pipeline.</p>
        </div>

        <!-- Notice -->
        <div class="flex items-start gap-3 bg-[#C6E9EF]/30 border border-[#368998]/20 rounded-xl px-5 py-4">
            <svg class="w-5 h-5 text-[#368998] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-[#2B6E7A]">
                Export includes all <strong>ANALYZED</strong> and <strong>REVIEWED</strong> cases.
                The package is consumed externally by MORU's training pipeline.
            </p>
        </div>

        <!-- Export panel -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-6 space-y-6">
            <h2 class="text-base font-medium text-[#368998] border-b border-[#368998]/10 pb-3">
                Generate Export Package
            </h2>

            <!-- Package structure info -->
            <div class="bg-[#F8F8F8] rounded-lg border border-[#368998]/10 p-4 text-sm text-[#5C5C5C] space-y-1">
                <p class="font-medium text-[#2E2E2E] mb-2">Package contents</p>
                <p>📁 <code class="text-[#368998]">images/</code> — analyzed image files
                    (<code class="text-[#368998]">images/&lt;caseId&gt;_&lt;imageId&gt;.jpg</code>)
                </p>
                <p>📄 <code class="text-[#368998]">labels.csv</code> — classification results
                    (case_id, source, parasite_stage, confidence, drug_exposure, drug_type)</p>
            </div>

            <!-- Generate button -->
            <div class="flex items-center gap-4 flex-wrap">
                <button @click="handleExport" :disabled="exporting"
                    class="flex items-center gap-2 px-6 py-2.5 bg-[#368998] hover:bg-[#2B6E7A] disabled:bg-[#368998]/40 text-white text-sm font-medium rounded-lg transition-colors">
                    <!-- Spinner when loading -->
                    <svg v-if="exporting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4A10 10 0 002 12h2z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {{ exporting ? 'Generating…' : 'Generate export.zip' }}
                </button>

                <!-- Done state -->
                <transition name="fade">
                    <div v-if="done" class="flex items-center gap-2 text-sm text-[#407533]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        export.zip downloaded successfully
                    </div>
                </transition>
            </div>

            <!-- Progress indicator -->
            <div v-if="exporting" class="space-y-1">
                <div class="w-full h-1.5 bg-[#C6E9EF]/40 rounded-full overflow-hidden">
                    <div class="h-full bg-[#368998] rounded-full animate-pulse" style="width: 70%"></div>
                </div>
                <p class="text-xs text-[#5C5C5C]">Requesting export from server… this may take a moment.</p>
            </div>

            <!-- Error state -->
            <transition name="fade">
                <div v-if="exportError"
                    class="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ exportError }}
                </div>
            </transition>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportLabZip } from '../services/lab.service.js'

const exporting = ref(false)
const done = ref(false)
const exportError = ref(null)

async function handleExport() {
    if (exporting.value) return
    done.value = false
    exportError.value = null
    exporting.value = true

    try {
        const res = await exportLabZip()  // POST /lab/export, responseType:'blob'

        // Create a temporary <a> to trigger browser download
        const blob = new Blob([res.data], { type: 'application/zip' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'export.zip'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        done.value = true
    } catch (err) {
        exportError.value = err?.response?.data?.message
            || err?.message
            || 'Export failed. Please try again.'
    } finally {
        exporting.value = false
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<template>
    <div class="p-8 max-w-5xl mx-auto w-full">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
                <h1 class="text-3xl font-bold text-[#2E2E2E] mb-1">Case Details</h1>
                <p class="text-[#5C5C5C] font-medium text-sm">Case ID: <span class="text-[#2E2E2E]">{{ caseId }}</span>
                </p>
            </div>
            <button @click="$router.push('/data-use/cases')"
                class="text-[#5C5C5C] hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">arrow_back</span>
                Back to Cases
            </button>
        </div>

        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <span class="material-symbols-outlined">error</span>
            {{ error }}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Section 1: Uploaded Image -->
            <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <h2 class="text-[#2E2E2E] font-semibold text-lg mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-[#48B7CB]">image</span>
                    Uploaded Smear Image
                </h2>
                <div
                    class="flex-1 min-h-[400px] bg-[#F8F8F8] border border-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden group">
                    <template v-if="imageUrl">
                        <img :src="imageUrl" class="max-w-full max-h-[600px] object-contain z-10 transition-transform duration-500 group-hover:scale-[1.02]" />
                    </template>
                    <template v-else>
                        <div class="flex flex-col items-center gap-3">
                            <span v-if="loadingImage" class="animate-spin material-symbols-outlined text-3xl text-gray-300">sync</span>
                            <span v-else class="material-symbols-outlined text-4xl text-gray-200">image_not_supported</span>
                            <p class="text-[#5C5C5C] font-medium z-10">{{ loadingImage ? 'Loading Image...' : 'No image available' }}</p>
                        </div>
                    </template>
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <!-- Section 2: AI Summary -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <!-- Loading Progress Overlay for AI -->
                    <div v-if="isAnalyzing" class="absolute top-0 left-0 w-full h-1 bg-[#48B7CB]/20">
                        <div class="h-full bg-[#48B7CB] animate-progress-indeterminate"></div>
                    </div>

                    <h2 class="text-[#2E2E2E] font-semibold text-lg mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-[#48B7CB]">neurology</span>
                        AI Assessment
                    </h2>

                    <div class="space-y-5">
                        <div>
                            <p class="text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Analysis Status</p>
                            <div class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold gap-2" 
                                :class="statusBadgeClasses">
                                <span v-if="isAnalyzing" class="animate-spin material-symbols-outlined text-[14px]">sync</span>
                                <span v-else class="material-symbols-outlined text-[14px]">{{ statusIcon }}</span>
                                {{ displayStatus }}
                            </div>
                        </div>

                        <div v-if="aiResult" class="animate-in fade-in slide-in-from-top-2 duration-500">
                            <div class="mb-4">
                                <p class="text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Detection Result</p>
                                <div class="p-3 bg-[#F3F9FA] rounded-xl border border-[#48B7CB]/10">
                                    <p class="text-[#2B6E7A] font-bold text-lg leading-tight uppercase">{{ aiResult.parasiteStage || 'No Parasite Detected' }}</p>
                                    <p v-if="aiResult.drugType" class="text-xs text-[#5C5C5C] mt-1">Suspected Type: <span class="font-semibold">{{ aiResult.drugType }}</span></p>
                                </div>
                            </div>
                            
                            <div>
                                <p class="text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-1">Confidence Score</p>
                                <div class="flex items-end gap-2">
                                    <span class="text-3xl font-black text-[#2E2E2E] leading-none">{{ (aiResult.confidence * 100).toFixed(1) }}%</span>
                                    <div class="h-1.5 flex-1 bg-gray-100 rounded-full mb-1 overflow-hidden">
                                        <div class="h-full bg-[#48B7CB] rounded-full transition-all duration-1000" :style="{ width: `${aiResult.confidence * 100}%` }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="isAnalyzing" class="py-10 text-center">
                            <div class="animate-pulse flex flex-col items-center gap-3">
                                <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                                    <span class="material-symbols-outlined text-2xl">monitoring</span>
                                </div>
                                <p class="text-sm font-medium text-gray-400">Processing detailed assessment...</p>
                            </div>
                        </div>

                        <div v-else-if="caseData?.analysisStatus === 'FAILED'" class="p-4 bg-red-50 rounded-xl border border-red-100 text-center">
                            <span class="material-symbols-outlined text-red-400 mb-1">sentiment_dissatisfied</span>
                            <p class="text-xs font-bold text-red-600 uppercase mb-1">Analysis Failed</p>
                            <p class="text-[10px] text-red-500">The AI model could not process this image. Please ensure the smear is clear.</p>
                        </div>
                    </div>
                    
                    <div class="mt-8 pt-5 border-t border-gray-50">
                        <div class="flex gap-2 p-3 bg-stone-50 rounded-lg">
                            <span class="material-symbols-outlined text-stone-400 text-sm">info</span>
                            <p class="text-[9px] text-stone-500 leading-normal font-medium uppercase tracking-tight">
                                MorphoAid provides AI-assisted support and does not replace professional clinical judgment. All results should be reviewed by qualified personnel.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Section 3: Notes -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
                    <h2 class="text-[#2E2E2E] font-semibold text-lg mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-[#48B7CB]">edit_note</span>
                        Technician Notes
                    </h2>
                    <textarea
                        class="flex-1 w-full bg-[#F8F8F8] border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:border-[#48B7CB] focus:ring-4 focus:ring-[#48B7CB]/10 transition-all resize-none text-[#2E2E2E] placeholder:text-gray-400"
                        placeholder="Add clinical observations or manual validation notes here..."></textarea>
                    <div class="mt-4 flex justify-end">
                        <button
                            class="bg-[#004A99] hover:bg-[#003D7A] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-[#004A99]/20 transition-all hover:scale-[1.02] active:scale-95 text-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">save</span>
                            Save Notes
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCaseById, fetchAiResult } from '@/features/case-management/services/case.service'
import { fetchCaseImageBlob } from '@/features/case-management/services/caseImage.service'

const route = useRoute()
const caseId = route.params.caseId

const caseData = ref(null)
const aiResult = ref(null)
const loadingData = ref(true)
const loadingImage = ref(false)
const error = ref(null)
const imageUrl = ref(null)
let pollTimer = null

const isAnalyzing = computed(() => {
    const status = caseData.value?.analysisStatus
    return status === 'PENDING' || status === 'PROCESSING'
})

const displayStatus = computed(() => {
    if (isAnalyzing.value) return 'Analyzing...'
    if (caseData.value?.analysisStatus === 'FAILED') return 'Failed'
    if (caseData.value?.analysisStatus === 'COMPLETED') return 'Completed'
    return caseData.value?.status || 'Unknown'
})

const statusIcon = computed(() => {
    if (isAnalyzing.value) return 'sync'
    if (caseData.value?.analysisStatus === 'FAILED') return 'error_outline'
    if (caseData.value?.analysisStatus === 'COMPLETED') return 'check_circle'
    return 'help_outline'
})

const statusBadgeClasses = computed(() => {
    if (isAnalyzing.value) return 'bg-blue-50 text-blue-600'
    if (caseData.value?.analysisStatus === 'FAILED') return 'bg-red-50 text-red-600'
    if (caseData.value?.analysisStatus === 'COMPLETED') return 'bg-emerald-50 text-emerald-600'
    return 'bg-gray-100 text-gray-500'
})

const loadCaseDetails = async (quiet = false) => {
    if (!quiet) loadingData.value = true
    error.value = null
    try {
        const res = await getCaseById(caseId)
        caseData.value = res.data

        // Start/Stop polling based on status
        if (isAnalyzing.value) {
            startPolling()
        } else {
            stopPolling()
            // Fetch detailed AI result if completed
            if (caseData.value.analysisStatus === 'COMPLETED') {
                loadAiResult()
            }
        }

        // Fetch image if available and not already loaded
        if (caseData.value?.imageId && !imageUrl.value && !loadingImage.value) {
            loadCaseImage(caseData.value.imageId)
        }
    } catch (err) {
        console.error("Fetch case error:", err)
        error.value = err.response?.data?.message || 'Failed to connect to server'
        stopPolling()
    } finally {
        if (!quiet) loadingData.value = false
    }
}

const loadCaseImage = async (imageId) => {
    loadingImage.value = true
    try {
        const blob = await fetchCaseImageBlob(caseId, imageId)
        if (blob) {
            if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
            imageUrl.value = URL.createObjectURL(blob)
        }
    } catch (imgErr) {
        console.error("Failed to load image blob", imgErr)
    } finally {
        loadingImage.value = false
    }
}

const loadAiResult = async () => {
    try {
        const res = await fetchAiResult(caseId)
        if (res.data) {
            aiResult.value = res.data
        }
    } catch (err) {
        console.error("Fetch AI result error:", err)
    }
}

const startPolling = () => {
    if (pollTimer) return
    pollTimer = setInterval(() => {
        loadCaseDetails(true)
    }, 3000) // Poll every 3 seconds
}

const stopPolling = () => {
    if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
    }
}

onMounted(() => {
    loadCaseDetails()
})

onUnmounted(() => {
    stopPolling()
    if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value)
    }
})
</script>

<style scoped>
@keyframes progress-indeterminate {
  0% { left: -35%; width: 35%; }
  60% { left: 100%; width: 100%; }
  100% { left: 100%; width: 100%; }
}

.animate-progress-indeterminate {
  position: absolute;
  animation: progress-indeterminate 1.5s infinite linear;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
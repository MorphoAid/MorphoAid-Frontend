<template>
    <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E] space-y-6">

        <!-- Back + Header -->
        <div class="flex items-center gap-4">
            <button @click="$router.push('/lab/review')"
                class="text-sm text-[#5C5C5C] hover:text-[#368998] transition-colors">
                ← Back
            </button>
            <div>
                <h1 class="text-2xl font-semibold text-[#368998]">
                    Case <span class="font-mono">#{{ caseId }}</span>
                </h1>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-16">
            <svg class="w-8 h-8 animate-spin text-[#368998]" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4A10 10 0 002 12h2z" />
            </svg>
        </div>

        <!-- Error -->
        <div v-else-if="error"
            class="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
            <svg class="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
        </div>

        <template v-else-if="record">
            <!-- Status badges -->
            <div class="flex items-center gap-2 flex-wrap -mt-2">
                <span :class="sourceBadge(record.source)"
                    class="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase">
                    {{ record.source }}
                </span>
                <span :class="statusBadge(record.caseStatus)"
                    class="px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase">
                    {{ record.caseStatus }}
                </span>
                <span class="text-xs text-[#5C5C5C]">{{ formatDate(record.createdAt) }}</span>
            </div>

            <div class="flex flex-col xl:flex-row gap-6">

                <!-- Left: Image -->
                <div class="w-full xl:w-3/5">
                    <div class="bg-white rounded-xl border border-[#368998]/20 p-5">
                        <h2 class="text-sm font-medium text-[#368998] mb-4">Image Preview</h2>
                        <div class="relative mx-auto bg-[#1A1A1A] rounded-lg overflow-hidden flex items-center justify-center"
                            style="min-height: 280px; max-width: 100%;">
                            <!-- Real image loaded as blob (auth header required) -->
                            <img v-if="imageObjectUrl" :src="imageObjectUrl" alt="Case image"
                                class="max-w-full max-h-[480px] object-contain rounded" />
                            <!-- Loading skeleton -->
                            <div v-else-if="imageLoading"
                                class="flex flex-col items-center gap-3 text-[#368998]/40 py-12">
                                <svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4A10 10 0 002 12h2z" />
                                </svg>
                                <p class="text-xs">Loading image…</p>
                            </div>
                            <!-- Fallback placeholder -->
                            <div v-else class="flex items-center justify-center py-12">
                                <svg class="w-20 h-20 text-[#368998]/20" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <p v-if="imageError" class="text-xs text-red-500 mt-2 text-center">{{ imageError }}</p>
                    </div>
                </div>

                <!-- Right: AI Result Card + Metadata -->
                <div class="w-full xl:w-2/5 space-y-4">

                    <!-- AI Result Card (classification — no bbox) -->
                    <div class="bg-white rounded-xl border border-[#368998]/20 p-5">
                        <h2 class="text-sm font-medium text-[#368998] mb-4">AI Classification Result</h2>

                        <dl class="space-y-3 text-sm">
                            <!-- Parasite Stage -->
                            <div class="flex justify-between items-center">
                                <dt class="text-[#5C5C5C]">Parasite Stage</dt>
                                <dd class="font-semibold text-[#2E2E2E]">
                                    {{ record.parasiteStage || 'N/A' }}
                                </dd>
                            </div>

                            <!-- Confidence -->
                            <div v-if="record.confidence != null">
                                <div class="flex justify-between items-center mb-1">
                                    <dt class="text-[#5C5C5C]">Confidence</dt>
                                    <dd class="font-semibold text-[#368998]">
                                        {{ (record.confidence * 100).toFixed(1) }}%
                                    </dd>
                                </div>
                                <div class="w-full h-1.5 bg-[#C6E9EF]/40 rounded-full overflow-hidden">
                                    <div class="h-full bg-[#368998] rounded-full transition-all"
                                        :style="{ width: (record.confidence * 100) + '%' }"></div>
                                </div>
                            </div>

                            <!-- Drug Exposure -->
                            <div class="flex justify-between items-center">
                                <dt class="text-[#5C5C5C]">Drug Exposure</dt>
                                <dd
                                    :class="record.drugExposure ? 'text-amber-600 font-semibold' : 'text-[#407533] font-semibold'">
                                    {{ record.drugExposure == null ? 'N/A' : record.drugExposure ? 'Yes' : 'No' }}
                                </dd>
                            </div>

                            <!-- Drug Type -->
                            <div class="flex justify-between items-center">
                                <dt class="text-[#5C5C5C]">Drug Type</dt>
                                <dd class="font-medium text-[#2E2E2E]">{{ record.drugType || 'N/A' }}</dd>
                            </div>

                            <!-- Top Class ID (optional technical detail) -->
                            <div class="flex justify-between items-center">
                                <dt class="text-[#5C5C5C]">Class ID</dt>
                                <dd class="font-mono text-[#5C5C5C] text-xs">
                                    {{ record.topClassId != null ? record.topClassId : '—' }}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Metadata -->
                    <div class="bg-white rounded-xl border border-[#368998]/20 p-5">
                        <h2 class="text-sm font-medium text-[#368998] mb-4">Metadata</h2>
                        <dl class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <dt class="text-[#5C5C5C]">Case ID</dt>
                                <dd class="font-mono text-[#368998]">#{{ record.caseId }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-[#5C5C5C]">Source</dt>
                                <dd>{{ record.source }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-[#5C5C5C]">Status</dt>
                                <dd>{{ record.caseStatus }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-[#5C5C5C]">Created</dt>
                                <dd class="text-xs">{{ formatDate(record.createdAt) }}</dd>
                            </div>
                            <div class="flex justify-between">
                                <dt class="text-[#5C5C5C]">Image ID</dt>
                                <dd class="font-mono text-xs text-[#5C5C5C]">{{ record.imageId ?? '—' }}</dd>
                            </div>
                        </dl>
                    </div>

                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getLabReviewDetail, fetchCaseImageBlob } from '../services/lab.service.js'

const props = defineProps({ id: { type: String, required: true } })

const caseId = props.id

const loading = ref(true)
const error = ref(null)
const record = ref(null)

const imageLoading = ref(false)
const imageError = ref(null)
const imageObjectUrl = ref(null)

onMounted(async () => {
    try {
        const res = await getLabReviewDetail(caseId)
        record.value = res.data
        // Load image as blob (GET /cases/{caseId}/images/{imageId} requires auth)
        if (record.value?.imageId) {
            await loadImage(record.value.caseId, record.value.imageId)
        }
    } catch (err) {
        error.value = err?.response?.data?.message
            || err?.message
            || 'Failed to load case detail.'
    } finally {
        loading.value = false
    }
})

onUnmounted(() => {
    // Release blob URL when component is destroyed
    if (imageObjectUrl.value) URL.revokeObjectURL(imageObjectUrl.value)
})

async function loadImage(caseId, imageId) {
    imageLoading.value = true
    imageError.value = null
    try {
        const res = await fetchCaseImageBlob(caseId, imageId)
        const blob = new Blob([res.data], { type: res.headers['content-type'] || 'image/jpeg' })
        imageObjectUrl.value = URL.createObjectURL(blob)
    } catch {
        imageError.value = 'Image unavailable.'
    } finally {
        imageLoading.value = false
    }
}

function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString()
}

function sourceBadge(source) {
    return source === 'CLINICAL'
        ? 'bg-[#368998]/10 text-[#2B6E7A]'
        : 'bg-[#C6E9EF]/60 text-[#2B6E7A]/80'
}

function statusBadge(status) {
    if (status === 'ANALYZED') return 'bg-[#407533]/10 text-[#407533]'
    if (status === 'REVIEWED') return 'bg-[#2B6E7A]/10 text-[#2B6E7A]'
    return 'bg-[#5C5C5C]/10 text-[#5C5C5C]'
}
</script>

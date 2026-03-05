<template>
    <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E] space-y-6">

        <!-- Back + Header -->
        <div class="flex items-center gap-4">
            <button @click="$router.push('/dataprep/images')"
                class="text-sm text-[#5C5C5C] hover:text-[#368998] transition-colors flex items-center gap-1">
                ← Back
            </button>
            <div>
                <h1 class="text-2xl font-semibold text-[#368998]">Case <span class="font-mono">#{{ id }}</span></h1>
                <p class="text-sm text-[#5C5C5C]">Read-only image detail view.</p>
            </div>
        </div>

        <!-- Read-Only Notice -->
        <div class="flex items-start gap-3 bg-[#C6E9EF]/30 border border-[#368998]/20 rounded-xl px-5 py-4">
            <svg class="w-5 h-5 text-[#368998] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-[#2B6E7A]">
                Training submission is handled externally by <strong>MORU</strong>. This view is read-only.
            </p>
        </div>

        <!-- Two Column Layout -->
        <div class="flex flex-col lg:flex-row gap-6">

            <!-- Left: Image Preview -->
            <div class="w-full lg:w-1/2">
                <div
                    class="bg-white rounded-xl border border-[#368998]/20 p-6 flex flex-col items-center justify-center min-h-[340px]">
                    <div
                        class="w-full max-w-sm aspect-square bg-[#F8F8F8] rounded-lg border border-[#368998]/10 flex items-center justify-center overflow-hidden">
                        <!-- Placeholder image block -->
                        <div class="flex flex-col items-center text-[#5C5C5C]/40">
                            <svg class="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="text-sm">Blood smear image</span>
                            <span class="text-xs mt-1">Case #{{ id }}</span>
                        </div>
                    </div>
                    <p class="text-xs text-[#5C5C5C] mt-4">Image source: {{ mockData.source }}</p>
                </div>
            </div>

            <!-- Right: Metadata + AI Summary -->
            <div class="w-full lg:w-1/2 space-y-5">

                <!-- Case Metadata -->
                <div class="bg-white rounded-xl border border-[#368998]/20 p-6">
                    <h2 class="text-base font-medium text-[#368998] mb-4 border-b border-[#368998]/10 pb-3">Case
                        Metadata</h2>
                    <dl class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Case ID</dt>
                            <dd class="font-mono font-medium text-[#368998]">#{{ id }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Uploaded</dt>
                            <dd class="text-[#2E2E2E]">{{ mockData.uploaded }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Source</dt>
                            <dd class="text-[#2E2E2E]">{{ mockData.source }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Patient Code</dt>
                            <dd class="text-[#2E2E2E]">{{ mockData.patientCode }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Technician ID</dt>
                            <dd class="text-[#2E2E2E]">{{ mockData.technicianId }}</dd>
                        </div>
                    </dl>
                </div>

                <!-- AI Summary -->
                <div class="bg-white rounded-xl border border-[#368998]/20 p-6">
                    <h2 class="text-base font-medium text-[#368998] mb-4 border-b border-[#368998]/10 pb-3">AI Analysis
                        Summary</h2>
                    <dl class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Status</dt>
                            <dd>
                                <span :class="statusStyle(mockData.status)"
                                    class="px-2 py-0.5 rounded text-xs font-medium">
                                    {{ mockData.status }}
                                </span>
                            </dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Parasite Stage</dt>
                            <dd class="text-[#2E2E2E]">{{ mockData.parasiteStage }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Drug Exposure</dt>
                            <dd class="text-[#2E2E2E]">{{ mockData.drugExposure }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Confidence</dt>
                            <dd class="text-[#2E2E2E]">{{ mockData.confidence }}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-[#5C5C5C]">Analyzed At</dt>
                            <dd class="text-[#2E2E2E]">{{ mockData.analyzedAt }}</dd>
                        </div>
                    </dl>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
const props = defineProps({ id: { type: String, required: true } })

const mockData = {
    uploaded: '03 Mar 2026, 14:22',
    source: 'Clinic A',
    patientCode: 'PT-1042',
    technicianId: 'T-07',
    status: 'Completed',
    parasiteStage: 'RING',
    drugExposure: 'No',
    confidence: '91.4%',
    analyzedAt: '03 Mar 2026, 14:35',
}

function statusStyle(status) {
    if (status === 'Completed') return 'bg-[#407533]/10 text-[#407533]'
    if (status === 'Pending') return 'bg-[#FF4C38]/10 text-[#FF4C38]'
    return 'bg-[#A92222]/10 text-[#A92222]'
}
</script>

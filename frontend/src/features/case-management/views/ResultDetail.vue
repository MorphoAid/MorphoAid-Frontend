<template>
    <div class="p-8 max-w-5xl mx-auto w-full">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
                <h1 class="text-3xl font-bold text-[#2E2E2E] mb-1">Case Detalls</h1>
                <p class="text-[#5C5C5C] font-medium text-sm">Case ID: <span class="text-[#2E2E2E]">{{ caseId }}</span>
                </p>
            </div>
            <button @click="$router.push('/data-use/cases')"
                class="text-[#5C5C5C] hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Cases
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Section 1: Uploaded Image -->
            <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <h2 class="text-[#2E2E2E] font-semibold text-lg mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-[#48B7CB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                        </path>
                    </svg>
                    Uploaded Smear Image
                </h2>
                <div
                    class="flex-1 min-h-[400px] bg-[#F8F8F8] border border-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <p class="text-[#5C5C5C] font-medium z-10">Image Placeholder</p>
                    <!-- Mock bounding box -->
                    <div
                        class="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-[#FF4C38] bg-[#FF4C38]/10 rounded shadow-sm z-0">
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-6">
                <!-- Section 2: AI Summary -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 class="text-[#2E2E2E] font-semibold text-lg mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-[#48B7CB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z">
                            </path>
                        </svg>
                        AI Assessment
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <p class="text-xs text-[#5C5C5C] uppercase tracking-wide font-medium mb-1">Status</p>
                            <div
                                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#407533]/10 text-[#407533]">
                                Success
                            </div>
                        </div>
                        <div>
                            <p class="text-xs text-[#5C5C5C] uppercase tracking-wide font-medium mb-1">Detection Result
                            </p>
                            <p class="text-[#2E2E2E] font-medium">Plasmodium falciparum (Rings)</p>
                        </div>
                        <div>
                            <p class="text-xs text-[#5C5C5C] uppercase tracking-wide font-medium mb-1">Confidence Score
                            </p>
                            <div class="flex items-center gap-3">
                                <div class="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full bg-[#407533] w-[94%] rounded-full"></div>
                                </div>
                                <span class="text-[#407533] font-bold text-sm">94.2%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 3: Notes -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
                    <h2 class="text-[#2E2E2E] font-semibold text-lg mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-[#48B7CB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                            </path>
                        </svg>
                        Technician Notes
                    </h2>
                    <textarea
                        class="flex-1 w-full bg-[#F8F8F8] border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#48B7CB] focus:ring-1 focus:ring-[#48B7CB] transition-shadow resize-none text-[#2E2E2E]"
                        placeholder="Add clinical observations or manual validation notes here..."></textarea>
                    <div class="mt-4 flex justify-end">
                        <button
                            class="bg-[#48B7CB] hover:bg-[#368998] text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                            Save Notes
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const caseId = route.params.caseId
</script>
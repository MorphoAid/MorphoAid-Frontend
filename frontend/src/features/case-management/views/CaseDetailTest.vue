<template>
    <div class="p-6 max-w-4xl mx-auto">
        <!-- Header & Back Button -->
        <div class="flex items-center gap-4 mb-6">
            <button @click="router.push('/__test/cases')"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow transition-colors">
                &larr; Back to Cases
            </button>
            <h1 class="text-2xl font-bold">Case Detail (ID: {{ route.params.id }})</h1>
        </div>

        <!-- 404 Case Not Found -->
        <div v-if="caseNotFound" class="bg-red-100 border border-red-400 text-red-700 px-6 py-10 rounded text-center">
            <h2 class="text-2xl font-bold mb-2">Case not found</h2>
            <p>The requested case could not be retrieved from the database.</p>
        </div>

        <!-- Loading State -->
        <div v-else-if="loadingCase" class="text-center py-10">
            <p class="text-gray-500 text-lg">Loading case details...</p>
        </div>

        <!-- General Error (Non 404) -->
        <div v-else-if="caseError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong class="font-bold">Error: </strong>
            <span class="block sm:inline">{{ caseError }}</span>
        </div>

        <!-- Case Details Content -->
        <div v-else-if="caseData" class="space-y-6">

            <!-- Primary Case Info Card -->
            <div class="bg-white p-6 rounded shadow border border-gray-200">
                <h2 class="text-xl font-semibold mb-4 border-b pb-2">Case Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong class="text-gray-600">Patient Code:</strong> {{ caseData.patientCode }}</div>
                    <div><strong class="text-gray-600">Technician ID:</strong> {{ caseData.technicianId }}</div>
                    <div><strong class="text-gray-600">Location:</strong> {{ caseData.location }}</div>
                    <div>
                        <strong class="text-gray-600">Status:</strong>
                        <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            :class="caseData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                            {{ caseData.status }}
                        </span>
                    </div>
                    <div><strong class="text-gray-600">Uploaded By ID:</strong> {{ caseData.uploadedById }}</div>
                    <div><strong class="text-gray-600">Created At:</strong> {{ new
                        Date(caseData.createdAt).toLocaleString() }}</div>
                </div>

                <div class="mt-4 pt-4 border-t">
                    <strong class="text-gray-600 block mb-2">Image Path:</strong>
                    <code class="bg-gray-100 px-2 py-1 rounded text-sm break-all">{{ caseData.imagePath }}</code>
                </div>
            </div>

            <!-- AI Result Section -->
            <div class="bg-white p-6 rounded shadow border border-gray-200">
                <h2 class="text-xl font-semibold mb-4 border-b pb-2">AI Analysis Result</h2>

                <div v-if="loadingAi" class="text-gray-500 italic">
                    Fetching AI results...
                </div>

                <div v-else-if="aiNotFound"
                    class="bg-gray-50 border border-gray-300 text-gray-600 px-4 py-6 rounded text-center italic">
                    No AI analysis performed yet.
                </div>

                <div v-else-if="aiError" class="text-red-600 italic">
                    Failed to load AI results: {{ aiError }}
                </div>

                <div v-else-if="aiData">
                    <!-- Annotated Image with Bounding Boxes -->
                    <div v-if="rawResults.length > 0" class="mb-6">
                        <h3 class="text-lg font-semibold mb-3">Detection Visualization</h3>
                        <AnnotatedImage :caseId="caseId" :detections="rawResults" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><strong class="text-gray-600">Parasite Stage:</strong> {{ aiData.parasiteStage || 'N/A' }}</div>
                        <div><strong class="text-gray-600">Drug Exposure:</strong> {{ aiData.drugExposure }} <span v-if="aiData.drugType">({{ aiData.drugType }})</span></div>
                        <div><strong class="text-gray-600">Confidence:</strong> {{ (aiData.confidence * 100).toFixed(2) }}%
                        </div>
                        <div v-if="aiData.createdAt"><strong class="text-gray-600">Analyzed At:</strong> {{ new Date(aiData.createdAt).toLocaleString() }}</div>
                    </div>

                    <!-- All Detections from Array -->
                    <div v-if="rawResults.length > 0" class="mt-8">
                        <h3 class="text-lg font-semibold mb-3 border-b pb-1">All Detections</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 border">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class ID</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage / Type</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exposure</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Box [x1, y1, x2, y2]</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="(res, idx) in rawResults" :key="idx" class="hover:bg-gray-50">
                                        <td class="px-4 py-2 border-l">{{ res.class }}</td>
                                        <td class="px-4 py-2 border-l">
                                            <span v-if="res.mappedStage" class="text-indigo-600 font-medium">{{ res.mappedStage }}</span>
                                            <span v-else-if="res.mappedDrugType" class="text-green-600 font-medium">Drug {{ res.mappedDrugType }}</span>
                                            <span v-else class="text-gray-400">Unknown</span>
                                        </td>
                                        <td class="px-4 py-2 border-l">
                                            {{ res.mappedExposure ? 'Yes' : 'No' }}
                                        </td>
                                        <td class="px-4 py-2 border-l">{{ (res.confidence * 100).toFixed(2) }}%</td>
                                        <td class="px-4 py-2 border-l text-xs font-mono text-gray-500">
                                            <span v-if="res.box">[{{ res.box.x1.toFixed(0) }}, {{ res.box.y1.toFixed(0) }}, {{ res.box.x2.toFixed(0) }}, {{ res.box.y2.toFixed(0) }}]</span>
                                            <span v-else class="text-gray-300">N/A</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Image Upload Section -->
            <CaseImageUpload :caseId="caseId" />

            <!-- Debug Pre Blocks (Optional) -->
            <details class="text-sm text-gray-500 mt-8">
                <summary class="cursor-pointer font-semibold">Show Raw JSON Data (Debug)</summary>
                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-800 text-green-400 p-4 rounded overflow-auto h-64">
                        <h3 class="text-white mb-2 pb-1 border-b border-gray-600">caseData</h3>
                        <pre>{{ JSON.stringify(caseData, null, 2) }}</pre>
                    </div>
                    <div class="bg-gray-800 text-blue-400 p-4 rounded overflow-auto h-64">
                        <h3 class="text-white mb-2 pb-1 border-b border-gray-600">aiData</h3>
                        <pre>{{ JSON.stringify(aiData, null, 2) }}</pre>
                    </div>
                </div>
            </details>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '@/services/http';
import AnnotatedImage from '@/components/AnnotatedImage.vue';
import CaseImageUpload from '../components/CaseImageUpload.vue';

const route = useRoute();
const router = useRouter();

// Derived ID
const caseId = Number(route.params.id);

// State: Case
const caseData = ref(null);
const loadingCase = ref(true);
const caseError = ref(null);
const caseNotFound = ref(false);

// State: AI Result
const aiData = ref(null);
const loadingAi = ref(true);
const aiError = ref(null);
const aiNotFound = ref(false);
const rawResults = ref([]);

const fetchCaseDetail = async () => {
    try {
        const response = await http.get(`/cases/${caseId}`);
        caseData.value = response.data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            caseNotFound.value = true;
        } else {
            caseError.value = err.message || 'Error loading case details';
        }
        console.error('Failed to fetch case detail:', err);
    } finally {
        loadingCase.value = false;
    }
};

const fetchAiResult = async () => {
    try {
        const response = await http.get(`/cases/${caseId}/ai-result`);
        aiData.value = response.data;
        
        // Attempt to parse rawResponseJson if it exists to fill in missing fields
        if (aiData.value && aiData.value.rawResponseJson) {
            try {
                const rawJson = JSON.parse(aiData.value.rawResponseJson);
                
                // New format: rawJson.images[0].results
                if (rawJson.images && rawJson.images.length > 0) {
                    const firstImage = rawJson.images[0];
                    if (firstImage.results && firstImage.results.length > 0) {
                        // Store the full array for the table display
                        rawResults.value = firstImage.results.map(res => {
                            let mappedStage = null;
                            let mappedExposure = false;
                            let mappedDrugType = null;
                            
                            switch(res.class) {
                                case 0: mappedExposure = true; mappedDrugType = 'A'; break;
                                case 1: mappedExposure = true; mappedDrugType = 'B'; break;
                                case 2: mappedExposure = false; mappedStage = 'RING'; break;
                                case 3: mappedExposure = false; mappedStage = 'SCHIZ'; break;
                                case 4: mappedExposure = false; mappedStage = 'TROPH'; break;
                            }
                            
                            return { ...res, mappedStage, mappedExposure, mappedDrugType };
                        });

                        // Extract top result by confidence
                        const topResult = firstImage.results.reduce((prev, current) => 
                            (prev.confidence > current.confidence) ? prev : current
                        );
                        
                        // Map missing fields from raw json onto main aiData
                        if (topResult.confidence !== undefined) {
                            aiData.value.confidence = topResult.confidence;
                        }
                        if (topResult.class !== undefined) {
                            aiData.value.topClassId = topResult.class;
                            switch(topResult.class) {
                                case 0:
                                    aiData.value.drugExposure = true;
                                    aiData.value.drugType = 'A';
                                    break;
                                case 1:
                                    aiData.value.drugExposure = true;
                                    aiData.value.drugType = 'B';
                                    break;
                                case 2:
                                    aiData.value.drugExposure = false;
                                    aiData.value.parasiteStage = 'RING';
                                    break;
                                case 3:
                                    aiData.value.drugExposure = false;
                                    aiData.value.parasiteStage = 'SCHIZ';
                                    break;
                                case 4:
                                    aiData.value.drugExposure = false;
                                    aiData.value.parasiteStage = 'TROPH';
                                    break;
                            }
                        }
                    }
                } else if (rawJson.isArray && rawJson.length > 0 && rawJson[0].boxes) {
                    // Fallback to old box array logic if needed (optional)
                    const oldBoxes = rawJson[0].boxes;
                    if (oldBoxes.length > 0) {
                         // omitted for brevity, but won't crash
                    }
                }
            } catch (parseError) {
                console.warn('Failed to parse rawResponseJson on frontend:', parseError);
            }
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            aiNotFound.value = true;
        } else {
            aiError.value = err.message || 'Error loading AI result';
        }
        console.error('Failed to fetch AI result:', err);
    } finally {
        loadingAi.value = false;
    }
};

onMounted(() => {
    if (Number.isNaN(caseId)) {
        caseError.value = "Invalid case id format.";
        loadingCase.value = false;
        loadingAi.value = false;
        return;
    }
    fetchCaseDetail();
    fetchAiResult();
});
</script>

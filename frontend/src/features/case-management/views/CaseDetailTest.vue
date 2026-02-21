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

                <div v-else-if="aiData" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong class="text-gray-600">Parasite Stage:</strong> {{ aiData.parasiteStage }}</div>
                    <div><strong class="text-gray-600">Drug Exposure:</strong> {{ aiData.drugExposure }}</div>
                    <div><strong class="text-gray-600">Confidence:</strong> {{ (aiData.confidence * 100).toFixed(2) }}%
                    </div>
                    <div v-if="aiData.createdAt"><strong class="text-gray-600">Analyzed At:</strong> {{ new
                        Date(aiData.createdAt).toLocaleString() }}</div>
                </div>
            </div>

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

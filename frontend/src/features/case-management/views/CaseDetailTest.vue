<template>
    <div class="p-6 max-w-4xl mx-auto">
        <!-- Header & Back Button -->
        <div class="flex items-center gap-4 mb-6">
            <button @click="router.push('/data-use/cases')"
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
                    <div><strong class="text-gray-600">Location:</strong> {{ clinicalData?.provinceName ||
                        caseData.location }}</div>
                    <div>
                        <strong class="text-gray-600">Status:</strong>
                        <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            :class="caseData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                            {{ caseData.status }}
                        </span>
                        <button v-if="caseData.status === 'PENDING'" @click="triggerAnalysis"
                            class="ml-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded shadow transition-colors"
                            :disabled="isAnalyzing">
                            {{ isAnalyzing ? 'Analyzing...' : 'Analyze Now' }}
                        </button>
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

                <div v-else-if="aiNotFound" class="space-y-4">
                    <!-- Uploaded Image Preview -->
                    <div v-if="caseData?.imageId" class="relative">
                        <h3 class="text-lg font-semibold mb-3">Uploaded Image</h3>
                        <div class="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <img v-if="previewImageUrl" :src="previewImageUrl" alt="Uploaded case image"
                                class="w-full h-auto block" />
                            <div v-else class="text-center py-10 text-gray-400 italic">Loading image preview...</div>
                        </div>

                        <!-- Analyzing Overlay -->
                        <div v-if="isAnalyzing"
                            class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg mt-9">
                            <div
                                class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-blue-400 mb-4">
                            </div>
                            <p class="text-white text-lg font-semibold">🔬 AI is analyzing...</p>
                            <p class="text-gray-300 text-sm mt-1">This may take a moment</p>
                        </div>
                    </div>

                    <!-- No Image Uploaded -->
                    <div v-else
                        class="bg-gray-50 border border-gray-300 text-gray-500 px-6 py-8 rounded text-center italic">
                        No image uploaded for this case.
                    </div>

                    <!-- Status & Analyze Button -->
                    <div class="text-center py-4">
                        <p class="text-gray-500 mb-4">No AI analysis performed yet.</p>
                        <button v-if="caseData?.imageId" @click="triggerAnalysis"
                            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                            :disabled="isAnalyzing">
                            {{ isAnalyzing ? '🔄 Analyzing...' : '🔬 Analyze Now' }}
                        </button>
                    </div>
                </div>

                <div v-else-if="aiError" class="text-red-600 italic">
                    Failed to load AI results: {{ aiError }}
                </div>

                <div v-else-if="aiData">
                    <!-- Annotated Image with Bounding Boxes -->
                    <div v-if="caseData?.imageId" class="mb-6">
                        <h3 class="text-lg font-semibold mb-3">Detection Visualization</h3>
                        <AnnotatedImage :caseId="caseId" :imageId="caseData.imageId" :detections="rawResults" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><strong class="text-gray-600">Parasite Stage:</strong> {{ aiData.parasiteStage || 'N/A' }}
                        </div>
                        <div><strong class="text-gray-600">Drug Exposure:</strong> {{ aiData.drugExposure }} <span
                                v-if="aiData.drugType">({{ aiData.drugType }})</span></div>
                        <div><strong class="text-gray-600">Confidence:</strong> {{ (aiData.confidence * 100).toFixed(2)
                            }}%
                        </div>
                        <div v-if="aiData.createdAt"><strong class="text-gray-600">Analyzed At:</strong> {{ new
                            Date(aiData.createdAt).toLocaleString() }}</div>
                    </div>

                    <!-- All Detections from Array -->
                    <div v-if="rawResults.length > 0" class="mt-8">
                        <h3 class="text-lg font-semibold mb-3 border-b pb-1">All Detections</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 border">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Class ID</th>
                                        <th
                                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stage / Type</th>
                                        <th
                                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Exposure</th>
                                        <th
                                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Confidence</th>
                                        <th
                                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Box [x1, y1, x2, y2]</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="(res, idx) in rawResults" :key="idx" class="hover:bg-gray-50">
                                        <td class="px-4 py-2 border-l">{{ res.class }}</td>
                                        <td class="px-4 py-2 border-l">
                                            <span v-if="res.mappedStage" class="text-indigo-600 font-medium">{{
                                                res.mappedStage }}</span>
                                            <span v-else-if="res.mappedDrugType" class="text-green-600 font-medium">Drug
                                                {{ res.mappedDrugType }}</span>
                                            <span v-else class="text-gray-400">Unknown</span>
                                        </td>
                                        <td class="px-4 py-2 border-l">
                                            {{ res.mappedExposure ? 'Yes' : 'No' }}
                                        </td>
                                        <td class="px-4 py-2 border-l">{{ (res.confidence * 100).toFixed(2) }}%</td>
                                        <td class="px-4 py-2 border-l text-xs font-mono text-gray-500">
                                            <span v-if="res.box">[{{ res.box.x1.toFixed(0) }}, {{ res.box.y1.toFixed(0)
                                                }}, {{ res.box.x2.toFixed(0) }}, {{ res.box.y2.toFixed(0) }}]</span>
                                            <span v-else class="text-gray-300">N/A</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Diagnostic Notes Section -->
            <div v-if="notes.length > 0 || !loadingClinical" class="bg-white p-6 rounded shadow border border-gray-200">
                <h2 class="text-xl font-semibold mb-4 border-b pb-2">Diagnostic Notes</h2>

                <!-- Notes List -->
                <div class="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                    <div v-for="note in notes" :key="note.id" class="bg-gray-50 p-4 rounded border border-gray-100">
                        <div class="flex justify-between items-start mb-2">
                            <span class="font-bold text-gray-700 text-sm">{{ note.authorName }}</span>
                            <span class="text-gray-400 text-xs">{{ formatDate(note.createdAt) }}</span>
                        </div>
                        <p class="text-gray-800 whitespace-pre-wrap">{{ note.note }}</p>
                    </div>
                    <p v-if="notes.length === 0" class="text-gray-500 italic text-center py-4">No diagnostic notes added
                        yet.</p>
                </div>

                <!-- Add Note Form -->
                <div class="mt-6 pt-4 border-t">
                    <textarea v-model="newNote" placeholder="Add clinical observation or diagnostic note..."
                        class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                        :disabled="isSavingNote"></textarea>
                    <div class="mt-3 flex justify-end">
                        <button @click="saveNote"
                            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            :disabled="!newNote.trim() || isSavingNote">
                            {{ isSavingNote ? 'Saving...' : 'Save Note' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Image Upload Section -->

            <CaseImageUpload :caseId="caseId" :existingFilename="caseData.imageFilename" :imageId="caseData.imageId"
                @upload-success="fetchCaseDetail" />

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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '@/services/http';
import AnnotatedImage from '@/components/AnnotatedImage.vue';
import CaseImageUpload from '../components/CaseImageUpload.vue';
import ClinicalService from '@/features/clinical/services/clinical.service';

const route = useRoute();
const router = useRouter();

// Derived ID — treat as string to support both numeric and UUID backends
const caseId = computed(() => route.params.id);

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
const previewImageUrl = ref(null);

// Load image preview for cases that haven't been analyzed yet
const loadPreviewImage = async () => {
    if (!caseData.value?.imageId) return;
    try {
        const response = await http.get(
            `/cases/${caseId.value}/images/${caseData.value.imageId}/content`,
            { responseType: 'arraybuffer' }
        );
        const blob = new Blob([response.data], {
            type: response.headers['content-type'] || 'image/png',
        });
        // Revoke previous URL if exists
        if (previewImageUrl.value) URL.revokeObjectURL(previewImageUrl.value);
        previewImageUrl.value = URL.createObjectURL(blob);
    } catch (err) {
        console.error('Failed to load preview image:', err);
    }
};

// State: Clinical
const clinicalData = ref(null);
const notes = ref([]);
const newNote = ref('');
const isSavingNote = ref(false);
const isExporting = ref(false);
const loadingClinical = ref(true);
const isAnalyzing = ref(false);

const triggerAnalysis = async () => {
    isAnalyzing.value = true;
    try {
        const response = await http.post(`/cases/${caseId.value}/analyze`);
        // Immediately update status and results without waiting for re-fetch
        processAiResults(response.data);
        aiNotFound.value = false;
        aiError.value = null;

        // Refresh case detail & AI result to ensure everything is up-to-date
        await fetchCaseDetail();
        await fetchAiResult();

    } catch (err) {
        console.error('Analysis failed:', err);
        alert('Analysis failed: ' + (err.response?.data?.message || err.message));
    } finally {
        isAnalyzing.value = false;
    }
};

const processAiResults = (data) => {
    aiData.value = data;
    rawResults.value = [];

    if (data && data.rawResponseJson) {
        try {
            const rawJson = JSON.parse(data.rawResponseJson);

            // New format: rawJson.images[0].results
            if (rawJson.images && rawJson.images.length > 0) {
                const firstImage = rawJson.images[0];
                if (firstImage.results && firstImage.results.length > 0) {
                    // Store the full array for the table display
                    rawResults.value = firstImage.results.map(res => {
                        let mappedStage = null;
                        let mappedExposure = false;
                        let mappedDrugType = null;

                        switch (res.class) {
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
                        switch (topResult.class) {
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
            }
        } catch (parseError) {
            console.warn('Failed to parse rawResponseJson on frontend:', parseError);
        }
    }
};

const fetchCaseDetail = async () => {
    try {
        const response = await http.get(`/cases/${caseId.value}`);
        caseData.value = response.data;
        // Load image preview if available (for pre-analysis display)
        if (response.data?.imageId) {
            loadPreviewImage();
        }
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
        const response = await http.get(`/cases/${caseId.value}/ai-result`);
        if (response.data) {
            processAiResults(response.data);
            aiNotFound.value = false;
        } else {
            // Backend returned 200 with null — no AI result yet
            aiNotFound.value = true;
        }
    } catch (err) {
        // Fallback: handle 404 gracefully in case older backend is running
        if (err.response && err.response.status === 404) {
            aiNotFound.value = true;
        } else {
            aiError.value = err.message || 'Error loading AI result';
            console.error('Failed to fetch AI result:', err);
        }
    } finally {
        loadingAi.value = false;
    }
};

const fetchClinicalData = async () => {
    loadingClinical.value = true;
    try {
        const res = await ClinicalService.getCase(caseId.value);
        clinicalData.value = res.data;
    } catch (err) {
        console.error('Failed to fetch clinical data:', err);
    } finally {
        loadingClinical.value = false;
    }
};

const fetchNotes = async () => {
    try {
        const res = await ClinicalService.getNotes(caseId.value);
        notes.value = res.data;
    } catch (err) {
        console.error('Failed to fetch notes:', err);
    }
};

const saveNote = async () => {
    if (!newNote.value.trim()) return;
    isSavingNote.value = true;
    try {
        await ClinicalService.addNote(caseId.value, newNote.value);
        newNote.value = '';
        await fetchNotes();
    } catch (err) {
        alert("Error saving note. Please try again later.");
    } finally {
        isSavingNote.value = false;
    }
};

const exportPdf = async () => {
    isExporting.value = true;
    try {
        const response = await ClinicalService.exportPdf(caseId.value);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report_${String(caseId.value).padStart(5, '0')}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        alert("Error exporting report. Please try again later.");
    } finally {
        isExporting.value = false;
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
};

// Cleanup object URL on unmount
onUnmounted(() => {
    if (previewImageUrl.value) {
        URL.revokeObjectURL(previewImageUrl.value);
    }
});

// Derived ID reactive — so template and logic updates automatically
import { computed, watch } from 'vue';

const loadAllData = () => {
    if (!caseId.value) {
        caseError.value = "Invalid case id format.";
        loadingCase.value = false;
        loadingAi.value = false;
        return;
    }
    fetchCaseDetail();
    fetchAiResult();
    fetchClinicalData();
    fetchNotes();
};

onMounted(loadAllData);

// Watch for ID changes (e.g., when navigating from the list side-by-side or back-and-forth)
watch(() => route.params.id, (newId) => {
    if (newId) {
        loadAllData();
    }
});
</script>

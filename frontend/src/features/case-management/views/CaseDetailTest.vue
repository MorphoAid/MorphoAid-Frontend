<template>
    <div class="h-full bg-slate-50 relative p-6">
        <!-- Header & Back Button -->
        <div class="flex justify-between items-center mb-6 text-gray-800">
            <button @click="router.push('/data-use/cases')"
                class="hover:bg-gray-200 p-1 rounded transition-colors text-sm font-semibold flex items-center">
                <ChevronLeft class="w-4 h-4 mr-1"/> Case Details
            </button>
            <button @click="exportCase" class="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded shadow-sm transition-colors">
                 <Download class="w-4 h-4" /> Export Report
            </button>
        </div>

        <!-- 404 Case Not Found -->
        <div v-if="caseNotFound" class="bg-red-100 border border-red-400 text-red-700 px-6 py-10 rounded text-center">
            <h2 class="text-2xl font-bold mb-2">Case not found</h2>
            <p>The requested case could not be retrieved from the database.</p>
        </div>

        <!-- Loading State -->
        <div v-else-if="loadingCase" class="text-center py-10 flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500 mb-4"></div>
            <p class="text-gray-500 font-medium">Loading case details...</p>
        </div>

        <!-- General Error (Non 404) -->
        <div v-else-if="caseError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong class="font-bold">Error: </strong>
            <span class="block sm:inline">{{ caseError }}</span>
        </div>

        <!-- Case Details Content: 2-Column Layout -->
        <div v-else-if="caseData" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- LEFT COLUMN: Annotated Image -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col items-center w-full relative min-h-[500px]">
                 <!-- Image Upload Section (if no image yet) -->
                <div v-if="!caseData?.imageId" class="w-full p-6">
                    <CaseImageUpload :caseId="caseId" :existingFilename="caseData.imageFilename" :imageId="caseData.imageId"
                        @upload-success="fetchCaseDetail" />
                </div>

                <!-- Preview / Loading Image -->
                <div v-else-if="loadingAi || isAnalyzing" class="w-full flex-grow relative flex items-center justify-center bg-gray-100">
                    <img v-if="previewImageUrl" :src="previewImageUrl" alt="Uploaded case image" class="max-w-full max-h-full object-contain opacity-50" />
                    <!-- Analyzing Overlay -->
                    <div v-if="isAnalyzing" class="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-emerald-500 mb-4"></div>
                        <p class="text-white text-lg font-semibold tracking-wide drop-shadow-md">Analyzing Image...</p>
                    </div>
                </div>

                 <!-- Annotated Image -->
                 <div v-else-if="aiData && rawResults && caseData?.imageId" class="w-full h-full p-2 bg-gray-50 flex items-center justify-center">
                    <AnnotatedImage :caseId="caseId" :imageId="caseData.imageId" :detections="rawResults" class="max-w-full max-h-[800px] object-contain rounded-lg shadow-inner" />
                 </div>
                 
                 <!-- Fallback Preview -->
                 <div v-else-if="caseData?.imageId" class="w-full h-full p-2 bg-gray-50 flex items-center justify-center">
                    <img v-if="previewImageUrl" :src="previewImageUrl" alt="Preview" class="max-w-full max-h-[800px] object-contain rounded-lg shadow-inner"/>
                 </div>
            </div>

            <!-- RIGHT COLUMN: Interactive Panels -->
            <div class="flex flex-col gap-6">

                <!-- 1. Patient Info Panel -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Patient Info.</h2>
                        <button @click="togglePatientInfoEdit" class="text-gray-400 hover:text-gray-700 transition-colors p-1">
                            <Pencil class="w-4 h-4" />
                        </button>
                    </div>

                    <div v-if="!isEditingPatientInfo" class="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                        <div class="flex items-baseline"><span class="font-bold text-gray-800 w-28">Patient ID:</span> <span class="text-gray-700">{{ caseData.patientCode || 'N/A' }}</span></div>
                        <div class="flex items-baseline"><span class="font-bold text-gray-800 w-28">Age:</span> <span class="text-gray-700">{{ patientData.age ? `${patientData.age} yrs` : '-' }}</span></div>
                        <div class="flex items-baseline"><span class="font-bold text-gray-800 w-28">Weight:</span> <span class="text-gray-700">{{ patientData.weight ? `${patientData.weight}kg` : '-' }}</span></div>
                        <div class="flex items-baseline"><span class="font-bold text-gray-800 w-28">Risk Factors:</span> <span class="text-gray-700">{{ patientData.riskFactors || 'None' }}</span></div>
                        <div class="flex items-baseline col-span-2"><span class="font-bold text-gray-800 w-28">Fever Duration:</span> <span class="text-gray-700">{{ patientData.feverDuration ? `${patientData.feverDuration} days` : '-' }}</span></div>
                    </div>
                    
                    <div v-else class="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div class="col-span-2 md:col-span-1">
                            <label class="block font-bold text-gray-700 mb-1 leading-tight text-xs uppercase tracking-wider">Patient Code</label>
                            <input v-model="patientData.patientCode" type="text" class="w-full border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" />
                        </div>
                        <div class="col-span-2 md:col-span-1 border-b pb-2 md:border-b-0 md:pb-0 border-gray-100">
                             <!-- empty spacer -->
                        </div>
                        
                        <div>
                            <label class="block font-bold text-gray-700 mb-1 leading-tight text-xs uppercase tracking-wider">Age (yrs)</label>
                            <select v-model="patientData.age" class="w-full border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white outline-none">
                                <option value="">Select</option>
                                <option v-for="n in 100" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-1 leading-tight text-xs uppercase tracking-wider">Weight (kg)</label>
                             <select v-model="patientData.weight" class="w-full border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white outline-none">
                                <option value="">Select</option>
                                <option v-for="n in 150" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <label class="block font-bold text-gray-700 mb-1 leading-tight text-xs uppercase tracking-wider">Risk Factors</label>
                            <select v-model="patientData.riskFactors" class="w-full border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white outline-none">
                                <option value="None">None</option>
                                <option value="Travel History">Travel History</option>
                                <option value="Forest Entry">Forest Entry</option>
                                <option value="Pregnancy">Pregnancy</option>
                            </select>
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <label class="block font-bold text-gray-700 mb-1 leading-tight text-xs uppercase tracking-wider">Fever Duration (days)</label>
                            <select v-model="patientData.feverDuration" class="w-full border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white outline-none">
                                <option value="">Select</option>
                                <option v-for="n in 30" :key="n" :value="n">{{ n }}</option>
                            </select>
                        </div>
                        
                        <div class="col-span-2 flex justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                             <button @click="isEditingPatientInfo = false" class="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">Cancel</button>
                             <button @click="savePatientInfo" class="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm transition-colors">Save</button>
                        </div>
                    </div>
                </div>

                <!-- 2. Diagnostic Panel -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-grow flex flex-col pt-5 tracking-tight">
                    <div class="flex justify-between items-center mb-5">
                        <h2 class="text-2xl font-bold text-gray-900">Diagnostic Panel</h2>
                        
                        <div v-if="aiData && !aiNotFound" class="px-4 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Analyzed
                        </div>
                        <button v-else-if="caseData?.imageId && !isAnalyzing" @click="triggerAnalysis" class="px-4 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 transition-colors shadow-sm">
                            Analyze Now
                        </button>
                        <div v-else-if="isAnalyzing" class="px-4 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-600 border border-gray-200 flex items-center">
                            <div class="animate-spin h-3 w-3 mr-2 border-2 border-gray-400 border-t-transparent rounded-full"></div> Analyzing
                        </div>
                    </div>

                    <div v-if="aiData && !aiNotFound" class="flex-grow flex flex-col gap-5">
                        <!-- AI Suggestion -->
                        <div>
                            <h3 class="text-sm font-bold text-gray-800 mb-2">AI Suggestion</h3>
                            <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
                                <div class="font-bold text-gray-900 text-base">Detect Stage: <span class="capitalize">{{ formattedParasiteStage }}</span></div>
                                <div class="text-gray-600 font-medium text-sm mt-1">
                                    {{ (aiData.confidence * 100).toFixed(1) }}% Confidence
                                </div>
                            </div>
                        </div>

                        <!-- Recommended Treatment (Conditional) -->
                        <div v-if="shouldShowTreatment">
                            <h3 class="text-sm font-bold text-gray-800 mb-2 mt-2">Recommended Treatment</h3>
                            <div class="pl-4 border-l-2 border-gray-300 text-sm text-gray-700 leading-relaxed font-medium">
                                 Administer ACT immediately (e.g., Artemether-Lumefantrine) for 3 days.
                            </div>
                        </div>

                        <!-- Next Steps (Conditional) -->
                        <div v-if="shouldShowTreatment || verdictData.drugExposure !== 'None'">
                             <h3 class="text-sm font-bold text-gray-800 mb-2 mt-2">Next Steps</h3>
                             <div class="pl-4 border-l-2 border-gray-300 text-sm text-gray-700 leading-relaxed font-medium">
                                 Schedule follow-up smears on Days 1, 2, 3, and 7
                             </div>
                        </div>
                    </div>
                    <div v-else class="text-gray-400 text-center py-8 text-sm font-medium flex-grow flex items-center justify-center">
                        Waiting for analysis...
                    </div>
                    
                    <!-- 3. Doctor's Verdict Section -->
                    <div class="mt-8">
                        <h3 class="text-sm font-bold text-gray-900 mb-3 whitespace-nowrap">Doctor's Verdict</h3>
                        
                        <label class="flex items-center gap-2 mb-4 cursor-pointer w-fit group">
                            <input type="checkbox" v-model="verdictData.isEditingResult" class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                            <span class="text-sm font-medium text-gray-800 group-hover:text-black">Edit Result</span>
                        </label>

                         <!-- Edit Form (when checkbox checked) -->
                         <div v-if="verdictData.isEditingResult" class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 w-3/4">
                            
                            <!-- Parasite Stage Radio -->
                            <div>
                                <h4 class="text-sm font-bold text-gray-900 mb-2">Parasite Stage</h4>
                                <div class="grid grid-cols-2 gap-y-2 gap-x-4 pl-1">
                                    <label class="flex items-center gap-2 cursor-pointer w-fit text-sm text-gray-700 hover:text-gray-900 font-medium">
                                        <input type="radio" value="RING" v-model="verdictData.parasiteStage" class="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500" /> Ring
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer w-fit text-sm text-gray-700 hover:text-gray-900 font-medium">
                                        <input type="radio" value="SCHIZONTS" v-model="verdictData.parasiteStage" class="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500" /> Schizonts
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer w-fit text-sm text-gray-700 hover:text-gray-900 font-medium">
                                        <input type="radio" value="TROPHOZOITE" v-model="verdictData.parasiteStage" class="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500" /> Trophozoite
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer w-fit text-sm text-gray-700 hover:text-gray-900 font-medium">
                                        <input type="radio" value="NONE" v-model="verdictData.parasiteStage" class="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500" /> None
                                    </label>
                                </div>
                            </div>

                            <!-- Drug Exposure Radio -->
                            <div>
                                <h4 class="text-sm font-bold text-gray-900 mb-2">Drug Exposure</h4>
                                 <div class="grid grid-cols-2 gap-y-2 gap-x-4 pl-1">
                                    <label class="flex items-center gap-2 cursor-pointer w-fit text-sm text-gray-700 hover:text-gray-900 font-medium">
                                        <input type="radio" value="A" v-model="verdictData.drugExposure" class="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500" /> Drug A
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer w-fit text-sm text-gray-700 hover:text-gray-900 font-medium">
                                        <input type="radio" value="B" v-model="verdictData.drugExposure" class="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500" /> Drug B
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer w-fit text-sm text-gray-700 hover:text-gray-900 font-medium col-span-2">
                                        <input type="radio" value="None" v-model="verdictData.drugExposure" class="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500" /> None
                                    </label>
                                </div>
                            </div>

                            <!-- Treatment Plan (conditional) -->
                            <div v-if="verdictData.drugExposure === 'A' || verdictData.drugExposure === 'B'" class="animate-in fade-in duration-200">
                                <h4 class="text-sm font-bold text-gray-900 mb-2">Treatment Plan <span class="text-xs text-gray-400 font-normal ml-1">(Optional)</span></h4>
                                 <input type="text" v-model="verdictData.treatmentPlan" placeholder="Enter specific treatment plan..." class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
                            </div>
                        </div>

                        <!-- Info display when NOT editing result -->
                        <div v-else-if="aiData && !aiNotFound" class="grid grid-cols-2 gap-4 text-sm mb-4 px-1 opacity-80 pl-2 border-l-4 border-gray-200">
                             <div><span class="font-bold text-gray-800">Stage:</span> <span class="capitalize text-gray-700 ml-1">{{ verdictData.parasiteStage || formattedParasiteStage || 'None' }}</span></div>
                             <div><span class="font-bold text-gray-800">Drug:</span> <span class="capitalize text-gray-700 ml-1">{{ verdictData.drugExposure !== 'None' ? 'Drug ' + verdictData.drugExposure : 'None' }}</span></div>
                        </div>

                        <!-- Notes Textarea -->
                        <div class="mt-4">
                            <h4 class="text-sm font-bold text-gray-900 mb-2">Notes</h4>
                            <textarea v-model="verdictData.notes" rows="3" class="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow resize-none" placeholder="Add clinical observations, reasons for edits, etc..."></textarea>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex justify-between items-center mt-6">
                            <button @click="resetVerdict" class="px-6 py-1.5 rounded-md border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                                Cancel
                            </button>
                            <button @click="saveVerdict" class="px-8 py-1.5 rounded-md bg-[#38a89d] hover:bg-[#2e8f85] text-white font-semibold text-sm transition-colors shadow-md flex items-center justify-center min-w-[120px]" :disabled="isSavingVerdict">
                                <div v-if="isSavingVerdict" class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                {{ isSavingVerdict ? 'Saving...' : 'Save' }}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Custom Modal Popup -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
            <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ modalTitle }}</h3>
                <p class="text-gray-700 whitespace-pre-line mb-6 text-sm leading-relaxed">{{ modalMessage }}</p>
                <div class="flex justify-end gap-3">
                    <button v-if="modalType === 'confirm'" @click="handleModalClose(false)" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                    <button @click="handleModalClose(true)" class="px-5 py-2 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 shadow-sm transition-colors">OK</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '@/services/http';
import AnnotatedImage from '@/components/AnnotatedImage.vue';
import ClinicalService from '@/features/clinical/services/clinical.service';
import CaseImageUpload from '../components/CaseImageUpload.vue';
import { ChevronLeft, ChevronRight, Pencil, Download } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

// Derived ID — treat as string to support both numeric and UUID backends
const caseId = computed(() => route.params.id);

// Custom Modal State
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalType = ref('alert');
let confirmResolve = null;

const customAlert = (title, message) => {
    modalTitle.value = title;
    modalMessage.value = message;
    modalType.value = 'alert';
    showModal.value = true;
};

const customConfirm = (title, message) => {
    modalTitle.value = title;
    modalMessage.value = message;
    modalType.value = 'confirm';
    showModal.value = true;
    return new Promise((resolve) => {
        confirmResolve = resolve;
    });
};

const handleModalClose = (result) => {
    showModal.value = false;
    if (confirmResolve) {
        confirmResolve(result);
        confirmResolve = null;
    }
};

// Edit states and local form data
const isEditingPatientInfo = ref(false);
const patientData = ref({
    patientCode: '',
    age: '',
    weight: '',
    riskFactors: 'None',
    feverDuration: ''
});

const verdictData = ref({
    isEditingResult: false,
    parasiteStage: '',
    drugExposure: 'None',
    treatmentPlan: '',
    notes: ''
});
const isSavingVerdict = ref(false);

const togglePatientInfoEdit = () => {
    isEditingPatientInfo.value = !isEditingPatientInfo.value;
};

const savePatientInfo = async () => {
    try {
        const hasMetadata = patientData.value.age || patientData.value.weight || 
                           (patientData.value.riskFactors && patientData.value.riskFactors !== 'None') || 
                           patientData.value.feverDuration;
        
        let metadataStr = null;
        if (hasMetadata) {
            metadataStr = JSON.stringify({
                age: patientData.value.age,
                weight: patientData.value.weight,
                riskFactors: patientData.value.riskFactors,
                feverDuration: patientData.value.feverDuration
            });
        }

        const payload = {
            patientCode: patientData.value.patientCode ? Number(patientData.value.patientCode) : null,
            patientMetadata: metadataStr
        };
        
        await ClinicalService.updatePatientInfo(caseId.value, payload);
        
        // Refresh local data to ensure sync
        await fetchCaseDetail();
        
        isEditingPatientInfo.value = false;
        customAlert("Success", "Patient information saved successfully!");
    } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
        customAlert("Error", `Failed to save patient info:\n${errorMessage}`);
        console.error("Save Patient Info Error:", err);
    }
};

const resetVerdict = () => {
    verdictData.value.isEditingResult = false;
    verdictData.value.parasiteStage = formattedParasiteStage.value || '';
    verdictData.value.drugExposure = aiData.value?.drugExposure ? aiData.value.drugType : 'None';
    verdictData.value.treatmentPlan = '';
    verdictData.value.notes = '';
};

const saveVerdict = async () => {
    isSavingVerdict.value = true;
    try {
        const payload = JSON.stringify({
            parasiteStage: verdictData.value.parasiteStage || formattedParasiteStage.value,
            drugExposure: verdictData.value.drugExposure || 'None',
            treatmentPlan: verdictData.value.treatmentPlan,
            notes: verdictData.value.notes
        });
        
        await ClinicalService.addNote(caseId.value, payload);
        verdictData.value.isEditingResult = false;
        
        const wantsExport = await customConfirm("Success", "Verdict saved successfully!\n\nDo you want to export this case as a PDF report?\n(Click OK to Export, or Cancel to return to the Main Page.)");
        if (wantsExport) {
            await exportCase();
        } else {
            router.push('/data-use/cases');
        }
    } catch (err) {
        customAlert("Error", "Failed to save doctor's verdict: " + (err.response?.data?.message || err.message));
        console.error(err);
    } finally {
        isSavingVerdict.value = false;
    }
};

const exportCase = async () => {
    try {
        const response = await ClinicalService.exportPdf(caseId.value);
        
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Case_Report_${caseData.value?.patientCode || caseId.value}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Export Error:", err);
        customAlert("Error", "Failed to export case report.");
    }
};

// Computed properties for display logic
const formattedParasiteStage = computed(() => {
    if (!aiData.value) return '';
    return aiData.value.parasiteStage || 'None';
});

const shouldShowTreatment = computed(() => {
    const stage = verdictData.value.isEditingResult ? verdictData.value.parasiteStage : formattedParasiteStage.value;
    return ['RING', 'SCHIZONTS', 'TROPHOZOITE'].includes(stage);
});

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
        const response = await http.post(`/cases/${caseId.value}/analyze`, null, { timeout: 120000 });
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
        
        // Initialize patient data from case data
        if (caseData.value) {
            patientData.value.patientCode = caseData.value.patientCode || '';
            if (caseData.value.patientMetadata) {
                try {
                    const meta = JSON.parse(caseData.value.patientMetadata);
                    patientData.value.age = meta.age || '';
                    patientData.value.weight = meta.weight || '';
                    patientData.value.riskFactors = meta.riskFactors || 'None';
                    patientData.value.feverDuration = meta.feverDuration || '';
                } catch(e) {
                     console.warn("Could not parse patient metadata", e);
                }
            }
        }

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

<template>
  <div class="min-h-screen bg-[#f8f9ff] text-[#191c20] font-inter">
    <!-- Main Content Canvas -->
    <div class="max-w-screen-2xl mx-auto p-6 flex flex-col gap-6 pt-4">
      <!-- Context Header -->
      <div v-if="caseData" class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="router.back()" class="flex items-center justify-center h-10 w-10 rounded-full bg-white hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 text-slate-500">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 class="text-2xl font-extrabold tracking-tight text-[#191c20] leading-none mb-1 font-manrope">
              Case Analysis: #{{ String(caseData.id).padStart(5, 'PX-00000').replace('PX-00000', 'PX-') }}
            </h1>
            <p class="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full" :class="caseData.analysisStatus === 'COMPLETED' ? 'bg-[#005050]' : 'bg-amber-400'"></span>
              {{ caseData.status }} • {{ caseData.analysisStatus }} • Uploaded {{ formatRelativeTime(caseData.createdAt) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button @click="viewDigitalReport" class="px-5 py-2.5 rounded-xl bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 border border-slate-200 transition-all flex items-center gap-2 shadow-sm">
            <span class="material-symbols-outlined text-lg">description</span>
            View Digital Report
          </button>
          <button @click="exportPdf" :disabled="isExporting" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00458f] to-[#005cbb] text-white text-sm font-bold shadow-lg shadow-primary/10 active:scale-95 transition-transform flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">download</span>
            {{ isExporting ? 'Generating...' : 'Export Report' }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div class="w-12 h-12 border-4 border-[#00458f]/20 border-t-[#00458f] rounded-full animate-spin"></div>
          <p class="text-slate-400 font-medium animate-pulse">Synchronizing clinical data...</p>
      </div>

      <!-- Bento Layout Content -->
      <div v-else-if="caseData" class="grid grid-cols-12 gap-6">
        <!-- Left Section: Microscopy Viewer & Clinical Verdict History -->
        <div class="col-span-12 lg:col-span-8 space-y-6">
          <!-- Microscopy Viewer -->
          <div class="relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200/50 group aspect-video">
            <!-- Image Container with Overlays -->
            <div class="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
               <AnnotatedImage 
                 v-if="caseData && aiResult" 
                 :image-url="imageUrl" 
                 :results="rawAiDetections" 
                 class="w-full h-full"
               />
               <img v-else-if="imageUrl" :src="imageUrl" class="w-full h-full object-contain" />
               <div v-else class="text-slate-500 font-medium">Image not available</div>
            </div>
            
            <!-- Viewer Controls -->
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl px-6 py-3 flex items-center gap-6 shadow-2xl z-20">
              <button class="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><span class="material-symbols-outlined">zoom_in</span></button>
              <button class="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><span class="material-symbols-outlined">zoom_out</span></button>
              <div class="h-4 w-px bg-slate-200"></div>
              <button class="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><span class="material-symbols-outlined">layers</span></button>
              <button class="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><span class="material-symbols-outlined">fullscreen</span></button>
              <div class="h-4 w-px bg-slate-200"></div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">MAG: 1000X</span>
            </div>
          </div>

          <!-- Clinical Verdict History Section -->
          <section class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200/50">
            <div class="flex items-center gap-3 mb-8">
              <span class="material-symbols-outlined text-[#00458f]" style="font-variation-settings: 'FILL' 1;">history_edu</span>
              <h2 class="text-xs font-black tracking-[0.2em] text-slate-400 uppercase">Clinical Verdict History</h2>
            </div>
            
            <div v-if="notes.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div v-for="note in notes" :key="note.id" 
                   class="relative group border border-slate-100 rounded-[2rem] p-6 transition-all duration-300 overflow-hidden"
                   :class="getVerdictStatus(note) === 'accepted' ? 'bg-[#00458f]/5 border-[#00458f]/20' : getVerdictStatus(note) === 'discarded' ? 'bg-red-50 border-red-100' : 'bg-slate-50/50 hover:bg-white hover:shadow-md'">
                
                <!-- Status Overlay Icon -->
                <div v-if="getVerdictStatus(note) !== 'pending'" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                   <span class="material-symbols-outlined text-8xl" :class="getVerdictStatus(note) === 'accepted' ? 'text-[#00458f]' : 'text-red-600'">
                     {{ getVerdictStatus(note) === 'accepted' ? 'check_circle' : 'cancel' }}
                   </span>
                </div>

                <div class="relative z-10 flex flex-col h-full">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ note.authorName }} • {{ formatRelativeTime(note.createdAt) }}</p>
                      <p class="text-sm font-bold text-[#191c20]">{{ parseNoteContent(note.note).parasiteStage || 'Clinical Note' }}</p>
                    </div>
                    <div class="flex gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-full border border-slate-100">
                      <button @click="toggleNoteStatus(note, 'accepted')" 
                              class="p-1.5 rounded-full transition-all duration-200"
                              :class="getVerdictStatus(note) === 'accepted' ? 'bg-[#00458f] text-white' : 'hover:bg-[#00458f]/10 text-slate-300'">
                        <span class="material-symbols-outlined text-sm">check_circle</span>
                      </button>
                      <button @click="toggleNoteStatus(note, 'discarded')" 
                              class="p-1.5 rounded-full transition-all duration-200"
                              :class="getVerdictStatus(note) === 'discarded' ? 'bg-red-600 text-white' : 'hover:bg-red-50 text-slate-300'">
                        <span class="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed italic">"{{ parseNoteContent(note.note).notes || note.note }}"</p>
                </div>
              </div>
            </div>
            
            <div v-else class="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 mb-8">
              <span class="material-symbols-outlined text-slate-300 text-4xl mb-2">clinical_notes</span>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">No historical verdicts recorded</p>
            </div>

            <!-- Current Verdict Section -->
            <div class="bg-[#f2f3f9] rounded-[2.5rem] p-8 border border-[#00458f]/10">
              <div class="flex items-center gap-3 mb-6">
                <span class="material-symbols-outlined text-[#00458f]">add_notes</span>
                <h2 class="text-xs font-black tracking-[0.2em] text-[#00458f] uppercase">Current Doctor's Verdict</h2>
              </div>
              <form @submit.prevent="saveVerdict" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-70">Confirmed Stage</label>
                    <select v-model="confirmedStage" class="w-full bg-white border border-slate-200 rounded-2xl text-sm font-bold text-[#191c20] focus:ring-4 focus:ring-primary/10 py-3.5 px-4 appearance-none transition-all">
                      <option value="RING">Ring Stage (Confirmed)</option>
                      <option value="TROPH">Trophozoite</option>
                      <option value="SCHIZ">Schizont</option>
                      <option value="GAMETO">Gametocyte</option>
                      <option value="NEGATIVE">Negative / Artifact</option>
                    </select>
                  </div>
                  <label class="flex items-center gap-3 cursor-pointer group bg-white/50 p-4 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                    <input type="checkbox" class="w-5 h-5 rounded-lg border-slate-300 text-[#00458f] focus:ring-[#00458f]/20" />
                    <span class="text-xs font-bold text-slate-600 group-hover:text-[#00458f] transition-colors">Modify AI Diagnostic Model</span>
                  </label>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-70">Clinical Notes & Treatment Plan</label>
                  <textarea v-model="verdictNotes" 
                            class="w-full h-full min-h-[140px] bg-white border border-slate-200 rounded-[2rem] text-sm font-medium text-slate-600 focus:ring-4 focus:ring-primary/10 p-5 resize-none transition-all" 
                            placeholder="Add detailed diagnostic observations and treatment recommendations..."></textarea>
                </div>
                <div class="md:col-span-2 flex justify-end">
                   <button type="submit" :disabled="!verdictNotes.trim() || isSavingVerdict" class="px-8 py-3.5 bg-[#00458f] text-white rounded-2xl text-sm font-black shadow-lg shadow-[#00458f]/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all">
                      {{ isSavingVerdict ? 'Saving Verdict...' : 'Confirm Final Verdict' }}
                   </button>
                </div>
              </form>
            </div>
          </section>
        </div>

        <!-- Right Section: Analysis Panels -->
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <!-- Patient Information Card -->
          <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/50">
            <div class="flex items-center gap-3 mb-8">
              <span class="material-symbols-outlined text-[#00458f] p-2 bg-[#00458f]/5 rounded-xl">person</span>
              <h2 class="text-xs font-black tracking-[0.2em] text-slate-400 uppercase">Patient Information</h2>
            </div>
            <div v-if="patientData" class="grid grid-cols-2 gap-y-8 gap-x-6">
              <div>
                <label class="block text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1.5 opacity-60">Patient ID</label>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ patientData.patientCode || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1.5 opacity-60">Gender / Age</label>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ patientData.gender || 'N/A' }}, {{ patientData.age || 'N/A' }}y</p>
              </div>
              <div>
                <label class="block text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1.5 opacity-60">Weight</label>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ patientData.weight || 'N/A' }} kg</p>
              </div>
              <div>
                <label class="block text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1.5 opacity-60">Fever Duration</label>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ patientData.feverDuration || 'N/A' }} Days</p>
              </div>
              <div class="col-span-2">
                <label class="block text-[9px] uppercase tracking-widest text-slate-400 font-black mb-2.5 opacity-60">Risk Factors</label>
                <div class="flex flex-wrap gap-2">
                  <span v-for="risk in parseRiskFactors(patientData.riskFactors)" :key="risk"
                        class="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-red-100">
                    {{ risk }}
                  </span>
                  <span v-if="!patientData.riskFactors || patientData.riskFactors === 'None'" class="text-xs text-slate-400 font-medium">None Recorded</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Diagnostic AI Panel -->
          <section class="bg-[#00458f] rounded-[2.5rem] p-8 shadow-xl shadow-[#00458f]/10 text-white relative overflow-hidden">
            <!-- Decorative circle -->
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            
            <div class="flex items-center justify-between mb-8 relative z-10">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-white/80 p-2 bg-white/10 rounded-xl">psychology</span>
                <h2 class="text-xs font-black tracking-[0.2em] text-white/60 uppercase">AI Diagnosis Insight</h2>
              </div>
              <span class="px-3 py-1 bg-[#a0f0f0] text-[#004f4f] text-[10px] font-black rounded-full uppercase tracking-widest">ANALYZED</span>
            </div>
            
            <div v-if="aiResult" class="space-y-8 relative z-10">
              <div class="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Detected Stage</p>
                <div class="flex items-end justify-between mb-4">
                  <h3 class="text-2xl font-black text-white leading-none font-manrope">{{ aiResult.parasiteStage || 'N/A' }}</h3>
                  <span class="text-sm font-black text-[#a0f0f0]">{{ (aiResult.confidence * 100).toFixed(1) }}% Confidence</span>
                </div>
                <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-[#a0f0f0] shadow-[0_0_10px_#a0f0f0]" :style="`width: ${aiResult.confidence * 100}%`"></div>
                </div>
              </div>
              
              <div class="px-2 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white/50 uppercase tracking-widest">Drug Exposure</span>
                  <span class="text-xs font-black uppercase" :class="aiResult.drugExposure ? 'text-[#a0f0f0]' : 'text-white/80'">
                    {{ aiResult.drugExposure ? 'Detected' : 'Negative' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white/50 uppercase tracking-widest">Morphology Check</span>
                  <span class="text-xs font-black text-[#a0f0f0] uppercase tracking-widest">VALIDATED</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 opacity-50">
               <p class="text-xs font-bold uppercase tracking-widest">Awaiting AI Metrics</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ClinicalService from '../services/clinical.service';
import http from '@/services/http';
import AnnotatedImage from '@/components/AnnotatedImage.vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const caseData = ref(null);
const aiResult = ref(null);
const rawAiDetections = ref([]);
const notes = ref([]);
const loading = ref(true);
const error = ref(null);
const isExporting = ref(false);

// New Form State
const verdictNotes = ref('');
const confirmedStage = ref('RING');
const isSavingVerdict = ref(false);
const patientData = ref(null);

const imageUrl = computed(() => {
    if (!caseData.value || !caseData.value.imageId) return '';
    return `/api/cases/${caseData.value.id}/images/${caseData.value.imageId}/content`;
});

const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const res = await ClinicalService.getCase(id);
        caseData.value = res.data;

        // Fetch AI result
        if (caseData.value.analysisStatus === 'COMPLETED') {
            try {
                const aiRes = await http.get(`/cases/${id}/ai-result`);
                aiResult.value = aiRes.data;
                processAiDetections(aiResult.value);
            } catch (e) {
                console.error("Failed to fetch AI detail", e);
            }
        }

        const notesRes = await ClinicalService.getNotes(id);
        notes.value = notesRes.data;

        // Parse patient metadata
        if (caseData.value.patientMetadata) {
            try {
                patientData.value = JSON.parse(caseData.value.patientMetadata);
            } catch (e) {
                patientData.value = { name: caseData.value.patientMetadata };
            }
        }
        if (patientData.value) {
           patientData.value.patientCode = caseData.value.patientCode;
        }

    } catch (err) {
        error.value = 'Failed to load case data. Please try again.';
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const processAiDetections = (data) => {
    if (data && data.rawResponseJson) {
        try {
            const rawJson = JSON.parse(data.rawResponseJson);
            if (rawJson.images && rawJson.images.length > 0) {
                const firstImage = rawJson.images[0];
                if (firstImage.results && firstImage.results.length > 0) {
                    rawAiDetections.value = firstImage.results.map(res => {
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
                }
            }
        } catch (e) {
            console.warn('Failed to parse AI detections for viewer:', e);
        }
    }
};

const parseNoteContent = (noteStr) => {
    if (!noteStr) return {};
    try {
        return JSON.parse(noteStr);
    } catch (e) {
        return { notes: noteStr };
    }
};

const getVerdictStatus = (note) => {
    const content = parseNoteContent(note.note);
    return content.status || 'pending';
};

const toggleNoteStatus = async (note, status) => {
    const currentStatus = getVerdictStatus(note);
    const newStatus = currentStatus === status ? 'pending' : status;
    
    try {
        const content = parseNoteContent(note.note);
        content.status = newStatus;
        
        await ClinicalService.updateNote(id, note.id, JSON.stringify(content));
        
        // Optimistic UI update or refresh
        const notesRes = await ClinicalService.getNotes(id);
        notes.value = notesRes.data;
    } catch (err) {
        console.error("Failed to update verdict status", err);
    }
};

const saveVerdict = async () => {
    if (!verdictNotes.value.trim()) return;
    isSavingVerdict.value = true;
    try {
        const payload = JSON.stringify({
            notes: verdictNotes.value,
            parasiteStage: confirmedStage.value,
            status: 'pending'
        });
        await ClinicalService.addNote(id, payload);
        verdictNotes.value = '';
        const notesRes = await ClinicalService.getNotes(id);
        notes.value = notesRes.data;
    } catch (err) {
        console.error("Error saving verdict:", err);
    } finally {
        isSavingVerdict.value = false;
    }
};

const exportPdf = async () => {
    isExporting.value = true;
    try {
        const response = await ClinicalService.exportPdf(id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report_#PX-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        alert("Error exporting report. Please try again later.");
    } finally {
        isExporting.value = false;
    }
};

const viewDigitalReport = () => {
    const url = `/data-use/cases/${id}/report`;
    window.open(url, '_blank');
};

const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const parseRiskFactors = (str) => {
    if (!str || str === 'None') return [];
    return str.split(',').map(s => s.trim().toUpperCase());
};

onMounted(fetchData);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

.font-manrope { font-family: 'Manrope', sans-serif; }
.font-inter { font-family: 'Inter', sans-serif; }

.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Custom Scrollbar for notes list if needed */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>

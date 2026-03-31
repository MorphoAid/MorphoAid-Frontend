<template>
  <div class="min-h-screen bg-surface text-on-surface font-inter pb-12">
    <!-- Main Content Canvas -->
    <div v-if="loadingCase" class="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p class="text-slate-400 font-medium animate-pulse font-manrope">Synchronizing clinical data...</p>
    </div>

    <div v-else-if="caseNotFound" class="max-w-4xl mx-auto mt-20 p-8 bg-white rounded-[2.5rem] shadow-sm border border-red-100 text-center">
        <span class="material-symbols-outlined text-red-500 text-5xl mb-4">error_outline</span>
        <h2 class="text-2xl font-extrabold text-on-surface font-manrope mb-2 text-error">Case record not found.</h2>
        <button @click="router.push('/data-use/cases')" class="mt-4 px-6 py-2 bg-primary text-on-primary rounded-xl font-bold">Back to Case List</button>
    </div>
    
    <div v-else-if="caseAccessDenied" class="max-w-4xl mx-auto mt-20 p-8 bg-white rounded-[2.5rem] shadow-sm border border-amber-100 text-center">
        <span class="material-symbols-outlined text-amber-500 text-5xl mb-4">block</span>
        <h2 class="text-2xl font-extrabold text-[#191c20] font-manrope mb-2">Access denied.</h2>
        <button @click="router.push('/data-use/cases')" class="mt-4 px-6 py-2 bg-primary text-on-primary rounded-xl font-bold">Back to Case List</button>
    </div>

    <div v-else-if="caseError" class="max-w-4xl mx-auto mt-20 p-8 bg-white rounded-[2.5rem] shadow-sm border border-red-100 text-center">
        <span class="material-symbols-outlined text-red-500 text-5xl mb-4">bolt</span>
        <h2 class="text-2xl font-extrabold text-[#191c20] font-manrope mb-2">Unable to load case detail. Please try again later.</h2>
        <button @click="loadAllData" class="mt-4 px-6 py-2 bg-primary text-on-primary rounded-xl font-bold">Try Refreshing</button>
    </div>

    <div v-else-if="caseData" class="max-w-screen-2xl mx-auto p-6 flex flex-col gap-6 pt-4">
      <!-- Context Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <button @click="router.push('/data-use/cases')" 
                  class="flex items-center justify-center h-14 w-14 rounded-3xl bg-white hover:shadow-md transition-all border border-slate-100 text-primary group active:scale-90">
            <span class="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </button>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-3xl font-black tracking-tighter text-on-surface font-manrope leading-none">
                Case #{{ String(caseId).padStart(5, 'PX-00000').replace('PX-00000', 'PX-') }}
              </h1>
              <div class="px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                <span class="text-[10px] font-black text-primary uppercase tracking-widest">{{ statusLabel }}</span>
              </div>
            </div>
            <div v-if="statusLabel === 'processing'" class="flex items-center gap-2 mb-2">
                <div class="animate-spin h-3 w-3 border-2 border-primary/20 border-t-primary rounded-full"></div>
                <span class="text-[11px] font-bold text-primary animate-pulse">analysis is still in progress</span>
            </div>
            <div v-else-if="statusLabel === 'fails'" class="flex items-center gap-2 mb-2 text-red-600">
                <span class="material-symbols-outlined text-sm">error</span>
                <span class="text-[11px] font-bold">AI analysis has failed</span>
            </div>
            <p class="text-sm text-slate-400 font-bold flex items-center gap-2">
               Analysis Node: {{ caseData.uploadedBy?.fullName || 'Technician' }} • {{ formatDate(caseData.createdAt) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button @click="viewDigitalReport" 
              data-testid="view-digital-report-button"
              class="px-8 py-4 rounded-2xl bg-white border-2 border-primary/10 text-primary text-xs font-black uppercase tracking-widest hover:bg-surface hover:border-primary/30 transition-all flex items-center gap-3 shadow-sm active:scale-95">
              <span class="material-symbols-outlined text-xl">description</span>
              View Digital Report
          </button>
          <button @click="handleSaveReport" :disabled="isSavingReport"
              class="px-8 py-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-on-primary text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center gap-3 relative overflow-hidden group">
              <div v-if="isSavingReport" class="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-10">
                <div class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
              </div>
              <span class="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">cloud_upload</span>
              {{ isSavingReport ? 'Syncing...' : 'Save Report' }}
          </button>
        </div>
      </div>
      
      <!-- Success Toast -->
      <Transition name="toast">
        <div v-if="showSaveSuccess" data-testid="save-success-toast" class="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-[#191c20] text-white px-8 py-4 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-2xl">
          <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-sm font-black">check</span>
          </div>
          <div class="flex flex-col">
            <p class="text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-none mb-1">Success</p>
            <p class="text-xs font-bold leading-none">Report synchronized to repository</p>
          </div>
        </div>
      </Transition>

      <!-- Bento Layout Content -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Left Section: Microscopy Viewer & Clinical Verdict History -->
        <div class="col-span-12 lg:col-span-8 space-y-6">
          <!-- Microscopy Viewer -->
          <div class="relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200/50 group aspect-video flex items-center justify-center">
            
            <div v-if="!caseData?.imageId" class="w-full h-full flex flex-col items-center justify-center bg-surface p-12">
                 <CaseImageUpload :caseId="caseId" :existingFilename="caseData.imageFilename" :imageId="caseData.imageId"
                    @upload-success="loadAllData" />
            </div>

            <div v-if="caseData?.imageId" class="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
               <!-- Small Analyzing Overlay -->
               <div v-if="isAnalyzing" class="absolute top-6 right-6 z-30 flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200/50 shadow-lg">
                  <div class="w-4 h-4 border-2 border-[#48B7CB]/20 border-t-[#48B7CB] rounded-full animate-spin"></div>
                  <span class="text-[10px] font-black uppercase tracking-widest text-[#48B7CB]">AI Processing</span>
               </div>

               <AnnotatedImage 
                 v-if="caseData.imageId && aiData" 
                 :case-id="caseId"
                 :image-id="caseData.imageId"
                 :detections="rawAiDetections" 
                 :zoom="microscopyZoom"
                 class="w-full h-full"
               />
               <img v-else-if="previewImageUrl" 
                    :src="previewImageUrl" 
                    class="w-full h-full object-contain transition-transform duration-300" 
                    :style="`transform: scale(${microscopyZoom})`" />
               <div v-else class="text-slate-500 font-medium flex flex-col items-center gap-2">
                 <span class="material-symbols-outlined text-4xl animate-pulse">image</span>
                 Decoding imagery...
               </div>
            </div>
            
            <!-- Viewer Controls -->
            <div v-if="caseData?.imageId" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl px-6 py-3 flex items-center gap-6 shadow-2xl z-20 transition-all opacity-0 group-hover:opacity-100">
              <button @click="handleZoomIn" class="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 active:scale-90"><span class="material-symbols-outlined text-xl">zoom_in</span></button>
              <button @click="handleZoomOut" class="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 active:scale-90"><span class="material-symbols-outlined text-xl">zoom_out</span></button>
              <div class="h-4 w-px bg-slate-200"></div>
              <button class="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><span class="material-symbols-outlined text-xl">layers</span></button>
              <button class="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><span class="material-symbols-outlined text-xl">fullscreen</span></button>
              <div class="h-4 w-px bg-slate-200"></div>
              <button @click="resetZoom" class="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 group">
                <span class="text-[10px] font-black uppercase tracking-[0.2em]">MAG: {{ Math.round(1000 * microscopyZoom) }}X</span>
                <span class="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">restart_alt</span>
              </button>
            </div>
          </div>

          <!-- Clinical Verdict History Section -->
          <section class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200/50">
            <div class="flex items-center gap-3 mb-8">
              <span class="material-symbols-outlined text-primary p-2 bg-primary/5 rounded-xl">clinical_notes</span>
              <h2 class="text-xs font-black tracking-[0.2em] text-on-surface-variant/70 uppercase">Clinical Verdict History</h2>
            </div>
            
            <div v-if="notes.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div v-for="note in notes" :key="note.id" 
                   class="relative group border border-slate-100 rounded-[2rem] p-6 transition-all duration-300 overflow-hidden"
                   :class="getVerdictStatus(note) === 'accepted' ? 'bg-emerald-50 border-emerald-200' : getVerdictStatus(note) === 'discarded' ? 'bg-red-50 border-red-100' : 'bg-slate-50/50 hover:bg-white hover:shadow-md'">
                
                <!-- Status Overlay Icon -->
                <div v-if="getVerdictStatus(note) !== 'pending'" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                   <span class="material-symbols-outlined text-[10rem]" :class="getVerdictStatus(note) === 'accepted' ? 'text-emerald-500' : 'text-red-600'">
                     {{ getVerdictStatus(note) === 'accepted' ? 'check_circle' : 'cancel' }}
                   </span>
                </div>

                <div class="relative z-10 flex flex-col h-full">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex-1 mr-4">
                      <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ note.authorName || 'Medical Officer' }} • {{ formatRelativeTime(note.createdAt) }}</p>
                      <div class="flex flex-wrap gap-2 items-center mt-1">
                          <p class="text-sm font-black text-on-surface capitalize tracking-tight">{{ (parseNoteContent(note.note).parasiteStage || 'Observation').toLowerCase().replace('druga', 'DrugA').replace('drugb', 'DrugB') }}</p>
                          <span v-if="parseNoteContent(note.note).drugExposure && parseNoteContent(note.note).drugExposure !== 'None'" 
                                class="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black rounded border border-amber-100 uppercase tracking-tighter">
                                {{ parseNoteContent(note.note).drugExposure }} Exposure
                          </span>
                      </div>
                    </div>
                    <div class="flex gap-1.5 bg-white/60 backdrop-blur-sm p-1 rounded-full border border-slate-100 shadow-sm">
                      <button @click="toggleNoteStatus(note, 'accepted')" 
                              class="p-1.5 rounded-full transition-all duration-200 active:scale-90"
                              title="Approve"
                              :class="getVerdictStatus(note) === 'accepted' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'hover:bg-emerald-50 text-slate-300'">
                        <span class="material-symbols-outlined text-sm font-bold">check</span>
                      </button>
                      <button @click="toggleNoteStatus(note, 'discarded')" 
                              class="p-1.5 rounded-full transition-all duration-200 active:scale-90"
                              title="Reject"
                              :class="getVerdictStatus(note) === 'discarded' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'hover:bg-red-50 text-slate-300'">
                        <span class="material-symbols-outlined text-sm font-bold">close</span>
                      </button>
                    </div>
                  </div>
                  <div class="mt-2 pt-3 border-t border-slate-100/50">
                    <p class="text-xs text-slate-400 leading-relaxed font-medium italic">"{{ parseNoteContent(note.note).notes || 'No detailed observations recorded.' }}"</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="py-16 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 mb-8">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span class="material-symbols-outlined text-slate-300 text-3xl">history</span>
              </div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">No history recorded yet</p>
            </div>

            <!-- Current Verdict Form -->
            <div class="bg-surface-container-low rounded-[2.5rem] p-10 border border-primary/5">
              <div class="flex items-center gap-3 mb-8">
                <span class="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-xl">add_notes</span>
                <h2 class="text-xs font-black tracking-[0.2em] text-primary uppercase">Issue New Clinical Verdict</h2>
              </div>
              <form @submit.prevent="saveVerdict" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-6">
                  <div class="space-y-2.5">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnostic Classification</label>
                    <div class="relative group">
                        <select v-model="confirmedStage" 
                            data-testid="verdict-stage-select"
                            class="w-full bg-white border border-slate-100 rounded-2xl text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:border-primary/20 py-4 px-5 appearance-none shadow-sm transition-all cursor-pointer">
                            <option value="">None / Select Classification</option>
                            <option value="RING">Parasite Stage: Ring</option>
                            <option value="TROPH">Parasite Stage: Trophozoite</option>
                            <option value="SCHIZ">Parasite Stage: Schizont</option>
                            <option value="DRUGA">Drug A</option>
                            <option value="DRUGB">Drug B</option>
                        </select>
                        <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 transition-transform group-hover:translate-y-[-40%]">expand_more</span>
                    </div>
                  </div>
                </div>
                <div class="space-y-2.5">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Observations & Findings</label>
                  <textarea v-model="verdictNotes" 
                            data-testid="verdict-note-textarea"
                            class="w-full h-full min-h-[160px] bg-white border border-slate-100 rounded-[2rem] text-sm font-medium text-on-surface-variant focus:ring-4 focus:ring-primary/5 p-6 resize-none transition-all shadow-sm placeholder:text-slate-300" 
                            placeholder="Document morphological characteristics, parasite density estimates, or relevant clinical symptoms..."></textarea>
                </div>
                <div class="md:col-span-2 flex justify-end gap-4 pt-2">
                   <button type="button" @click="verdictNotes = ''" class="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                   <button type="submit" :disabled="!confirmedStage || !verdictNotes.trim() || isSavingVerdict" 
                        data-testid="submit-verdict-button"
                        class="px-10 py-4 bg-primary text-on-primary rounded-[1.5rem] text-xs font-black uppercase tracking-[0.1em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center gap-3">
                      <span v-if="!isSavingVerdict" class="material-symbols-outlined text-lg">verified</span>
                      <div v-else class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                      {{ isSavingVerdict ? 'Syncing...' : 'Submit Verification' }}
                   </button>
                </div>
              </form>
            </div>
          </section>
        </div>

        <!-- Right Section: Analysis Panels -->
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <!-- Patient Information Card -->
          <section class="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-200/50">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary p-2 bg-primary/5 rounded-xl" style="font-variation-settings: 'FILL' 1;">person</span>
                <h2 class="text-xs font-black tracking-[0.2em] text-on-surface-variant uppercase">Patient Profile</h2>
              </div>
              <button @click="savePatientInfo" data-testid="save-patient-info-button" class="p-2 rounded-xl bg-surface-container-high text-primary hover:bg-primary/10 transition-all flex items-center justify-center group shadow-sm active:scale-90">
                  <span class="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">sync</span>
              </button>
            </div>
            
            <div v-if="patientData" class="space-y-5">
              <div class="space-y-1.5">
                <label class="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black">System ID</label>
                <input v-model="patientData.patientCode" 
                       readonly
                       class="w-full bg-surface-container-low border-none rounded-xl text-sm font-black text-on-surface-variant p-4 cursor-not-allowed" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black">Age</label>
                  <div class="relative">
                    <input v-model="patientData.age" data-testid="patient-age-input" type="number" class="w-full bg-surface border-none rounded-xl text-sm font-black text-on-surface p-4 pr-10" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-on-surface-variant pointer-events-none">YR</span>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black">Gender</label>
                  <select v-model="patientData.gender" data-testid="patient-gender-select" class="w-full bg-surface border-none rounded-xl text-xs font-black text-on-surface p-4 appearance-none cursor-pointer">
                      <option value="Male">MALE</option>
                      <option value="Female">FEMALE</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black">Weight</label>
                  <div class="relative">
                    <input v-model="patientData.weight" data-testid="patient-weight-input" type="number" class="w-full bg-surface border-none rounded-xl text-sm font-black text-on-surface p-4 pr-10" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-on-surface-variant pointer-events-none">KG</span>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black">Fever</label>
                  <div class="relative">
                    <input v-model="patientData.feverDuration" data-testid="patient-fever-input" type="number" class="w-full bg-surface border-none rounded-xl text-sm font-black text-on-surface p-4 pr-10" />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-on-surface-variant pointer-events-none">DAYS</span>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <label class="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black">Risk Assessment</label>
                <select v-model="patientData.riskFactors" data-testid="patient-risk-select" class="w-full bg-surface border-none rounded-xl text-[10px] font-black text-on-surface p-4 appearance-none cursor-pointer uppercase tracking-widest">
                    <option value="None">Normal / Low Risk</option>
                    <option value="Pregnancy">Pregnancy (Critical)</option>
                    <option value="Travel History">Recent Travel Exposure</option>
                    <option value="Anemic">Anemic Symptoms</option>
                </select>
                <div class="flex flex-wrap gap-2 pt-1">
                  <span v-for="risk in parseRiskFactors(patientData.riskFactors)" :key="risk"
                        class="px-3 py-1.5 bg-error/5 text-error text-[9px] font-black rounded-lg uppercase tracking-widest border border-error/10 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span>
                    {{ risk }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Diagnostic AI Panel -->
          <section class="clinical-gradient rounded-[2.5rem] p-10 shadow-2xl shadow-primary/10 text-on-primary relative overflow-hidden group/ai">
            <!-- Decorative circle -->
            <div class="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-[80px] group-hover/ai:scale-110 transition-transform duration-1000"></div>
            <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-300/5 rounded-full blur-[60px]"></div>
            
            <div class="flex items-center justify-between mb-10 relative z-10">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-white/90 p-3 bg-white/10 rounded-2xl shadow-inner" style="font-variation-settings: 'FILL' 1;">psychology</span>
                <div>
                    <h2 class="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase leading-none mb-1">AI Diagnostic</h2>
                    <p class="text-xs font-black text-white uppercase tracking-widest leading-none">Insight Engine</p>
                </div>
              </div>
              <div class="flex flex-col items-end">
                  <span class="px-3 py-1 bg-white/10 text-white text-[9px] font-black rounded-full uppercase tracking-[0.2em] border border-white/5">v4.2.1-LIVE</span>
              </div>
            </div>
            
            <div v-if="aiData" class="space-y-10 relative z-10">
              <div class="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl transition-all group-hover/ai:-translate-y-1">
                <div class="flex items-center justify-between mb-4">
                    <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Dominant Stage</p>
                    <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 bg-blue-300 rounded-full animate-ping"></span>
                        <span class="text-[10px] font-black text-blue-300 uppercase tracking-widest">Optimized</span>
                    </div>
                </div>
                <div class="flex items-end justify-between mb-6">
                  <h3 class="text-3xl font-black text-white leading-none font-manrope capitalize tracking-tight">{{ aiData.parasiteStage?.toLowerCase() || 'Negative' }} Stage</h3>
                  <div class="text-right">
                      <p class="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Prob.</p>
                      <span class="text-xl font-black text-blue-200 leading-none">{{ (aiData.confidence * 100).toFixed(1) }}%</span>
                  </div>
                </div>
                <div class="w-full h-2.5 bg-white/10 rounded-full overflow-hidden shadow-inner p-[1px]">
                  <div class="h-full bg-gradient-to-r from-blue-300 to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(147,197,253,0.3)]" :style="`width: ${aiData.confidence * 100}%`"></div>
                </div>
              </div>
              
              <div class="px-4 space-y-6">
                <div class="flex items-center justify-between border-b border-white/5 pb-4">
                  <div class="flex items-center gap-3">
                      <span class="material-symbols-outlined text-white/40">vaccines</span>
                      <span class="text-xs font-bold text-white/50 uppercase tracking-widest">Drug Response</span>
                  </div>
                  <span class="text-xs font-black uppercase px-2.5 py-1 rounded-lg" :class="aiData.drugExposure ? 'bg-blue-300/20 text-blue-300' : 'bg-white/5 text-white/40'">
                    {{ aiData.drugExposure ? 'Positive (Type '+aiData.drugType+')' : 'Negative' }}
                  </span>
                </div>
                <div class="flex items-center justify-between pb-2">
                  <div class="flex items-center gap-3">
                      <span class="material-symbols-outlined text-white/40">verified_user</span>
                      <span class="text-xs font-bold text-white/50 uppercase tracking-widest">Analysis Integrity</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                      <span class="text-[10px] font-black text-blue-300 uppercase tracking-widest">LEGITIMIZED</span>
                      <span class="material-symbols-outlined text-sm text-blue-300">check_circle</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-16 opacity-40 flex flex-col items-center gap-6 relative z-10">
               <div v-if="statusLabel === 'processing'" class="flex flex-col items-center gap-6">
                   <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border-2 border-white/20 border-t-white animate-spin"></div>
                   <p class="text-xs font-black uppercase tracking-[0.3em] mb-2">analysis is still in progress</p>
               </div>
               <div v-else-if="statusLabel === 'fails'" class="flex flex-col items-center gap-6 text-red-200">
                   <div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                       <span class="material-symbols-outlined text-4xl">error</span>
                   </div>
                   <p class="text-xs font-black uppercase tracking-[0.3em] mb-2">AI analysis has failed</p>
               </div>
               <div v-else class="flex flex-col items-center gap-6">
                   <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                       <span class="material-symbols-outlined text-4xl">analytics</span>
                   </div>
                   <div>
                       <p class="text-xs font-black uppercase tracking-[0.3em] mb-2">Awaiting Diagnostic Data</p>
                       <p class="text-[10px] font-medium text-white/50 max-w-[200px] leading-relaxed italic">Upload image and initialize analysis to retrieve AI insights.</p>
                   </div>
                   <button v-if="caseData?.imageId" @click="triggerAnalysis" 
                      class="px-10 py-4 bg-white text-[#00458f] rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                      Run Diagnostic Engine
                   </button>
               </div>
            </div>

            <!-- Clinical Disclaimer -->
            <div class="mt-6 pt-6 border-t border-white/5 relative z-10">
              <p class="text-[9px] text-white/30 leading-relaxed italic uppercase tracking-tighter">
                MorphoAid provides AI-assisted diagnostic support and does not replace professional clinical judgment. All results should be reviewed and interpreted by qualified personnel.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Alert Modal (SRS-82/83/84) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="alert.show" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Transition name="scale">
            <div v-if="alert.show" class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 max-w-sm w-full text-center">
              <div :class="[
                'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl',
                alert.type === 'success' ? 'bg-emerald-50 text-emerald-500 shadow-emerald-200/50' : 'bg-red-50 text-red-500 shadow-red-200/50'
              ]">
                <span class="material-symbols-outlined text-4xl font-black">
                  {{ alert.type === 'success' ? 'check_circle' : 'error_outline' }}
                </span>
              </div>
              <h3 class="text-2xl font-black text-[#191c20] font-manrope mb-2 tracking-tight" data-testid="alert-title">{{ alert.title }}</h3>
              <p class="text-slate-400 font-bold text-sm leading-relaxed mb-8" data-testid="alert-message">{{ alert.message }}</p>
              <button @click="closeAlert" data-testid="alert-ok-button" class="w-full py-4 bg-primary text-on-primary rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                OK
              </button>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '@/services/http';
import AnnotatedImage from '@/components/AnnotatedImage.vue';
import ClinicalService from '@/features/clinical/services/clinical.service';
import CaseImageUpload from '../components/CaseImageUpload.vue';

const route = useRoute();
const router = useRouter();

// Basic State
const caseId = computed(() => route.params.id);
const caseData = ref(null);
const loadingCase = ref(true);
const caseNotFound = ref(false);
const caseAccessDenied = ref(false);
const caseError = ref(null);

// AI & Analysis State
const aiData = ref(null);
const rawAiDetections = ref([]);
const previewImageUrl = ref(null);
let pollTimer = null;

const isAnalyzing = computed(() => {
    const s = caseData.value?.status;
    return s === 'PENDING' || s === 'PROCESSING';
});

const statusLabel = computed(() => {
    const s = caseData.value?.status;
    if (s === 'PENDING' || s === 'PROCESSING') return 'processing';
    if (s === 'FAILED') return 'fails';
    return 'analyzed'; // success or finished
});

// Form & Interactive State
const notes = ref([]);
const patientData = ref({
    patientCode: '',
    age: '',
    gender: '',
    weight: '',
    riskFactors: 'None',
    feverDuration: ''
});
const verdictNotes = ref('');
const confirmedStage = ref('');
const isSavingVerdict = ref(false);
const isSavingReport = ref(false);
const showSaveSuccess = ref(false);
const isExporting = ref(false);

// Viewer State
const microscopyZoom = ref(1.0);

const handleZoomIn = () => {
    if (microscopyZoom.value < 4.0) {
        microscopyZoom.value = parseFloat((microscopyZoom.value + 0.25).toFixed(2));
    }
};

const handleZoomOut = () => {
    if (microscopyZoom.value > 0.5) {
        microscopyZoom.value = parseFloat((microscopyZoom.value - 0.25).toFixed(2));
    }
};

const resetZoom = () => {
    microscopyZoom.value = 1.0;
};

const alert = ref({
    show: false,
    title: '',
    message: '',
    type: 'success', // 'success' | 'error' | 'warning'
    callback: null
})

const showAlert = (title, message, type = 'success', callback = null) => {
    alert.value.title = title
    alert.value.message = message
    alert.value.type = type
    alert.value.callback = callback
    alert.value.show = true
}

const closeAlert = () => {
    alert.value.show = false
    if (alert.value.callback) {
        alert.value.callback()
        alert.value.callback = null
    }
}

const startPolling = () => {
    if (pollTimer) return;
    pollTimer = setInterval(() => {
        loadAllData(true);
    }, 3000); // Polling every 3 seconds
};

const stopPolling = () => {
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }
};

const loadAllData = async (quiet = false) => {
    if (!quiet) loadingCase.value = true;
    try {
        await fetchCaseDetail();
        
        // Polling management
        if (isAnalyzing.value) {
            startPolling();
        } else {
            stopPolling();
        }

        if (caseData.value?.imageId) {
            // Only fetch AI result if completed or if we don't have it yet
            if (caseData.value.status === 'ANALYZED' || caseData.value.status === 'COMPLETED' || !aiData.value) {
                await fetchAiResult();
            }
            // Always try to load image if hasn't been loaded
            if (!previewImageUrl.value) {
                await loadPreviewImage();
            }
        }
        
        if (!quiet) await fetchNotes();
    } catch (err) {
        console.error("Failed to sequence data hydration:", err);
        stopPolling();
    } finally {
        if (!quiet) loadingCase.value = false;
    }
};

const fetchCaseDetail = async () => {
    try {
        const response = await http.get(`/cases/${caseId.value}`);
        caseData.value = response.data;
        
        if (caseData.value) {
            patientData.value.patientCode = caseData.value.patientCode || '';
            if (caseData.value.patientMetadata) {
                try {
                    const meta = JSON.parse(caseData.value.patientMetadata);
                    patientData.value.age = meta.age || '';
                    patientData.value.gender = meta.gender || '';
                    patientData.value.weight = meta.weight || '';
                    patientData.value.riskFactors = meta.riskFactors || 'None';
                    patientData.value.feverDuration = meta.feverDuration || '';
                } catch(e) {
                     console.warn("Patient metadata malformed, falling back to defaults.");
                }
            }
        }
    } catch (err) {
        if (err.response?.status === 404) caseNotFound.value = true;
        else if (err.response?.status === 403) caseAccessDenied.value = true;
        else caseError.value = "Unable to load case detail. Please try again later.";
    }
};

const fetchAiResult = async () => {
    try {
        const response = await http.get(`/cases/${caseId.value}/ai-result`);
        if (response.data) {
            aiData.value = response.data;
            processAiDetections(response.data);
        }
    } catch (err) {
        console.warn("AI result context not established yet.");
    }
};

const processAiDetections = (data) => {
    if (data?.rawResponseJson) {
        try {
            const rawJson = JSON.parse(data.rawResponseJson);
            if (rawJson.images?.[0]?.results) {
                rawAiDetections.value = rawJson.images[0].results.map(res => {
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
        } catch (e) {
            console.error("Critical: AI raw data parsing failure.");
        }
    }
};

const fetchNotes = async () => {
    try {
        const res = await ClinicalService.getNotes(caseId.value);
        notes.value = res.data;
    } catch (err) {
        console.warn("Could not retrieve verdict timeline.");
    }
};

const triggerAnalysis = async () => {
    try {
        await http.post(`/cases/${caseId.value}/analyze`);
        await loadAllData(true); // Restart data cycle which will start polling
    } catch (err) {
        showAlert('Error', 'Analysis sequence interrupted. Please check network connectivity.', 'error');
    }
};

const loadPreviewImage = async () => {
    if (!caseData.value?.imageId) return;
    try {
        const response = await http.get(`/cases/${caseId.value}/images/${caseData.value.imageId}/content`, { responseType: 'arraybuffer' });
        const blob = new Blob([response.data], { type: response.headers['content-type'] || 'image/png' });
        if (previewImageUrl.value) URL.revokeObjectURL(previewImageUrl.value);
        previewImageUrl.value = URL.createObjectURL(blob);
    } catch (err) {
        console.warn("Specimen imagery rendering failed.");
    }
};

const handleSaveReport = async () => {
    isSavingReport.value = true;
    try {
        await savePatientInfo(true);
        if (verdictNotes.value.trim()) {
            await saveVerdict(true);
        }
        showSaveSuccess.value = true;
        setTimeout(() => { showSaveSuccess.value = false; }, 3000);
    } catch (err) {
        console.error("Consolidated save failed:", err);
    } finally {
        isSavingReport.value = false;
    }
}

const savePatientInfo = async (eventOrSilent) => {
    const silent = eventOrSilent === true;
    try {
        const payload = {
            patientCode: patientData.value.patientCode ? Number(patientData.value.patientCode) : null,
            patientMetadata: JSON.stringify({
                age: patientData.value.age,
                gender: patientData.value.gender,
                weight: patientData.value.weight,
                riskFactors: patientData.value.riskFactors,
                feverDuration: patientData.value.feverDuration
            })
        };
        await ClinicalService.updatePatientInfo(caseId.value, payload);
        if(!silent) {
            showSaveSuccess.value = true;
            setTimeout(() => { showSaveSuccess.value = false; }, 3000);
        }
    } catch (err) {
        if(!silent) {
            const msg = err.response?.data?.message || "Sync error. Verify patient ID format.";
            showAlert('Error', msg, 'error');
        }
        throw err;
    }
};

const parseNoteContent = (noteContent) => {
    if (!noteContent) return {};
    if (typeof noteContent === 'object') return noteContent;
    try { return JSON.parse(noteContent); } 
    catch (e) { return { notes: noteContent }; }
};

const getVerdictStatus = (note) => parseNoteContent(note.note).status || 'pending';

const toggleNoteStatus = async (note, status) => {
    const currentStatus = getVerdictStatus(note);
    const newStatus = currentStatus === status ? 'pending' : status;
    try {
        const content = parseNoteContent(note.note);
        content.status = newStatus;
        await ClinicalService.updateNote(caseId.value, note.id, JSON.stringify(content));
        await fetchNotes();
    } catch (err) {
        console.error("Verdict status update rejected.");
        showAlert('Error', 'Unable to update clinical verdict status. Please try again later.', 'error');
    }
};

const saveVerdict = async (eventOrSilent) => {
    const silent = eventOrSilent === true;
    if (!verdictNotes.value.trim()) return;
    isSavingVerdict.value = true;
    try {
        const payload = JSON.stringify({
            notes: verdictNotes.value,
            parasiteStage: confirmedStage.value,
            status: 'pending'
        });
        await ClinicalService.addNote(caseId.value, payload);
        verdictNotes.value = '';
        await fetchNotes();
        if(!silent) {
            showAlert('Success', 'Clinical verdict submitted successfully.', 'success');
        }
    } catch (err) {
        if(!silent) {
            console.error("Verdict persistence failed.");
            const apiMsg = err.response?.data?.message;
            const msg = apiMsg ? `Unable to submit clinical verdict. ${apiMsg}` : 'Unable to submit clinical verdict. Please try again later.';
            showAlert('Error', msg, 'error');
        }
        throw err;
    } finally {
        isSavingVerdict.value = false;
    }
};

const exportPdf = async () => {
    isExporting.value = true;
    try {
        const response = await ClinicalService.exportPdf(caseId.value);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `REPORT-${caseId.value}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        showAlert('Error', 'Export engine failed.', 'error');
    } finally {
        isExporting.value = false;
    }
};

const viewDigitalReport = () => {
    window.open(`/data-use/cases/${caseId.value}/report`, '_blank');
};

const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diffMs = new Date() - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
};

const parseRiskFactors = (str) => {
    if (!str || str === 'None') return [];
    return str.split(',').map(s => s.trim().toUpperCase());
};

onMounted(loadAllData);
onUnmounted(() => { 
    stopPolling();
    if (previewImageUrl.value) URL.revokeObjectURL(previewImageUrl.value); 
});
watch(() => route.params.id, (newId) => { if (newId) loadAllData(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

.font-manrope { font-family: 'Manrope', sans-serif; }
.font-inter { font-family: 'Inter', sans-serif; }

.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

.toast-enter-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}
.toast-enter-from {
  transform: translate(-50%, -100%);
  opacity: 0;
}
.toast-leave-to {
  transform: translate(-50%, -20px);
  opacity: 0;
}

input:focus, select:focus, textarea:focus {
    outline: none;
}
</style>

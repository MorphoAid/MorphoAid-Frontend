<template>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen bg-[#f8f9ff]">
    <div class="w-16 h-16 border-4 border-[#00458f]/20 border-t-[#00458f] rounded-full animate-spin mb-4"></div>
    <p class="font-manrope font-bold text-[#00458f] animate-pulse">Preparing Diagnostic Report...</p>
  </div>

  <div v-else-if="error === 'Case record not found.'" class="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
    <span class="material-symbols-outlined text-red-500 text-6xl mb-4">search_off</span>
    <h1 class="text-2xl font-black text-[#191c20] font-manrope mb-2 tracking-tight">Case record not found.</h1>
    <button @click="handleBack" class="px-8 py-3 bg-[#00458f] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4">
      Go Back
    </button>
  </div>

  <div v-else-if="error === 'Access denied.'" class="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
    <span class="material-symbols-outlined text-amber-500 text-6xl mb-4">lock</span>
    <h1 class="text-2xl font-black text-[#191c20] font-manrope mb-2 tracking-tight">Access denied.</h1>
    <button @click="handleBack" class="px-8 py-3 bg-[#00458f] text-white rounded-2xl font-black uppercase tracking-widest text-xs mt-4">
      Go Back
    </button>
  </div>

  <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
    <span class="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
    <h1 class="text-2xl font-black text-[#191c20] font-manrope mb-2 tracking-tight">Unable to load digital report. Please try again later.</h1>
    <p class="text-slate-500 font-medium mb-8 max-w-md">{{ error }}</p>
    <button @click="handleBack" class="px-8 py-3 bg-[#00458f] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#005cbb] transition-all shadow-lg active:scale-95">
      Return to Case Detail
    </button>
  </div>

  <div v-else class="bg-[#f8f9ff] font-inter text-[#191c20] antialiased print:bg-white min-h-screen print:min-h-0">
    <!-- Top Navigation Bar (Hidden on Print) -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 no-print">
      <div class="flex items-center justify-between px-8 py-4 max-w-screen-2xl mx-auto">
        <div class="flex items-center gap-2 cursor-pointer" @click="$router.push('/data-use')">
          <div class="w-8 h-8 bg-[#00458f] rounded-lg flex items-center justify-center text-white shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
            </svg>
          </div>
          <span class="text-xl font-black tracking-tighter text-[#00458f] font-manrope">MorphoAid</span>
        </div>
        <div class="flex items-center gap-4">
          <button @click="handleBack" class="flex items-center gap-2 px-4 py-2 text-slate-500 font-bold text-sm hover:text-[#00458f] transition-colors">
            <span class="material-symbols-outlined text-lg">arrow_back</span> Back
          </button>
          <button 
            v-if="caseData?.status === 'ANALYZED'"
            data-testid="export-report-button"
            @click="printReport" class="flex items-center gap-2 px-6 py-2.5 bg-[#00458f] text-white rounded-xl font-bold text-sm hover:bg-[#005cbb] transition-all shadow-md shadow-blue-900/10 active:scale-95">
            <span class="material-symbols-outlined text-lg">description</span> Export Report
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content Canvas -->
    <main class="pt-24 pb-12 px-6 flex flex-col items-center min-h-screen bg-[#f8f9ff] print:bg-white print:pt-0 print:pb-0 font-inter">
      
      <!-- Utility Actions -->
      <div class="w-full max-w-[210mm] mb-6 flex justify-between items-center no-print">
        <div class="flex items-center gap-2 text-slate-500 cursor-pointer hover:text-[#00458f] transition-colors" @click="handleBack">
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          <span class="text-sm font-bold">Back to Patient Archive</span>
        </div>
        <div class="flex gap-3">
          <button class="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm shadow-black/5 active:scale-95">
            <span class="material-symbols-outlined text-lg">share</span> Share
          </button>
          <button 
            v-if="caseData?.status === 'ANALYZED'"
            data-testid="export-report-button"
            @click="printReport" class="px-5 py-2.5 bg-[#00458f] text-white rounded-xl text-sm font-bold hover:bg-[#005cbb] transition-all flex items-center gap-2 shadow-lg shadow-blue-900/10 active:scale-95">
            <span class="material-symbols-outlined text-lg">description</span> Export Report
          </button>
        </div>
      </div>

      <!-- Page 1 -->
      <article class="report-page bg-white p-12 flex flex-col gap-10 relative overflow-hidden print:p-8">
        <!-- Watermark -->
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] rotate-[-45deg] select-none">
          <span class="text-9xl font-black font-headline">MALARIA AI</span>
        </div>

        <!-- Header Section -->
        <header class="flex justify-between items-start border-b border-[#00458f]/10 pb-10 relative z-10">
          <div class="flex gap-6 items-center">
            <div class="h-20 w-20 bg-[#d7e2ff] flex items-center justify-center rounded-3xl text-[#00458f] shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
              </svg>
            </div>
            <div>
              <h1 class="font-manrope text-4xl font-black tracking-tighter text-[#00458f] leading-none mb-1">MorphoAid</h1>
              <span class="text-[9px] text-[#00458f] font-bold uppercase tracking-[0.2em]">[Hospital Facility Name]</span>
            </div>
          </div>
          <div class="text-right">
            <h2 class="font-manrope text-2xl font-black text-[#191c20] tracking-tight">Diagnostic Report</h2>
            <div class="mt-3 space-y-1.5">
              <p class="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Report ID: <span class="text-[#00458f] ml-1">#CAS-{{ displayId }}</span></p>
              <p class="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Timestamp: <span class="text-[#191c20] ml-1">{{ generatedAt }}</span></p>
              <p class="text-[9px] text-[#00458f] font-bold uppercase tracking-widest pt-1">Page 1 of 2</p>
            </div>
          </div>
        </header>

        <!-- Patient & Case Summary: Bento-style Grid -->
        <section class="report-grid-3 grid grid-cols-1 md:grid-cols-3 gap-1 relative z-10 bg-slate-50 rounded-[2rem] p-1 border border-slate-100">
          <div class="col-span-1 md:col-span-2 bg-white p-8 rounded-l-[1.8rem]">
            <h3 class="text-[10px] font-black text-[#00458f] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined !text-sm">person</span> Patient Profile
            </h3>
            <div class="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5 opacity-70">Identifier</p>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ patientData.patientCode || 'Not Specified' }}</p>
              </div>
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5 opacity-70">Patient Name</p>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ patientData.name || 'Anonymous' }}</p>
              </div>
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5 opacity-70">Region</p>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ caseData.provinceName || 'Not Recorded' }}</p>
              </div>
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5 opacity-70">Clinical Data</p>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ patientData.age ? patientData.age + 'Y' : 'N/A' }} / {{ patientData.gender || 'N/A' }} / {{ patientData.weight ? patientData.weight + 'kg' : 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5 opacity-70">Fever Duration</p>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ patientData.feverDuration || 'Not Disclosed' }}</p>
              </div>
            </div>
          </div>
          <div class="bg-[#00458f]/5 p-8 rounded-r-[1.8rem] border-l border-white/50">
            <h3 class="text-[10px] font-black text-[#00458f] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined !text-sm">biotech</span> Clinical Context
            </h3>
            <div class="space-y-6">
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5 opacity-70">Technician</p>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ caseData.uploadedBy?.fullName || 'System Technician' }}</p>
              </div>
              <div>
                <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1.5 opacity-70">Collection Date</p>
                <p class="text-sm font-bold text-[#191c20] font-manrope">{{ formatDate(caseData.createdAt) }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Diagnostic Results Section -->
        <section class="space-y-8 relative z-10 report-grid-5">
          <div class="flex items-center justify-between">
            <h3 class="font-manrope text-xl font-black text-[#191c20] tracking-tight flex items-center gap-3">
              <span class="w-1.5 h-8 bg-[#00458f] rounded-full"></span> Microscopy & AI Detection
            </h3>
            <div v-if="aiData" class="px-4 py-1.5 bg-[#a0f0f0] text-[#004f4f] rounded-full text-[10px] font-black uppercase tracking-widest ring-4 ring-[#a0f0f0]/30">
              AI Confidence: {{ (aiData.confidence * 100).toFixed(1) }}%
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-5 gap-10 items-start print-grid-5">
            <!-- Blood Smear Image -->
            <div class="md:col-span-3 space-y-4 print-span-3">
              <div class="aspect-video bg-slate-900 rounded-[2rem] overflow-hidden relative border border-slate-100 shadow-inner group flex items-center justify-center">
                <AnnotatedImage 
                   v-if="caseData && aiData && aiData.rawResponseJson" 
                   :case-id="caseId" 
                   :image-id="caseData.imageId" 
                   :detections="rawResults"
                   class="max-w-full max-h-full"
                />
                <div v-else-if="previewImageUrl" class="w-full h-full relative">
                   <img :src="previewImageUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <span class="material-symbols-outlined text-6xl mb-2">image_not_supported</span>
                  <p class="text-xs font-bold uppercase tracking-widest">Image Unavailable</p>
                </div>
              </div>
              <p class="text-[10px] text-slate-400 italic text-center font-medium">Digital Photomicrograph: Annotated Specimen Sample</p>
            </div>
            
            <!-- AI Analysis Table -->
            <div class="md:col-span-2 space-y-6">
              <div class="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="bg-slate-50/50">
                      <th class="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Morphology</th>
                      <th class="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px] text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr>
                      <td class="px-6 py-4">
                        <p class="text-[10px] text-slate-400 font-bold uppercase mb-0.5 opacity-60">Dominant Stage</p>
                        <p class="text-sm font-black text-[#191c20] font-manrope">{{ aiData?.parasiteStage || 'None Detected' }}</p>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <span class="text-sm font-black text-[#00458f] font-manrope">{{ aiData ? (aiData.confidence * 100).toFixed(1) + '%' : '-' }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-6 py-4">
                        <p class="text-[10px] text-slate-400 font-bold uppercase mb-0.5 opacity-60">Drug Sensitivity</p>
                        <p class="text-sm font-black text-[#191c20] font-manrope">{{ aiData?.drugExposure ? 'Type ' + aiData.drugType : 'None Observed' }}</p>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <span class="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{{ aiData?.drugExposure ? 'DETECTED' : 'CLEAR' }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div v-if="aiData" class="p-6 bg-[#00458f]/5 rounded-[2rem] border border-[#00458f]/10">
                <p class="text-[10px] font-black text-[#00458f] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">auto_awesome</span> System Insight
                </p>
                <p class="text-xs text-slate-600 leading-relaxed font-medium">
                  {{ generateAiRecommendation() }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </article>

      <!-- Page Break Indicator -->
      <div class="page-break-indicator no-print">
        Page Break
      </div>

      <!-- Page 2 -->
      <article class="report-page bg-white p-12 flex flex-col gap-10 relative overflow-hidden print:p-8">
        <!-- Watermark -->
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] rotate-[-45deg] select-none">
          <span class="text-9xl font-black font-headline">MALARIA AI</span>
        </div>

        <!-- Condensed Header for Page 2 -->
        <header class="flex justify-between items-center border-b border-[#00458f]/10 pb-6 relative z-10 mb-4">
          <div class="flex gap-4 items-center">
            <div class="h-12 w-12 bg-[#d7e2ff] flex items-center justify-center rounded-xl text-[#00458f]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
              </svg>
            </div>
            <h2 class="font-manrope text-xl font-black text-[#00458f] tracking-tighter pt-1">MorphoAid</h2>
          </div>
          <div class="text-right">
            <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest">Report ID: <span class="text-[#00458f] font-bold">#CAS-{{ displayId }}</span></p>
            <p class="text-[9px] text-[#00458f] font-bold uppercase tracking-widest">Page 2 of 2</p>
          </div>
        </header>

        <!-- Final Verdict Section -->
        <section class="bg-[#f2f3f9] p-10 rounded-[2.5rem] relative z-10 border border-slate-200/50 flex-grow">
          <h3 class="text-[10px] font-black text-[#00458f] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <span class="material-symbols-outlined !text-sm">verified</span> Clinician Final Verdict
          </h3>
          <div class="space-y-12">
            <div>
              <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3 opacity-70">Conclusion / Diagnosis</p>
              <div class="inline-flex items-center gap-4 px-6 py-3 rounded-2xl shadow-sm border transition-all"
                   :class="finalVerdictStatus === 'accepted' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-100 text-[#191c20]'">
                <span v-if="finalVerdictStatus === 'accepted'" class="material-symbols-outlined text-2xl text-emerald-500">check_circle</span>
                <p class="text-3xl font-manrope font-black uppercase">{{ finalDiagnosis }}</p>
              </div>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-4 opacity-70">Clinician Notes & Observations</p>
              <div v-if="notes.length > 0" class="space-y-4">
                <div v-for="note in notes" :key="note.id" 
                     class="relative group border rounded-[2rem] p-8 transition-all duration-300 overflow-hidden shadow-sm"
                     :class="getVerdictStatus(note) === 'accepted' ? 'bg-emerald-50 border-emerald-100' : getVerdictStatus(note) === 'discarded' ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'">
                  
                  <!-- Status Overlay Icon -->
                  <div v-if="getVerdictStatus(note) !== 'pending'" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <span class="material-symbols-outlined text-[8rem]" :class="getVerdictStatus(note) === 'accepted' ? 'text-emerald-500' : 'text-red-600'">
                      {{ getVerdictStatus(note) === 'accepted' ? 'check_circle' : 'cancel' }}
                    </span>
                  </div>

                  <div class="relative z-10 flex flex-col h-full">
                    <div class="flex justify-between items-start mb-4">
                      <div class="flex-1 mr-4">
                        <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ note.authorName }} • {{ formatDate(note.createdAt) }}</p>
                        <div class="flex flex-wrap gap-2 items-center mt-1">
                            <p class="text-base font-black text-[#191c20] capitalize tracking-tight">{{ (parseNoteContent(note.note).parasiteStage || 'Observation').toLowerCase().replace('druga', 'DrugA').replace('drugb', 'DrugB') }}</p>
                            <span v-if="parseNoteContent(note.note).drugExposure && parseNoteContent(note.note).drugExposure !== 'None'" 
                                  class="px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-black rounded border border-amber-100 uppercase tracking-tighter">
                                  {{ parseNoteContent(note.note).drugExposure }} Exposure
                            </span>
                        </div>
                      </div>
                      <div class="flex gap-2">
                         <span v-if="getVerdictStatus(note) === 'accepted'" class="material-symbols-outlined text-emerald-500">check_circle</span>
                         <span v-if="getVerdictStatus(note) === 'discarded'" class="material-symbols-outlined text-red-500">cancel</span>
                      </div>
                    </div>
                    <div class="mt-2 pt-3 border-t border-slate-100/50">
                      <p class="text-sm text-slate-600 leading-relaxed font-medium italic">"{{ parseNoteContent(note.note).notes || 'No detailed observations recorded.' }}"</p>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-slate-400 italic font-medium bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-inner">
                Automated analysis performed with no additional clinical overrides recorded at the time of export.
              </p>
            </div>
          </div>
        </section>

        <!-- Signature Section -->
        <section class="grid grid-cols-2 gap-20 relative z-10 pt-4">
          <div class="space-y-4">
            <div class="h-24 border-b border-slate-200 flex items-end pb-3 px-2 italic font-serif text-3xl opacity-30 select-none">
               Authorized Signature
            </div>
            <div class="px-2">
              <p class="text-sm font-black text-[#191c20] font-manrope">{{ caseData.uploadedBy?.fullName || 'Technician' }}</p>
              <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest">Reporting Health Professional</p>
            </div>
          </div>
          <div class="space-y-4">
            <div class="h-24 border-b border-slate-200 flex items-end pb-3 px-2 italic font-serif text-3xl opacity-30 select-none">
               Report Identifier
            </div>
            <div class="px-2">
              <p class="text-sm font-black text-[#191c20] font-manrope">MorphoAid Node Agent v2.4</p>
              <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest">Diagnostic Processing System</p>
            </div>
          </div>
        </section>

        <!-- Footer Section -->
        <footer class="mt-auto pt-10 border-t border-slate-100 relative z-10">
          <div class="flex flex-col md:flex-row justify-between items-end gap-6">
            <div class="max-w-xl">
              <p class="text-[8px] text-slate-300 leading-normal font-bold uppercase tracking-tight">
                CLINICAL DISCLAIMER: This report contains AI-assisted analytical output for clinical support purposes only and must be reviewed by qualified personnel. MorphoAid does not replace professional medical judgment. Final responsibility for diagnosis and therapeutic intervention remains with the attending clinician. Data encrypted @ 256-bit AES.
              </p>
            </div>
            <div class="flex flex-col items-end">
              <div class="flex items-center gap-2 mb-1">
                <span class="material-symbols-outlined text-[#00458f] text-sm">assignment</span>
                <span class="text-sm font-black text-[#00458f] font-manrope tracking-tighter">MorphoAid™ Diagnostic Note</span>
              </div>

            </div>
          </div>
        </footer>
      </article>

      <div class="mt-10 text-center text-slate-300 no-print pb-12">
        <p class="text-[10px] font-black uppercase tracking-widest">System Secure • Encrypted Link • Printed on {{ generatedAt.split('•')[0] }}</p>
      </div>
    </main>

    <!-- Alert Modal (SRS-99/100) -->
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
              <h3 data-testid="alert-title" class="text-2xl font-black text-[#191c20] font-manrope mb-2 tracking-tight">{{ alert.title }}</h3>
              <p data-testid="alert-message" class="text-slate-400 font-bold text-sm leading-relaxed mb-8">{{ alert.message }}</p>
              <button @click="closeAlert" class="w-full py-4 bg-[#00458f] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#00458f]/20 hover:scale-[1.02] active:scale-95 transition-all">
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
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '@/services/http';
import ClinicalService from '@/features/clinical/services/clinical.service';
import AnnotatedImage from '@/components/AnnotatedImage.vue';

const route = useRoute();
const router = useRouter();
const caseId = route.params.id;

const loading = ref(true);
const error = ref(null);

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
const caseData = ref(null);
const aiData = ref(null);
const rawResults = ref([]);
const notes = ref([]);
const previewImageUrl = ref(null);
const patientData = ref({
    patientCode: '',
    name: '',
    age: '',
    gender: '',
    weight: '',
    riskFactors: 'None',
    feverDuration: ''
});

const displayId = computed(() => {
    return String(caseId).padStart(5, '0');
});

const generatedAt = computed(() => {
    return new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }) + ' • ' + new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }) + ' UTC';
});


const parseNoteContent = (noteContent) => {
    if (!noteContent) return {};
    if (typeof noteContent === 'object') return noteContent;
    try { return JSON.parse(noteContent); } 
    catch (e) { return { notes: noteContent }; }
};

const getVerdictStatus = (note) => parseNoteContent(note.note).status || 'pending';

const finalDiagnosis = computed(() => {
    // Find the latest accepted verdict
    const acceptedVerdict = [...notes.value].reverse().find(n => getVerdictStatus(n) === 'accepted');
    if (acceptedVerdict) {
        return parseNoteContent(acceptedVerdict.note).parasiteStage;
    }
    return aiData.value?.parasiteStage || 'Ring';
});

const finalVerdictStatus = computed(() => {
    const acceptedVerdict = [...notes.value].reverse().find(n => getVerdictStatus(n) === 'accepted');
    if (acceptedVerdict) return 'accepted';
    
    // Check if there are any discarded ones to maybe show a warning, 
    // but usually we just care if it's accepted or still pending/AI
    return 'pending';
});

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const generateAiRecommendation = () => {
    if (!aiData.value) return 'System idle. Waiting for analysis parameters.';
    const stage = aiData.value.parasiteStage;
    const confidence = (aiData.value.confidence * 100).toFixed(1);
    
    if (stage === 'RING' || (aiData.value.topClassId === 2)) {
        return `Diagnostic metrics (${confidence}%) strongly indicate Ring-form trophozoites. This morphology is consistent with early P. falciparum infection. Immediate correlation with patient travel history is advised for endemic zone validation.`;
    } else if (stage === 'TROPH' || (aiData.value.topClassId === 4)) {
        return `Trophozoite detection confirmed with ${confidence} precision. Significant parasitemia threshold may be approaching. Requesting clinical monitoring of vital signs.`;
    } else if (aiData.value.drugExposure) {
        return `AI has detected morphological response indicative of Drug Exposure (Type ${aiData.value.drugType}). Current confidence stands at ${confidence}%. Efficacy of current protocol should be secondary verified through subsequent films.`;
    }
    return `Analysis parameters established with ${confidence} confidence. Morphology identified as ${stage || 'Undetermined'}. No critical anomalies detected outside normal variance for this stage.`;
};

const processAiResults = (data) => {
    if (data && data.rawResponseJson) {
        try {
            const rawJson = JSON.parse(data.rawResponseJson);
            if (rawJson.images && rawJson.images.length > 0) {
                const firstImage = rawJson.images[0];
                if (firstImage.results && firstImage.results.length > 0) {
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
                }
            }
        } catch (e) {
            console.warn('Failed to parse rawResponseJson in report:', e);
        }
    }
};

const handleBack = () => {
    if (window.opener || window.history.length <= 1) {
        window.close();
        setTimeout(() => router.push('/data-use/cases'), 100);
    } else {
        router.back();
    }
};

const printReport = () => {
    if (caseData.value?.status !== 'ANALYZED') {
        showAlert('Export Restricted', 'Report export is only allowed for analyzed cases.', 'error');
        return;
    }

    // Set up completion handler before triggering the system dialog
    window.onafterprint = () => {
        showAlert('Success', 'Report exported successfully.', 'success');
        window.onafterprint = null; // Clean up
    };

    try {
        window.print();
    } catch (err) {
        console.error("Export execution failed:", err);
        showAlert('Error', 'Error exporting report. Please try again later.', 'error');
        window.onafterprint = null;
    }
};

const loadData = async () => {
    if (!caseId) {
        error.value = "Missing Case identifier.";
        loading.value = false;
        return;
    }

    try {
        // Fetch Case, AI, and Notes in parallel
        const [caseRes, aiRes, notesRes] = await Promise.all([
            http.get(`/cases/${caseId}`),
            http.get(`/cases/${caseId}/ai-result`),
            ClinicalService.getNotes(caseId)
        ]);

        caseData.value = caseRes.data;
        aiData.value = aiRes.data;
        notes.value = notesRes.data;

        // Process AI results for AnnotatedImage
        if (aiData.value) {
            processAiResults(aiData.value);
        }

        // Parse meta if available
        if (caseData.value.patientMetadata) {
            try {
                const meta = JSON.parse(caseData.value.patientMetadata);
                patientData.value = { ...patientData.value, ...meta };
            } catch (e) {
                patientData.value.name = caseData.value.patientMetadata;
            }
        }
        patientData.value.patientCode = caseData.value.patientCode;

        // Load image binary
        if (caseData.value.imageId) {
            try {
                const imgRes = await http.get(
                    `/cases/${caseId}/images/${caseData.value.imageId}/content`,
                    { responseType: 'arraybuffer' }
                );
                const blob = new Blob([imgRes.data], {
                    type: imgRes.headers['content-type'] || 'image/png',
                });
                previewImageUrl.value = URL.createObjectURL(blob);
            } catch (imgErr) {
                console.warn('Could not load microscopic image for report:', imgErr);
            }
        }

        loading.value = false;
    } catch (err) {
        console.error('Diagnostic Report data failure:', err);
        if (err.response?.status === 404) {
            error.value = "Case record not found.";
        } else if (err.response?.status === 403) {
            error.value = "Access denied.";
        } else {
            error.value = "Unable to retrieve clinical data for this case record. The data may have been moved or you may lack sufficient permissions.";
        }
        loading.value = false;
    }
};

onMounted(loadData);

onUnmounted(() => {
    if (previewImageUrl.value) URL.revokeObjectURL(previewImageUrl.value);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

.font-manrope { font-family: 'Manrope', sans-serif; }
.font-inter { font-family: 'Inter', sans-serif; }

.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
}

@media screen {
    .report-page {
        width: 210mm;
        min-height: 297mm;
        margin: 2rem auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 12px;
    }
    .page-break-indicator {
        width: 210mm;
        margin: 1rem auto;
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #94a3b8;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }
    .page-break-indicator::before,
    .page-break-indicator::after {
        content: "";
        flex: 1;
        height: 1px;
        background: #e2e8f0;
        border-top: 1px dashed #cbd5e1;
    }
}

@media print {
  @page {
    size: A4;
    margin: 12mm 15mm; /* Balanced professional margins */
  }

  .no-print { display: none !important; }
  
  body { 
    background-color: white !important;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    font-size: 10.5pt !important; /* Standard readable print size */
  }
  
  main { 
    margin: 0 !important; 
    padding: 0 !important;
    width: 100% !important; 
    display: block !important;
  }
  
  .report-page { 
    box-shadow: none !important; 
    margin: 0 !important; 
    width: 100% !important; 
    height: 270mm !important; /* Approx fit for A4 minus @page margins */
    page-break-after: always !important;
    break-after: page !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important; /* Let @page handle parent margins */
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    overflow: visible !important;
  }

  .page-break-indicator { display: none !important; }

  section {
    page-break-inside: avoid;
    break-inside: avoid;
    margin-bottom: 2rem !important;
    display: block !important;
    width: 100% !important;
    overflow: visible !important;
  }

  /* Robust grid definitions for PDF engine */
  .report-grid-3 {
    display: grid !important;
    grid-template-columns: 2fr 1fr !important;
    gap: 0.5rem !important;
  }

  .print-grid-5 {
    display: grid !important;
    grid-template-columns: 3fr 2fr !important;
    gap: 1.5rem !important;
  }

  /* Increase heading sizes for professional look */
  h1 { font-size: 32pt !important; line-height: 1 !important; }
  h2 { font-size: 20pt !important; line-height: 1.2 !important; }
  h3 { font-size: 10pt !important; letter-spacing: 0.1em !important; }

  img, canvas {
    max-width: 100% !important;
    height: auto !important;
  }

  .aspect-video {
    aspect-ratio: 16/9 !important;
    max-height: 90mm !important; /* Maximize image size on Page 1 */
  }
  
  .bg-slate-50 { background-color: #f8fafc !important; }
  div[class*="bg-[#00458f]/5"] { background-color: rgba(0, 69, 143, 0.05) !important; }
}
</style>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
    <p class="text-on-surface-variant font-headline font-bold">Loading Page Content...</p>
  </div>

  <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
    <span class="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
    <h1 class="text-2xl font-black text-[#191c20] font-manrope mb-2 tracking-tight">Unable to load page content.</h1>
    <p class="text-slate-500 font-medium mb-8 max-w-md">Unable to load page content. Please try again later.</p>
    <button @click="$router.back()" class="px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg active:scale-95">
      Go Back
    </button>
  </div>

  <div v-else class="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-full">
    <main class="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <!-- Hero Section -->
      <header class="mb-24 mt-12 text-center max-w-4xl mx-auto">
        <h1 class="font-headline text-6xl md:text-7xl font-extrabold text-on-surface tracking-tight mb-8">
          About MorphoAid
        </h1>
        <p class="text-xl md:text-2xl text-on-surface-variant leading-relaxed font-light">
          A digital platform that transforms malaria AI research into a practical and user-friendly interface for case review, diagnostic support, and information management.
        </p>
      </header>

      <!-- Bento Grid Section: Malaria & MORU -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
        <!-- About Malaria Card -->
        <section class="md:col-span-7 bg-surface-container-low rounded-xl p-8 md:p-12 flex flex-col justify-between overflow-hidden relative">
          <div class="relative z-10">

            <h2 class="text-4xl font-headline font-bold text-on-surface mb-6">About Malaria</h2>
            <p class="text-on-surface-variant leading-relaxed text-lg mb-6">
              Malaria is a serious infectious disease caused by Plasmodium parasites. While preventable and treatable, accurate diagnosis and clear clinical interpretation are essential for safe and effective malaria management.
            </p>
            <div class="flex flex-wrap gap-4 mt-8">
              <div class="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/15">
                <span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">shield</span>
                <span class="text-sm font-medium">Prevention Focus</span>
              </div>
              <div class="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/15">
                <span class="material-symbols-outlined text-primary">biotech</span>
                <span class="text-sm font-medium">Parasitological Data</span>
              </div>
            </div>
          </div>
          <div class="absolute -right-12 -bottom-12 w-64 h-64 opacity-10 pointer-events-none">
            <img class="w-full h-full object-cover rounded-full" alt="laboratory view of blood cells" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf8DEkNVNrgc-jicyDx5Jhommk8LB_UM4aAqN1El9CEDITX16lzwotrPoVL-xMUtKZ-UL4HZbIg954TU8rBtWfC0eTrNpj2gS4auXbTrZRtKNEHyyGw7XbVc7EV23__rMujN6n5dGmJKQ5_ggWrhj9P1RCKVzH2DIyxyIwmIFCrpCbpudNRx1EFERN07SmFKWjmZwDaGU4PpYbv6i5KhKXtxtml7r2JeHnrtUAqrccYiow5zPWeVc3NaBliS2rIY-Wsy0aJICBww"/>
          </div>
        </section>

        <!-- About MORU Card -->
        <section class="md:col-span-5 bg-primary text-on-primary rounded-xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
          <div class="relative z-10">
            <h2 class="text-3xl font-headline font-bold mb-6 text-white">About MORU</h2>
            <p class="opacity-90 leading-relaxed text-lg font-light text-white">
              The Mahidol Oxford Tropical Medicine Research Unit, or MORU, is a long-established tropical medicine research collaboration. Their support has made it possible for us to transform advanced AI research into a more accessible and practical digital tool for real-world use.
            </p>
            <div class="mt-8 pt-8 border-t border-white/20">
              <p class="text-sm uppercase tracking-widest font-bold font-headline mb-4 opacity-70 text-white">Research Ecosystem</p>
              <div class="flex items-center gap-4 text-white">
                <span class="material-symbols-outlined text-4xl">account_balance</span>
                <span class="material-symbols-outlined text-4xl">groups</span>
                <span class="material-symbols-outlined text-4xl">school</span>
              </div>
            </div>
          </div>
          <!-- Abstract visual element -->
          <div class="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none" style="background-image: radial-gradient(circle at 100% 0%, white 0%, transparent 60%);"></div>
        </section>
      </div>

      <!-- Workflow & Platform Features -->
      <section class="mb-24">
        <div class="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div class="max-w-2xl">
            <h2 class="text-4xl font-headline font-extrabold text-on-surface mb-4">The MorphoAid Platform</h2>
            <p class="text-on-surface-variant text-lg">
              MorphoAid is a digital platform designed to support malaria-related image analysis and case management. Our framework is built on four core pillars of diagnostic excellence.
            </p>
          </div>
          <div class="hidden md:block h-[2px] flex-grow mx-12 bg-surface-container-high mb-4"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Card 1 -->
          <div class="bg-surface-container-lowest p-8 rounded-xl transition-all duration-300 hover:bg-surface-bright group border border-transparent hover:border-outline-variant/15">
            <div class="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-primary">image_search</span>
            </div>
            <h3 class="text-xl font-headline font-bold text-on-surface mb-4">Image Analysis</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">
              High-precision processing of microscopy slides using trained AI models to detect and classify Plasmodium species.
            </p>
          </div>
          <!-- Card 2 -->
          <div class="bg-surface-container-lowest p-8 rounded-xl transition-all duration-300 hover:bg-surface-bright group border border-transparent hover:border-outline-variant/15">
            <div class="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-secondary">clinical_notes</span>
            </div>
            <h3 class="text-xl font-headline font-bold text-on-surface mb-4">Case Management</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">
              Structured documentation for patient history, treatment tracks, and longitudinal diagnostic monitoring.
            </p>
          </div>
          <!-- Card 3 -->
          <div class="bg-surface-container-lowest p-8 rounded-xl transition-all duration-300 hover:bg-surface-bright group border border-transparent hover:border-outline-variant/15">
            <div class="w-12 h-12 bg-tertiary-fixed rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-tertiary">monitoring</span>
            </div>
            <h3 class="text-xl font-headline font-bold text-on-surface mb-4">Visualization</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">
              Insight features that translate complex data into clear, actionable visual reports for clinicians.
            </p>
          </div>
          <!-- Card 4 -->
          <div class="bg-surface-container-lowest p-8 rounded-xl transition-all duration-300 hover:bg-surface-bright group border border-transparent hover:border-outline-variant/15">
            <div class="w-12 h-12 bg-error-container rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-error">hub</span>
            </div>
            <h3 class="text-xl font-headline font-bold text-on-surface mb-4">Workflow Sync</h3>
            <p class="text-on-surface-variant text-sm leading-relaxed">
              Aims to make malaria-related workflows clearer, more organized, and more accessible for practical use.
            </p>
          </div>
        </div>
      </section>

      <!-- Academic & Technical Context -->
      <section class="bg-surface-container rounded-xl p-8 md:p-12 mb-24 overflow-hidden relative">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h2 class="text-3xl font-headline font-bold text-on-surface mb-6">Commitment to Clinical Precision</h2>
            <p class="text-on-surface-variant leading-relaxed mb-6">
              MorphoAid operates at the intersection of medical science and advanced computing. We understand that in the clinical environment, every pixel counts. Our system is built to provide diagnostic support that augments—rather than replaces—the expertise of trained parasitologists.
            </p>
            <div class="flex flex-col gap-4">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-1">check_circle</span>
                <div>
                  <span class="font-bold block">Rigorous Validation</span>
                  <span class="text-sm text-on-surface-variant">Validated against expert manual microscopy benchmarks.</span>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary mt-1">check_circle</span>
                <div>
                  <span class="font-bold block">Privacy First</span>
                  <span class="text-sm text-on-surface-variant">Architecture designed for patient data security and ethical AI use.</span>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-lg overflow-hidden h-64 md:h-80 shadow-2xl">
            <img class="w-full h-full object-cover" alt="a clean high-tech medical research lab" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9ijMfxl5ePAAtsmIePPmhwkhgvimsgOzkwrWdww3tuNkBTE04FUCVvmx2NuLWJmzrejQJ1pE1mO_K5HCW8C-KmfwyxqPJ_bhFtTYOyU5bnZPSNy6GLt1x1pBtXr88xyC2XfTtKE664GQR6W_JYgBn-YZ-JRPQ7rQV6CHuzArPzT6vT65aBzRiPHgH61o8v1MmMg5UHRN7uJ9IsWdQJqHTMjXdNsTpvA1BPSBNIGn09ALTlIWK8Kwz_l0MFMVXIvWcgsNwII8C9w"/>
          </div>
        </div>
        <!-- Decorative circle -->
        <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full px-8 py-12 mt-auto border-t border-outline-variant/15 bg-surface-container-low">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div class="space-y-4">
            <span class="text-lg font-bold text-on-surface font-headline">MorphoAid AI</span>
            <p class="text-sm font-body text-on-surface-variant max-w-xs">
              © 2026 MorphoAid AI. Clinical Diagnostic Support System.
              <br/>
              <span class="block mt-2 font-medium italic">Developed as part of an academic and practical collaboration.</span>
            </p>
          </div>

        </div>
        <div class="pt-8 border-t border-outline-variant/15 text-center">
          <p class="text-xs text-on-surface-variant/70 leading-relaxed max-w-2xl mx-auto">
            MorphoAid provides AI-assisted diagnostic support and does not replace professional clinical judgment. All results should be reviewed and interpreted by qualified healthcare personnel.
          </p>
          <div class="mt-4 flex justify-center gap-6">
            <button @click="isPrivacyModalOpen = true" class="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">Privacy Notice</button>
            <button @click="isTermsModalOpen = true" class="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">Terms of Use</button>
          </div>
        </div>
      </div>
    </footer>

    <PolicyModal 
      :is-open="isPrivacyModalOpen" 
      title="Privacy Notice" 
      @close="isPrivacyModalOpen = false"
    >
      <LegalContent :sections="privacySections" />
    </PolicyModal>

    <PolicyModal 
      :is-open="isTermsModalOpen" 
      title="Terms of Use" 
      @close="isTermsModalOpen = false"
    >
      <LegalContent :sections="termsSections" />
    </PolicyModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PolicyModal from '@/components/legal/PolicyModal.vue'
import LegalContent from '@/components/legal/LegalContent.vue'
import { privacySections, termsSections } from '@/data/legalPolicies'

const isPrivacyModalOpen = ref(false)
const isTermsModalOpen = ref(false)
const loading = ref(true)
const error = ref(null)

onMounted(() => {
    // Simulated loading as per SRS consistency
    setTimeout(() => {
        loading.value = false
    }, 400)
    
    // In a real scenario, we might wrap this in a try-catch for dynamic content
    // error.value = "Failed to load" // SRS test toggle
})
</script>

<style scoped>
.font-headline { font-family: 'Manrope', sans-serif; }
.font-body { font-family: 'Inter', sans-serif; }

.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
}
</style>

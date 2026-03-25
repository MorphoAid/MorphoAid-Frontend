<template>
  <div class="max-w-4xl mx-auto px-6 py-16 font-inter text-[#2E2E2E] bg-white shadow-sm border border-gray-100 mt-8 mb-20 rounded-2xl">
    <div class="mb-12 text-center border-b border-gray-100 pb-10">
        <h1 class="text-4xl font-black mb-4 font-manrope tracking-tight text-primary">MorphoAid Terms of Use</h1>
        <div class="flex items-center justify-center gap-6 text-sm text-gray-400 font-medium">
            <span>Effective Date: 2026-03-25</span>
            <div class="w-1 h-1 bg-gray-200 rounded-full"></div>
            <span>Last Updated: 2026-03-25</span>
        </div>
    </div>

    <section class="space-y-12 text-[15px] leading-relaxed text-gray-600">
      <div v-for="section in termsSections" :key="section.id" :id="'section-' + section.id">
          <h2 class="text-xl font-bold mb-4 font-manrope text-[#191c20] flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center text-xs font-black">{{ section.id.toString().padStart(2, '0') }}</span>
              {{ section.title }}
          </h2>
          <div v-html="section.content" class="legal-content" :class="{ 'disclaimer-box': section.id === 6 }"></div>
      </div>
    </section>
    
    <div class="mt-20 pt-12 border-t flex items-center justify-between gap-12">
      <div class="text-left font-manrope">
          <p class="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-1">MorphoAid Terms © 2026</p>
          <p class="text-xs text-gray-400">Institutional Governance & Service Terms</p>
      </div>
      <button @click="router.back()" class="px-8 py-3 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all transform hover:scale-105 active:scale-95">Return</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const termsSections = [
  { id: 1, title: '1. Acceptance of Terms', content: '<p>These Terms of Use (“Terms”) govern your access to and use of the MorphoAid application. By registering or using MorphoAid, you agree to be bound by these Terms.</p>' },
  { id: 2, title: '2. About MorphoAid', content: '<p>MorphoAid is a digital platform designed to support malaria-related image analysis and case management. It is provided for academic, research, or project-related use.</p>' },
  { id: 3, title: '3. Eligibility and Authorized Use', content: '<p>You may use MorphoAid only if authorized, properly approved, and usage is for legitimate purposes in compliance with these terms and law.</p>' },
  { id: 4, title: '4. Accounts and Security', content: '<p>You are responsible for confidentiality of credentials and activity under your account. We may suspend or terminate accounts for security reasons.</p>' },
  { id: 5, title: '5. Acceptable Use', content: '<p>You agree not to use platform for unlawful purposes, misuse patient data, or interfere with system security/performance.</p>' },
  { id: 6, title: '6. Clinical and Research Use Disclaimer', content: '<p class="font-bold underline text-red-700">MorphoAid is an AI-assisted support platform. It does not replace professional clinical judgment. Users are solely responsible for all final decisions. Must not rely on it as the sole basis for diagnosis.</p>' },
  { id: 7, title: '7. Data and User Content', content: '<p>You retain responsibility for data/images you upload. You grant MorphoAid a limited right to process this content solely for operating the platform.</p>' },
  { id: 8, title: '8. Privacy', content: '<p>Your use of MorphoAid is subject to the MorphoAid Privacy Notice.</p>' },
  { id: 9, title: '9. Intellectual Property', content: '<p>MorphoAid (interface, softwave, workflows) is property of the project owner. Unauthorized reproduction is prohibited.</p>' },
  { id: 10, title: '10. Availability and Changes', content: '<p>We may modify or suspend MorphoAid at any time. We do not guarantee uninterrupted availability.</p>' },
  { id: 11, title: '11. No Warranty', content: '<p>MorphoAid is provided on an “as is” and “as available” basis.</p>' },
  { id: 12, title: '12. Limitation of Liability', content: '<p>To the maximum extent permitted by law, MorphoAid and its owners shall not be liable for indirect, incidental, or consequential damages.</p>' },
  { id: 13, title: '13. Termination', content: '<p>We may suspend access if you violate these terms or your access is no longer authorized.</p>' },
  { id: 14, title: '14. Governing Rules', content: '<p>These Terms shall be governed by the laws and institutional rules of Thailand.</p>' },
  { id: 15, title: '15. Changes to These Terms', content: '<p>We may revise These Terms from time to time. Continued use after updates constitutes acceptance.</p>' },
  { id: 16, title: '16. Contact', content: '<p>For questions, contact the MorphoAid Project Team at Chiang Mai University (details in Section 14 of Privacy Notice).</p>' }
]
</script>

<style scoped>
.legal-content :deep(p) { margin-bottom: 0.5rem; }
.disclaimer-box { background: rgba(239, 68, 68, 0.05); padding: 1.5rem; border-radius: 1rem; border: 1px solid rgba(239, 68, 68, 0.2); }
</style>

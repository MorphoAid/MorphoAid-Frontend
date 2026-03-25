<template>
  <div class="max-w-4xl mx-auto px-6 py-16 font-inter text-[#2E2E2E] bg-white shadow-sm border border-gray-100 mt-8 mb-20 rounded-2xl">
    <div class="mb-12 text-center border-b border-gray-100 pb-10">
        <h1 class="text-4xl font-black mb-4 font-manrope tracking-tight text-[#00458f]">MorphoAid Privacy Notice</h1>
        <div class="flex items-center justify-center gap-6 text-sm text-gray-400 font-medium">
            <span>Effective Date: 2026-03-25</span>
            <div class="w-1 h-1 bg-gray-200 rounded-full"></div>
            <span>Last Updated: 2026-03-25</span>
        </div>
    </div>

    <section class="space-y-12 text-[15px] leading-relaxed text-gray-600">
      <div v-for="section in privacySections" :key="section.id">
          <h2 class="text-xl font-bold mb-4 font-manrope text-[#191c20] flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-[#00458f]/5 text-[#00458f] flex items-center justify-center text-xs font-black">{{ section.id.toString().padStart(2, '0') }}</span>
              {{ section.title }}
          </h2>
          <div v-html="section.content" class="legal-content"></div>
      </div>
    </section>
    
    <div class="mt-20 pt-12 border-t flex items-center justify-between gap-12">
      <div class="text-left font-manrope">
          <p class="text-[#00458f] font-black uppercase text-[10px] tracking-[0.3em] mb-1">MorphoAid Project © 2026</p>
          <p class="text-xs text-gray-400">Chiang Mai University Academic Platform</p>
      </div>
      <button @click="router.back()" class="px-8 py-3 bg-[#00458f]/5 text-[#00458f] font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#00458f] hover:text-white transition-all transform hover:scale-105 active:scale-95">Return</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const privacySections = [
  { id: 1, title: '1. Introduction', content: '<p>MorphoAid (“MorphoAid,” “we,” “us,” or “our”) respects your privacy and is committed to protecting personal data handled through our platform.</p><p class="mt-2">This Privacy Notice explains how we collect, use, disclose, store, and protect personal data when you access or use the MorphoAid application.</p><p class="mt-2">MorphoAid is an academic and practical digital platform designed to support malaria-related image analysis, case review, and diagnostic information management.</p>' },
  { id: 2, title: '2. Who We Are', content: '<div class="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-1"><p><strong>Chiang Mai University, College of Arts, Media and Technology</strong></p><p>Project Team: Seksan Jomchanasuk and Chonthicha Maitham</p><p>Email: Seksan_jo@cmu.ac.th, Chonthicha_mai@cmu.ac.th</p><p>Address: College of Arts, Media and Technology, Chiang Mai University, Chiang Mai, Thailand</p></div>' },
  { id: 3, title: '3. Scope of This Notice', content: '<p>This Privacy Notice applies to personal data collected through:</p><ul class="list-disc pl-6 mt-2 space-y-1"><li>the MorphoAid web application,</li><li>user registration and login,</li><li>case creation and case management features,</li><li>image upload and AI-assisted analysis features,</li><li>support, administrative, and security-related operations.</li></ul>' },
  { id: 4, title: '4. Personal Data We Collect', content: '<p>Depending on how you use the platform, we may collect:</p><div class="mt-4 space-y-4"><div class="border-l-2 border-[#00458f]/20 pl-4"><strong>4.1 Account and Identity Data:</strong> full name, email address, user role, organization/institution, encrypted credentials, access records.</div><div class="border-l-2 border-[#00458f]/20 pl-4"><strong>4.2 System and Usage Data:</strong> login timestamps, IP/device metadata, audit logs, activity history, error logs.</div><div class="border-l-2 border-[#00458f]/20 pl-4"><strong>4.3 Case and Clinical Workflow Data:</strong> case identifiers, blood smear images, AI analysis results, case notes, case metadata.</div></div><div class="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 italic text-sm"><strong>4.4 Sensitive Personal Data:</strong> MorphoAid minimizes unnecessary personal data collection. Users must avoid entering identifying patient information unless authorized.</div>' },
  { id: 5, title: '5. Purposes of Processing', content: '<p>We process personal data to:</p><ul class="list-disc pl-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8"><li>Manage user accounts and roles</li><li>Operate the platform and provide features</li><li>Receive and process case images</li><li>Generate AI-assisted analysis results</li><li>Support case review and workflow management</li><li>Maintain system security and auditability</li><li>Troubleshoot technical issues</li><li>Support academic and project governance</li><li>Comply with legal and security obligations</li></ul>' },
  { id: 6, title: '6. Legal Bases for Processing', content: '<p>We process data based on performance of contract, compliance with legal obligations, legitimate interests, or explicit consent. Sensitive data relies on appropriate health/medical legal bases.</p>' },
  { id: 7, title: '7. Data Disclosure', content: '<p>We disclose personal data only to authorized members, institutional supervisors, technical service providers, or regulators where required by law. <strong>We do not sell personal data.</strong></p>' },
  { id: 8, title: '8. Data Retention', content: '<p>Personal data is retained only for as long as necessary for the academic, research, or operational purposes described here, or as required by law. At the end of the period, data will be deleted or anonymized.</p>' },
  { id: 9, title: '9. Data Security', content: '<p>We implement administrative, technical, and organizational measures (Authentication, Encryption, Access logging, Need-to-know access) to protect personal data. However, no system can guarantee absolute security.</p>' },
  { id: 10, title: '10. Your Rights', content: '<p>Subject to applicable law, you may have rights to access, copy, correct, delete, restrict, object, withdraw consent, or request data portability. Contact Section 14 to exercise these rights.</p>' },
  { id: 11, title: '11. User Responsibilities', content: '<p>Users are responsible for providing accurate info, maintaining login confidentiality, entering only necessary data, and using the system in accordance with professional duty and law.</p>' },
  { id: 12, title: '12. Cross-Border Data Transfers', content: '<p>If data is processed outside Thailand, we will take appropriate steps to ensure transfer is carried out in accordance with legal requirements and safeguards.</p>' },
  { id: 13, title: '13. Changes to This Privacy Notice', content: '<p>We may update this Notice from time to time. Updated versions will be posted within the application. The “Last Updated” date indicates the latest revision.</p>' },
  { id: 14, title: '14. Contact Us', content: '<div class="bg-gray-50 p-6 rounded-2xl border border-gray-100"><p><strong>MorphoAid Project</strong></p><p>College of Arts, Media and Technology, Chiang Mai University</p><p>Project Team: Seksan Jomchanasuk and Chonthicha Maitham</p><p>Email: Seksan_jo@cmu.ac.th, Chonthicha_mai@cmu.ac.th</p></div>' }
]
</script>

<style scoped>
.legal-content :deep(p) { margin-bottom: 0.5rem; }
.legal-content :deep(ul) { margin-bottom: 0.5rem; }
</style>

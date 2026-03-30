<template>
    <aside
        class="w-64 bg-white border-r border-gray-200 p-4 flex flex-col fixed h-[calc(100vh-64px)] overflow-y-auto">
        
        <!-- Logo as per image -->
        <div class="mb-8 px-4 flex items-center gap-2">
            <div class="w-8 h-8 bg-[#004A99] rounded-lg flex items-center justify-center text-white overflow-hidden shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
                </svg>
            </div>
            <span class="text-xl font-bold text-[#004A99] tracking-tight">MorphoAid</span>
        </div>

        <!-- New Case Button as per image -->
        <button 
            v-if="showNewCase"
            @click="$emit('new-case')"
            class="mx-2 mb-8 bg-[#004A99] hover:bg-[#003D7A] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#004A99]/20 transition-all hover:scale-[1.02] active:scale-95"
            data-testid="new-case-button"
        >
            <span class="material-symbols-outlined text-xl">add</span>
            New Case
        </button>

        <div class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Menu</div>

        <template v-for="(item, index) in items" :key="index">
            <div v-if="item.divider" class="mt-8 mb-4 border-t border-gray-100"></div>
            <SidebarItem v-else :to="item.to" :label="item.label" :disabled="item.disabled"
                :active-matches="item.activeMatches || []">
                <template #icon v-if="item.iconHtml">
                    <span v-html="item.iconHtml" class="w-full h-full block"></span>
                </template>
            </SidebarItem>
        </template>

        <!-- Legal Footer -->
        <div class="mt-auto px-6 py-8 border-t border-gray-100/50 bg-stone-50/30">
            <div class="flex flex-col gap-2">
                <button @click="isPrivacyModalOpen = true" class="text-[11px] font-bold text-gray-400 hover:text-primary transition-colors text-left uppercase tracking-wider">Privacy Policy</button>
                <button @click="isTermsModalOpen = true" class="text-[11px] font-bold text-gray-400 hover:text-primary transition-colors text-left uppercase tracking-wider">Terms of Use</button>
            </div>
            <p class="mt-4 text-[10px] text-gray-300 font-medium">MorphoAid AI © 2026</p>
        </div>
    </aside>

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
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'
import PolicyModal from '@/components/legal/PolicyModal.vue'
import LegalContent from '@/components/legal/LegalContent.vue'
import { privacySections, termsSections } from '@/data/legalPolicies'
import { ref } from 'vue'

const isPrivacyModalOpen = ref(false)
const isTermsModalOpen = ref(false)

defineProps({
    items: {
        type: Array,
        required: true,
        // Expected format: [{ label: 'Name', to: '/path', disabled: false, iconHtml: '<svg>...', activeMatches: ['/path'] }, { divider: true }]
    },
    showNewCase: {
        type: Boolean,
        default: true
    }
})

defineEmits(['new-case'])
</script>

<template>
    <AppShell :items="dataUseItems" :show-new-case="true" @new-case="uiStore.openUploadModal()" />
    <CaseUploadModal :is-open="uiStore.isUploadModalOpen" @close="uiStore.closeUploadModal" />
</template>

<script setup>
import { ref } from 'vue'
import AppShell from '@/components/layout/AppShell.vue'
import CaseUploadModal from '@/features/case-management/components/CaseUploadModal.vue'
import { useUiStore } from '@/store/ui.store'

const uiStore = useUiStore()

const dataUseItems = [
    {
        label: 'Dashboard',
        to: '/data-use',
        activeMatches: [],
        iconHtml: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>'
    },
    // {
    //     label: 'Upload',
    //     to: '/data-use/cases/new',
    //     activeMatches: ['/data-use/cases/new'],
    //     iconHtml: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>'
    // },
    {
        label: 'Cases',
        to: '/data-use/cases',
        activeMatches: [],
        iconHtml: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>'
    },
    // { divider: true },
    {
        label: 'Insight',
        to: '/data-use/insights',
        activeMatches: ['/data-use/insights'],
        iconHtml: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>'
    },
    {
        label: 'Information',
        to: '/data-use/about',
        activeMatches: ['/data-use/about'],
        iconHtml: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    }
]
</script>
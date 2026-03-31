<template>
    <div class="layout bg-[#F8F8F8] h-screen overflow-hidden font-sans text-[#2E2E2E]">
        <Navbar class="no-print" />
        <Sidebar :items="items" :show-new-case="showNewCase" @new-case="$emit('new-case')" class="no-print" />

        <main class="ml-64 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8F8F8] print:ml-0 print:h-auto print:overflow-visible print:bg-white">
            <router-view />
        </main>
    </div>
</template>

<style>
@media print {
    .no-print {
        display: none !important;
    }
    
    main {
        margin-left: 0 !important;
        width: 100% !important;
    }
}
</style>

<script setup>
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'

defineProps({
    items: {
        type: Array,
        required: true
    },
    showNewCase: {
        type: Boolean,
        default: true
    }
})

defineEmits(['new-case'])
</script>
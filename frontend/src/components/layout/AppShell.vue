<template>
    <div class="layout bg-[#F8F8F8] h-screen overflow-hidden font-sans text-[#2E2E2E]">
        <Navbar />
        <Sidebar :items="items" @new-case="$emit('new-case')" />

        <main class="ml-64 h-screen overflow-y-auto bg-[#F8F8F8]">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'

defineProps({
    items: {
        type: Array,
        required: true
    }
})

defineEmits(['new-case'])
</script>
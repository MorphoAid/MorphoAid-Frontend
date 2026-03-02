<template>
    <div class="layout bg-[#F8F8F8] min-h-screen flex flex-col font-sans text-[#2E2E2E]">
        <Navbar />

        <div class="flex flex-1 overflow-hidden">
            <Sidebar :items="items" />

            <!-- Main Content -->
            <main class="flex-1 overflow-auto bg-[#F8F8F8]">
                <router-view />
            </main>
        </div>
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
</script>

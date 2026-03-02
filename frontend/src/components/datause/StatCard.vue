<template>
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
        <div class="text-[#5C5C5C] text-sm font-medium mb-2">{{ title }}</div>
        <div class="text-3xl font-bold text-[#2E2E2E]">{{ value }}</div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    }
})
</script>

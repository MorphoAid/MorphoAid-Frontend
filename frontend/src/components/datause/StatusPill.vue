<template>
    <span :class="['px-3 py-1 text-xs font-semibold rounded-full', statusClasses]">
        {{ label }}
    </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    status: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    }
})

const statusClasses = computed(() => {
    const norm = props.status.toLowerCase()
    if (norm === 'analyzed' || norm === 'completed' || norm === 'success') {
        return 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]' // Emerald Green
    } else if (norm === 'fails' || norm === 'failed' || norm === 'danger') {
        return 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]' // Red
    } else if (norm === 'processing' || norm === 'pending' || norm === 'in queue' || norm === 'needs review') {
        return 'bg-[#F0F9FF] text-[#075985] border border-[#BAE6FD]' // Blue/Sky
    }
    return 'bg-gray-100 text-[#5C5C5C] border border-gray-200'
})
</script>

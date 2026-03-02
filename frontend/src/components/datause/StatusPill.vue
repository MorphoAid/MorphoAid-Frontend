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
    if (norm === 'completed' || norm === 'success') {
        return 'bg-[#407533]/10 text-[#407533]'
    } else if (norm === 'failed' || norm === 'danger') {
        return 'bg-[#FF4C38]/10 text-[#A92222]'
    } else if (norm === 'pending' || norm === 'in queue' || norm === 'needs review') {
        return 'bg-[#48B7CB]/10 text-[#368998]'
    }
    return 'bg-gray-100 text-[#5C5C5C]'
})
</script>

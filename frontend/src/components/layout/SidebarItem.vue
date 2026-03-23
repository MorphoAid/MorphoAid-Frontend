<template>
    <component :is="disabled ? 'div' : 'RouterLink'" :to="to" :class="[
        'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors mb-2',
        disabled ? 'opacity-50 cursor-not-allowed text-[#5C5C5C]' : 'cursor-pointer hover:bg-[#C6E9EF]/50',
        isActive && !disabled ? 'bg-[#C6E9EF] text-[#2B6E7A]' : 'text-[#5C5C5C]'
    ]">
        <div class="w-5 h-5 flex items-center justify-center">
            <slot name="icon"></slot>
        </div>
        <span>{{ label }}</span>
    </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    to: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    activeMatches: {
        type: Array,
        default: () => []
    }
})

const route = useRoute()

const isActive = computed(() => {
    if (props.disabled) return false
    if (props.to && route.path === props.to) return true
    if (props.activeMatches.length > 0) {
return props.activeMatches.some(match => {
    if (route.path === match) return true
    return route.path.startsWith(match + '/')
})    }
    return false
})
</script>

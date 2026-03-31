<template>
    <component :is="disabled ? 'div' : 'RouterLink'" :to="to" :class="[
        'flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all mb-2 text-xs uppercase tracking-widest',
        disabled ? 'opacity-50 cursor-not-allowed text-on-surface-variant/40' : 'cursor-pointer hover:bg-secondary/20',
        isActive && !disabled ? 'bg-secondary text-primary shadow-sm shadow-primary/5' : 'text-on-surface-variant'
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

<template>
    <aside class="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu</div>

        <template v-for="(item, index) in items" :key="index">
            <div v-if="item.divider" class="mt-8 mb-4 border-t border-gray-100"></div>
            <SidebarItem v-else :to="item.to" :label="item.label" :disabled="item.disabled"
                :active-matches="item.activeMatches || []">
                <template #icon v-if="item.iconHtml">
                    <span v-html="item.iconHtml" class="w-full h-full block"></span>
                </template>
            </SidebarItem>
        </template>
    </aside>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue'

defineProps({
    items: {
        type: Array,
        required: true,
        // Expected format: [{ label: 'Name', to: '/path', disabled: false, iconHtml: '<svg>...', activeMatches: ['/path'] }, { divider: true }]
    }
})
</script>

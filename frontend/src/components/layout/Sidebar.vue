<template>
    <aside
        class="w-64 bg-white border-r border-gray-200 p-4 flex flex-col fixed h-[calc(100vh-64px)] overflow-y-auto">
        
        <!-- Logo as per image -->
        <div class="mb-8 px-4 flex items-center gap-2">
            <div class="w-8 h-8 bg-[#004A99] rounded-lg flex items-center justify-center text-white">
                <span class="material-symbols-outlined text-xl">microscope</span>
            </div>
            <span class="text-xl font-bold text-[#004A99] tracking-tight">MorphoAid</span>
        </div>

        <!-- New Case Button as per image -->
        <button 
            @click="$emit('new-case')"
            class="mx-2 mb-8 bg-[#004A99] hover:bg-[#003D7A] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#004A99]/20 transition-all hover:scale-[1.02] active:scale-95"
        >
            <span class="material-symbols-outlined text-xl">add</span>
            New Case
        </button>

        <div class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Menu</div>

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

defineEmits(['new-case'])
</script>

<template>
  <div class="space-y-12 text-[14px] leading-relaxed text-gray-600 font-inter">
    <div v-for="section in sections" :key="section.id">
        <h3 class="text-lg font-bold mb-3 font-manrope text-[#191c20] flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#00458f]/5 text-[#00458f] flex items-center justify-center text-[10px] font-black">{{ section.id.toString().padStart(2, '0') }}</span>
            {{ section.title }}
        </h3>
        <div v-html="section.content" class="legal-text"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sections: Array
})
</script>

<style scoped>
.legal-text :deep(p) { margin-bottom: 0.5rem; }
.legal-text :deep(ul) { margin-bottom: 0.5rem; }
.legal-text :deep(strong) { color: #191c20; font-weight: 700; }
.legal-text :deep(ul) { list-style-type: disc; padding-left: 1.5rem; }
.legal-text :deep(li) { margin-bottom: 0.25rem; }
</style>

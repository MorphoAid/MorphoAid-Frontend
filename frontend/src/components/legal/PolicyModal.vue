<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0">
          <div class="flex flex-col">
              <h2 class="text-2xl font-black text-[#00458f] font-manrope tracking-tight">{{ title }}</h2>
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">MorphoAid Legal Documentation</p>
          </div>
          <button @click="$emit('close')" class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-8 legal-scroll" ref="scrollContainer">
           <slot></slot>
        </div>

        <!-- Footer -->
        <div class="px-8 py-6 border-t border-gray-100 flex justify-end flex-shrink-0 bg-gray-50/50">
           <button @click="$emit('close')" 
             class="px-8 py-3 bg-[#00458f] text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:shadow-xl hover:shadow-[#00458f]/20 transition-all transform hover:scale-105 active:scale-95">
             I Understand
           </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: String
})

defineEmits(['close'])
</script>

<style scoped>
.legal-scroll {
  scrollbar-width: thin;
  scrollbar-color: #00458f/20 transparent;
}
.legal-scroll::-webkit-scrollbar {
  width: 6px;
}
.legal-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 69, 143, 0.2);
  border-radius: 10px;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>

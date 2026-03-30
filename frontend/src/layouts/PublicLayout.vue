<template>
  <div
    class="relative min-h-screen bg-background overflow-hidden flex flex-col font-body"
  >
    <!-- Subtle Background Element for Depth -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-[120px]"></div>

    <div class="relative z-10 w-full flex-grow flex items-center justify-center p-6 sm:p-12">
      <router-view />
    </div>

    <!-- Redesigned Footer -->
    <footer class="relative z-10 w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/10 bg-surface-container-low/30 backdrop-blur-sm">
      <div class="text-xs font-normal tracking-wide text-on-surface-variant/60">
        © 2026 AI-Based Malaria Treatment Supporting Platform
      </div>
      <div class="flex gap-6">
        <button type="button" class="text-xs font-medium tracking-wide text-on-surface-variant/60 hover:text-primary transition-colors">Privacy Policy</button>
        <button type="button" class="text-xs font-medium tracking-wide text-on-surface-variant/60 hover:text-primary transition-colors">Terms of Service</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
// shared public auth layout
</script>
<template>
  <div
    class="relative min-h-screen bg-background overflow-hidden flex flex-col font-body"
  >
    <!-- Subtle Background Element for Depth -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-[120px]"></div>

    <div class="relative z-10 w-full flex-grow flex flex-col">
      <router-view />
    </div>
  </div>
</template>

<script setup>
// shared public auth layout
</script>
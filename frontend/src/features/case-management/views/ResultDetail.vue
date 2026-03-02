<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold">Case Result Detail</h1>

    <p class="mt-2 text-gray-600">
      Placeholder – Detailed AI result view will be implemented in next UI phase.
    </p>

    <div class="mt-6 bg-gray-50 p-4 rounded border">
      <p><strong>Case ID:</strong> {{ caseId }}</p>
      <p><strong>Status:</strong> MOCK DATA</p>
      <p><strong>AI Confidence:</strong> --%</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const caseId = route.params.caseId
</script>
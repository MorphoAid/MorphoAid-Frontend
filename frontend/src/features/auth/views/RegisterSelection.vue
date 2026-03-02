<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-semibold">Register Selection</h1>
    <p class="mt-2 text-gray-600">
      Placeholder – User role selection screen will be implemented in UI phase.
    </p>

    <div class="mt-6 flex gap-4">
      <RouterLink
        to="/register/data-use"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Register as Data Use
      </RouterLink>

      <RouterLink
        to="/register/data-prep"
        class="bg-green-600 text-white px-4 py-2 rounded"
      >
        Register as Data Prep
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
// UI placeholder for register role selection
</script>
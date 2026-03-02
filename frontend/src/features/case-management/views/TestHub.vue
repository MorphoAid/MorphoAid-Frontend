<template>
    <div class="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-4xl font-bold mb-8 text-gray-800">UI Testing Hub</h1>
        <p class="text-gray-600 mb-8 text-center max-w-lg">
            Welcome to the MorphoAid frontend testing portal. Select a workflow below to begin UI interaction testing.
        </p>

        <!-- Error Toast -->
        <div v-if="error"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 shadow w-full max-w-md text-center">
            <strong class="font-bold">Error: </strong>
            <span class="block sm:inline">{{ error }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <!-- Upload Case Button -->
            <button @click="router.push('/data-use/cases/new')"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Case
            </button>

            <!-- Case List Button -->
            <button @click="router.push('/data-use/cases')"
                class="bg-green-600 hover:bg-green-700 text-white font-semibold py-6 px-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Case List
            </button>

            <!-- Latest Case Button -->
            <button @click="openLatestCase" :disabled="loading"
                class="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-6 px-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 flex flex-col items-center">
                <svg v-if="loading" class="animate-spin h-8 w-8 mb-2 text-white" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                {{ loading ? 'Opening...' : 'Open Latest Case' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/services/http';

const router = useRouter();
const loading = ref(false);
const error = ref(null);

const openLatestCase = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await http.get('/cases');
        const cases = response.data;
        if (cases && cases.length > 0) {
            router.push(`/data-use/cases/${cases[0].id}`);
        } else {
            error.value = "Database is empty. No cases available.";
        }
    } catch (err) {
        if (err.request) {
            error.value = "Network Error: Could not reach the backend.";
        } else {
            error.value = err.message || "Failed to fetch latest case.";
        }
        console.error("Failed fetching latest case:", err);
    } finally {
        loading.value = false;
    }
};
</script>

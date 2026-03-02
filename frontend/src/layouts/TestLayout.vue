<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <!-- Navbar -->
        <header class="bg-indigo-900 text-white shadow-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16 items-center">

                    <!-- Left side: Brand & Links -->
                    <div class="flex items-center space-x-8">
                        <span class="font-bold text-xl tracking-wide shrink-0">MorphoAid Test</span>

                        <nav class="hidden md:flex space-x-4">
                            <RouterLink to="/data-use"
                                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                                active-class="bg-indigo-800" exact>
                                Hub
                            </RouterLink>
                            <RouterLink to="/data-use/cases/new"
                                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                                active-class="bg-indigo-800">
                                Upload
                            </RouterLink>
                            <RouterLink to="/data-use/cases"
                                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                                :class="{ 'bg-indigo-800': $route.path.startsWith('/data-use/cases') }">
                                Cases
                            </RouterLink>
                            <RouterLink to="/__test/visualization"
                                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                                active-class="bg-indigo-800">
                                Visualization
                            </RouterLink>
                        </nav>
                    </div>

                    <!-- Right side: Base URL & Status -->
                    <div class="flex items-center space-x-6 text-sm">
                        <div class="hidden sm:block text-indigo-200">
                            API: <code class="bg-indigo-800 px-2 py-1 rounded text-xs">{{ baseUrl }}</code>
                        </div>

                        <div
                            class="flex items-center space-x-2 bg-indigo-950 px-3 py-1.5 rounded-full border border-indigo-700">
                            <span class="relative flex h-3 w-3">
                                <span v-if="isOnline"
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-3 w-3"
                                    :class="isOnline ? 'bg-green-500' : 'bg-red-500'"></span>
                            </span>
                            <span class="font-medium" :class="isOnline ? 'text-green-400' : 'text-red-400'">
                                Backend: {{ isOnline ? 'Online' : 'Offline' }}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 w-full relative">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import http from '@/services/http';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'Not Set';
const isOnline = ref(false);

const checkBackendStatus = async () => {
    try {
        // Ping the cases endpoint to verify connectivity
        await http.get('/cases');
        isOnline.value = true;
    } catch (err) {
        if (err.response) {
            // If we got a response (even 4xx/5xx), the backend is technically online
            isOnline.value = true;
        } else {
            // Network error, backend is not reachable
            isOnline.value = false;
        }
        console.error("Backend ping failed:", err);
    }
};

onMounted(() => {
    checkBackendStatus();
});
</script>

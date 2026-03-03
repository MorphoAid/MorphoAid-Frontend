<template>
    <header class="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
        <div class="text-[#48B7CB] text-2xl font-bold tracking-tight">
            MorphoAids
        </div>
        <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-[#F8F8F8] rounded-full flex items-center justify-center text-[#5C5C5C] shadow-sm">
                <!-- Notification Placeholder -->
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                    </path>
                </svg>
            </div>

            <div class="relative">
                <button @click="isDropdownOpen = !isDropdownOpen"
                    class="w-10 h-10 bg-[#F8F8F8] rounded-full flex items-center justify-center text-[#5C5C5C] shadow-sm overflow-hidden border border-gray-200 focus:outline-none hover:bg-gray-100 transition-colors">
                    <!-- Profile Placeholder -->
                    <svg class="w-6 h-6 text-gray-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd"></path>
                    </svg>
                </button>

                <!-- Dropdown Panel -->
                <div v-if="isDropdownOpen"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                    <button @click="handleLogout"
                        class="block w-full text-left px-4 py-2 text-sm text-[#2E2E2E] hover:bg-gray-50 hover:text-[#FF4C38] transition-colors">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const isDropdownOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    isDropdownOpen.value = false
    authStore.logout()
    router.push('/login')
}
</script>

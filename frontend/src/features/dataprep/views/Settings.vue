<template>
    <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E] space-y-6">

        <!-- Header -->
        <div>
            <h1 class="text-2xl font-semibold text-[#368998]">Settings</h1>
            <p class="text-sm text-[#5C5C5C]">Manage your profile and preferences.</p>
        </div>

        <!-- Profile Block -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-6 space-y-4">
            <h2 class="text-base font-medium text-[#368998] border-b border-[#368998]/10 pb-3">Profile</h2>
            <div class="flex items-center gap-5">
                <div
                    class="w-16 h-16 rounded-full bg-[#C6E9EF]/40 border border-[#368998]/20 flex items-center justify-center text-[#368998]">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-[#2E2E2E]">Data Prep User</p>
                    <p class="text-sm text-[#5C5C5C]">prep@morphoaid.org</p>
                    <span
                        class="inline-block mt-1 px-2 py-0.5 bg-[#368998]/10 text-[#368998] rounded text-xs font-medium">DATA_PREP</span>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                    <label class="block text-xs text-[#5C5C5C] mb-1">Name</label>
                    <input type="text" value="Data Prep User" disabled
                        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-[#F8F8F8] text-[#5C5C5C] cursor-not-allowed" />
                </div>
                <div>
                    <label class="block text-xs text-[#5C5C5C] mb-1">Organization</label>
                    <input type="text" value="MORU / MorphoAid" disabled
                        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-[#F8F8F8] text-[#5C5C5C] cursor-not-allowed" />
                </div>
            </div>
        </div>

        <!-- Preferences -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-6 space-y-4">
            <h2 class="text-base font-medium text-[#368998] border-b border-[#368998]/10 pb-3">Preferences</h2>
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-[#2E2E2E]">Dark Mode</p>
                        <p class="text-xs text-[#5C5C5C]">Coming soon</p>
                    </div>
                    <div class="w-10 h-5 bg-gray-200 rounded-full relative opacity-40 cursor-not-allowed">
                        <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-[#2E2E2E]">Email Notifications</p>
                        <p class="text-xs text-[#5C5C5C]">Coming soon</p>
                    </div>
                    <div class="w-10 h-5 bg-gray-200 rounded-full relative opacity-40 cursor-not-allowed">
                        <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Security -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-6 space-y-4">
            <h2 class="text-base font-medium text-[#368998] border-b border-[#368998]/10 pb-3">Security</h2>
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-[#2E2E2E]">Sign out of your account</p>
                    <p class="text-xs text-[#5C5C5C]">You will be redirected to the login page.</p>
                </div>
                <button @click="handleLogout"
                    class="px-4 py-2 text-sm font-medium text-white bg-[#A92222] hover:bg-[#8a1c1c] rounded-lg transition-colors">
                    Logout
                </button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

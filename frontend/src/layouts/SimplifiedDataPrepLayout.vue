<template>
    <div class="min-h-screen bg-[#F8F8F8] font-poppins text-[#2E2E2E] flex flex-col">
        <!-- Minimal Top Header -->
        <header class="bg-white border-b border-[#368998]/20 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#368998] text-white flex items-center justify-center font-bold shadow-sm">
                    M
                </div>
                <div>
                    <span class="text-xl font-bold tracking-tight text-[#368998]">Morpho</span><span
                        class="text-xl font-bold text-[#2B6E7A]">Aid</span>
                    <span class="ml-2 text-xs font-semibold bg-[#C6E9EF] text-[#2B6E7A] px-2 py-0.5 rounded-full">DataPrep</span>
                </div>
            </div>

            <!-- Profile / Logout -->
            <div class="relative" ref="profileDropdownRef">
                <button @click="profileOpen = !profileOpen"
                    class="flex items-center gap-2 hover:bg-[#F8F8F8] p-1.5 rounded-lg transition-colors border border-transparent hover:border-[#368998]/20 focus:outline-none">
                    <div
                        class="w-8 h-8 rounded-full bg-[#E5F5F8] text-[#368998] flex items-center justify-center font-semibold text-sm">
                        {{ userInitials }}
                    </div>
                    <span class="text-sm font-medium hidden sm:block">{{ userName }}</span>
                    <svg class="w-4 h-4 text-[#5C5C5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div v-show="profileOpen"
                    class="absolute auto-dropdown right-0 mt-2 w-48 bg-white border border-[#368998]/20 rounded-xl shadow-lg py-1 z-50">
                    <div class="px-4 py-2 border-b border-[#368998]/10">
                        <p class="text-xs text-[#5C5C5C]">Signed in as</p>
                        <p class="text-sm font-medium truncate">{{ userEmail }}</p>
                    </div>
                    <button @click="handleLogout"
                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors mt-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content Slot -->
        <main class="flex-1 p-6 flex flex-col items-center">
            <div class="w-full max-w-5xl">
                <router-view />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const profileOpen = ref(false)
const profileDropdownRef = ref(null)

const userInitials = computed(() => {
    const fn = authStore.user?.firstName || ''
    const ln = authStore.user?.lastName || ''
    if (fn && ln) return (fn[0] + ln[0]).toUpperCase()
    if (authStore.user?.fullName) return authStore.user.fullName.substring(0, 2).toUpperCase()
    return authStore.user?.email ? authStore.user.email.substring(0, 2).toUpperCase() : 'U'
})

const userName = computed(() => {
    const fn = authStore.user?.firstName || ''
    const ln = authStore.user?.lastName || ''
    if (fn || ln) return `${fn} ${ln}`.trim()
    return authStore.user?.fullName || authStore.user?.email || 'User'
})

const userEmail = computed(() => {
    return authStore.user?.email || 'No Email'
})

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
        profileOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

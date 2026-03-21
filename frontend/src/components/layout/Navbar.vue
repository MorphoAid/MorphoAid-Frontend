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

            <div class="relative" ref="dropdownRef">
                <!-- Avatar Button -->
                <button @click="isDropdownOpen = !isDropdownOpen"
                    class="w-10 h-10 bg-[#F8F8F8] rounded-full flex items-center justify-center text-[#5C5C5C] shadow-sm overflow-hidden border border-gray-200 focus:outline-none hover:bg-gray-100 transition-colors">
                    <img v-if="profilePictureUrl" :src="profilePictureUrl" alt="avatar"
                        class="w-full h-full object-cover rounded-full" />
                    <svg v-else class="w-6 h-6 text-gray-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd"></path>
                    </svg>
                </button>

                <!-- Dropdown Panel -->
                <div v-if="isDropdownOpen"
                    class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <!-- User info header -->
                    <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p class="text-xs text-gray-400 font-medium">ชื่อผู้ใช้</p>
                        <p class="text-sm font-semibold text-[#2E2E2E] truncate">
                            {{ fullName || authStore.user?.email || '—' }}
                        </p>
                    </div>

                    <!-- Manage Account -->
                    <button @click="goToAccount"
                        class="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-[#2E2E2E] hover:bg-gray-50 transition-colors">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zM19.5 19.5a9.5 9.5 0 10-15 0" />
                        </svg>
                        จัดการบัญชี
                    </button>

                    <div class="border-t border-gray-100"></div>

                    <!-- Logout -->
                    <button @click="handleLogout"
                        class="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-[#2E2E2E] hover:bg-gray-50 hover:text-[#FF4C38] transition-colors">
                        <svg class="w-4 h-4 text-gray-400 group-hover:text-[#FF4C38]" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const router = useRouter()
const authStore = useAuthStore()

const profilePictureUrl = computed(() => authStore.user?.profilePictureUrl || null)
const fullName = computed(() => {
    const u = authStore.user
    if (!u) return ''
    if (u.firstName && u.lastName) return `${u.firstName} ${u.lastName}`
    if (u.firstName) return u.firstName
    return u.fullName || ''
})

const handleLogout = () => {
    isDropdownOpen.value = false
    authStore.logout()
    router.push('/login')
}

const goToAccount = () => {
    isDropdownOpen.value = false
    router.push('/data-use/account')
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isDropdownOpen.value = false
    }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

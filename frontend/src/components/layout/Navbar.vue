<template>
    <header class="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
        <!-- Logo moved to Sidebar -->
        <div class="w-10 h-10 lg:hidden">
            <!-- Mobile logo if needed -->
        </div>

        <!-- Search Bar Contextual -->
        <div class="flex-1 max-w-md mx-8 relative" ref="searchContainerRef">
            <div class="relative flex items-center">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input type="text" v-model="searchStore.query" 
                    @focus="showSearchDropdown = true" 
                    @click="showSearchDropdown = true"
                    @input="showSearchDropdown = true"
                    :placeholder="searchPlaceholder" 
                    class="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48B7CB] focus:border-transparent transition-all text-[#2E2E2E] text-sm bg-[#F8F8F8] hover:bg-white" />
                
                <!-- Clear Button -->
                <button v-if="searchStore.query" @click.stop="clearSearch" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#FF4C38] transition-colors focus:outline-none cursor-pointer">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>

            <div v-if="showSearchDropdown && searchResults.length > 0" 
                 class="absolute bg-white border border-gray-100 shadow-xl rounded-xl w-full mt-2 py-2 z-[100] max-h-72 overflow-y-auto"
                 style="scrollbar-width: thin; scrollbar-color: #B8E7FC transparent;">
                 <div v-for="result in searchResults" :key="result.name"
                      @mouseenter="result.type !== 'case' && mapStore.setHoveredLocation(result.type, result.name)"
                      @mouseleave="result.type !== 'case' && mapStore.clearHoveredLocation()"
                      @mousedown.prevent="selectLocation(result)"
                      class="px-4 py-2 hover:bg-[#F3F9FA] cursor-pointer flex items-center justify-between group transition-colors">
                      <div>
                          <p class="text-sm font-semibold text-[#2E2E2E]" :class="result.type === 'case' ? 'text-[#48B7CB]' : 'group-hover:text-[#48B7CB]'">{{ result.name }}</p>
                          <p class="text-[10px] text-[#5C5C5C] uppercase tracking-wide">{{ result.type }}</p>
                      </div>
                      <span v-if="result.type !== 'case'" class="material-symbols-outlined text-[#B8E7FC] group-hover:text-[#48B7CB] xl:text-[20px] lg:text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
                          travel_explore
                      </span>
                 </div>
            </div>
        </div>

        <div class="flex items-center gap-4 shrink-0">
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
                        <p class="text-xs text-gray-400 font-medium">Username</p>
                        <p class="text-sm font-semibold text-[#2E2E2E] truncate">
                            {{ fullName || authStore.user?.email || '—' }}
                        </p>
                    </div>

                    <button @click="goToAccount"
                        class="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-[#2E2E2E] hover:bg-gray-50 transition-colors">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zM19.5 19.5a9.5 9.5 0 10-15 0" />
                        </svg>
                        Manage Account
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
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'
import { useMapStore, englishProvinces } from '@/store/map.store'
import { useSearchStore } from '@/store/search.store'

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const mapStore = useMapStore()
const searchStore = useSearchStore()

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
    const role = authStore.user?.role
    if (role === 'ADMIN') {
        router.push('/admin/account')
    } else {
        router.push('/data-use/account')
    }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isDropdownOpen.value = false
    }
}

// Search Logic Contextual
const showSearchDropdown = ref(false)
const searchContainerRef = ref(null)

const regions = ['North', 'Northeast', 'Central', 'East', 'West', 'South']

const searchContext = computed(() => {
    return route.path.startsWith('/data-use/cases') ? 'cases' : 'map'
})

const searchPlaceholder = computed(() => {
    return searchContext.value === 'cases' ? 'Search ID (e.g. 12)...' : 'Search province or region...'
})

const searchResults = computed(() => {
    const q = searchStore.query.trim().toLowerCase()
    
    if (searchContext.value === 'map') {
        if (!q) {
            return regions.map(r => ({ type: 'region', name: r }))
        }
        let res = []
        regions.forEach(r => {
            if (r.toLowerCase().includes(q)) {
                res.push({ type: 'region', name: r })
            }
        })
        englishProvinces.forEach(p => {
            if (p.toLowerCase().includes(q)) {
                res.push({ type: 'province', name: p })
            }
        })
        return res.slice(0, 8)
    } 
    
    else if (searchContext.value === 'cases') {
        if (!q) return []
        const cleanQ = q.replace('cas-0', '')
        return searchStore.globalCases
            .filter(c => c.id.toString().includes(cleanQ))
            .map(c => ({ type: 'case', name: `CAS-0${c.id}`, rawId: c.id.toString() }))
            .slice(0, 5)
    }
})

const selectLocation = (result) => {
    if (result.type === 'region' || result.type === 'province') {
        mapStore.setSelectedRegion(result.name)
        searchStore.setQuery(result.name)
        showSearchDropdown.value = false
        mapStore.clearHoveredLocation()
    } else if (result.type === 'case') {
        searchStore.setQuery(result.rawId)
        showSearchDropdown.value = false
    }
}

const clearSearch = () => {
    searchStore.clear()
    if (searchContext.value === 'map') {
        mapStore.setSelectedRegion('All')
        mapStore.clearHoveredLocation()
    }
    showSearchDropdown.value = false
}

const handleClickOutsideSearch = (event) => {
    if (searchContainerRef.value && !searchContainerRef.value.contains(event.target)) {
        showSearchDropdown.value = false
        mapStore.clearHoveredLocation()
    }
}

// Watch store so if TestHub resets it, search bar resets (only matters mapping context)
watch(() => mapStore.selectedRegion, (val) => {
    if (searchContext.value === 'map') {
        if (val === 'All') {
            searchStore.setQuery('')
        } else {
            searchStore.setQuery(val);
        }
    }
})

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('mousedown', handleClickOutsideSearch)
})

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('mousedown', handleClickOutsideSearch)
})
</script>

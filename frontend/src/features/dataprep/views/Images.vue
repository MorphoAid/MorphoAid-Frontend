<template>
    <div class="bg-[#F8F8F8] min-h-full p-6 font-poppins text-[#2E2E2E] space-y-6">

        <!-- Header -->
        <div>
            <h1 class="text-2xl font-semibold text-[#368998]">Image Review</h1>
            <p class="text-sm text-[#5C5C5C]">Browse and inspect submitted blood smear images.</p>
        </div>

        <!-- Search -->
        <div class="bg-white rounded-xl border border-[#368998]/20 p-4 flex items-center gap-3">
            <svg class="w-4 h-4 text-[#5C5C5C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search by Case ID..."
                class="flex-1 text-sm bg-transparent focus:outline-none text-[#2E2E2E] placeholder-[#5C5C5C]/60" />
        </div>

        <!-- Action Button -->
        <div class="flex justify-end">
            <button @click="$router.push('/dataprep/cases/new')"
                class="bg-[#368998] hover:bg-[#2B6E7A] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Upload Image
            </button>
        </div>

        <!-- Image Table -->
        <div class="bg-white rounded-xl border border-[#368998]/20 overflow-hidden relative min-h-[300px]">
            <!-- Loading Overlay -->
            <div v-if="loading" class="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[2px]">
                <svg class="animate-spin h-8 w-8 text-[#368998]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-[#F8F8F8] text-[#5C5C5C] border-b border-[#368998]/10">
                        <tr>
                            <th class="py-3 px-6 font-medium">Case ID</th>
                            <th class="py-3 px-6 font-medium">Uploaded</th>
                            <th class="py-3 px-6 font-medium">AI Status</th>
                            <th class="py-3 px-6 font-medium">Source</th>
                            <th class="py-3 px-6 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#368998]/10 text-[#2E2E2E]">
                        <tr v-if="!loading && filteredImages.length === 0">
                            <td colspan="5" class="py-10 text-center text-[#5C5C5C] text-sm italic">No cases found.</td>
                        </tr>
                        <tr v-for="row in filteredImages" :key="row.id" class="hover:bg-[#F8F8F8]/50 transition-colors">
                            <td class="py-3 px-6 font-mono text-xs text-[#368998]">#{{ row.id }}</td>
                            <td class="py-3 px-6 text-[#5C5C5C]">{{ formatDate(row.uploaded) }}</td>
                            <td class="py-3 px-6">
                                <span :class="statusStyle(row.status)" class="px-2 py-0.5 rounded text-xs font-medium uppercase">
                                    {{ row.status }}
                                </span>
                            </td>
                            <td class="py-3 px-6 text-[#5C5C5C]">{{ row.source }}</td>
                            <td class="py-3 px-6">
                                <button @click="$router.push('/dataprep/images/' + row.id)"
                                    class="text-xs font-medium text-[#368998] hover:text-[#2B6E7A] transition-colors">
                                    View →
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchCases as apiFetchCases } from '@/features/case-management/services/case.service'
import { useAuthStore } from '@/store/auth.store'

const searchQuery = ref('')
const images = ref([])
const loading = ref(false)
const authStore = useAuthStore()

const fetchUserCases = async () => {
    loading.value = true
    try {
        const response = await apiFetchCases()
        const allCases = response.data || []
        
        // Filter by current technician (DATA_PREP user)
        images.value = allCases
            .filter(c => c.technicianId === authStore.user?.id)
            .map(c => ({
                id: c.id.toString(),
                uploaded: c.createdAt,
                status: c.status || 'PENDING',
                source: c.location || 'Unknown'
            }))
            
        // Sort by newest
        images.value.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded))
    } catch (error) {
        console.error('Failed to fetch cases:', error)
    } finally {
        loading.value = false
    }
}

const filteredImages = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return images.value
    return images.value.filter(img => img.id.includes(q))
})

const formatDate = (dateString) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function statusStyle(status) {
    const s = status?.toUpperCase()
    if (s === 'COMPLETED' || s === 'ANALYZED') return 'bg-[#407533]/10 text-[#407533]'
    if (s === 'PENDING' || s === 'UPLOADING') return 'bg-[#FF4C38]/10 text-[#FF4C38]'
    return 'bg-[#A92222]/10 text-[#A92222]'
}

onMounted(async () => {
    if (!authStore.isHydrated) {
        await authStore.init()
    }
    fetchUserCases()
})
</script>

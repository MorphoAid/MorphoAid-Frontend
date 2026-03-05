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

        <!-- Image Table -->
        <div class="bg-white rounded-xl border border-[#368998]/20 overflow-hidden">
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
                        <tr v-if="filteredImages.length === 0">
                            <td colspan="5" class="py-10 text-center text-[#5C5C5C] text-sm italic">No cases found.</td>
                        </tr>
                        <tr v-for="row in filteredImages" :key="row.id" class="hover:bg-[#F8F8F8]/50 transition-colors">
                            <td class="py-3 px-6 font-mono text-xs text-[#368998]">#{{ row.id }}</td>
                            <td class="py-3 px-6 text-[#5C5C5C]">{{ row.uploaded }}</td>
                            <td class="py-3 px-6">
                                <span :class="statusStyle(row.status)" class="px-2 py-0.5 rounded text-xs font-medium">
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
import { ref, computed } from 'vue'

const searchQuery = ref('')

const images = [
    { id: '1042', uploaded: '03 Mar 2026, 14:22', status: 'Completed', source: 'Clinic A' },
    { id: '1041', uploaded: '03 Mar 2026, 11:05', status: 'Pending', source: 'Hospital B' },
    { id: '1040', uploaded: '03 Mar 2026, 09:48', status: 'Completed', source: 'Clinic A' },
    { id: '1039', uploaded: '02 Mar 2026, 16:30', status: 'Failed', source: 'Lab C' },
    { id: '1038', uploaded: '02 Mar 2026, 14:10', status: 'Completed', source: 'Hospital B' },
    { id: '1037', uploaded: '02 Mar 2026, 10:55', status: 'Pending', source: 'Clinic D' },
    { id: '1036', uploaded: '01 Mar 2026, 17:00', status: 'Completed', source: 'Clinic A' },
]

const filteredImages = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return images
    return images.filter(img => img.id.includes(q))
})

function statusStyle(status) {
    if (status === 'Completed') return 'bg-[#407533]/10 text-[#407533]'
    if (status === 'Pending') return 'bg-[#FF4C38]/10 text-[#FF4C38]'
    return 'bg-[#A92222]/10 text-[#A92222]'
}
</script>

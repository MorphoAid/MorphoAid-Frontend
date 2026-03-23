<template>
  <div class="px-8 pb-12 pt-6 w-full max-w-[1400px] mx-auto text-on-surface font-inter">
    <!-- Top Metrics Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm transition-transform hover:scale-[1.01]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-secondary uppercase tracking-wider font-manrope">System Activity</span>
          <span class="material-symbols-outlined text-primary text-[20px]">hub</span>
        </div>
        <div class="flex items-baseline gap-2">
          <h2 class="text-3xl font-extrabold font-manrope tracking-tight">{{ totalProcessed }}</h2>
          <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
        </div>
        <p class="text-[11px] text-on-surface-variant mt-1">Total clinical instances processed today</p>
      </div>

      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm transition-transform hover:scale-[1.01]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-secondary uppercase tracking-wider font-manrope">AI Confirmations</span>
          <span class="material-symbols-outlined text-tertiary text-[20px]">psychology</span>
        </div>
        <div class="flex items-baseline gap-2">
          <h2 class="text-3xl font-extrabold font-manrope tracking-tight">{{ stats.completed }}</h2>
          <span class="text-[11px] font-medium text-secondary bg-surface-container px-2 py-0.5 rounded-full">New Stages</span>
        </div>
        <p class="text-[11px] text-on-surface-variant mt-1">Confirmed Plasmodium identifications</p>
      </div>

      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 transition-transform hover:scale-[1.01]"
           :class="aiStatus === 'Online' ? 'border-[#407533]' : 'border-[#FF4C38]'">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold uppercase tracking-wider font-manrope"
                :class="aiStatus === 'Online' ? 'text-[#407533]' : 'text-[#FF4C38]'">MORU AI Status</span>
          <div class="flex items-center gap-2">
            <button v-if="isAdmin" @click="toggleAiStatus" 
                    class="px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors cursor-pointer"
                    :class="aiStatus === 'Online' ? 'bg-[#407533] text-white border-[#407533] hover:bg-opacity-90' : 'bg-white text-[#FF4C38] border-[#FF4C38] hover:bg-red-50'">
              {{ aiStatus === 'Online' ? 'Turn Off' : 'Turn On' }}
            </button>
            <span class="material-symbols-outlined text-[20px]"
                  :class="aiStatus === 'Online' ? 'text-[#407533]' : 'text-[#FF4C38]'"
                  style="font-variation-settings: 'FILL' 1;">
              {{ aiStatus === 'Online' ? 'cloud_done' : 'cloud_off' }}
            </span>
          </div>
        </div>
        <div class="flex items-baseline gap-2">
          <h2 class="text-3xl font-extrabold font-manrope tracking-tight"
              :class="aiStatus === 'Online' ? 'text-[#407533]' : 'text-[#FF4C38]'">{{ aiStatus }}</h2>
          <span v-if="aiStatus === 'Online'" class="flex items-center gap-1.5 text-[11px] font-bold text-[#407533] bg-[#F0F8FF] px-2.5 py-0.5 rounded-full border border-[#B8E7FC]">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#407533] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#48B7CB]"></span>
            </span>
            Ready
          </span>
          <span v-else class="text-[11px] font-bold text-[#FF4C38] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
            Offline
          </span>
        </div>
        <p class="text-[11px] text-[#5C5C5C] mt-1">Diagnostic engine connection interface</p>
      </div>
    </section>

    <!-- 2-Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Side: Heatmap (Primary) -->
      <div class="lg:col-span-8 space-y-8">
        <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div class="p-6 flex items-center justify-between z-20">
            <div>
              <h3 class="text-xl font-bold font-manrope tracking-tight">Incident Density Heatmap</h3>
              <p class="text-sm text-on-surface-variant">Real-time vector distribution: Thailand & Border Regions</p>
            </div>
            <div class="flex gap-2">
              <select v-model="selectedRegion" class="px-4 py-2 bg-[#48B7CB] text-[#F8F8F8] font-bold rounded-xl text-xs hover:opacity-90 transition-colors cursor-pointer border-none outline-none ring-0 appearance-none focus:ring-0 shadow-sm leading-tight text-center">
                <option class="bg-[#F8F8F8] text-[#2E2E2E] font-medium" value="All">All Regions</option>
                <option class="bg-[#F8F8F8] text-[#2E2E2E] font-medium" value="North">North</option>
                <option class="bg-[#F8F8F8] text-[#2E2E2E] font-medium" value="Northeast">Northeast</option>
                <option class="bg-[#F8F8F8] text-[#2E2E2E] font-medium" value="Central">Central</option>
                <option class="bg-[#F8F8F8] text-[#2E2E2E] font-medium" value="East">East</option>
                <option class="bg-[#F8F8F8] text-[#2E2E2E] font-medium" value="West">West</option>
                <option class="bg-[#F8F8F8] text-[#2E2E2E] font-medium" value="South">South</option>
              </select>
            </div>
          </div>
          <div class="flex-1 relative bg-[#e1e2e8]">
            <ThailandHeatmap :region="selectedRegion" />
          </div>
        </div>

        <!-- Quick Action: Image Upload -->
        <div v-if="aiStatus !== 'Offline'" @click="$router.push('/data-use/cases/new')" class="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-2 border-dashed border-outline-variant hover:border-primary transition-all group cursor-pointer">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="w-20 h-20 bg-primary-fixed rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[40px]">biotech</span>
            </div>
            <div class="flex-1 text-center md:text-left">
              <h4 class="text-lg font-bold font-manrope">Quick Diagnostic Scan</h4>
              <p class="text-sm text-on-surface-variant">Drag and drop blood smear microscopy images (JPEG, PNG, DICOM) to initiate AI parasite detection and staging.</p>
            </div>
            <button class="px-8 py-3 bg-surface-container-high rounded-xl font-bold text-sm hover:bg-surface-variant transition-colors whitespace-nowrap">
              Select File
            </button>
          </div>
        </div>
        <!-- Offline State -->
        <div v-else class="bg-red-50 p-8 rounded-xl shadow-sm border-2 border-dashed border-red-200 opacity-90 cursor-not-allowed">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center text-[#FF4C38]">
              <span class="material-symbols-outlined text-[40px]">cloud_off</span>
            </div>
            <div class="flex-1 text-center md:text-left">
              <h4 class="text-lg font-bold font-manrope text-[#A92222]">Diagnostic AI is Offline</h4>
              <p class="text-sm text-[#FF4C38]">The MORU AI engine is disconnected or disabled by an administrator. Image uploads are suspended until the connection is restored.</p>
            </div>
            <button disabled class="px-8 py-3 bg-red-100 text-[#FF4C38]/70 rounded-xl font-bold text-sm cursor-not-allowed whitespace-nowrap">
              Service Unavailable
            </button>
          </div>
        </div>
      </div>

      <!-- Right Side: Regional Summary (Secondary) -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col">
          <h3 class="text-lg font-bold font-manrope tracking-tight mb-6 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[#48B7CB]">location_on</span>
                {{ selectedRegion === 'All' ? 'Regional Summary' : selectedRegion + ' Provinces' }}
            </div>
            <button v-if="selectedRegion !== 'All'" @click="selectedRegion = 'All'" class="text-[10px] text-[#5C5C5C] hover:text-[#48B7CB] font-bold uppercase tracking-wider">
                Reset Overview
            </button>
          </h3>
          <div class="space-y-6 max-h-[400px] overflow-y-auto pr-2" style="scrollbar-width: thin; scrollbar-color: #B8E7FC transparent;">
            <!-- Dynamic Items -->
            <div v-for="item in displayedSummaryItems" :key="item.name" class="space-y-2 cursor-pointer group" @click="selectedRegion = item.onClickRegion">
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-sm font-bold group-hover:text-[#48B7CB] transition-colors text-[#2E2E2E]">{{ item.name }}</p>
                  <p class="text-[11px] text-[#5C5C5C]">{{ item.subtitle }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold" :class="item.statusColor">{{ item.value }} Cases</p>
                  <p class="text-[11px] text-[#5C5C5C]">{{ item.status }} Capacity</p>
                </div>
              </div>
              <div class="h-1.5 w-full bg-[#f0f1f5] rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :class="item.bgColor" :style="{ width: item.percentage + '%' }"></div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="displayedSummaryItems.length === 0" class="text-center text-[#5C5C5C] text-xs py-8 italic bg-[#F8F8F8] rounded-xl border border-[#e1e2e8]">
              No active cases in this region.
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-100">
            <h4 class="text-xs font-bold text-secondary uppercase mb-4">Latest Lab Feed</h4>
            <div class="space-y-4">
              <div class="flex gap-3">
                <div class="w-8 h-8 rounded-lg bg-red-50 text-error flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-sm">warning</span>
                </div>
                <div>
                  <p class="text-[11px] font-bold">High Load: Tak General</p>
                  <p class="text-[10px] text-on-surface-variant">Emergency request for AI triage assistance</p>
                </div>
              </div>
              <div class="flex gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                </div>
                <div>
                  <p class="text-[11px] font-bold">System Update: v2.4.1</p>
                  <p class="text-[10px] text-on-surface-variant">P. falciparum detection accuracy improved by 2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchCases as apiFetchCases } from '@/features/case-management/services/case.service'
import { visualizationService } from '@/features/visualization/services/visualization.service'
import { systemService } from '@/services/system.service'
import { useAuthStore } from '@/store/auth.store'
import { useMapStore } from '@/store/map.store'
import ThailandHeatmap from '@/features/visualization/views/ThailandHeatmap.vue'

const authStore = useAuthStore()
const mapStore = useMapStore()
const isAdmin = computed(() => authStore.role === 'ADMIN')

const selectedRegion = computed({
    get: () => mapStore.selectedRegion,
    set: (val) => mapStore.setSelectedRegion(val)
})
const heatmapData = ref([])
const aiStatus = ref('Checking...')
const stats = ref({
    needsReview: 0,
    inQueue: 0,
    completed: 0,
    failed: 0
})

const totalProcessed = computed(() => {
    return stats.value.completed + stats.value.inQueue + stats.value.failed + stats.value.needsReview;
})

const regionsMap = {
  'North': ['chiangmai', 'chiangrai', 'lampang', 'lamphun', 'maehongson', 'nan', 'phayao', 'phrae', 'uttaradit'],
  'Northeast': ['amnatcharoen', 'buengkan', 'buriram', 'chaiyaphum', 'kalasin', 'khonkaen', 'loei', 'mahasarakham', 'mukdahan', 'nakhonphanom', 'nakhonratchasima', 'nongbualamphu', 'nongkhai', 'roiet', 'sakonnakhon', 'sisaket', 'surin', 'ubonratchathani', 'udonthani', 'yasothon'],
  'Central': ['angthong', 'phranakhonsiayutthaya', 'ayutthaya', 'krungthepmahanakhon', 'bangkok', 'chainat', 'kamphaengphet', 'lopburi', 'nakhonnayok', 'nakhonpathom', 'nakhonsawan', 'nonthaburi', 'pathumthani', 'phetchabun', 'phichit', 'phitsanulok', 'samutprakan', 'samutsakhon', 'samutsongkhram', 'saraburi', 'singburi', 'sukhothai', 'suphanburi', 'uthaithani'],
  'East': ['chachoengsao', 'chanthaburi', 'chonburi', 'prachinburi', 'rayong', 'sakaeo', 'trat'],
  'West': ['kanchanaburi', 'phetchaburi', 'prachuapkhirikhan', 'ratchaburi', 'tak'],
  'South': ['chumphon', 'krabi', 'nakhonsithammarat', 'narathiwat', 'pattani', 'phangnga', 'phatthalung', 'phuket', 'ranong', 'satun', 'songkhla', 'suratthani', 'trang', 'yala']
}

function normalizeProv(name) {
    if (!name) return ''
    return name.replace(/\s+/g, '').toLowerCase()
}

function getProvinceRegion(provEn, provTh) {
    const normal = normalizeProv(provEn) || normalizeProv(provTh)
    for (const [reg, provs] of Object.entries(regionsMap)) {
        if (provs.includes(normal)) return reg
    }
    return 'Central'
}

const displayedSummaryItems = computed(() => {
    if (selectedRegion.value === 'All') {
        const regionTotals = { 'North': 0, 'Northeast': 0, 'Central': 0, 'East': 0, 'West': 0, 'South': 0 }
        heatmapData.value.forEach(d => {
            const reg = getProvinceRegion(d.provinceNameEn, d.provinceNameTh)
            if (regionTotals[reg] !== undefined) regionTotals[reg] += d.value;
        })
        const max = Math.max(...Object.values(regionTotals), 1)
        return Object.entries(regionTotals)
          .map(([reg, val]) => ({
            name: reg + ' Region',
            subtitle: 'Cumulative Cases',
            value: val,
            percentage: (val / max) * 100,
            status: val > 50 ? 'Critical' : val > 20 ? 'Warning' : 'Controlled',
            statusColor: val > 50 ? 'text-[#A92222]' : val > 20 ? 'text-[#FF4C38]' : 'text-[#48B7CB]',
            bgColor: val > 50 ? 'bg-[#A92222]' : val > 20 ? 'bg-[#FF4C38]' : 'bg-[#48B7CB]',
            onClickRegion: reg
          }))
          .sort((a,b) => b.value - a.value)
          .filter(x => x.value > 0)
    } else {
        const isRegion = Object.keys(regionsMap).includes(selectedRegion.value)
        let provs = []
        
        if (isRegion) {
            provs = heatmapData.value.filter(d => getProvinceRegion(d.provinceNameEn, d.provinceNameTh) === selectedRegion.value)
        } else {
            provs = heatmapData.value.filter(d => normalizeProv(d.provinceNameEn) === normalizeProv(selectedRegion.value) || normalizeProv(d.provinceNameTh) === normalizeProv(selectedRegion.value))
        }
        const max = Math.max(...provs.map(p => p.value), 1)
        return provs.map(d => ({
            name: d.provinceNameEn || d.provinceNameTh || 'Unknown',
            subtitle: 'Active Province Data',
            value: d.value,
            percentage: (d.value / max) * 100,
            status: d.value > 50 ? 'Critical' : d.value > 20 ? 'Warning' : 'Controlled',
            statusColor: d.value > 50 ? 'text-[#A92222]' : d.value > 20 ? 'text-[#FF4C38]' : 'text-[#48B7CB]',
            bgColor: d.value > 50 ? 'bg-[#A92222]' : d.value > 20 ? 'bg-[#FF4C38]' : 'bg-[#48B7CB]',
            onClickRegion: selectedRegion.value
        })).sort((a,b) => b.value - a.value).slice(0, 8)
    }
})

const loadDashboardData = async () => {
    try {
        try {
            const aiRes = await systemService.getAiStatus();
            aiStatus.value = aiRes.aiStatus === 'ONLINE' ? 'Online' : 'Offline';
        } catch (e) {
            console.error("AI Status fetch error:", e);
            aiStatus.value = 'Offline';
        }

        const response = await apiFetchCases()
        const allCases = response.data || []

        stats.value = allCases.reduce((acc, c) => {
            if (c.status === 'ANALYZED') acc.needsReview++

            if (c.analysisStatus === 'PENDING' || c.analysisStatus === 'PROCESSING') acc.inQueue++
            else if (c.analysisStatus === 'COMPLETED') acc.completed++
            else if (c.analysisStatus === 'FAILED') acc.failed++

            return acc
        }, { needsReview: 0, inQueue: 0, completed: 0, failed: 0 })

        const hData = await visualizationService.getHeatmapData()
        heatmapData.value = Array.isArray(hData) ? hData : (hData?.data || [])

    } catch (err) {
        console.error("Dashboard load error:", err)
    }
}

const toggleAiStatus = async () => {
    if (!isAdmin.value) return;
    try {
        aiStatus.value = 'Toggling...'
        const res = await systemService.toggleAiStatus();
        aiStatus.value = res.aiStatus === 'ONLINE' ? 'Online' : 'Offline'
    } catch (e) {
        console.error("Failed to toggle AI status", e)
        aiStatus.value = 'Offline'
    }
}

onMounted(() => {
    loadDashboardData()
})
</script>

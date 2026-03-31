<template>
  <div class="p-8 max-w-2xl mx-auto w-full">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[#2E2E2E] mb-2">Upload New Case</h1>
      <p class="text-[#5C5C5C]">Upload a blood smear image for AI analysis and tracking.</p>
    </div>

    <div v-if="aiStatus === 'Offline'" class="mb-8 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-4 shadow-sm">
      <div class="mt-0.5 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
        <span class="material-symbols-outlined text-lg">cloud_off</span>
      </div>
      <div>
        <h3 class="font-bold text-red-800 tracking-tight">Diagnostic AI is Offline</h3>
        <p class="text-sm text-red-600 mt-0.5">The AI parsing engine is temporarily disconnected or disabled by an administrator. You cannot upload new images for analysis at this time.</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

      <!-- Drag & Drop Area -->
      <div
        class="border-2 rounded-xl text-center transition-colors mb-8 relative"
        :class="aiStatus === 'Offline' ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' : 'border-dashed border-[#C6E9EF] hover:bg-[#F8F8F8] cursor-pointer'"
        @click="aiStatus !== 'Offline' && triggerFileInput()" @dragover.prevent @drop.prevent="aiStatus !== 'Offline' && handleDrop($event)">
        
        <input id="fileInput" type="file" ref="fileInputRef" class="hidden" accept=".png, .jpg, .jpeg"
          @change="handleFileChange" :disabled="aiStatus === 'Offline'" />

        <div v-if="previewUrl" class="w-full flex flex-col items-center">
          <img :src="previewUrl" alt="Preview"
            class="w-full h-auto max-h-[240px] rounded object-contain mx-auto border border-gray-200 mb-3" />
          <div class="text-center mb-3">
            <p class="text-sm font-medium text-[#2E2E2E]">{{ selectedFileName }}</p>
            <p class="text-xs text-[#5C5C5C]">{{ selectedFileSize }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button type="button" @click.stop="triggerFileInput"
              class="px-4 py-1.5 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 text-[#2E2E2E] transition-colors">
              Change
            </button>
            <button type="button" @click.stop="removeFile"
              class="px-4 py-1.5 bg-red-50 border border-red-100 text-sm font-medium rounded-lg hover:bg-red-100 text-red-600 transition-colors">
              Remove
            </button>
          </div>
        </div>

        <div v-else>
          <div
            class="w-16 h-16 bg-[#C6E9EF]/30 rounded-full flex items-center justify-center mx-auto mb-4 text-[#48B7CB]">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
              </path>
            </svg>
          </div>

          <p class="text-lg font-medium text-[#2E2E2E] mb-1">
            Click to upload or drag and drop
          </p>
          <p class="text-sm text-[#5C5C5C]">PNG or JPG up to 10MB</p>
        </div>
      </div>

      <!-- Form Inputs -->
      <div class="space-y-5 mb-8">
        <div>
          <label class="block text-sm font-medium text-[#2E2E2E] mb-1">Patient Code</label>
          <input type="text" v-model="form.patientCode" placeholder="Loading..." disabled
            class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none transition-all" />
        </div>

        <div class="grid grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-[#2E2E2E] mb-1">Technician Firstname
              Lastname</label>
            <input type="text" v-model="form.technicianId" placeholder="Loading..." disabled
              class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2E2E2E] mb-1">Location</label>
            <div class="relative">
              <input type="text" v-model="provinceSearch" @focus="showDropdown = true" @input="handleSearchInput"
                @blur="handleBlur" placeholder="🔍 Search or select province..."
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48B7CB] focus:border-transparent transition-all text-[#2E2E2E] text-sm" />

              <div v-if="showDropdown && filteredProvinces.length > 0"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div v-for="province in filteredProvinces" :key="province" @mousedown.prevent="selectProvince(province)"
                  class="px-4 py-2 hover:bg-[#F3F9FA] cursor-pointer text-sm text-[#2E2E2E] transition-colors"
                  :class="{ 'bg-[#F3F9FA] font-medium text-[#368998]': form.location === province }">
                  {{ province }}
                </div>
              </div>

              <p v-if="form.location" class="mt-1 text-xs text-[#368998] font-medium">
                ✓ Selected: {{ form.location }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button type="button" @click="$router.push('/data-use')" :disabled="isSubmitting"
          class="px-5 py-2 text-[#5C5C5C] hover:bg-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Cancel
        </button>
        <button type="submit" :disabled="isSubmitting || aiStatus === 'Offline'"
          class="px-6 py-2 bg-[#48B7CB] hover:bg-[#368998] text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed">
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
            </circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ isSubmitting ? 'Uploading...' : 'Upload Case' }}
        </button>
      </div>

      <div class="mt-6 pt-2 text-center">
        <p class="text-[10px] text-[#5C5C5C] italic opacity-60">
            AI-assisted support only. Results must be reviewed by qualified personnel.
        </p>
      </div>
    </form>

    <!-- Custom Modal Popup -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-auto shadow-2xl relative">
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ modalTitle }}</h3>
          <p class="text-gray-700 whitespace-pre-line mb-6 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">{{ modalMessage }}</p>
          <div class="flex justify-end gap-3">
            <button @click="handleModalClose" class="px-5 py-2 bg-[#48B7CB] hover:bg-[#368998] text-white rounded-md font-medium text-sm shadow-sm transition-colors">
              OK
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { uploadCase, analyzeCase, fetchNextPatientCode } from '@/features/case-management/services/case.service'
import { uploadCaseImage } from '@/features/case-management/services/caseImage.service'
import { systemService } from '@/services/system.service'
import http from '@/services/http'

const router = useRouter()
const aiStatus = ref('Checking...')
const fileInputRef = ref(null)
const selectedFileName = ref('')
const selectedFileSize = ref('')
const previewUrl = ref('')
const isSubmitting = ref(false)

const provinceSearch = ref('')

const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
let modalCallback = null

const customAlert = (title, message, callback = null) => {
  modalTitle.value = title
  modalMessage.value = message
  showModal.value = true
  modalCallback = callback
}

const handleModalClose = () => {
  showModal.value = false
  if (modalCallback) {
    modalCallback()
    modalCallback = null
  }
}


const form = reactive({
  patientCode: '',
  technicianId: '',
  location: ''
})

const filteredProvinces = computed(() => {
  const q = provinceSearch.value.trim().toLowerCase()
  if (!q) return englishProvinces
  return englishProvinces.filter(p => p.toLowerCase().includes(q))
})

const showDropdown = ref(false)

const handleSearchInput = () => {
  showDropdown.value = true
  // If user types, invalidate previous selection until they click again or exact match
  if (form.location !== provinceSearch.value) {
    form.location = ''
  }
}

const selectProvince = (province) => {
  form.location = province
  provinceSearch.value = province
  showDropdown.value = false
}

const handleBlur = () => {
  showDropdown.value = false
  // Auto-select if exact match typed, otherwise clear invalid input
  if (provinceSearch.value && !form.location) {
    const exactMatch = englishProvinces.find(p => p.toLowerCase() === provinceSearch.value.trim().toLowerCase())
    if (exactMatch) {
      selectProvince(exactMatch)
    }
  }
}

const englishProvinces = [
  "Amnat Charoen", "Ang Thong", "Bangkok Metropolis", "Bueng Kan", "Buri Ram", "Chachoengsao",
  "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai", "Chiang Rai", "Chon Buri",
  "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi",
  "Lampang", "Lamphun", "Loei", "Lop Buri", "Mae Hong Son", "Maha Sarakham",
  "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima",
  "Nakhon Sawan", "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lam Phu",
  "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Phangnga", "Phatthalung",
  "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phra Nakhon Si Ayutthaya",
  "Phrae", "Phuket", "Prachin Buri", "Prachuap Khiri Khan", "Ranong", "Ratchaburi",
  "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon",
  "Samut Songkhram", "Saraburi", "Satun", "Sing Buri", "Si Sa Ket", "Songkhla",
  "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang", "Trat",
  "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", "Yala", "Yasothon"
].sort((a, b) => a.localeCompare(b));

onMounted(async () => {
  try {
    try {
      const aiRes = await systemService.getAiStatus();
      aiStatus.value = aiRes.aiStatus === 'ONLINE' ? 'Online' : 'Offline';
    } catch (e) {
      aiStatus.value = 'Offline';
    }

    const nextCodeRes = await fetchNextPatientCode();
    form.patientCode = nextCodeRes.data;

    const authRes = await http.get('/auth/me');
    if (authRes.data) {
      if (authRes.data.firstName || authRes.data.lastName) {
        form.technicianId = `${authRes.data.firstName || ''} ${authRes.data.lastName || ''}`.trim();
      } else if (authRes.data.fullName) {
        form.technicianId = authRes.data.fullName;
      } else {
        form.technicianId = authRes.data.email || 'Unknown User';
      }
    }
  } catch (e) {
    console.error('Failed to load initial data:', e);
  }
})

const triggerFileInput = () => {
  fileInputRef.value.click()
}

const updatePreview = (file) => {
  if (file) {
    selectedFileName.value = file.name
    selectedFileSize.value = `${(file.size / 1024 / 1024).toFixed(2)} MB`
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeFile = () => {
  selectedFileName.value = ''
  selectedFileSize.value = ''
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleFileChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    updatePreview(e.target.files[0])
  }
}

const handleDrop = (e) => {
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    updatePreview(e.dataTransfer.files[0])
    fileInputRef.value.files = e.dataTransfer.files
  }
}

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

const analyzeError = ref('')

const handleSubmit = async () => {
  if (!previewUrl.value) {
    customAlert('Warning', 'Please select an image file first.')
    return
  }

  if (isSubmitting.value) {
    return // Prevent duplicate submissions
  }

  try {
    isSubmitting.value = true

    // 3-second delay as requested
    await new Promise(resolve => setTimeout(resolve, 3000))

    const caseFormData = new FormData()
    caseFormData.append('patientCode', form.patientCode)
    caseFormData.append('technicianId', form.technicianId)
    caseFormData.append('location', form.location)

    if (fileInputRef.value.files && fileInputRef.value.files.length > 0) {
      caseFormData.append('image', fileInputRef.value.files[0])
    }

    const res = await uploadCase(caseFormData)
    const caseId = res.data.id

    // Attempt AI analysis — non-blocking: 502 means AI service is down,
    // but the case was created successfully so we still navigate.
    try {
      await analyzeCase(caseId)
    } catch (analyzeErr) {
      const status = analyzeErr.response?.status
      console.warn(`AI analysis failed (HTTP ${status || 'unknown'}):`, analyzeErr.message)
      // Soft warning — user sees the case detail page anyway
      analyzeError.value = status === 502
        ? 'AI analysis service is currently unavailable. You can retry analysis from the case detail page.'
        : `AI analysis failed: ${analyzeErr.response?.data?.message || analyzeErr.message}`
    }

    isSubmitting.value = false

    customAlert('Success', 'Image is valid and meets the criteria. Click OK to proceed to analysis.', () => {
      router.push(`/data-use/cases/${caseId}`)
    })

  } catch (error) {
    console.error('Upload error:', error)
    isSubmitting.value = false

    if (error.response?.data?.type === 'ImageValidationFailed') {
      customAlert('Upload Rejected', 'The image is invalid, not a blood cell or microscope image.')
    } else {
      customAlert('Upload Failed', error.response?.data?.message || error.message)
    }
  }
}
</script>

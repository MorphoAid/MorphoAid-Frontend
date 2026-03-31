<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="handleClose">
        <Transition name="scale">
          <div v-if="isOpen" class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300" data-testid="case-upload-modal">
            <!-- Modal Header - Simplified as per image -->
            <div class="p-8">
              <!-- Upload Area -->
              <div
                class="border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer mb-8 group"
                :class="[
                  isDragging ? 'border-[#48B7CB] bg-[#F3F9FA]' : 'border-[#C6E9EF] hover:border-[#48B7CB] hover:bg-[#F3F9FA]',
                  aiStatus === 'Offline' ? 'opacity-50 cursor-not-allowed grayscale' : ''
                ]"
                @click="aiStatus !== 'Offline' && triggerFileInput()"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
              >
                <input
                  type="file"
                  ref="fileInputRef"
                  class="hidden"
                  accept=".png, .jpg, .jpeg"
                  @change="handleFileChange"
                  :disabled="aiStatus === 'Offline'"
                  data-testid="file-input"
                />

                <div v-if="previewUrl" class="relative group/preview">
                  <img :src="previewUrl" alt="Preview" class="w-full h-48 object-contain rounded-lg mb-4" />
                  <div class="text-sm font-medium text-[#2E2E2E] truncate mb-1">{{ selectedFileName }}</div>
                  <div class="text-xs text-[#5C5C5C] mb-4">{{ selectedFileSize }}</div>
                  <div class="flex justify-center gap-2">
                    <button type="button" @click.stop="triggerFileInput" class="text-xs font-semibold text-[#48B7CB] hover:text-[#368998] px-3 py-1 bg-white border border-[#48B7CB]/30 rounded-full shadow-sm">Change</button>
                    <button type="button" @click.stop="removeFile" class="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1 bg-white border border-red-200 rounded-full shadow-sm">Remove</button>
                  </div>
                </div>

                <div v-else class="flex flex-col items-center">
                  <div class="w-16 h-16 bg-[#C6E9EF]/30 rounded-2xl flex items-center justify-center mb-4 text-[#48B7CB] group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl font-light">cloud_upload</span>
                  </div>
                  <h3 class="text-lg font-bold text-[#2E2E2E] mb-1">Click to upload or drag and drop</h3>
                  <p class="text-sm text-[#5C5C5C]">PNG or JPG up to 10MB</p>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="space-y-6">
                <div>
                  <label class="block text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Patient Code</label>
                  <input
                    type="text"
                    v-model="form.patientCode"
                    disabled
                    class="w-full px-4 py-3 bg-[#F8F8F8] border border-gray-100 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Technician Firstname Lastname</label>
                    <input
                      type="text"
                      v-model="form.technicianId"
                      disabled
                      class="w-full px-4 py-3 bg-[#F8F8F8] border border-gray-100 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                    />
                  </div>
                  <div class="relative" ref="searchContainerRef" @keydown.esc="showDropdown = false">
                    <label class="block text-[11px] font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Location</label>
                    <div class="relative group/search" @focusout="handleFocusOut">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl group-focus-within/search:text-[#48B7CB] transition-colors">search</span>
                      <input
                        type="text"
                        v-model="provinceSearch"
                        @focus="showDropdown = true"
                        @input="handleSearchInput"
                        placeholder="Search or select province..."
                        class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#48B7CB]/20 focus:border-[#48B7CB] transition-all text-[#2E2E2E] text-sm font-medium"
                        data-testid="location-input"
                      />
                      
                      <div v-if="showDropdown && filteredProvinces.length > 0" class="absolute z-[110] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-56 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                        <div
                          v-for="province in filteredProvinces"
                          :key="province"
                          @mousedown.prevent="selectProvince(province)"
                          class="px-5 py-3 hover:bg-[#F3F9FA] cursor-pointer text-sm font-medium transition-colors"
                          :class="form.location === province ? 'text-[#48B7CB] bg-[#F3F9FA]' : 'text-[#5C5C5C]'"
                          data-testid="province-option"
                        >
                          {{ province }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="flex items-center justify-end gap-3 mt-10">
                <button
                  @click="handleClose"
                  :disabled="isSubmitting"
                  class="px-6 py-2.5 text-sm font-bold text-[#5C5C5C] hover:text-[#2E2E2E] hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  @click="handleSubmit"
                  :disabled="isSubmitting || isLoadingInitial || !selectedFile || aiStatus === 'Offline'"
                  class="px-8 py-2.5 bg-[#004A99] hover:bg-[#003D7A] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#004A99]/20 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  data-testid="upload-case-button"
                >
                  <svg v-if="isSubmitting || isLoadingInitial" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isSubmitting ? 'Uploading...' : (isLoadingInitial ? 'Loading...' : 'Upload Case') }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Success/Error Alert Modal -->
    <Teleport to="body">
      <div v-if="alert.show" class="fixed inset-0 z-[2100] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
        <div class="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
          <div :class="['w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto', alert.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500']">
            <span class="material-symbols-outlined text-3xl">{{ alert.type === 'success' ? 'check_circle' : 'error' }}</span>
          </div>
          <h3 class="text-xl font-bold text-[#2E2E2E] text-center mb-2" data-testid="alert-title">{{ alert.title }}</h3>
          <p class="text-[#5C5C5C] text-center mb-8 leading-relaxed" data-testid="alert-message">{{ alert.message }}</p>
          <button @click="closeAlert" class="w-full py-3 bg-[#48B7CB] hover:bg-[#368998] text-white font-bold rounded-xl shadow-lg shadow-[#48B7CB]/20 transition-all" data-testid="alert-ok-button">
            OK
          </button>
        </div>
      </div>
    </Teleport>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { uploadCase, analyzeCase, fetchNextPatientCode } from '@/features/case-management/services/case.service'
import { systemService } from '@/services/system.service'
import { useUiStore } from '@/store/ui.store'
import http from '@/services/http'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'success'])

const router = useRouter()
const uiStore = useUiStore()
const fileInputRef = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const selectedFileSize = ref('')
const previewUrl = ref('')
const isSubmitting = ref(false)
const isDragging = ref(false)
const isLoadingInitial = ref(true)
const aiStatus = ref('Checking...')

const provinceSearch = ref('')
const showDropdown = ref(false)
const searchContainerRef = ref(null)

const alert = reactive({
  show: false,
  title: '',
  message: '',
  type: 'success', // 'success' | 'error'
  callback: null
})

const form = reactive({
  patientCode: '',
  technicianId: '',
  location: ''
})

const handleClose = () => {
  if (isSubmitting.value) return
  emit('close')
  resetForm()
}

const resetForm = () => {
  selectedFile.value = null
  selectedFileName.value = ''
  selectedFileSize.value = ''
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  form.location = ''
  provinceSearch.value = ''
}

const triggerFileInput = () => {
  fileInputRef.value.click()
}

const updatePreview = (file) => {
  if (file && (file instanceof File || file instanceof Blob)) {
    selectedFile.value = file
    selectedFileName.value = file.name
    selectedFileSize.value = `${(file.size / 1024 / 1024).toFixed(2)} MB`
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  selectedFileName.value = ''
  selectedFileSize.value = ''
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const handleFileChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    updatePreview(e.target.files[0])
  }
}

const handleDragOver = () => {
  if (aiStatus.value === 'Offline') return
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e) => {
  isDragging.value = false
  if (aiStatus.value === 'Offline') return
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    updatePreview(e.dataTransfer.files[0])
  }
}

const handleSearchInput = () => {
  showDropdown.value = true
}

const selectProvince = (province) => {
  form.location = province
  provinceSearch.value = province
  showDropdown.value = false
}

const handleFocusOut = (event) => {
  // Use a tiny delay to allow relatedTarget to be populated
  // and check if focus is still within the container
  requestAnimationFrame(() => {
    if (searchContainerRef.value && !searchContainerRef.value.contains(document.activeElement)) {
      showDropdown.value = false
    }
  })
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
].sort((a, b) => a.localeCompare(b))

const filteredProvinces = computed(() => {
  const q = provinceSearch.value.trim().toLowerCase()
  if (!q) return englishProvinces
  return englishProvinces.filter(p => p.toLowerCase().includes(q))
})

const showAlert = (title, message, type = 'success', callback = null) => {
  alert.title = title
  alert.message = message
  alert.type = type
  alert.callback = callback
  alert.show = true
}

const closeAlert = () => {
  alert.show = false
  if (alert.callback) alert.callback()
}

const loadInitialData = async () => {
  if (!props.isOpen) return
  try {
    isLoadingInitial.value = true
    const [aiRes, nextCodeRes, authRes] = await Promise.all([
      systemService.getAiStatus().catch(() => ({ aiStatus: 'OFFLINE' })),
      fetchNextPatientCode().catch(() => ({ data: 'ERROR' })),
      http.get('/auth/me').catch(() => ({ data: {} }))
    ])

    aiStatus.value = aiRes.aiStatus === 'ONLINE' ? 'Online' : 'Offline'
    form.patientCode = nextCodeRes.data
    
    if (authRes.data) {
      form.technicianId = `${authRes.data.firstName || ''} ${authRes.data.lastName || ''}`.trim() || authRes.data.email || 'Unknown User'
    }
  } catch (e) {
    console.error('Failed to load initial data:', e)
  } finally {
    isLoadingInitial.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadInitialData()
    if (uiStore.uploadedFile) {
      updatePreview(uiStore.uploadedFile)
      uiStore.uploadedFile = null
    }
  }
})

const handleSubmit = async () => {
  // SRS-41: Selection Validation
  if (!selectedFile.value) {
    showAlert('Selection Required', 'Please select an image file first.', 'error')
    return
  }

  // SRS-139: Block uploads when AI service is offline
  if (aiStatus.value === 'Offline') {
    showAlert('Service Offline', 'AI service is currently offline for maintenance. New image uploads are suspended.', 'error')
    return
  }
  
  // SRS-40: Supported formats (already restricted by input accept, but for drag-drop/manual)
  const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg']
  if (!allowedFormats.includes(selectedFile.value.type)) {
     showAlert('Unsupported Format', 'Unsupported file format.', 'error')
     return
  }

  // SRS-42: File size limit 10MB
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (selectedFile.value.size > maxSize) {
    showAlert('Limit Exceeded', 'File size exceeds the limit.', 'error')
    return
  }

  // SRS-39: Location Required
  if (!form.location) {
    showAlert('Field Required', 'Location is required.', 'error')
    return
  }

  // Ensure patient code and technician are loaded
  if (isLoadingInitial.value || !form.patientCode || form.patientCode === 'ERROR') {
    showAlert('System Error', 'Could not retrieve patient data. Please refresh and try again.', 'error')
    return
  }

  if (isSubmitting.value) return

  try {
    isSubmitting.value = true

    const caseFormData = new FormData()
    caseFormData.append('patientCode', form.patientCode)
    caseFormData.append('technicianId', form.technicianId)
    caseFormData.append('location', form.location)
    caseFormData.append('image', selectedFile.value)

    const res = await uploadCase(caseFormData)
    const caseId = res.data.id

    isSubmitting.value = false
    
    // SRS-45/46: Success Validation Popup
    showAlert('Success', 'Image is valid and meets the criteria. Click OK to proceed to analysis.', 'success', async () => {
      try {
        // SRS-47: Submit for AI analysis
        analyzeCase(caseId).catch(err => console.error('Auto-analysis trigger failed:', err))
        
        handleClose()
        // SRS-49: Redirect to Case Detail
        router.push(`/data-use/cases/${caseId}`)
      } catch (e) {
        console.error('Post-OK action failed:', e)
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    isSubmitting.value = false
    
    const resData = error.response?.data
    if (resData?.type === 'ImageValidationFailed' || (error.response?.status === 400 && resData?.message)) {
      // SRS-44: Upload Rejected
      showAlert('Upload Rejected', 'The image is invalid, not a blood cell or microscope image.', 'error')
    } else {
      // SRS-50: System/Database error
      showAlert('Error', 'Error creating case. Please try again later.', 'error')
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scale-enter-active, .scale-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.9); }

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>

<template>
  <div class="p-8 max-w-2xl mx-auto w-full">
    <div class="mb-8">
      <button @click="$router.back()" class="flex items-center gap-2 text-[#5C5C5C] hover:text-[#368998] transition-colors mb-4 group">
        <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="text-sm font-medium">Back</span>
      </button>
      <h1 class="text-3xl font-bold text-[#2E2E2E] mb-2">Upload New Case</h1>
      <p class="text-[#5C5C5C]">Upload a blood smear image for AI analysis. Patient information is strictly anonymized.</p>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
      <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h3 class="text-sm font-medium text-red-800">Validation Error</h3>
        <p class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

      <!-- Drag & Drop Area -->
      <div
        class="border-2 border-dashed rounded-xl text-center transition-colors cursor-pointer mb-8 relative"
        @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop"
        :class="[
          previewUrl ? 'p-4 border-[#C6E9EF]' : 'p-10 hover:bg-[#F8F8F8] border-[#C6E9EF]',
          errorMessage ? 'border-red-300 bg-red-50' : ''
        ]">
        <input id="fileInput" type="file" ref="fileInputRef" class="hidden" accept=".png, .jpg, .jpeg"
          @change="handleFileChange" />

        <div v-if="previewUrl" class="w-full flex flex-col items-center">
          <img :src="previewUrl" alt="Preview"
            class="w-full h-auto max-h-[240px] rounded object-contain mx-auto border border-gray-200 mb-3" />
          <div class="text-center mb-3">
            <p class="text-sm font-medium text-[#2E2E2E] truncate max-w-xs">{{ selectedFileName }}</p>
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

      <!-- Action Buttons -->
      <div class="flex items-center justify-end pt-4 border-t border-gray-100">
        <button type="submit" :disabled="isSubmitting || !previewUrl"
          class="px-6 py-2.5 bg-[#48B7CB] hover:bg-[#368998] text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center min-w-[160px] disabled:opacity-70 disabled:cursor-not-allowed">
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ isSubmitting ? 'Processing...' : 'Upload Image' }}
        </button>
      </div>
    </form>

    <!-- Custom Modal Popup -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ modalTitle }}</h3>
          <p class="text-gray-700 whitespace-pre-line mb-6 text-sm leading-relaxed">{{ modalMessage }}</p>
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
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { uploadDataPrepCase } from '@/features/case-management/services/case.service'

const router = useRouter()
const fileInputRef = ref(null)
const selectedFileName = ref('')
const selectedFileSize = ref('')
const previewUrl = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

const clearError = () => {
  errorMessage.value = ''
}

const triggerFileInput = () => {
  clearError()
  fileInputRef.value.click()
}

const validateFile = (file) => {
  if (!file) {
    errorMessage.value = 'Please select a file to upload.'
    return false
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    errorMessage.value = 'Invalid file type. Please upload a JPG or PNG image.'
    return false
  }
  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is 10MB.`
    return false
  }
  return true
}

const updatePreview = (file) => {
  clearError()
  if (!validateFile(file)) {
    removeFile()
    return
  }

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
    if (!errorMessage.value) {
      fileInputRef.value.files = e.dataTransfer.files
    }
  }
}

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

const handleSubmit = async () => {
  clearError()

  if (!previewUrl.value || !fileInputRef.value.files || fileInputRef.value.files.length === 0) {
    errorMessage.value = 'Please select an image file first.'
    return
  }

  if (isSubmitting.value) return

  try {
    isSubmitting.value = true

    const caseFormData = new FormData()
    caseFormData.append('image', fileInputRef.value.files[0])

    const res = await uploadDataPrepCase(caseFormData)
    const caseId = res.data.id

    isSubmitting.value = false

    customAlert('Success', 'Image is valid and meets the criteria. Click OK to proceed to analysis.', () => {
      // AI analysis is triggered server-side by the DataPrepCaseController.
      // Navigate directly into result view.
      router.push(`/dataprep/cases/${caseId}/result`)
    })
  } catch (error) {
    console.error('Upload error:', error)
    isSubmitting.value = false

    if (error.response?.data?.type === 'ImageValidationFailed') {
      customAlert('Upload Rejected', 'The image is invalid, not a blood cell or microscope image.')
    } else if (error.response?.data?.message) {
      errorMessage.value = `Upload failed: ${error.response.data.message}`
    } else {
      errorMessage.value = 'An unexpected error occurred during upload. Please try again.'
    }
  }
}
</script>

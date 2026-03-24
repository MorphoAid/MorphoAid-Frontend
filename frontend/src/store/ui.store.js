import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isUploadModalOpen = ref(false)
  const uploadedFile = ref(null)

  const openUploadModal = (file = null) => {
    uploadedFile.value = file
    isUploadModalOpen.value = true
  }

  const closeUploadModal = () => {
    isUploadModalOpen.value = false
    uploadedFile.value = null
  }

  const toggleUploadModal = () => {
    isUploadModalOpen.value = !isUploadModalOpen.value
    if (!isUploadModalOpen.value) {
      uploadedFile.value = null
    }
  }

  return {
    isUploadModalOpen,
    uploadedFile,
    openUploadModal,
    closeUploadModal,
    toggleUploadModal
  }
})

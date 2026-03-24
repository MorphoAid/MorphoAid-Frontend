import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isUploadModalOpen = ref(false)

  const openUploadModal = () => {
    isUploadModalOpen.value = true
  }

  const closeUploadModal = () => {
    isUploadModalOpen.value = false
  }

  const toggleUploadModal = () => {
    isUploadModalOpen.value = !isUploadModalOpen.value
  }

  return {
    isUploadModalOpen,
    openUploadModal,
    closeUploadModal,
    toggleUploadModal
  }
})

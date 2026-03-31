<template>
  <div class="case-image-upload mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clip-rule="evenodd" />
        </svg>
        Case Image
      </h2>
      <div v-if="imageId"
        class="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
        {{ existingFilename || 'Image Attached' }}
      </div>
    </div>

    <div class="p-8">
      <!-- State 1: Already has an image and NOT in editing mode -->
      <div v-if="imageId && !isEditing" class="flex flex-col items-center justify-center py-4">
        <div class="relative group cursor-pointer" @click="isEditing = true">
          <div v-if="imageUrl" class="relative">
            <img :src="imageUrl" alt="Case Image Preview"
              class="max-w-full h-auto max-h-72 rounded-lg border-2 border-gray-100 shadow-md group-hover:opacity-75 transition-opacity" />
            <div
              class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span
                class="bg-white/90 text-blue-700 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Change Image
              </span>
            </div>
          </div>
          <div v-else
            class="bg-blue-50 text-blue-700 px-6 py-10 rounded-xl border-2 border-dashed border-blue-200 flex flex-col items-center gap-3 w-full max-w-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="font-medium text-center">Image exists but content failed to load</p>
            <button @click.stop="isEditing = true" class="mt-2 text-sm font-bold underline">Try replacing it</button>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button @click="isEditing = true"
            class="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fill-rule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clip-rule="evenodd" />
            </svg>
            Edit / Replace Image
          </button>
        </div>
      </div>

      <!-- State 2: No image OR in editing mode -->
      <div v-else class="max-w-xl mx-auto">
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            {{ imageId ? 'Replace existing image' : 'Upload new image' }}
          </label>
          <div
            class="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-dashed rounded-xl transition-all duration-200"
            :class="[
              selectedFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50',
              errorMessage ? 'border-red-300 bg-red-50' : ''
            ]">
            <div class="space-y-1 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400"
                :class="{ 'text-blue-500': selectedFile }" stroke="currentColor" fill="none" viewBox="0 0 48 48"
                aria-hidden="true">
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600 justify-center">
                <label for="file-upload"
                  class="relative cursor-pointer bg-white rounded-md font-bold text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2">
                  <span>{{ selectedFile ? 'Change file' : 'Select a file' }}</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/png, image/jpeg"
                    @change="handleFileChange" :disabled="isUploading" />
                </label>
                <p v-if="!selectedFile" class="pl-1">or drag and drop</p>
              </div>
              <p v-if="!selectedFile" class="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
              <p v-else class="text-sm font-bold text-blue-700 mt-2 truncate max-w-xs mx-auto">{{ selectedFile.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Error & Info Messages -->
        <transition name="fade">
          <div v-if="errorMessage"
            class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex gap-3 animate-head-shake">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-bold text-red-800">Invalid Upload</p>
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>
          </div>
        </transition>

        <div class="flex items-center justify-end gap-3">
          <button v-if="imageId" @click="cancelEdit" :disabled="isUploading"
            class="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 border border-transparent hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button @click="uploadImage" :disabled="!selectedFile || isUploading"
            class="relative px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden">
            <span v-if="isUploading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Uploading...
            </span>
            <span v-else>{{ imageId ? 'Confirm Update' : 'Upload Image' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Modal Popup -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ modalTitle }}</h3>
          <p class="text-gray-700 whitespace-pre-line mb-6 text-sm leading-relaxed">{{ modalMessage }}</p>
          <div class="flex justify-end gap-3">
            <button @click="handleModalClose" class="px-5 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 shadow-sm transition-colors">
              OK
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/store/auth.store';
import { uploadCaseImage, fetchCaseImageBlob } from '../services/caseImage.service';

const props = defineProps({
  caseId: {
    type: [Number, String],
    required: true
  },
  existingFilename: {
    type: String,
    default: ''
  },
  imageId: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['upload-success']);

const authStore = useAuthStore();

const selectedFile = ref(null);
const errorMessage = ref('');
const isUploading = ref(false);
const isEditing = ref(false);
const imageUrl = ref('');

const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
let modalCallback = null;

const customAlert = (title, message, callback = null) => {
  modalTitle.value = title;
  modalMessage.value = message;
  showModal.value = true;
  modalCallback = callback;
};

const handleModalClose = () => {
  showModal.value = false;
  if (modalCallback) {
    modalCallback();
    modalCallback = null;
  }
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const handleFileChange = (event) => {
  errorMessage.value = '';
  const file = event.target.files[0];

  if (!file) {
    selectedFile.value = null;
    return;
  }

  // Validate MIME type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png)$/i)) {
    errorMessage.value = 'Invalid file format. Please use PNG, JPG, or JPEG.';
    selectedFile.value = null;
    event.target.value = '';
    return;
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = 'File is too large. Maximum size allowed is 5MB.';
    selectedFile.value = null;
    event.target.value = '';
    return;
  }

  selectedFile.value = file;
};

const cancelEdit = () => {
  isEditing.value = false;
  selectedFile.value = null;
  errorMessage.value = '';
};

const loadImagePreview = async () => {
  if (!props.imageId) {
    imageUrl.value = '';
    return;
  }

  try {
    const blob = await fetchCaseImageBlob(props.caseId, props.imageId);
    if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to load image preview:', err);
    imageUrl.value = '';
  }
};

const uploadImage = async () => {
  if (!selectedFile.value) return;

  const uploaderId = authStore.user?.id;
  if (!uploaderId) {
    errorMessage.value = 'Session expired. Please log in again.';
    return;
  }

  isUploading.value = true;
  errorMessage.value = '';

  try {
    const uploadResult = await uploadCaseImage(props.caseId, uploaderId, selectedFile.value);
    const newImageId = uploadResult?.id || uploadResult?.imageId || uploadResult?.data?.id;

    if (newImageId) {
      // Reload preview
      const blob = await fetchCaseImageBlob(props.caseId, newImageId);
      if (imageUrl.value) URL.revokeObjectURL(imageUrl.value);
      imageUrl.value = URL.createObjectURL(blob);
    }

    isUploading.value = false;
    errorMessage.value = '';

    customAlert('Success', 'Image is valid and meets the criteria. Click OK to proceed.', () => {
      emit('upload-success', uploadResult);
      selectedFile.value = null;
      isEditing.value = false;
    });
  } catch (err) {
    console.error('Upload failed:', err);
    isUploading.value = false;
    
    if (err?.response?.data?.type === 'ImageValidationFailed') {
      customAlert('Upload Rejected', 'The image is invalid, not a blood cell or microscope image.');
    } else {
      errorMessage.value = err?.response?.data?.message || err.message || 'Server error occurred during upload.';
    }
  }
};

watch(() => props.imageId, (newVal) => {
  if (newVal) loadImagePreview();
}, { immediate: true });

onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes head-shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  50% {
    transform: translateX(4px);
  }

  75% {
    transform: translateX(-4px);
  }

  100% {
    transform: translateX(0);
  }
}

.animate-head-shake {
  animation: head-shake 0.4s ease-in-out;
}
</style>

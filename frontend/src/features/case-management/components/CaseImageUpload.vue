<template>
  <div class="case-image-upload mt-6 bg-white p-6 rounded shadow border border-gray-200">
    <h2 class="text-xl font-semibold mb-4 border-b pb-2">Upload Case Image</h2>
    
    <div class="mb-4">
      <input 
        type="file" 
        accept="image/png, image/jpeg" 
        @change="handleFileChange" 
        :disabled="isUploading"
        class="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100 disabled:opacity-50"
      />
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="text-red-700 bg-red-100 border border-red-400 px-4 py-3 rounded text-sm mb-4">
      {{ errorMessage }}
    </div>

    <!-- Upload Button -->
    <button 
      @click="uploadImage" 
      :disabled="!selectedFile || isUploading"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ isUploading ? 'Uploading...' : 'Upload Image' }}
    </button>

    <!-- Uploaded Image Preview -->
    <div v-if="imageUrl" class="mt-6">
      <h3 class="font-semibold mb-2 text-gray-700">Uploaded Image Preview</h3>
      <div class="border p-2 bg-gray-50 rounded inline-block">
        <img :src="imageUrl" alt="Case Image Blob Preview" class="max-w-full h-auto max-h-96 rounded border border-gray-300" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store/auth.store';
import { uploadCaseImage, fetchCaseImageBlob } from '../services/caseImage.service';

const props = defineProps({
  caseId: {
    type: [Number, String],
    required: true
  }
});

const authStore = useAuthStore();

const selectedFile = ref(null);
const errorMessage = ref('');
const isUploading = ref(false);
const imageUrl = ref('');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const handleFileChange = (event) => {
  errorMessage.value = '';
  const file = event.target.files[0];
  
  if (!file) {
    selectedFile.value = null;
    return;
  }

  // Validate MIME type
  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    errorMessage.value = 'Invalid file type. Only PNG and JPEG are allowed.';
    selectedFile.value = null;
    event.target.value = ''; // Reset input
    return;
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = 'File size exceeds 5MB limit.';
    selectedFile.value = null;
    event.target.value = ''; // Reset input
    return;
  }

  selectedFile.value = file;
};

const uploadImage = async () => {
  if (!selectedFile.value) return;

  const uploaderId = authStore.user?.id;
  if (!uploaderId) {
    errorMessage.value = 'Authentication error: Missing uploader ID.';
    return;
  }

  isUploading.value = true;
  errorMessage.value = '';

  try {
    // 1. Upload the image directly using the service
    const uploadResult = await uploadCaseImage(props.caseId, uploaderId, selectedFile.value);
    
    // We expect the imageId to be returned somewhere in the response.
    // Handling generic response structures since exact shape is not fully provided but typically it is the id.
    const imageId = uploadResult?.id || uploadResult?.imageId || uploadResult?.data?.id; 
    
    if (!imageId) {
      errorMessage.value = 'Upload succeeded, but could not get the image ID to fetch the content.';
      isUploading.value = false;
      return;
    }

    // 2. Fetch the blob using the service
    const blob = await fetchCaseImageBlob(props.caseId, imageId);
    
    // 3. Clear previous blob url
    if (imageUrl.value) {
      URL.revokeObjectURL(imageUrl.value);
    }

    // Render image via URL.createObjectURL
    imageUrl.value = URL.createObjectURL(blob);
    
    // Optional: Reset file selection. Note: Keeping selection visually if user wants context is fine, but resetting feels cleaner.
    selectedFile.value = null;
    // Clear input element file visually is harder without a ref to it, but standard interaction applies.
  } catch (err) {
    console.error('Case image upload error:', err);
    errorMessage.value = err?.response?.data?.message || err.message || 'An error occurred during upload.';
  } finally {
    isUploading.value = false;
  }
};

onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
});
</script>

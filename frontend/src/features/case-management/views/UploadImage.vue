<template>
    <div class="p-8 max-w-2xl mx-auto w-full">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-[#2E2E2E] mb-2">Upload New Case</h1>
            <p class="text-[#5C5C5C]">Upload a blood smear image for AI analysis and tracking.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

            <!-- Drag & Drop Area -->
            <div class="border-2 border-dashed border-[#C6E9EF] rounded-xl text-center hover:bg-[#F8F8F8] transition-colors cursor-pointer mb-8 relative"
                @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop"
                :class="{ 'p-10': !previewUrl, 'p-4': previewUrl }">
                <input id="fileInput" type="file" ref="fileInputRef" class="hidden" accept=".png, .jpg, .jpeg"
                    @change="handleFileChange" />

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
                    <input type="text" v-model="form.patientCode" placeholder="e.g. PT-1004"
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48B7CB] focus:border-transparent transition-all text-[#2E2E2E]" />
                </div>

                <div class="grid grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm font-medium text-[#2E2E2E] mb-1">Technician ID</label>
                        <input type="text" v-model="form.technicianId" placeholder="e.g. T-99"
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48B7CB] focus:border-transparent transition-all text-[#2E2E2E]" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-[#2E2E2E] mb-1">Location</label>
                        <input type="text" v-model="form.location" placeholder="e.g. Clinic A"
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48B7CB] focus:border-transparent transition-all text-[#2E2E2E]" />
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" @click="$router.push('/data-use/dashboard')"
                    class="px-5 py-2 text-[#5C5C5C] hover:bg-gray-100 font-medium rounded-lg transition-colors">
                    Cancel
                </button>
                <button type="submit"
                    class="px-6 py-2 bg-[#48B7CB] hover:bg-[#368998] text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center min-w-[120px]">
                    Upload Case
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { uploadCase, analyzeCase } from '@/features/case-management/services/case.service'
import { uploadCaseImage } from '@/features/case-management/services/caseImage.service'

const router = useRouter()
const fileInputRef = ref(null)
const selectedFileName = ref('')
const selectedFileSize = ref('')
const previewUrl = ref('')

const form = reactive({
    patientCode: '',
    technicianId: '',
    location: ''
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

const handleSubmit = async () => {
    if (!previewUrl.value) {
        alert('Please select an image file first.')
        return
    }

    try {
        const caseFormData = new FormData()
        caseFormData.append('patientCode', form.patientCode)
        caseFormData.append('technicianId', form.technicianId)
        caseFormData.append('location', form.location)
        // Add fake uploaderId for now to satisfy backend
        caseFormData.append('uploaderId', 1)

        if (fileInputRef.value.files && fileInputRef.value.files.length > 0) {
            caseFormData.append('image', fileInputRef.value.files[0])
        }

        const res = await uploadCase(caseFormData)
        const caseId = res.data.id

        await analyzeCase(caseId)

        router.push(`/data-use/cases/${caseId}`)
    } catch (error) {
        console.error("Upload error:", error)
        alert('Upload failed: ' + (error.response?.data?.message || error.message))
    }
}
</script>

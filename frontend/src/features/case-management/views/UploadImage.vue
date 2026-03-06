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
                        <input type="text" v-model="form.location" placeholder="Select Province"
                            list="english-provinces"
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48B7CB] focus:border-transparent transition-all text-[#2E2E2E]" />
                        <datalist id="english-provinces">
                            <option v-for="province in englishProvinces" :key="province" :value="province"></option>
                        </datalist>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" @click="$router.push('/data-use/dashboard')" :disabled="isSubmitting"
                    class="px-5 py-2 text-[#5C5C5C] hover:bg-gray-100 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Cancel
                </button>
                <button type="submit" :disabled="isSubmitting"
                    class="px-6 py-2 bg-[#48B7CB] hover:bg-[#368998] text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed">
                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ isSubmitting ? 'Uploading...' : 'Upload Case' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { uploadCase, analyzeCase, fetchNextPatientCode } from '@/features/case-management/services/case.service'
import { uploadCaseImage } from '@/features/case-management/services/caseImage.service'
import http from '@/services/http'

const router = useRouter()
const fileInputRef = ref(null)
const selectedFileName = ref('')
const selectedFileSize = ref('')
const previewUrl = ref('')
const isSubmitting = ref(false)

const form = reactive({
    patientCode: '',
    technicianId: '',
    location: ''
})

const englishProvinces = [
    "Amnat Charoen", "Ang Thong", "Bangkok", "Bueng Kan", "Buri Ram", "Chachoengsao",
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
        alert('Please select an image file first.')
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

        router.push(`/data-use/cases/${caseId}`)
    } catch (error) {
        console.error('Upload error:', error)
        alert('Upload failed: ' + (error.response?.data?.message || error.message))
    } finally {
        isSubmitting.value = false
    }
}
</script>

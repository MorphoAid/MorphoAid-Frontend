<template>
    <div class="clinical-upload-container">
        <div class="upload-card">
            <h1 class="premium-title">Clinical Case Upload</h1>
            <p class="subtitle">Upload a microscope image for AI-powered parasite analysis.</p>

            <form @submit.prevent="handleUpload" class="upload-form">
                <!-- Image Upload Section -->
                <div class="form-group">
                    <label class="form-label">Microscope Image (JPG/PNG)</label>
                    <div class="drop-zone" :class="{ 'drop-zone--active': isDragging, 'drop-zone--error': imageError }"
                        @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                        @drop.prevent="onDrop" @click="$refs.fileInput.click()">
                        <div v-if="!imagePreview" class="drop-zone-content">
                            <i class="upload-icon">+</i>
                            <span>Click or drag image to upload</span>
                            <span class="file-hint">Max size: 5MB</span>
                        </div>
                        <img v-else :src="imagePreview" alt="Preview" class="preview-img" />
                        <input type="file" ref="fileInput" hidden accept="image/jpeg,image/png"
                            @change="onFileChange" />
                    </div>
                    <p v-if="imageError" class="error-text">{{ imageError }}</p>
                </div>

                <div class="metadata-grid">
                    <!-- Province Selection -->
                    <div class="form-group">
                        <label class="form-label">Province</label>
                        <select v-model="form.provinceCode" required class="premium-input">
                            <option value="" disabled>Select Province</option>
                            <option v-for="p in provinces" :key="p.code" :value="p.code">
                                {{ p.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Patient Code -->
                    <div class="form-group">
                        <label class="form-label">Patient Code (Optional)</label>
                        <input type="text" v-model="form.patientCode" placeholder="e.g. P12345" class="premium-input" />
                    </div>
                </div>

                <!-- Consent Toggle -->
                <div class="form-group consent-section">
                    <label class="consent-label">
                        <input type="checkbox" v-model="form.consent" class="consent-checkbox" />
                        <span>I have obtained patient consent to store metadata</span>
                    </label>
                </div>

                <!-- Patient Metadata (PII) -->
                <transition name="fade">
                    <div v-if="form.consent" class="form-group">
                        <label class="form-label">Patient Identifiable Metadata</label>
                        <textarea v-model="form.patientMetadata" placeholder="Enter name, HN, or contact info..."
                            class="premium-input premium-textarea" required></textarea>
                        <p class="info-text">Stored securely. Only visible to you and administrators.</p>
                    </div>
                </transition>

                <div v-if="statusMessage" class="status-banner" :class="statusClass">
                    {{ statusMessage }}
                </div>

                <button type="submit" class="submit-btn" :disabled="isUploading || !form.imageFile">
                    <span v-if="isUploading">Processing AI Analysis...</span>
                    <span v-else>Submit for Analysis</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import ClinicalService from '../services/clinical.service';

const router = useRouter();
const isDragging = ref(false);
const isUploading = ref(false);
const imageError = ref('');
const imagePreview = ref(null);
const statusMessage = ref('');
const statusType = ref('info');

const form = reactive({
    imageFile: null,
    provinceCode: '',
    provinceName: '',
    patientCode: '',
    consent: false,
    patientMetadata: ''
});

const provinces = [
    { code: 'BK', name: 'Bangkok' },
    { code: 'CM', name: 'Chiang Mai' },
    { code: 'PK', name: 'Phuket' },
    { code: 'CB', name: 'Chon Buri' },
    { code: 'KK', name: 'Khon Kaen' }
    // Add more provinces as needed
];

const statusClass = computed(() => ({
    'status-banner--info': statusType.value === 'info',
    'status-banner--success': statusType.value === 'success',
    'status-banner--error': statusType.value === 'error',
    'status-banner--warn': statusType.value === 'warn'
}));

const onFileChange = (e) => {
    const file = e.target.files[0];
    validateAndPreview(file);
};

const onDrop = (e) => {
    isDragging.value = false;
    const file = e.dataTransfer.files[0];
    validateAndPreview(file);
};

const validateAndPreview = (file) => {
    imageError.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        imageError.value = 'Only JPG/PNG files are allowed.';
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        imageError.value = 'File size exceeds the limit.';
        return;
    }

    form.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => (imagePreview.value = e.target.result);
    reader.readAsDataURL(file);
};

const handleUpload = async () => {
    if (!form.imageFile) return;

    isUploading.value = true;
    statusMessage.value = 'Uploading and analyzing...';
    statusType.value = 'info';

    const formData = new FormData();
    formData.append('image', form.imageFile);
    formData.append('provinceCode', form.provinceCode);

    const province = provinces.find(p => p.code === form.provinceCode);
    formData.append('provinceName', province ? province.name : '');

    formData.append('consent', form.consent);
    if (form.consent) {
        formData.append('patientMetadata', form.patientMetadata);
    }

    try {
        const response = await ClinicalService.uploadCase(formData);
        statusType.value = 'success';
        statusMessage.value = 'Upload successful!';

        // Check if AI failed in the callback
        if (response.data.analysisStatus === 'FAILED') {
            statusType.value = 'warn';
            statusMessage.value = 'Case saved, but AI analysis failed. Please try again later.';
        }

        // Redirect to detail after a short delay
        setTimeout(() => {
            router.push({ name: 'ClinicalCaseDetail', params: { id: response.data.id } });
        }, 2000);

    } catch (error) {
        statusType.value = 'error';
        const msg = error.response?.data?.message || 'Error creating case. Please try again later.';
        statusMessage.value = msg;
    } finally {
        isUploading.value = false;
    }
};
</script>

<style scoped>
.clinical-upload-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
    background: #f8fafc;
    min-height: calc(100vh - 64px);
}

.upload-card {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 600px;
}

.premium-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: #64748b;
    margin-bottom: 2rem;
}

.upload-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-weight: 600;
    font-size: 0.9rem;
    color: #475569;
}

.drop-zone {
    height: 200px;
    border: 2px dashed #e2e8f0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    position: relative;
}

.drop-zone--active {
    border-color: #3b82f6;
    background: #eff6ff;
}

.drop-zone--error {
    border-color: #ef4444;
}

.drop-zone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: #94a3b8;
}

.upload-icon {
    font-size: 2rem;
    font-style: normal;
}

.file-hint {
    font-size: 0.8rem;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.metadata-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.premium-input {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
    background: #f1f5f9;
}

.premium-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
}

.premium-textarea {
    min-height: 100px;
    resize: vertical;
}

.consent-section {
    background: #f1f5f9;
    padding: 1rem;
    border-radius: 8px;
}

.consent-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    cursor: pointer;
}

.consent-checkbox {
    width: 18px;
    height: 18px;
}

.status-banner {
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
}

.status-banner--info {
    background: #eff6ff;
    color: #1e3a8a;
}

.status-banner--success {
    background: #ecfdf5;
    color: #065f46;
}

.status-banner--error {
    background: #fef2f2;
    color: #991b1b;
}

.status-banner--warn {
    background: #fffbeb;
    color: #92400e;
}

.submit-btn {
    background: #2563eb;
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
    background: #1d4ed8;
}

.submit-btn:disabled {
    background: #94a3b8;
    cursor: not-allowed;
}

.error-text {
    color: #ef4444;
    font-size: 0.8rem;
}

.info-text {
    color: #64748b;
    font-size: 0.8rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

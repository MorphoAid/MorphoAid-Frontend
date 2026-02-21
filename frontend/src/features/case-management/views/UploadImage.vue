<template>
    <div class="upload-image-container p-6 w-full max-w-xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">Upload Multiple Cases</h1>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <div>
                <label for="image" class="block font-medium">Image File</label>
                <input id="image" type="file" @change="handleFileChange" class="border p-2 w-full rounded" required />
            </div>
            <div>
                <label for="patientCode" class="block font-medium">Patient Code</label>
                <input id="patientCode" v-model="form.patientCode" type="text" class="border p-2 w-full rounded"
                    required />
            </div>
            <div>
                <label for="technicianId" class="block font-medium">Technician ID</label>
                <input id="technicianId" v-model="form.technicianId" type="text" class="border p-2 w-full rounded"
                    required />
            </div>
            <div>
                <label for="location" class="block font-medium">Location</label>
                <input id="location" v-model="form.location" type="text" class="border p-2 w-full rounded" required />
            </div>
            <!-- Error State -->
            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong class="font-bold">Error: </strong>
                <span class="block sm:inline">{{ error }}</span>
            </div>

            <button type="submit" :disabled="loading"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {{ loading ? 'Uploading...' : 'Submit Upload' }}
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { uploadCase } from '../services/case.service';

const router = useRouter();

const loading = ref(false);
const error = ref(null);

const form = reactive({
    patientCode: '',
    technicianId: '',
    location: ''
});

const selectedFile = ref(null);

const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
        selectedFile.value = event.target.files[0];
    }
};

const handleSubmit = async () => {
    if (!selectedFile.value) {
        alert("Please select a file.");
        return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile.value);
    formData.append('patientCode', form.patientCode);
    formData.append('technicianId', form.technicianId);
    formData.append('location', form.location);
    formData.append('uploaderId', 1);

    loading.value = true;
    error.value = null;

    try {
        const response = await uploadCase(formData);
        alert('Upload successful! Redirecting to case details...');
        router.push(`/__test/cases/${response.data.id}`);
    } catch (err) {
        if (err.response) {
            error.value = `HTTP ${err.response.status}: ${err.response.data?.error || err.message}`;
        } else if (err.request) {
            error.value = 'Network Error: Backend not reachable.';
        } else {
            error.value = `Error: ${err.message}`;
        }
        console.error('Upload failed:', err);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
/* Optional styling */
</style>

<template>
    <div class="account-management-page">
        <!-- Header with back button -->
        <div class="page-header">
            <button class="back-btn" @click="goBack">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="back-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 19l-7-7 7-7" />
                </svg>
                Back
            </button>
            <h1 class="page-title">Manage Account</h1>
        </div>

        <!-- Card -->
        <div class="account-card">
            <!-- Profile Picture Area -->
            <div class="avatar-section">
                <div class="avatar-wrapper" @click="triggerUpload" :title="'Click to change profile picture'">
                    <img v-if="profilePictureUrl" :src="profilePictureUrl" alt="Profile Picture"
                        class="avatar-img" />
                    <div v-else class="avatar-placeholder">
                        <svg fill="currentColor" viewBox="0 0 20 20" class="avatar-icon">
                            <path fill-rule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="avatar-overlay">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="camera-icon">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </div>

                <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp"
                    class="hidden-file-input" @change="handleFileChange" />

                <button class="upload-btn" @click="triggerUpload" :disabled="isUploading">
                    <span v-if="isUploading">Uploading...</span>
                    <span v-else>{{ profilePictureUrl ? 'Change Profile Picture' : 'Upload Profile Picture' }}</span>
                </button>

                <!-- Messages -->
                <p v-if="successMsg" class="msg success-msg">{{ successMsg }}</p>
                <p v-if="errorMsg" class="msg error-msg">{{ errorMsg }}</p>
            </div>

            <!-- User Info -->
            <div class="info-section">
                <div class="info-row">
                    <span class="info-label">First Name</span>
                    <span class="info-value">{{ user?.firstName || '—' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Last Name</span>
                    <span class="info-value">{{ user?.lastName || '—' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email</span>
                    <span class="info-value">{{ user?.email || '—' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Role</span>
                    <span class="info-value role-badge">{{ roleLabel }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'
import { userService } from '@/services/user.service'

const router = useRouter()
const authStore = useAuthStore()

const fileInput = ref(null)
const isUploading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const user = computed(() => authStore.user)
const profilePictureUrl = computed(() => authStore.user?.profilePictureUrl || null)
const roleLabel = computed(() => {
    const roleMap = {
        DATA_USE: 'Data User',
        DATA_PREP: 'Data Prep',
        ADMIN: 'Admin',
    }
    return roleMap[authStore.user?.role] || authStore.user?.role || '—'
})

function goBack() {
    router.back()
}

function triggerUpload() {
    if (fileInput.value) {
        fileInput.value.click()
    }
}

async function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file) return

    successMsg.value = ''
    errorMsg.value = ''
    isUploading.value = true

    try {
        const response = await userService.uploadProfilePicture(file)
        // Refresh the entire user object in the store so Navbar avatar updates too
        try {
            await authStore.fetchMe()
        } catch {
            // If fetchMe fails (e.g. network blip), apply the returned URL locally as fallback
            if (authStore.user) {
                authStore.user = { ...authStore.user, profilePictureUrl: response.data.profilePictureUrl }
            }
        }
        successMsg.value = 'Profile picture uploaded successfully!'
    } catch (err) {
        console.error('Upload failed:', err)
        errorMsg.value = err?.response?.data || 'Failed to upload. Please try again.'
    } finally {
        isUploading.value = false
        // Reset the file input so the same file can be re-selected if needed
        if (fileInput.value) fileInput.value.value = ''
    }
}
</script>

<style scoped>
.account-management-page {
    min-height: 100vh;
    background: #F8F8F8;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Header */
.page-header {
    width: 100%;
    max-width: 560px;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    border: 1.5px solid #D1D5DB;
    border-radius: 8px;
    background: #fff;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
}

.back-btn:hover {
    background: #F3F4F6;
    border-color: #9CA3AF;
}

.back-icon {
    width: 1rem;
    height: 1rem;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2E2E2E;
}

/* Card */
.account-card {
    width: 100%;
    max-width: 560px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
}

/* Avatar */
.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.avatar-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 3px solid #48B7CB;
    box-shadow: 0 2px 10px rgba(72,183,203,0.3);
    transition: transform 0.2s;
}

.avatar-wrapper:hover {
    transform: scale(1.03);
}

.avatar-wrapper:hover .avatar-overlay {
    opacity: 1;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    background: #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-icon {
    width: 64px;
    height: 64px;
    color: #9CA3AF;
    margin-top: 12px;
}

.avatar-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: 50%;
}

.camera-icon {
    width: 32px;
    height: 32px;
    color: #fff;
}

.hidden-file-input {
    display: none;
}

.upload-btn {
    padding: 0.55rem 1.4rem;
    background: #48B7CB;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
}

.upload-btn:hover:not(:disabled) {
    background: #3aa4b8;
}

.upload-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Messages */
.msg {
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 6px;
    padding: 0.4rem 0.9rem;
}

.success-msg {
    color: #166534;
    background: #DCFCE7;
}

.error-msg {
    color: #991B1B;
    background: #FEE2E2;
}

/* Info */
.info-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.info-row {
    display: flex;
    align-items: center;
    padding: 0.85rem 1rem;
    background: #F9FAFB;
    border-radius: 10px;
    border: 1px solid #E5E7EB;
}

.info-label {
    width: 100px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #6B7280;
    flex-shrink: 0;
}

.info-value {
    font-size: 0.95rem;
    color: #2E2E2E;
    font-weight: 500;
}

.role-badge {
    display: inline-block;
    background: #CFFAFE;
    color: #0E7490;
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}
</style>

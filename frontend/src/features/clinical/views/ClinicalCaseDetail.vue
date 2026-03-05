<template>
    <div class="clinical-detail-container">
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading case details...</p>
        </div>

        <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button @click="fetchData" class="retry-btn">Retry</button>
        </div>

        <div v-else class="content-grid">
            <!-- Left Column: Image and Status -->
            <div class="main-column">
                <div class="card image-card">
                    <div class="card-header">
                        <h2 class="card-title">Microscope Image</h2>
                        <div class="status-badge" :class="statusClass">{{ caseData.status }}</div>
                    </div>
                    <div class="image-viewer">
                        <img :src="imageUrl" alt="Case Image" class="main-img" @error="onImageError" />
                    </div>
                </div>

                <div class="card ai-result-card"
                    :class="{ 'ai-card--processing': caseData.analysisStatus === 'PROCESSING' }">
                    <div class="card-header">
                        <h2 class="card-title">AI Analysis Result</h2>
                        <div class="status-badge" :class="analysisStatusClass">{{ caseData.analysisStatus }}</div>
                    </div>

                    <div v-if="caseData.analysisStatus === 'COMPLETED'" class="ai-content">
                        <div class="ai-grid">
                            <div class="ai-item">
                                <span class="ai-label">Parasite Stage</span>
                                <span class="ai-value">{{ aiResult.parasiteStage || 'N/A' }}</span>
                            </div>
                            <div class="ai-item">
                                <span class="ai-label">Confidence</span>
                                <span class="ai-value highlighted">{{ (aiResult.confidence * 100).toFixed(2) }}%</span>
                            </div>
                            <div class="ai-item">
                                <span class="ai-label">Drug Exposure</span>
                                <span class="ai-value">{{ aiResult.drugExposure ? 'Detected' : 'Not Detected' }}</span>
                            </div>
                            <div class="ai-item">
                                <span class="ai-label">Drug Type</span>
                                <span class="ai-value">{{ aiResult.drugType || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="caseData.analysisStatus === 'FAILED'" class="ai-placeholder ai-placeholder--error">
                        <i class="icon">!</i>
                        <p>AI analysis failed. Please try again later.</p>
                    </div>

                    <div v-else class="ai-placeholder">
                        <div class="pulse-loader"></div>
                        <p>AI result is not available yet.</p>
                    </div>
                </div>
            </div>

            <!-- Right Column: Metadata and Notes -->
            <div class="side-column">
                <div class="card metadata-card">
                    <h2 class="card-title">Case Information</h2>
                    <div class="metadata-list">
                        <div class="meta-item">
                            <span class="meta-label">ID</span>
                            <span class="meta-value">#{{ String(caseData.id).padStart(5, '0') }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Province</span>
                            <span class="meta-value">{{ caseData.provinceName }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Created</span>
                            <span class="meta-value">{{ formatDate(caseData.createdAt) }}</span>
                        </div>
                        <div v-if="caseData.consent" class="meta-item pii-item">
                            <span class="meta-label">Patient Metadata</span>
                            <p class="meta-value patient-meta">{{ caseData.patientMetadata }}</p>
                        </div>
                    </div>
                    <button @click="exportPdf" class="export-btn" :disabled="isExporting">
                        <span v-if="isExporting">Generating...</span>
                        <span v-else>Download PDF Report</span>
                    </button>
                </div>

                <div class="card notes-card">
                    <h2 class="card-title">Diagnostic Notes</h2>
                    <div class="notes-list">
                        <div v-for="note in notes" :key="note.id" class="note-item">
                            <div class="note-header">
                                <span class="note-author">{{ note.authorName }}</span>
                                <span class="note-date">{{ formatDate(note.createdAt) }}</span>
                            </div>
                            <p class="note-content">{{ note.note }}</p>
                        </div>
                        <p v-if="notes.length === 0" class="no-notes">No notes added yet.</p>
                    </div>

                    <div class="add-note-section">
                        <textarea v-model="newNote" placeholder="Add clinical observation..." class="note-input"
                            :disabled="isSavingNote"></textarea>
                        <button @click="saveNote" class="save-note-btn" :disabled="!newNote.trim() || isSavingNote">
                            Save Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import ClinicalService from '../services/clinical.service';

const route = useRoute();
const id = route.params.id;

const caseData = ref(null);
const aiResult = ref(null);
const notes = ref([]);
const loading = ref(true);
const error = ref(null);
const newNote = ref('');
const isSavingNote = ref(false);
const isExporting = ref(false);

const imageUrl = computed(() => {
    if (!caseData.value || !caseData.value.imageId) return '';
    return `/api/cases/${caseData.value.id}/images/${caseData.value.imageId}/content`;
});

const statusClass = computed(() => `badge--${caseData.value?.status.toLowerCase()}`);
const analysisStatusClass = computed(() => `badge--${caseData.value?.analysisStatus.toLowerCase()}`);

const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const res = await ClinicalService.getCase(id);
        caseData.value = res.data;

        // Fetch AI result if completed (assuming it might be separate or part of detail)
        // In our implementation, we can call the same endpoint or a specific one
        // For now, assume it's included or we fetch separately if needed
        if (caseData.value.analysisStatus === 'COMPLETED') {
            // Fetch AI detail if not in service
            try {
                const aiRes = await http.get(`/cases/${id}/ai-result`);
                aiResult.value = aiRes.data;
            } catch (e) {
                console.error("Failed to fetch AI detail", e);
            }
        }

        const notesRes = await ClinicalService.getNotes(id);
        notes.value = notesRes.data;

    } catch (err) {
        error.value = 'Failed to load case data. Please try again.';
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const saveNote = async () => {
    if (!newNote.value.trim()) return;
    isSavingNote.value = true;
    try {
        await ClinicalService.addNote(id, newNote.value);
        newNote.value = '';
        const notesRes = await ClinicalService.getNotes(id);
        notes.value = notesRes.data;
    } catch (err) {
        alert("Error saving note. Please try again later.");
    } finally {
        isSavingNote.value = false;
    }
};

const exportPdf = async () => {
    isExporting.value = true;
    try {
        const response = await ClinicalService.exportPdf(id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report_${String(id).padStart(5, '0')}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        alert("Error exporting report. Please try again later.");
    } finally {
        isExporting.value = false;
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
};

const onImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
};

onMounted(fetchData);
</script>

<style scoped>
.clinical-detail-container {
    padding: 2rem;
    background: #f1f5f9;
    min-height: calc(100vh - 64px);
}

.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
}

.content-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
}

.image-viewer {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    aspect-ratio: 4/3;
    display: flex;
    align-items: center;
}

.main-img {
    width: 100%;
    height: auto;
}

.ai-result-card {
    border-left: 6px solid #e2e8f0;
    transition: all 0.3s ease;
}

.ai-card--processing {
    border-left-color: #3b82f6;
    background: #f0f9ff;
}

.ai-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 10px;
}

.ai-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.ai-label {
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.ai-value {
    font-weight: 700;
    color: #334155;
    font-size: 1.1rem;
}

.highlighted {
    color: #2563eb;
}

.ai-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    color: #94a3b8;
    gap: 1rem;
}

/* Status Badges */
.status-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
}

.badge--pending {
    background: #fffbe6;
    color: #856404;
}

.badge--analyzed {
    background: #e6fffa;
    color: #065f46;
}

.badge--completed {
    background: #e6fffa;
    color: #065f46;
}

.badge--processing {
    background: #e1effe;
    color: #1e429f;
}

.badge--failed {
    background: #fdf2f2;
    color: #9b1c1c;
}

.metadata-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
}

.meta-item {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 0.5rem;
}

.meta-label {
    color: #64748b;
    font-size: 0.9rem;
}

.meta-value {
    font-weight: 600;
    color: #1e293b;
}

.pii-item {
    flex-direction: column;
    gap: 0.5rem;
    background: #fff1f2;
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
}

.patient-meta {
    font-size: 0.9rem;
    color: #be123c;
    word-break: break-all;
}

.export-btn {
    width: 100%;
    background: #1e293b;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.export-btn:hover:not(:disabled) {
    background: #0f172a;
}

.notes-list {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.note-item {
    background: #f8fafc;
    padding: 0.75rem;
    border-radius: 8px;
}

.note-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
}

.note-author {
    font-weight: 700;
    color: #475569;
}

.note-date {
    color: #94a3b8;
}

.note-content {
    font-size: 0.9rem;
    color: #1e293b;
    line-height: 1.4;
}

.add-note-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.note-input {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
    min-height: 80px;
    resize: none;
}

.save-note-btn {
    align-self: flex-end;
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
}

.save-note-btn:disabled {
    background: #94a3b8;
    cursor: not-allowed;
}

.pulse-loader {
    width: 40px;
    height: 40px;
    background: #3b82f6;
    border-radius: 50%;
    animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
    0% {
        transform: scale(0);
        opacity: 1;
    }

    100% {
        transform: scale(1.5);
        opacity: 0;
    }
}

@media (max-width: 900px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<template>
    <div class="annotated-image-wrapper">
        <div v-if="loading" class="text-center py-6">
            <p class="text-gray-500 italic">Loading image...</p>
        </div>
        <div v-else-if="errorMsg" class="text-red-500 italic text-sm py-2">
            {{ errorMsg }}
        </div>
        <div v-else class="annotated-image-container" ref="containerRef">
            <canvas ref="canvasRef" class="annotated-canvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import http from '@/services/http';

const CLASS_LABELS = {
    0: 'Drug A',
    1: 'Drug B',
    2: 'Ring',
    3: 'Schiz',
    4: 'Troph',
};

const props = defineProps({
    caseId: { type: [Number, String], required: true },
    imageId: { type: [Number, String], required: false },
    detections: { type: Array, default: () => [] },
});

const canvasRef = ref(null);
const containerRef = ref(null);
const loading = ref(true);
const errorMsg = ref(null);
let loadedImage = null;

const fetchAndDraw = async () => {
    if (!props.imageId) {
        errorMsg.value = 'No image associated with this case.';
        loading.value = false;
        return;
    }

    loading.value = true;
    errorMsg.value = null;

    try {
        const response = await http.get(`/cases/${props.caseId}/images/${props.imageId}/content`, {
            responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], {
            type: response.headers['content-type'] || 'image/png',
        });
        const imageUrl = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
            loadedImage = img;
            loading.value = false;
            nextTick(() => drawAnnotations());
            URL.revokeObjectURL(imageUrl);
        };
        img.onerror = () => {
            errorMsg.value = 'Failed to decode image.';
            loading.value = false;
            URL.revokeObjectURL(imageUrl);
        };
        img.src = imageUrl;
    } catch (err) {
        errorMsg.value = 'Failed to load image from server.';
        loading.value = false;
        console.error('AnnotatedImage fetch error:', err);
    }
};

const drawAnnotations = () => {
    if (!loadedImage || !canvasRef.value || !containerRef.value) return;

    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');
    const container = containerRef.value;

    // Original image dimensions
    const imgW = loadedImage.naturalWidth;
    const imgH = loadedImage.naturalHeight;

    // Fit to container width
    const containerWidth = container.clientWidth;
    const scale = containerWidth / imgW;
    const displayW = containerWidth;
    const displayH = imgH * scale;

    // Set canvas size to display size (CSS pixels), with devicePixelRatio for sharpness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = displayW + 'px';
    canvas.style.height = displayH + 'px';
    ctx.scale(dpr, dpr);

    // Draw image scaled to display size
    ctx.drawImage(loadedImage, 0, 0, displayW, displayH);

    // Draw bounding boxes
    if (props.detections && props.detections.length > 0) {
        props.detections.forEach((det) => {
            if (!det.box) return;

            const x1 = det.box.x1 * scale;
            const y1 = det.box.y1 * scale;
            const x2 = det.box.x2 * scale;
            const y2 = det.box.y2 * scale;
            const boxW = x2 - x1;
            const boxH = y2 - y1;

            // Draw blue rectangle
            ctx.strokeStyle = '#0000FF';
            ctx.lineWidth = 2;
            ctx.strokeRect(x1, y1, boxW, boxH);

            // Build label
            const label = CLASS_LABELS[det.class] ?? `Class ${det.class}`;
            const confidence = (det.confidence * 100).toFixed(1);
            const text = `${label} (${confidence}%)`;

            // Draw label background
            const fontSize = Math.max(12, Math.min(16, displayW * 0.018));
            ctx.font = `bold ${fontSize}px Arial, sans-serif`;
            const textMetrics = ctx.measureText(text);
            const textW = textMetrics.width;
            const textH = fontSize + 4;
            const labelX = x1;
            const labelY = y1 - textH - 2;

            ctx.fillStyle = 'rgba(0, 0, 255, 0.7)';
            ctx.fillRect(labelX, labelY, textW + 8, textH + 2);

            // Draw label text
            ctx.fillStyle = '#FFFFFF';
            ctx.textBaseline = 'top';
            ctx.fillText(text, labelX + 4, labelY + 2);
        });
    }
};

onMounted(() => {
    fetchAndDraw();

    // Redraw on window resize for responsiveness
    window.addEventListener('resize', () => {
        if (loadedImage) drawAnnotations();
    });
});

watch(() => props.detections, () => {
    if (loadedImage) drawAnnotations();
}, { deep: true });

watch(() => props.imageId, () => {
    fetchAndDraw();
});
</script>

<style scoped>
.annotated-image-wrapper {
    width: 100%;
}

.annotated-image-container {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f9fafb;
}

.annotated-canvas {
    display: block;
    width: 100%;
    height: auto;
}
</style>

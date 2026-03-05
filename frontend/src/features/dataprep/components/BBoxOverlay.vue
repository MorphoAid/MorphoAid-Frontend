<template>
    <!--
    BBoxOverlay.vue
    Props:
      detections: Array<{ label: string, confidence: number, bbox: { x, y, w, h } }>
      width:  number  (container pixel width)
      height: number  (container pixel height)
    Usage:
      Wrap your image in a relative container and place <BBoxOverlay> as sibling or child.
      The component uses position:absolute and stretches to the container.
  -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div v-for="(det, i) in detections" :key="i" :style="boxStyle(det.bbox)"
            class="absolute border-2 border-[#48B7CB] rounded-sm">
            <!-- Label chip — sits above the box -->
            <span
                class="absolute -top-6 left-0 bg-[#48B7CB] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm whitespace-nowrap leading-tight">
                {{ det.label }} {{ pct(det.confidence) }}%
            </span>
        </div>
    </div>
</template>

<script setup>
import { bboxToStyle } from '../utils/bbox.js'

const props = defineProps({
    detections: {
        type: Array,
        default: () => [],
        // each item: { label: string, confidence: number, bbox: { x, y, w, h } }
    },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
})

function boxStyle(bbox) {
    return bboxToStyle(bbox, props.width, props.height)
}

function pct(confidence) {
    return (confidence * 100).toFixed(0)
}

// Neutral single style — no per-label color mapping
function borderColor() { return 'border-[#48B7CB]' }
function chipColor() { return 'bg-[#48B7CB]' }
</script>

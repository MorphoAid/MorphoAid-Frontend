<template>
  <div class="p-8 max-w-5xl mx-auto w-full font-poppins text-[#2E2E2E]">

    <!-- Header & Action -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-[#368998] mb-1">Case Result</h1>
        <p class="text-[#5C5C5C] text-sm flex items-center gap-2">
          <span>Case ID:</span>
          <span class="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#2E2E2E]">#{{ id }}</span>
        </p>
      </div>

      <button @click="$router.push('/dataprep/cases/new')"
        class="bg-white border border-[#368998] text-[#368998] hover:bg-[#368998] hover:text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2 shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Upload Another Case
      </button>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Left: Image Preview -->
      <div class="bg-white rounded-xl shadow-sm border border-[#368998]/20 flex flex-col p-6 h-full">
        <h2 class="text-[#2E2E2E] font-semibold text-lg mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#48B7CB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
            </path>
          </svg>
          Uploaded Specimen
        </h2>

        <div
          class="flex-1 min-h-[300px] bg-[#F8F8F8] border border-gray-100 rounded-lg flex items-center justify-center p-2 relative">
          <template v-if="imageUrl">
            <canvas ref="detectionCanvas" class="max-w-full max-h-[500px] rounded" style="display: block; margin: 0 auto;"></canvas>
          </template>
          <template v-else-if="loadingImage">
            <div class="flex flex-col items-center justify-center text-[#5C5C5C]">
              <svg class="animate-spin w-8 h-8 mb-3 text-[#48B7CB]" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span class="text-sm font-medium">Loading image...</span>
            </div>
          </template>
          <template v-else>
            <p class="text-[#5C5C5C] text-sm">Image unavailable</p>
          </template>
        </div>
      </div>

      <!-- Right: Analysis Summary -->
      <div class="bg-white rounded-xl shadow-sm border border-[#368998]/20 flex flex-col p-6 h-full">
        <h2 class="text-[#2E2E2E] font-semibold text-lg mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#48B7CB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z">
            </path>
          </svg>
          AI Analysis Status
        </h2>

        <div v-if="loadingCase" class="flex-1 flex items-center justify-center min-h-[200px]">
          <svg class="animate-spin w-8 h-8 text-[#48B7CB]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>

        <div v-else-if="caseError" class="flex-1 flex items-center justify-center p-4">
          <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p class="text-red-600 font-medium mb-2">Error loading case data</p>
            <p class="text-xs text-red-500">{{ caseError }}</p>
          </div>
        </div>

        <div v-else class="flex-1 space-y-6">

          <!-- Dynamic Status Banner -->
          <div :class="statusBannerStyle" class="p-4 rounded-lg flex items-center justify-between border">
            <div class="flex items-center gap-3">
              <span v-html="statusIcon"></span>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider mb-0.5" :class="statusTextColor">
                  Analysis Status
                </p>
                <p class="font-bold text-lg leading-none" :class="statusTextColor">
                  {{ displayStatus }}
                </p>
              </div>
            </div>

            <button v-if="isFailed" @click="retryAnalysis" :disabled="retrying"
              class="px-4 py-1.5 bg-white border border-red-200 text-red-600 text-sm font-medium rounded shadow-sm hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center gap-2">
              <svg v-if="retrying" class="animate-spin w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ retrying ? 'Retrying...' : 'Retry Now' }}
            </button>
          </div>

          <!-- Extended Details (If complete) -->
          <div v-if="isCompleted" class="bg-gray-50 border border-gray-100 rounded-lg p-5">
            <h3 class="text-sm font-semibold text-[#2E2E2E] mb-4 border-b pb-2 border-gray-200">Result Details</h3>

            <dl class="space-y-4 text-sm">
              <div class="grid grid-cols-2">
                <dt class="text-[#5C5C5C] font-medium">Parasite Stage</dt>
                <dd class="text-[#2E2E2E] font-semibold flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="aiResult?.parasiteStage && aiResult.parasiteStage !== 'None' ? 'bg-red-500' : 'bg-green-500'"
                  ></span>
                  {{ aiResult?.parasiteStage || 'Not Detected' }}
                </dd>
              </div>
              
              <div class="grid grid-cols-2">
                <dt class="text-[#5C5C5C] font-medium">Confidence</dt>
                <dd class="text-[#2E2E2E] font-semibold">
                  {{ aiResult?.confidence ? (aiResult.confidence * 100).toFixed(1) + '%' : 'N/A' }}
                </dd>
              </div>

               <div class="grid grid-cols-2">
                <dt class="text-[#5C5C5C] font-medium">Uploaded At</dt>
                <dd class="text-[#5C5C5C]">
                  {{ formatDate(caseData?.createdAt) }}
                </dd>
              </div>

               <div v-if="aiResult?.createdAt" class="grid grid-cols-2">
                <dt class="text-[#5C5C5C] font-medium">Analyzed At</dt>
                <dd class="text-[#5C5C5C]">
                  {{ formatDate(aiResult.createdAt) }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- PENDING/PROCESSING State details -->
          <div v-else-if="isProcessing || isPending" class="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
             <p class="text-[#5C5C5C] text-sm mb-2 font-medium">In the AI analysis queue</p>
             <p class="text-xs text-gray-400">This view will update once results are available.</p>
          </div>

          <!-- FAILED State Details -->
          <div v-else-if="isFailed" class="flex flex-col p-5 bg-[#FFF5F5] border border-red-100 rounded-lg">
             <p class="text-red-700 text-sm font-medium mb-1">Analysis failed to complete</p>
             <p class="text-xs text-red-500 mb-3">The AI engine may be temporarily unreachable or the image quality was insufficient for processing.</p>
             <p class="text-xs text-gray-500 italic">Please try clicking the Retry button above.</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getCaseById, analyzeCase } from '@/features/case-management/services/case.service'
import { fetchCaseImageBlob } from '@/features/case-management/services/caseImage.service'
import http from '@/services/http'

const detectionCanvas = ref(null)

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const caseData = ref(null)
const aiResult = ref(null)
const loadingCase = ref(true)
const caseError = ref('')

const imageUrl = ref(null)
const loadingImage = ref(true)

const displayStatus = ref('PENDING')
const retrying = ref(false)
let pollingInterval = null

const isPending = computed(() => displayStatus.value === 'PENDING')
const isProcessing = computed(() => displayStatus.value === 'PROCESSING')
const isCompleted = computed(() => displayStatus.value === 'COMPLETED' || displayStatus.value === 'ANALYZED')
const isFailed = computed(() => displayStatus.value === 'FAILED')

const statusBannerStyle = computed(() => {
  if (isCompleted.value) return 'bg-[#E5F5E8] border-[#A3D9B1]'
  if (isFailed.value) return 'bg-[#FFF0F0] border-[#FFC2C2]'
  return 'bg-[#F0F7FF] border-[#B8D8FA]' // Pending/Processing
})

const statusTextColor = computed(() => {
  if (isCompleted.value) return 'text-[#287A38]'
  if (isFailed.value) return 'text-[#B02A2A]'
  return 'text-[#1F5594]' // Pending/Processing
})

const statusIcon = computed(() => {
  if (isCompleted.value) {
    return `<svg class="w-8 h-8 text-[#287A38]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
  }
  if (isFailed.value) {
    return `<svg class="w-8 h-8 text-[#B02A2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
  }
  // Processing/Pending icon spinner
  return `<svg class="animate-spin w-8 h-8 text-[#1F5594]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

const loadData = async () => {
  try {
    const res = await getCaseById(props.id)
    caseData.value = res.data

    // Setup display status from backend
    if (caseData.value?.analysisStatus) {
      displayStatus.value = caseData.value.analysisStatus.toUpperCase()
    } else if (caseData.value?.status) {
      displayStatus.value = caseData.value.status.toUpperCase()
    }

    // Try fetch AI Result specifically if completed
    if (isCompleted.value) {
      try {
        const aiRes = await http.get(`/cases/${props.id}/ai-result`)
        aiResult.value = aiRes.data
      } catch (e) {
        console.warn('Could not fetch AI result details:', e)
      }
    }

    // Load image only once
    if (!imageUrl.value && caseData.value?.imageId) {
      loadCaseImage(caseData.value.imageId)
    } else {
        loadingImage.value = false;
    }

  } catch (err) {
    console.error('Failed to load case details', err)
    caseError.value = err.response?.data?.message || err.message
  } finally {
    loadingCase.value = false
  }
}

const loadCaseImage = async (imageId) => {
  try {
    const blob = await fetchCaseImageBlob(props.id, imageId)
    if (blob) {
      imageUrl.value = URL.createObjectURL(blob)
    }
  } catch (err) {
    console.error('Failed to load case image', err)
  } finally {
    loadingImage.value = false
  }
}

const parseStatus = (data) => {
  if (data?.analysisStatus) {
    displayStatus.value = data.analysisStatus.toUpperCase()
  } else if (data?.status) {
    displayStatus.value = data.status.toUpperCase()
  }
    
  if (isCompleted.value && !aiResult.value) {
      // Re-trigger load to fetch AI result details
      loadData()
      stopPolling()
  } else if (isFailed.value) {
      stopPolling()
  }
}

const pollStatus = async () => {
    if (isCompleted.value || isFailed.value) return;
    try {
        const res = await getCaseById(props.id)
        parseStatus(res.data)
    } catch(e) {
        console.warn('Status poll error:', e)
    }
}

const startPolling = () => {
  if (!pollingInterval && !isCompleted.value && !isFailed.value) {
    pollingInterval = setInterval(pollStatus, 3000) // Poll every 3 seconds
  }
}

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

const retryAnalysis = async () => {
  if (retrying.value) return
  retrying.value = true
  
  try {
    // Attempt local API trigger
    await analyzeCase(props.id)
    displayStatus.value = 'PROCESSING'
    startPolling() // resume polling
  } catch (e) {
    const errMsg = e.response?.data?.message || e.message
    alert('Retry request failed immediately: ' + errMsg)
  } finally {
    retrying.value = false
  }
}

onMounted(async () => {
  await loadData()
  if (isPending.value || isProcessing.value) {
    startPolling()
  }
})

// ── Detection Overlay Drawing ──
const drawDetections = () => {
  const canvas = detectionCanvas.value
  if (!canvas || !imageUrl.value) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    // Parse detections from rawResponseJson
    let detections = []
    let originalShape = null // [height, width]
    if (aiResult.value?.rawResponseJson) {
      try {
        const parsed = JSON.parse(aiResult.value.rawResponseJson)
        if (parsed.images && parsed.images[0]) {
          detections = parsed.images[0].results || []
          originalShape = parsed.images[0].shape || null
        }
      } catch (e) {
        console.warn('Failed to parse rawResponseJson for detections:', e)
      }
    }

    // Use original image dimensions for the canvas
    const natW = img.naturalWidth
    const natH = img.naturalHeight
    canvas.width = natW
    canvas.height = natH

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, natW, natH)
    ctx.drawImage(img, 0, 0, natW, natH)

    if (detections.length === 0) return

    // Scale factor: if shape is provided, coords are relative to shape; map them to natW/natH
    let scaleX = 1
    let scaleY = 1
    if (originalShape) {
      // shape is [height, width]
      scaleX = natW / originalShape[1]
      scaleY = natH / originalShape[0]
    }

    const BOX_COLOR = '#6366F1' // Indigo
    const LABEL_BG = 'rgba(99, 102, 241, 0.85)'
    const LABEL_TEXT = '#FFFFFF'

    detections.forEach(det => {
      if (!det.box) return
      const x1 = det.box.x1 * scaleX
      const y1 = det.box.y1 * scaleY
      const x2 = det.box.x2 * scaleX
      const y2 = det.box.y2 * scaleY
      const w = x2 - x1
      const h = y2 - y1

      // Draw bounding box
      ctx.strokeStyle = BOX_COLOR
      ctx.lineWidth = Math.max(2, Math.round(natW / 250))
      ctx.strokeRect(x1, y1, w, h)

      // Build label text
      const label = `${det.name || 'Detection'} (${(det.confidence * 100).toFixed(1)}%)`
      const fontSize = Math.max(12, Math.round(natW / 40))
      ctx.font = `bold ${fontSize}px sans-serif`
      const textMetrics = ctx.measureText(label)
      const textW = textMetrics.width + fontSize * 0.8
      const textH = fontSize * 1.5

      // Position label above the box, or inside if at top edge
      let labelY = y1 - textH - 2
      if (labelY < 0) labelY = y1 + 2

      // Draw label background
      ctx.fillStyle = LABEL_BG
      const radius = 4
      const lx = x1
      const ly = labelY
      ctx.beginPath()
      ctx.moveTo(lx + radius, ly)
      ctx.lineTo(lx + textW - radius, ly)
      ctx.quadraticCurveTo(lx + textW, ly, lx + textW, ly + radius)
      ctx.lineTo(lx + textW, ly + textH - radius)
      ctx.quadraticCurveTo(lx + textW, ly + textH, lx + textW - radius, ly + textH)
      ctx.lineTo(lx + radius, ly + textH)
      ctx.quadraticCurveTo(lx, ly + textH, lx, ly + textH - radius)
      ctx.lineTo(lx, ly + radius)
      ctx.quadraticCurveTo(lx, ly, lx + radius, ly)
      ctx.closePath()
      ctx.fill()

      // Draw label text
      ctx.fillStyle = LABEL_TEXT
      ctx.textBaseline = 'middle'
      ctx.fillText(label, lx + fontSize * 0.4, ly + textH / 2)
    })
  }
  img.src = imageUrl.value
}

// Re-draw detections when image or AI result changes
watch([imageUrl, aiResult], () => {
  if (imageUrl.value) {
    nextTick(() => drawDetections())
  }
})

onUnmounted(() => {
  stopPolling()
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
})
</script>

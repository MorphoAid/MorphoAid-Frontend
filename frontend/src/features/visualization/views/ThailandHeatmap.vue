<template>
    <div class="relative w-full overflow-hidden" style="height: 480px;">
        <!-- Progress Bar (Subtle) -->
        <div v-if="isLoading" class="absolute top-0 left-0 right-0 h-1 bg-[#368998]/10 z-[1001]">
            <div class="h-full bg-[#368998] transition-all duration-300" :style="{ width: `${progress}%` }"></div>
        </div>

        <!-- Map Container -->
        <div ref="mapEl" class="w-full h-full rounded-b-xl overflow-hidden"></div>

        <!-- Loading Overlay -->
        <div v-if="isLoading"
            class="absolute inset-0 bg-white/75 flex flex-col items-center justify-center z-[1000] rounded-b-xl">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#368998] mb-4"></div>
            <p class="text-[#368998] font-medium text-sm">Querying Database... {{ progress }}%</p>
        </div>

        <!-- Legend -->
        <div
            class="absolute bottom-4 right-4 z-[500] bg-white/90 border border-[#368998]/20 rounded-lg px-3 py-2 text-xs text-[#5C5C5C] shadow-sm pointer-events-none">
            <div class="flex items-center gap-2 mb-1 font-semibold">
                <span>Case Density</span>
            </div>
            <div class="flex flex-col gap-1">
                <div v-for="level in legendLevels" :key="level.label" class="flex items-center gap-2">
                    <span class="w-4 h-3 rounded-sm inline-block border border-[#2B6E7A]"
                        :style="{ background: level.color }"></span>
                    <span>{{ level.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import thailandGeoJSON from '@/assets/geo/thailand.json'
import { visualizationService } from '../services/visualization.service'

const mapEl = ref(null)
const isLoading = ref(true)
const progress = ref(0)
let mapInstance = null
let geoJsonLayer = null

const legendLevels = [
    { label: '0 cases', color: '#F3FBFB' },
    { label: '1 - 5 cases', color: '#C6E9EF' },
    { label: '6 - 20 cases', color: '#7CCBD8' },
    { label: '21 - 50 cases', color: '#368998' },
    { label: '50+ cases', color: '#1B454C' },
]

function getColor(d) {
    return d > 50 ? '#1B454C' :
        d > 20 ? '#368998' :
            d > 5 ? '#7CCBD8' :
                d > 0 ? '#C6E9EF' :
                    '#F3FBFB';
}

function style(feature, heatmapData) {
    const provinceName = getProvinceName(feature).trim()
    const data = heatmapData.find(d =>
        (d.provinceNameEn && d.provinceNameEn.trim() === provinceName) ||
        (d.provinceNameTh && d.provinceNameTh.trim() === provinceName)
    )
    const val = data ? data.value : 0
    return {
        weight: 1,
        color: '#2B6E7A',
        fillColor: getColor(val),
        fillOpacity: 0.8,
    }
}

function getProvinceName(feature) {
    const p = feature.properties
    return (p.name || p.NAME_1 || p.province || p.Province || 'Unknown').trim()
}

async function fetchData() {
    try {
        progress.value = 20
        const data = await visualizationService.getHeatmapData()
        console.log('Heatmap data fetched successfully:', data)
        if (!data || data.length === 0) {
            console.warn('Heatmap data is empty.')
        }
        progress.value = 100
        return data
    } catch (error) {
        console.error('Failed to fetch heatmap data:', error)
        if (error.response) {
            console.error('Response data:', error.response.data)
            console.error('Response status:', error.response.status)
        }
        progress.value = 0
        return []
    }
}

onMounted(async () => {
    mapInstance = L.map(mapEl.value, {
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false,
    })

    // Minimal tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 10,
    }).addTo(mapInstance)

    // Attribution
    L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('© <a href="https://carto.com">CARTO</a>')
        .addTo(mapInstance)

    const heatmapData = await fetchData()

    geoJsonLayer = L.geoJSON(thailandGeoJSON, {
        style: (feature) => style(feature, heatmapData),

        onEachFeature(feature, lyr) {
            const name = getProvinceName(feature).trim()
            const data = heatmapData.find(d =>
                (d.provinceNameEn && d.provinceNameEn.trim() === name) ||
                (d.provinceNameTh && d.provinceNameTh.trim() === name)
            )

            let tooltipContent = `<div class="font-semibold border-b border-[#368998]/10 mb-1 pb-1">${name}</div>`
            if (data && data.value > 0) {
                tooltipContent += `<div class="mb-1 text-[#368998]">Total: ${data.value} cases</div>`
            } else {
                tooltipContent += `<div class="italic text-[#5C5C5C]/70">No case data</div>`
            }

            lyr.bindTooltip(tooltipContent, {
                permanent: false,
                direction: 'top',
                className: 'morpho-tooltip',
                offset: [0, -4],
                sticky: true
            })

            lyr.on({
                mouseover(e) {
                    const l = e.target
                    l.setStyle({
                        weight: 2,
                        color: '#2B6E7A',
                        fillOpacity: 1,
                    })
                    l.bringToFront()
                },
                mouseout(e) {
                    geoJsonLayer.resetStyle(e.target)
                },
            })
        },
    }).addTo(mapInstance)

    mapInstance.fitBounds(geoJsonLayer.getBounds(), { padding: [12, 12] })
    setTimeout(() => {
        isLoading.value = false
    }, 400)
})

onBeforeUnmount(() => {
    if (mapInstance) {
        mapInstance.remove()
        mapInstance = null
    }
})
</script>

<style>
/* Keep leaflet z-index below sticky navbar (z-20) */
.leaflet-pane {
    z-index: 10 !important;
}

.leaflet-top,
.leaflet-bottom {
    z-index: 20 !important;
}

.leaflet-control {
    z-index: 20 !important;
}

/* Tooltip styling */
.morpho-tooltip {
    background: white;
    border: 1px solid rgba(54, 137, 152, 0.25);
    border-radius: 6px;
    padding: 4px 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    color: #2E2E2E;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    pointer-events: none;
}

.morpho-tooltip::before {
    display: none;
}
</style>

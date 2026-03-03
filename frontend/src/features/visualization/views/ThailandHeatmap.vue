<template>
    <div class="relative w-full" style="height: 420px;">
        <!-- Map Container -->
        <div ref="mapEl" class="w-full h-full rounded-b-xl overflow-hidden"></div>

        <!-- Loading Overlay -->
        <div v-if="isLoading"
            class="absolute inset-0 bg-white/75 flex items-center justify-center z-[1000] rounded-b-xl">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#368998]"></div>
        </div>

        <!-- Legend -->
        <div
            class="absolute bottom-4 right-4 z-[500] bg-white/90 border border-[#368998]/20 rounded-lg px-3 py-2 text-xs text-[#5C5C5C] shadow-sm pointer-events-none">
            <div class="flex items-center gap-2 mb-1">
                <span class="w-4 h-3 rounded-sm inline-block border border-[#2B6E7A]"
                    style="background:#C6E9EF;"></span>
                <span>Province boundary</span>
            </div>
            <p class="text-[10px] text-[#5C5C5C]/70 italic">Intensity coming later</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import thailandGeoJSON from '@/assets/geo/thailand.json'

const mapEl = ref(null)
const isLoading = ref(true)
let mapInstance = null

const defaultStyle = {
    weight: 1,
    color: '#2B6E7A',
    fillColor: '#C6E9EF',
    fillOpacity: 0.6,
}

const hoverStyle = {
    weight: 2,
    color: '#2B6E7A',
    fillColor: '#C6E9EF',
    fillOpacity: 0.85,
}

function getProvinceName(feature) {
    const p = feature.properties
    return p.name || p.NAME_1 || p.province || p.Province || 'Unknown'
}

onMounted(() => {
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

    // Attribution small
    L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('© <a href="https://carto.com">CARTO</a>')
        .addTo(mapInstance)

    const layer = L.geoJSON(thailandGeoJSON, {
        style: () => ({ ...defaultStyle }),

        onEachFeature(feature, lyr) {
            const name = getProvinceName(feature)

            lyr.bindTooltip(name, {
                permanent: false,
                direction: 'top',
                className: 'morpho-tooltip',
                offset: [0, -4],
            })

            lyr.on({
                mouseover(e) {
                    e.target.setStyle(hoverStyle)
                    e.target.bringToFront()
                },
                mouseout(e) {
                    layer.resetStyle(e.target)
                },
            })
        },
    }).addTo(mapInstance)

    mapInstance.fitBounds(layer.getBounds(), { padding: [12, 12] })
    isLoading.value = false
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

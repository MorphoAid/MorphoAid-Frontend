<template>
    <div class="relative w-full overflow-hidden" style="height: 100%;">
        <!-- Progress Bar (Subtle) -->
        <div v-if="isLoading" class="absolute top-0 left-0 right-0 h-1 bg-[#368998]/10 z-[1001]">
            <div class="h-full bg-[#368998] transition-all duration-300" :style="{ width: `${progress}%` }"></div>
        </div>

        <!-- Map Container -->
        <div ref="mapEl" class="w-full h-full rounded-b-xl overflow-hidden min-h-[480px]"></div>

        <!-- Loading Overlay -->
        <div v-if="isLoading"
            class="absolute inset-0 bg-white/75 flex flex-col items-center justify-center z-[1000] rounded-b-xl">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p class="text-primary font-bold text-sm font-manrope">Querying Database... {{ progress }}%</p>
        </div>

        <!-- Legend -->
        <div
            class="absolute bottom-6 left-6 z-[500] bg-white/90 backdrop-blur-md rounded-xl p-4 text-xs shadow-lg border border-white/50 min-w-[180px] pointer-events-none">
            <p class="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Density Index</p>
            <div class="flex flex-col gap-2">
                <div v-for="level in legendLevels" :key="level.label" class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full shadow-sm"
                        :style="{ background: level.color }"></span>
                    <span class="text-xs font-medium text-on-surface">{{ level.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'
import thailandGeoJSON from '@/assets/geo/thailand.json'
import { visualizationService } from '../services/visualization.service'
import { useMapStore } from '@/store/map.store'

const props = defineProps({
    region: {
        type: String,
        default: 'All'
    }
})

const mapEl = ref(null)
const isLoading = ref(true)
const progress = ref(0)
const mapStore = useMapStore()

let mapInstance = null
let geoJsonLayer = null
let heatmapDataStore = []

const legendLevels = [
    { label: '0 cases', color: '#F0F8FF' },
    { label: '1 - 5 cases', color: '#B8E7FC' },
    { label: '6 - 20 cases', color: '#48B7CB' },
    { label: '21 - 50 cases', color: '#FF4C38' },
    { label: '50+ cases', color: '#A92222' },
]

function getColor(d) {
    return d > 50 ? '#A92222' :
        d > 20 ? '#FF4C38' :
        d > 5 ? '#48B7CB' :
        d > 0 ? '#B8E7FC' :
        '#F0F8FF';
}

const regionsMap = {
  'Northern Region': ['chiangmai', 'chiangrai', 'lampang', 'lamphun', 'maehongson', 'nan', 'phayao', 'phrae', 'uttaradit'],
  'Northeastern Region': ['amnatcharoen', 'buengkan', 'buriram', 'chaiyaphum', 'kalasin', 'khonkaen', 'loei', 'mahasarakham', 'mukdahan', 'nakhonphanom', 'nakhonratchasima', 'nongbualamphu', 'nongkhai', 'roiet', 'sakonnakhon', 'sisaket', 'surin', 'ubonratchathani', 'udonthani', 'yasothon'],
  'Central Region': ['angthong', 'phranakhonsiayutthaya', 'ayutthaya', 'krungthepmahanakhon', 'bangkok', 'chainat', 'kamphaengphet', 'lopburi', 'nakhonnayok', 'nakhonpathom', 'nakhonsawan', 'nonthaburi', 'pathumthani', 'phetchabun', 'phichit', 'phitsanulok', 'samutprakan', 'samutsakhon', 'samutsongkhram', 'saraburi', 'singburi', 'sukhothai', 'suphanburi', 'uthaithani'],
  'Eastern Region': ['chachoengsao', 'chanthaburi', 'chonburi', 'prachinburi', 'rayong', 'sakaeo', 'trat'],
  'Western Region': ['kanchanaburi', 'phetchaburi', 'prachuapkhirikhan', 'ratchaburi', 'tak'],
  'Southern Region': ['chumphon', 'krabi', 'nakhonsithammarat', 'narathiwat', 'pattani', 'phangnga', 'phatthalung', 'phuket', 'ranong', 'satun', 'songkhla', 'suratthani', 'trang', 'yala']
}

function normalizeProv(name) {
    if (!name) return ''
    return name.replace(/\s+/g, '').toLowerCase()
}

function getProvinceRegion(provName) {
    const normal = normalizeProv(provName)
    for (const [reg, provs] of Object.entries(regionsMap)) {
        if (provs.includes(normal)) return reg
    }
    return 'Central' // Fallback
}

function isProvInSelectedRegion(provName) {
    if (!props.region || props.region === 'All') return true
    if (Object.keys(regionsMap).includes(props.region)) {
        return getProvinceRegion(provName) === props.region
    }
    return normalizeProv(provName) === normalizeProv(props.region)
}

function style(feature) {
    const provinceName = getProvinceName(feature).trim()
    const data = heatmapDataStore.find(d =>
        (d.provinceNameEn && normalizeProv(d.provinceNameEn) === normalizeProv(provinceName)) ||
        (d.provinceNameTh && d.provinceNameTh.trim() === provinceName)
    )
    const val = data ? data.value : 0
    
    const inRegion = isProvInSelectedRegion(provinceName)

    return {
        weight: inRegion ? 1.5 : 1,
        color: inRegion ? '#ffffff' : '#e1e2e8',
        fillColor: inRegion ? getColor(val) : '#F8F8F8',
        fillOpacity: inRegion ? 0.95 : 0.4,
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
        heatmapDataStore = Array.isArray(data) ? data : (data?.data || [])
        progress.value = 100
    } catch (error) {
        console.error('Failed to fetch heatmap data:', error)
        progress.value = 0
        heatmapDataStore = []
    }
}

function updateRegionFilter() {
    if (!geoJsonLayer || !mapInstance) return
    
    // Trigger restyle
    geoJsonLayer.setStyle(style)

    // Calculate bounds for selected region
    if (props.region && props.region !== 'All') {
        let bounds = null;
        geoJsonLayer.eachLayer(layer => {
            const provName = getProvinceName(layer.feature)
            if (isProvInSelectedRegion(provName)) {
                if (!bounds) {
                    bounds = layer.getBounds()
                } else {
                    bounds.extend(layer.getBounds())
                }
            }
        })
        if (bounds && bounds.isValid()) {
            mapInstance.fitBounds(bounds, { padding: [20, 20], animate: true, duration: 0.8 })
        }
    } else {
        // Reset to all Thailand
        mapInstance.fitBounds(geoJsonLayer.getBounds(), { padding: [12, 12], animate: true, duration: 0.8 })
    }
}

watch(() => props.region, () => {
    updateRegionFilter()
})

watch(() => mapStore.hoveredLocation, (loc) => {
    if (!geoJsonLayer) return;
    
    geoJsonLayer.setStyle(style); // Reset baseline style
    
    if (loc) {
        geoJsonLayer.eachLayer(layer => {
            const name = getProvinceName(layer.feature);
            let shouldHighlight = false;
            
            if (loc.type === 'province') {
                shouldHighlight = normalizeProv(name) === normalizeProv(loc.name);
            } else if (loc.type === 'region') {
                shouldHighlight = getProvinceRegion(name).toLowerCase() === loc.name.toLowerCase();
            }
            
            if (shouldHighlight) {
                layer.setStyle({
                    weight: 2.5,
                    color: '#2E2E2E',
                    fillOpacity: 1,
                });
                layer.bringToFront();
            }
        });
    }
}, { deep: true })

onMounted(async () => {
    mapInstance = L.map(mapEl.value, {
        center: [13.736717, 100.523186], // Bangkok fallback
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false,
    })

    // Carto light basemap (dimmed to make country stand out)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 10,
        opacity: 0.35,
    }).addTo(mapInstance)

    await fetchData()

    geoJsonLayer = L.geoJSON(thailandGeoJSON, {
        style,
        onEachFeature(feature, lyr) {
            const name = getProvinceName(feature).trim()
            
            // Tooltip creation
            const data = heatmapDataStore.find(d =>
                (d.provinceNameEn && normalizeProv(d.provinceNameEn) === normalizeProv(name)) ||
                (d.provinceNameTh && d.provinceNameTh.trim() === name)
            )

            let tooltipContent = `<div class="font-bold border-b border-outline-variant mb-1 pb-1 font-manrope">${name}</div>`
            if (data && data.value > 0) {
                tooltipContent += `<div class="mb-1 text-primary font-bold">Active Cases: ${data.value}</div>`
            } else {
                tooltipContent += `<div class="italic text-on-surface-variant text-[10px]">No cases reported</div>`
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
                    if (!isProvInSelectedRegion(name)) return;
                    const l = e.target
                    l.setStyle({
                        weight: 2.5,
                        color: '#2E2E2E',
                        fillOpacity: 1,
                    })
                    l.bringToFront()
                },
                mouseout(e) {
                    geoJsonLayer.resetStyle(e.target)
                },
                click(e) {
                    // Update global store context, propagating changes to TestHub Sidebar, Navbar search, and Map Style
                    if (mapStore.selectedRegion === name) {
                        mapStore.setSelectedRegion('All') // Toggle off if already selected
                    } else {
                        mapStore.setSelectedRegion(name)
                    }
                }
            })
        },
    }).addTo(mapInstance)

    updateRegionFilter()

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

defineExpose({
    updateRegionFilter
})
</script>

<style>
/* Keep leaflet z-index below sticky navbar (z-20) */
.leaflet-pane {
    z-index: 10 !important;
}

/* Add drop shadow to make Thailand pop against the dimmed basemap */
.leaflet-overlay-pane svg {
    filter: drop-shadow(0px 8px 20px rgba(46, 46, 46, 0.35));
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

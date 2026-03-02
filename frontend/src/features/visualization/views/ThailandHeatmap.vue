<template>
  <div class="h-full w-full flex flex-col p-4">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-800">Thailand Heatmap (Mock Data)</h1>
      <p class="text-sm text-gray-600">Visualizing detected cases by province.</p>
    </div>
    <div class="flex-grow bg-white rounded-lg shadow-md overflow-hidden relative min-h-[600px]">
      <div id="map" class="h-full w-full"></div>
      
      <!-- Loading overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { visualizationService } from '../services/visualization.service';
// Using an import to ensure Vite bundles the JSON properly or references it
import thailandGeoJSON from '@/assets/geo/thailand.json';

const map = ref(null);
const geojsonLayer = ref(null);
const isLoading = ref(true);

// Mockup Heatmap colors
function getColor(d) {
    return d > 400 ? '#800026' :
           d > 300  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature, backendData) {
    // try to find the match by English Name first
    const provinceData = backendData.find(
        (p) =>
            p.provinceNameEn.toLowerCase() === feature.properties.name.toLowerCase() ||
            p.provinceNameEn.toLowerCase().replace(' ', '') === feature.properties.name.toLowerCase().replace(' ', '')
    );
    const mockValue = provinceData ? provinceData.value : 0;
    
    return {
        fillColor: getColor(mockValue),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    layer.bringToFront();
}

function resetHighlight(e, backendData) {
    geojsonLayer.value.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.value.fitBounds(e.target.getBounds());
}

async function initMap() {
    try {
        isLoading.value = true;
        // Fetch data from backend
        const serverData = await visualizationService.getHeatmapData();

        // 13.0367, 101.4913 is roughly center of Thailand
        map.value = L.map('map').setView([13.0367, 101.4913], 6);

        // Add base tile layer (optional, but good for context)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map.value);

        // Add GeoJSON Layer with backend data binding
        geojsonLayer.value = L.geoJSON(thailandGeoJSON, {
            style: (feature) => style(feature, serverData),
            onEachFeature: (feature, layer) => {
                const pNameEn = feature.properties.name;
                const pNameTh = feature.properties.name_th || 'N/A';
                
                // Find data
                const pData = serverData.find(
                    (p) => p.provinceNameEn.toLowerCase() === pNameEn.toLowerCase() || 
                           p.provinceNameEn.toLowerCase().replace(' ', '') === pNameEn.toLowerCase().replace(' ', '')
                );
                const mockCases = pData ? pData.value : 0;

                // Popup content
                const popupContent = `
                    <div class="px-2 py-1">
                        <strong class="text-sm font-bold block">${pNameEn} / ${pNameTh}</strong>
                        <span class="text-xs text-gray-600 block mb-1">Detected Cases</span>
                        <div class="bg-indigo-100 text-indigo-800 text-lg font-semibold rounded px-2 py-1 inline-block">
                           ${mockCases}
                        </div>
                    </div>
                `;
                
                layer.bindPopup(popupContent, { closeButton: false, className: 'custom-popup' });
                
                layer.on({
                    mouseover: function(e) {
                        highlightFeature(e);
                        this.openPopup();
                    },
                    mouseout: function(e) {
                        geojsonLayer.value.resetStyle(e.target);
                        this.closePopup();
                    },
                    click: zoomToFeature
                });
            }
        }).addTo(map.value);
        
    } catch (error) {
        console.error("Failed to load map data:", error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    initMap();
});

onBeforeUnmount(() => {
    if (map.value) {
        map.value.remove();
    }
});
</script>

<style>
/* Leaflet uses z-index deeply, adjusting it slightly so it doesn't conflict with our navbar */
.leaflet-pane {
    z-index: 10;
}
.leaflet-top,
.leaflet-bottom {
    z-index: 20;
}
.custom-popup .leaflet-popup-content-wrapper {
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.custom-popup .leaflet-popup-content {
    margin: 8px;
}
</style>

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import 'leaflet/dist/leaflet.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')

// Testability hook for E2E
if (window.Cypress || window.playwright || import.meta.env.MODE === 'development') {
  window.pinia = pinia
}

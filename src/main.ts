import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'

createApp(App).use(router).mount('#app')

// Register the service worker (PWA) in production builds only
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount } from 'vue'
import { MapPin, ExternalLink, Map as MapIcon } from 'lucide-vue-next'
import { establishments, ESTABLISHMENTS_DIRECTORY_URL } from '../data/vaud'

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

const loaded = ref(false)
const loading = ref(false)
const error = ref(false)
const mapEl = ref<HTMLElement | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any = null

function loadCss(href: string) {
  return new Promise<void>((resolve) => {
    if (document.querySelector(`link[href="${href}"]`)) return resolve()
    const l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = href
    l.onload = () => resolve()
    document.head.appendChild(l)
  })
}
function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).L) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('leaflet load failed'))
    document.head.appendChild(s)
  })
}

async function showMap() {
  if (loaded.value || loading.value) return
  loading.value = true
  error.value = false
  try {
    await loadCss(LEAFLET_CSS)
    await loadScript(LEAFLET_JS)
    loaded.value = true
    await nextTick()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L
    if (!mapEl.value || !L) throw new Error('no map')
    map = L.map(mapEl.value, { scrollWheelZoom: false }).setView([46.62, 6.62], 9)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markers: any[] = establishments.map((e) =>
      L.marker([e.lat, e.lng]).bindPopup(`<strong>${e.name}</strong><br>${e.city}`),
    )
    const group = L.featureGroup(markers).addTo(map)
    map.fitBounds(group.getBounds().pad(0.12))
  } catch {
    error.value = true
    loaded.value = false
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="rounded-[24px] border-2 border-border bg-card overflow-hidden">
    <div class="p-5 flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-2">
        <MapPin :size="20" class="text-primary" />
        <h3 class="font-bold text-foreground">Carte des établissements scolaires (VD)</h3>
      </div>
      <a
        :href="ESTABLISHMENTS_DIRECTORY_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-cta hover:underline"
      >
        Annuaire officiel
        <ExternalLink :size="14" />
      </a>
    </div>

    <div v-if="!loaded" class="px-5 pb-6">
      <button
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-semibold disabled:opacity-60"
        :disabled="loading"
        @click="showMap"
      >
        <MapIcon :size="18" />
        {{ loading ? 'Chargement…' : 'Afficher la carte' }}
      </button>
      <p v-if="error" class="text-sm text-destructive mt-3">
        Impossible de charger la carte. Consultez l’annuaire officiel ci-dessus.
      </p>
      <p v-else class="text-xs text-muted-foreground mt-3">
        La carte se charge uniquement à la demande (elle ne ralentit pas la page).
      </p>
    </div>

    <div v-show="loaded" ref="mapEl" class="h-[380px] w-full" />
  </div>
</template>

<style scoped>
:deep(.leaflet-container) {
  font-family: 'Inter', sans-serif;
  background: var(--muted);
}
</style>

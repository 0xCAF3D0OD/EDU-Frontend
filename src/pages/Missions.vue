<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { gsap } from 'gsap'
import { MapPin, Calendar, BookOpen, Users, Award, Clock } from 'lucide-vue-next'
import Footer from '../components/Footer.vue'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'
import EstablishmentsMap from '../components/EstablishmentsMap.vue'
import GrilleHoraire from '../components/GrilleHoraire.vue'
import { yearLevels, subjectsForLevels } from '../data/vaud'
import { useOffers } from '../composables/useOffers'
import DropdownSelect from '../components/DropdownSelect.vue'

const { offers } = useOffers()
const sortBy = ref('Plus récentes')

// Location search (the "Emplacement" bar) + canton chips filter the catalogue
const locationQuery = ref('')
const filteredOffers = computed(() => {
  const q = locationQuery.value.trim().toLowerCase()
  return offers.value.filter((o) => {
    const loc = o.location.toLowerCase()
    if (q && !loc.includes(q)) return false
    if (selected.cantons.length && !selected.cantons.some((c) => loc.includes(c.toLowerCase()))) return false
    return true
  })
})

const doodles: Doodle[] = [
  // left gutter
  { name: 'arrow', top: '12%', left: '2%', size: 64, rotate: -8, opacity: 0.5 },
  { name: 'swirl', top: '34%', left: '3%', size: 78, opacity: 0.45 },
  { name: 'arrow2', top: '58%', left: '2%', size: 58, rotate: 12, opacity: 0.5 },
  { name: 'hills', bottom: '8%', left: '4%', size: 90, opacity: 0.4 },
  { name: 'dots-red', bottom: '30%', left: '3%', size: 50, opacity: 0.45 },
  // right gutter
  { name: 'lightning', top: '14%', right: '2%', size: 56, opacity: 0.55 },
  { name: 'cloud-line', top: '38%', right: '3%', size: 84, opacity: 0.4 },
  { name: 'lightning2', top: '62%', right: '2%', size: 50, opacity: 0.5 },
  { name: 'star-mini', bottom: '12%', right: '5%', size: 36, opacity: 0.55 },
  { name: 'check', bottom: '34%', right: '4%', size: 40, opacity: 0.5 },
]

type FilterKey = 'days' | 'cantons' | 'levels' | 'subjects'

const selected = reactive<Record<FilterKey, string[]>>({
  days: [],
  cantons: [],
  levels: [],
  subjects: [],
})

const periodsRange = ref(14)
const searchRadius = ref(15)

const days = [
  { id: 'lun-matin', label: 'Lun', period: 'Matin' },
  { id: 'mar-matin', label: 'Mar', period: 'Matin' },
  { id: 'mer-matin', label: 'Mer', period: 'Matin' },
  { id: 'jeu-matin', label: 'Jeu', period: 'Matin' },
  { id: 'ven-matin', label: 'Ven', period: 'Matin' },
  { id: 'lun-am', label: 'Lun', period: 'AM' },
  { id: 'mar-am', label: 'Mar', period: 'AM' },
  { id: 'mer-am', label: 'Mer', period: 'AM' },
  { id: 'jeu-am', label: 'Jeu', period: 'AM' },
  { id: 'ven-am', label: 'Ven', period: 'AM' },
]

const cantons = [
  { id: 'VD', label: 'Vaud (VD)', color: '#FD4401' },
  { id: 'GE', label: 'Genève (GE)', color: '#FDCB40' },
  { id: 'FR', label: 'Fribourg (FR)', color: '#FD4401' },
  { id: 'VS', label: 'Valais (VS)', color: '#FDCB40' },
  { id: 'NE', label: 'Neuchâtel (NE)', color: '#FD4401' },
  { id: 'JU', label: 'Jura (JU)', color: '#FDCB40' },
]

// Niveaux officiels VD (HarmoS) ; les disciplines dépendent des niveaux choisis
const levels = yearLevels
const availableSubjects = computed(() => subjectsForLevels(selected.levels))

// Retire les disciplines qui ne sont plus proposées quand les niveaux changent
watch(availableSubjects, (subs) => {
  selected.subjects = selected.subjects.filter((s) => subs.includes(s))
})

function toggle(key: FilterKey, id: string) {
  const list = selected[key]
  const idx = list.indexOf(id)
  if (idx === -1) list.push(id)
  else list.splice(idx, 1)
}

function periodLabel(period: string) {
  return period === 'Matin' ? 'AM' : 'PM'
}

function onBtnHover(e: MouseEvent, opts: { rotate?: number; y?: number } = {}) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1.05, rotate: opts.rotate ?? 0, y: opts.y ?? 0, duration: 0.2 })
}
function onBtnLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, rotate: 0, y: 0, duration: 0.2 })
}
function onBtnPress(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 0.95, duration: 0.1 })
}
function onBtnRelease(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, duration: 0.15 })
}
function onCardHover(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1.02, y: -5, duration: 0.3, ease: 'power2.out' })
}
function onCardLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' })
}
</script>

<template>
  <div style="min-height:100dvh; overflow-x:hidden; background:var(--background); position:relative;">
    <DoodleBackground :items="doodles" />
    <div class="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <!-- Left: filters -->
        <div class="lg:col-span-4">
          <div class="sticky top-28 rounded-[32px] p-8 bg-muted">
            <h2 class="text-[2rem] mb-8 leading-tight" style="font-family:'DM Serif Display',serif">
              Mes Préférences
              <br />
              <span class="text-primary">de Remplacement</span>
            </h2>

            <!-- Disponibilités -->
            <div class="mb-8">
              <label class="block text-base font-semibold mb-4" style="font-family:Inter,sans-serif">Disponibilités dans la semaine</label>
              <div class="grid grid-cols-5 gap-2 mb-2">
                <div v-for="d in ['Lun','Mar','Mer','Jeu','Ven']" :key="d" class="text-center text-xs font-medium text-foreground/60">{{ d }}</div>
              </div>
              <div class="space-y-2">
                <div v-for="period in ['Matin','AM']" :key="period" class="grid grid-cols-5 gap-2">
                  <button
                    v-for="day in days.filter((x) => x.period === period)"
                    :key="day.id"
                    class="h-12 rounded-[16px] text-sm font-medium transition-all"
                    :style="{
                      backgroundColor: selected.days.includes(day.id) ? '#FD4401' : 'var(--card)',
                      color: selected.days.includes(day.id) ? 'white' : 'var(--muted-foreground)',
                    }"
                    @click="toggle('days', day.id)"
                    @mouseenter="onBtnHover" @mouseleave="onBtnLeave"
                  >
                    {{ periodLabel(period) }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Emplacement -->
            <div class="mb-8">
              <label class="block text-base font-semibold mb-4" style="font-family:Inter,sans-serif">Emplacement (Suisse romande)</label>
              <input v-model="locationQuery" type="text" placeholder="Ville ou NPA (ex: Lausanne)" class="w-full px-4 py-3 rounded-[16px] border-2 border-foreground/10 mb-3 bg-input-background text-foreground" style="font-family:Inter,sans-serif" />
              <div class="mb-3">
                <label class="block text-sm text-foreground/70 mb-2">Rayon: {{ searchRadius }} km</label>
                <input type="range" min="5" max="50" v-model.number="searchRadius" class="w-full" />
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="canton in cantons"
                  :key="canton.id"
                  class="px-4 py-2 rounded-[16px] text-sm font-medium transition-all"
                  :style="{
                    backgroundColor: selected.cantons.includes(canton.id) ? canton.color : 'var(--card)',
                    color: selected.cantons.includes(canton.id) ? 'white' : 'var(--muted-foreground)',
                  }"
                  @click="toggle('cantons', canton.id)"
                  @mouseenter="(e) => onBtnHover(e, { rotate: 2 })" @mouseleave="onBtnLeave"
                >
                  {{ canton.label }}
                </button>
              </div>
            </div>

            <!-- Niveau HarmoS -->
            <div class="mb-8">
              <label class="block text-base font-semibold mb-4" style="font-family:Inter,sans-serif">Niveau des classes (HarmoS)</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="level in levels"
                  :key="level.id"
                  class="px-4 py-3 rounded-[16px] text-sm font-medium transition-all"
                  :style="{
                    backgroundColor: selected.levels.includes(level.id) ? '#FDCB40' : 'var(--card)',
                    color: selected.levels.includes(level.id) ? '#1A1A1A' : 'var(--muted-foreground)',
                  }"
                  @click="toggle('levels', level.id)"
                  @mouseenter="onBtnHover" @mouseleave="onBtnLeave"
                >
                  {{ level.label }}
                </button>
              </div>
            </div>

            <!-- Volume horaire -->
            <div class="mb-8">
              <label class="block text-base font-semibold mb-4" style="font-family:Inter,sans-serif">Volume horaire par semaine</label>
              <div class="px-4 py-6 rounded-[16px] bg-card">
                <div class="text-center mb-3">
                  <span class="text-2xl font-bold text-primary">{{ periodsRange }}</span>
                  <span class="text-sm text-foreground/60 ml-2">périodes</span>
                </div>
                <input type="range" min="1" max="28" v-model.number="periodsRange" class="w-full" />
                <div class="flex justify-between text-xs text-foreground/65 mt-1">
                  <span>1</span>
                  <span>28</span>
                </div>
              </div>
            </div>

            <!-- Disciplines -->
            <div class="mb-6">
              <label class="block text-base font-semibold mb-2" style="font-family:Inter,sans-serif">Disciplines</label>
              <p class="text-xs text-foreground/65 mb-4">
                {{ selected.levels.length ? 'Selon les niveaux sélectionnés' : 'Sélectionnez un niveau pour affiner' }}
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="subject in availableSubjects"
                  :key="subject"
                  class="px-4 py-2 rounded-[16px] text-sm font-medium transition-all"
                  :style="{
                    backgroundColor: selected.subjects.includes(subject) ? '#FD4401' : 'var(--card)',
                    color: selected.subjects.includes(subject) ? 'white' : 'var(--muted-foreground)',
                  }"
                  @click="toggle('subjects', subject)"
                  @mouseenter="(e) => onBtnHover(e, { y: -2 })" @mouseleave="onBtnLeave"
                >
                  {{ subject }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: results -->
        <div class="lg:col-span-8">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-[clamp(1.875rem,6vw,3rem)] leading-tight" style="font-family:'DM Serif Display',serif">
              <span class="text-primary">{{ filteredOffers.length }}</span> opportunités
              <br />
              correspondent à votre profil
            </h1>
            <div class="w-52 shrink-0">
              <DropdownSelect v-model="sortBy" :options="['Plus récentes', 'Plus proches', 'Meilleure affinité']" aria-label="Trier" />
            </div>
          </div>

          <div class="space-y-6">
            <div v-if="filteredOffers.length === 0" class="rounded-[24px] p-10 text-center bg-card border-2 border-dashed border-border">
              <p class="text-foreground/60">Aucune offre ne correspond à cette recherche.</p>
            </div>
            <div
              v-for="mission in filteredOffers"
              :key="mission.id"
              class="rounded-[24px] p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden bg-card"
              @mouseenter="onCardHover" @mouseleave="onCardLeave"
            >
              <div class="absolute top-6 right-6 flex items-center gap-2">
                <span v-if="mission.urgent" class="px-3 py-1.5 rounded-[14px] bg-destructive/15 text-destructive text-xs font-bold">
                  Urgent
                </span>
                <div class="px-4 py-2 rounded-[16px] flex items-center gap-2 bg-muted">
                  <Award :size="20" color="#FD4401" />
                  <span class="text-sm font-bold text-primary">{{ mission.match ? mission.match + '% Match' : 'Nouvelle offre' }}</span>
                </div>
              </div>

              <h3 class="text-[1.75rem] mb-4 pr-32 leading-tight" style="font-family:'DM Serif Display',serif">{{ mission.school }}</h3>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="flex items-center gap-2">
                  <BookOpen :size="18" color="#FD4401" />
                  <span class="text-sm text-foreground/80">{{ mission.subject }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Users :size="18" color="#FDCB40" />
                  <span class="text-sm text-foreground/80">{{ mission.level }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Clock :size="18" color="#FD4401" />
                  <span class="text-sm text-foreground/80">{{ mission.periods }} périodes/sem</span>
                </div>
                <div class="flex items-center gap-2">
                  <MapPin :size="18" color="#FDCB40" />
                  <span class="text-sm text-foreground/80">{{ mission.location }}</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-3 mb-6">
                <div class="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-muted">
                  <Calendar :size="16" color="#FD4401" />
                  <span class="text-sm font-medium">Du {{ mission.startDate }} au {{ mission.endDate }}</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-muted">
                  <Clock :size="16" color="#FD4401" />
                  <span class="text-sm font-medium">{{ mission.daypart }}</span>
                </div>
              </div>

              <button
                class="w-full py-4 bg-primary text-primary-foreground rounded-[16px] text-base font-semibold shadow-lg"
                @mouseenter="onBtnHover" @mouseleave="onBtnLeave" @mousedown="onBtnPress" @mouseup="onBtnRelease"
              >
                Postuler en 1 clic
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Carte des établissements + grilles horaires -->
      <div class="mt-12 space-y-6">
        <EstablishmentsMap />
        <GrilleHoraire />
      </div>
    </div>

    <Footer />
  </div>
</template>

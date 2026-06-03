<script setup lang="ts">
import { ref, reactive } from 'vue'
import { gsap } from 'gsap'
import { MapPin, Calendar, BookOpen, Users, Award, Clock } from 'lucide-vue-next'
import Footer from '../components/Footer.vue'

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

const levels = [
  { id: '1-4H', label: '1-4H (Primaire)' },
  { id: '5-8H', label: '5-8H (Primaire)' },
  { id: '9-11H', label: '9-11H (CO)' },
  { id: 'sec2', label: 'Secondaire II' },
]

const subjects = ['Français', 'Mathématiques', 'Allemand', 'Anglais', 'Histoire & Citoyenneté', 'Géographie', 'Sciences de la nature']

const missions = [
  { id: 1, school: 'Établissement Primaire de Belmont', match: 95, subject: 'Français', level: '5-8H', periods: 18, startDate: '15 Septembre 2026', endDate: '12 Décembre 2026', location: 'Lausanne, VD' },
  { id: 2, school: "Collège de l'Elysée", match: 88, subject: 'Mathématiques', level: '9-11H', periods: 22, startDate: '1 Octobre 2026', endDate: '20 Décembre 2026', location: 'Genève, GE' },
  { id: 3, school: 'École Primaire des Jordils', match: 92, subject: 'Sciences de la nature', level: '5-8H', periods: 14, startDate: '8 Septembre 2026', endDate: '30 Novembre 2026', location: 'Pully, VD' },
]

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
  <div style="min-height:100vh; overflow-x:hidden; background:var(--background);">
    <div class="max-w-[1600px] mx-auto px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <!-- Left: filters -->
        <div class="lg:col-span-4">
          <div class="sticky top-28 rounded-[32px] p-8" style="background-color:#FFF4E6">
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
                      backgroundColor: selected.days.includes(day.id) ? '#FD4401' : 'white',
                      color: selected.days.includes(day.id) ? 'white' : '#6B6B6B',
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
              <input type="text" placeholder="NPA (ex: 1003)" class="w-full px-4 py-3 rounded-[16px] border-2 border-foreground/10 mb-3" style="font-family:Inter,sans-serif" />
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
                    backgroundColor: selected.cantons.includes(canton.id) ? canton.color : 'white',
                    color: selected.cantons.includes(canton.id) ? 'white' : '#6B6B6B',
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
                    backgroundColor: selected.levels.includes(level.id) ? '#FDCB40' : 'white',
                    color: selected.levels.includes(level.id) ? '#1A1A1A' : '#6B6B6B',
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
              <div class="px-4 py-6 rounded-[16px] bg-white">
                <div class="text-center mb-3">
                  <span class="text-2xl font-bold text-primary">{{ periodsRange }}</span>
                  <span class="text-sm text-foreground/60 ml-2">périodes</span>
                </div>
                <input type="range" min="1" max="28" v-model.number="periodsRange" class="w-full" />
                <div class="flex justify-between text-xs text-foreground/50 mt-1">
                  <span>1</span>
                  <span>28</span>
                </div>
              </div>
            </div>

            <!-- Disciplines -->
            <div class="mb-6">
              <label class="block text-base font-semibold mb-4" style="font-family:Inter,sans-serif">Disciplines théoriques</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="subject in subjects"
                  :key="subject"
                  class="px-4 py-2 rounded-[16px] text-sm font-medium transition-all"
                  :style="{
                    backgroundColor: selected.subjects.includes(subject) ? '#FD4401' : 'white',
                    color: selected.subjects.includes(subject) ? 'white' : '#6B6B6B',
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
            <h1 class="text-[3rem] leading-tight" style="font-family:'DM Serif Display',serif">
              <span class="text-primary">{{ missions.length }}</span> opportunités
              <br />
              correspondent à votre profil
            </h1>
            <select class="px-6 py-3 rounded-[16px] border-2 border-foreground/10 font-medium">
              <option>Plus récentes</option>
              <option>Plus proches</option>
              <option>Meilleure affinité</option>
            </select>
          </div>

          <div class="space-y-6">
            <div
              v-for="mission in missions"
              :key="mission.id"
              class="rounded-[24px] p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
              style="background-color:white"
              @mouseenter="onCardHover" @mouseleave="onCardLeave"
            >
              <div class="absolute top-6 right-6 px-4 py-2 rounded-[16px] flex items-center gap-2" style="background-color:#FFF4E6">
                <Award :size="20" color="#FD4401" />
                <span class="text-sm font-bold text-primary">{{ mission.match }}% Match</span>
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

              <div class="flex items-center gap-2 mb-6 px-4 py-2 rounded-[12px] inline-flex" style="background-color:#FFF4E6">
                <Calendar :size="16" color="#FD4401" />
                <span class="text-sm font-medium">Du {{ mission.startDate }} au {{ mission.endDate }}</span>
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
    </div>

    <Footer />
  </div>
</template>

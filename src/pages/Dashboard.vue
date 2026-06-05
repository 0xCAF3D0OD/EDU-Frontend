<script setup lang="ts">
import { gsap } from 'gsap'
import { Calendar, MapPin, MessageCircle, Clock, CheckCircle, AlertCircle, Link as LinkIcon } from 'lucide-vue-next'
import Footer from '../components/Footer.vue'
import CroppedIcon from '../components/CroppedIcon.vue'
import illustrationSet1 from '../imports/illustrationSet1.png'
import illustrationSet2 from '../imports/illustrationSet2.png'

const missions = [
  { id: 1, status: 'confirmed', statusLabel: 'Confirmé', school: 'Établissement Primaire de Belmont', class: '5H-6H', subject: 'Français', periods: 18, startDate: '15 Sep 2026', endDate: '12 Déc 2026', schedule: 'Lun-Mar-Mer 08:30-11:45', teacher: 'Mme Sophie Ducret', location: 'Lausanne, VD' },
  { id: 2, status: 'pending', statusLabel: 'En attente', school: "Collège de l'Elysée", class: '9H-11H', subject: 'Mathématiques', periods: 22, startDate: '1 Oct 2026', endDate: '20 Déc 2026', schedule: 'Jeu-Ven 13:30-16:00', teacher: 'M. Jean-Marc Favre', location: 'Genève, GE' },
  { id: 3, status: 'confirmed', statusLabel: 'Confirmé', school: 'École Primaire des Jordils', class: '7H-8H', subject: 'Sciences de la nature', periods: 14, startDate: '8 Sep 2026', endDate: '30 Nov 2026', schedule: 'Lun-Mer 09:00-10:30', teacher: 'Mme Claire Monnier', location: 'Pully, VD' },
]

const upcomingWeek = [
  { day: 'Lun', date: '15', missions: ['Belmont', 'Jordils'] },
  { day: 'Mar', date: '16', missions: ['Belmont'] },
  { day: 'Mer', date: '17', missions: ['Belmont', 'Jordils'] },
  { day: 'Jeu', date: '18', missions: [] },
  { day: 'Ven', date: '19', missions: [] },
]

const decorations = [
  { set: illustrationSet1, row: 5, col: 6, size: 140, opacity: 0.1, pos: 'top-20 right-20' },
  { set: illustrationSet2, row: 3, col: 8, size: 160, opacity: 0.08, pos: 'bottom-40 left-20' },
  { set: illustrationSet1, row: 2, col: 4, size: 110, opacity: 0.07, pos: 'top-1/3 left-32' },
  { set: illustrationSet2, row: 5, col: 7, size: 130, opacity: 0.09, pos: 'bottom-1/4 right-40' },
  { set: illustrationSet1, row: 4, col: 9, size: 95, opacity: 0.06, pos: 'top-2/3 right-16' },
]

function onCardHover(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1.01, y: -3, duration: 0.3, ease: 'power2.out' })
}
function onCardLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' })
}
function onBtnHover(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1.03, duration: 0.2 })
}
function onBtnLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, duration: 0.2 })
}
</script>

<template>
  <div style="min-height:100vh; overflow-x:hidden; background:var(--background); position:relative;">
    <div
      v-for="(deco, i) in decorations"
      :key="i"
      class="absolute pointer-events-none"
      :class="deco.pos"
    >
      <CroppedIcon :image-url="deco.set" :row="deco.row" :col="deco.col" :size="deco.size" :opacity="deco.opacity" />
    </div>

    <div class="max-w-[1400px] mx-auto px-8 py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-[clamp(2rem,6.5vw,3.5rem)] mb-6 leading-tight" style="font-family:'DM Serif Display',serif">
          Bonjour <span class="text-primary">Marc</span>,
          <br />
          prêt pour votre prochaine mission ?
        </h1>
        <button
          class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-[24px] text-base font-semibold shadow-lg"
          @mouseenter="onBtnHover" @mouseleave="onBtnLeave"
        >
          <LinkIcon :size="20" />
          Lier mon calendrier (Google, Apple, Outlook)
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Week timeline -->
        <div class="lg:col-span-4">
          <div class="rounded-[32px] p-8 sticky top-28 bg-muted">
            <h2 class="text-[2rem] mb-6 leading-tight" style="font-family:'DM Serif Display',serif">Cette semaine</h2>
            <div class="space-y-3">
              <div
                v-for="day in upcomingWeek"
                :key="day.date"
                class="rounded-[20px] p-4 transition-all"
                :style="{
                  backgroundColor: day.missions.length > 0 ? '#FD4401' : 'var(--card)',
                  color: day.missions.length > 0 ? 'white' : 'var(--foreground)',
                }"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <div class="text-sm opacity-70">{{ day.day }}</div>
                    <div class="text-2xl font-bold">{{ day.date }}</div>
                  </div>
                  <div v-if="day.missions.length > 0" class="text-sm font-medium">
                    {{ day.missions.length }} mission{{ day.missions.length > 1 ? 's' : '' }}
                  </div>
                </div>
                <div v-if="day.missions.length > 0" class="space-y-1">
                  <div v-for="(m, i) in day.missions" :key="i" class="text-xs bg-white/20 rounded-[12px] px-3 py-1">
                    {{ m }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mission cards -->
        <div class="lg:col-span-8">
          <h2 class="text-[clamp(1.75rem,5vw,2.5rem)] mb-8 leading-tight" style="font-family:'DM Serif Display',serif">Mes missions à venir</h2>
          <div class="space-y-6">
            <div
              v-for="mission in missions"
              :key="mission.id"
              class="rounded-[28px] p-8 shadow-lg hover:shadow-xl transition-all relative overflow-hidden bg-card"
              @mouseenter="onCardHover" @mouseleave="onCardLeave"
            >
              <div class="absolute top-6 right-6">
                <div
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-[16px] text-sm font-semibold"
                  :style="{
                    backgroundColor: mission.status === 'confirmed' ? '#D4EDDA' : '#FFF3CD',
                    color: mission.status === 'confirmed' ? '#155724' : '#856404',
                  }"
                >
                  <CheckCircle v-if="mission.status === 'confirmed'" :size="16" />
                  <AlertCircle v-else :size="16" />
                  {{ mission.statusLabel }}
                </div>
              </div>

              <h3 class="text-[2rem] mb-2 pr-32 leading-tight" style="font-family:'DM Serif Display',serif">{{ mission.school }}</h3>
              <div class="flex items-center gap-2 mb-6 text-foreground/70">
                <span class="font-semibold">{{ mission.class }}</span>
                <span>•</span>
                <span>{{ mission.subject }}</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="flex items-start gap-3 p-4 rounded-[16px] bg-muted/30">
                  <Calendar :size="20" class="text-primary mt-1" />
                  <div>
                    <div class="text-sm text-foreground/60">Période</div>
                    <div class="font-medium">{{ mission.startDate }} - {{ mission.endDate }}</div>
                    <div class="text-sm text-foreground/70">{{ mission.schedule }}</div>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 rounded-[16px] bg-muted/30">
                  <Clock :size="20" class="text-primary mt-1" />
                  <div>
                    <div class="text-sm text-foreground/60">Volume</div>
                    <div class="font-medium">{{ mission.periods }} périodes/semaine</div>
                  </div>
                </div>
              </div>

              <div class="mb-6 p-4 rounded-[16px] bg-muted">
                <div class="text-sm text-foreground/60 mb-1">Enseignant titulaire</div>
                <div class="font-semibold text-lg">{{ mission.teacher }}</div>
                <div class="text-sm text-foreground/70 mt-1 flex items-center gap-1">
                  <MapPin :size="14" />
                  {{ mission.location }}
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  class="flex-1 py-3 bg-primary text-primary-foreground rounded-[16px] text-base font-semibold flex items-center justify-center gap-2"
                  @mouseenter="onBtnHover" @mouseleave="onBtnLeave"
                >
                  <MapPin :size="18" />
                  Voir l'itinéraire
                </button>
                <button
                  class="flex-1 py-3 bg-card border-2 border-foreground/10 text-foreground rounded-[16px] text-base font-semibold flex items-center justify-center gap-2 hover:border-primary/30"
                  @mouseenter="onBtnHover" @mouseleave="onBtnLeave"
                >
                  <MessageCircle :size="18" />
                  Contacter le titulaire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

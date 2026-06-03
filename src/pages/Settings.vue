<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Bell, Calendar, Lock, Trash2, Save, Camera, Check } from 'lucide-vue-next'
import Footer from '../components/Footer.vue'
import CroppedIcon from '../components/CroppedIcon.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'
import illustrationSet1 from '../imports/illustrationSet1.png'
import illustrationSet2 from '../imports/illustrationSet2.png'

type ThemeOption = 'creme' | 'nuit' | 'foret' | 'lavande'

interface ThemeColors {
  bg: string
  card: string
  text: string
  textSecondary: string
  accent: string
  inputBg: string
  inputBorder: string
  gradient: string
}

interface Theme {
  id: ThemeOption
  name: string
  description: string
  emoji: string
  colors: ThemeColors
}

const themes: Theme[] = [
  { id: 'creme', name: 'Papier Crème', description: 'Ton clair doux et reposant', emoji: '☀️', colors: { bg: '#FFFEF9', card: '#FFFFFF', text: '#1A1A1A', textSecondary: '#6B6B6B', accent: '#FD4401', inputBg: '#FFFFFF', inputBorder: 'rgba(26, 26, 26, 0.1)', gradient: 'linear-gradient(135deg, #FFFEF9 0%, #FFF4E6 100%)' } },
  { id: 'nuit', name: 'Nuit Bleutée', description: 'Sombre et apaisant pour les yeux', emoji: '🌙', colors: { bg: '#121824', card: '#1E293B', text: '#F8FAFC', textSecondary: '#CBD5E1', accent: '#FD4401', inputBg: '#0F172A', inputBorder: 'rgba(203, 213, 225, 0.2)', gradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' } },
  { id: 'foret', name: 'Forêt Romande', description: 'Nature et sérénité', emoji: '🌲', colors: { bg: '#F0F4F0', card: '#FFFFFF', text: '#1F3A2E', textSecondary: '#4A6B5A', accent: '#B8621B', inputBg: '#FFFFFF', inputBorder: 'rgba(31, 58, 46, 0.1)', gradient: 'linear-gradient(135deg, #E8F0E8 0%, #D4E4D4 100%)' } },
  { id: 'lavande', name: 'Lavande Douce', description: 'Relaxant et élégant', emoji: '💜', colors: { bg: '#F5F3F7', card: '#FFFFFF', text: '#3D2557', textSecondary: '#6B4A8C', accent: '#7C3F8C', inputBg: '#FFFFFF', inputBorder: 'rgba(61, 37, 87, 0.1)', gradient: 'linear-gradient(135deg, #F5F3F7 0%, #E9E4EE 100%)' } },
]

const emailNotif = ref(true)
const smsNotif = ref(false)
const pushNotif = ref(true)
const selectedTheme = ref<ThemeOption>('creme')

const currentTheme = computed(() => themes.find((t) => t.id === selectedTheme.value) ?? themes[0]!)
const c = computed(() => currentTheme.value.colors)

const decorations = [
  { set: illustrationSet1, row: 2, col: 7, size: 120, opacity: 0.08, pos: 'top-32 right-32' },
  { set: illustrationSet2, row: 4, col: 3, size: 140, opacity: 0.1, pos: 'top-80 left-20' },
  { set: illustrationSet1, row: 5, col: 9, size: 100, opacity: 0.09, pos: 'bottom-96 right-40' },
  { set: illustrationSet2, row: 1, col: 5, size: 130, opacity: 0.08, pos: 'bottom-40 left-32' },
]
</script>

<template>
  <div style="min-height:100vh; overflow-x:hidden; position:relative;" :style="{ backgroundColor: c.bg }">
    <div
      v-for="(deco, i) in decorations"
      :key="i"
      class="absolute pointer-events-none"
      :class="deco.pos"
    >
      <CroppedIcon :image-url="deco.set" :row="deco.row" :col="deco.col" :size="deco.size" :opacity="deco.opacity" />
    </div>

    <div class="max-w-5xl mx-auto px-8 py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-[3.5rem] mb-3 leading-tight" style="font-family:'DM Serif Display',serif" :style="{ color: c.text }">
          Réglages du <span :style="{ color: c.accent }">compte</span>
        </h1>
        <p class="text-lg" :style="{ color: c.textSecondary }">Gérez vos préférences et paramètres de compte</p>
      </div>

      <div class="space-y-8">
        <!-- Section 1: Profil -->
        <section class="rounded-[32px] p-10 shadow-sm" :style="{ backgroundColor: c.card }">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center" :style="{ backgroundColor: `${c.accent}15` }">
              <User :size="24" :style="{ color: c.accent }" />
            </div>
            <h2 class="text-[2rem] leading-tight" style="font-family:'DM Serif Display',serif" :style="{ color: c.text }">Profil & Identité</h2>
          </div>

          <div class="flex flex-col md:flex-row gap-8 mb-8">
            <div class="flex flex-col items-center">
              <div class="relative">
                <div class="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold" :style="{ backgroundColor: c.accent }">MR</div>
                <button class="absolute bottom-0 right-0 w-10 h-10 rounded-full shadow-lg flex items-center justify-center border-2" :style="{ backgroundColor: c.card, borderColor: c.inputBorder }">
                  <Camera :size="18" :style="{ color: c.accent }" />
                </button>
              </div>
              <div class="mt-4 px-4 py-2 rounded-[12px] bg-green-50 flex items-center gap-2">
                <Check :size="16" class="text-green-600" />
                <span class="text-sm font-semibold text-green-700">Profil vérifié DIP</span>
              </div>
            </div>

            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold mb-2" style="font-family:Inter,sans-serif" :style="{ color: c.text }">Prénom</label>
                <input type="text" value="Marc" class="w-full px-4 py-3 rounded-[16px] border-2 focus:outline-none transition-all" :style="{ backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2" style="font-family:Inter,sans-serif" :style="{ color: c.text }">Nom</label>
                <input type="text" value="Renaud" class="w-full px-4 py-3 rounded-[16px] border-2 focus:outline-none transition-all" :style="{ backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2" style="font-family:Inter,sans-serif" :style="{ color: c.text }">Email</label>
                <input type="email" value="marc.renaud@exemple.ch" class="w-full px-4 py-3 rounded-[16px] border-2 focus:outline-none transition-all" :style="{ backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2" style="font-family:Inter,sans-serif" :style="{ color: c.text }">Téléphone</label>
                <input type="tel" value="+41 79 123 45 67" class="w-full px-4 py-3 rounded-[16px] border-2 focus:outline-none transition-all" :style="{ backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }" />
              </div>
            </div>
          </div>
        </section>

        <!-- Section 2: Affichage & Thème -->
        <section class="rounded-[32px] p-10 shadow-sm" :style="{ backgroundColor: c.card }">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center" :style="{ backgroundColor: `${c.accent}15` }">
              <span class="text-2xl">🎨</span>
            </div>
            <h2 class="text-[2rem] leading-tight" style="font-family:'DM Serif Display',serif" :style="{ color: c.text }">Préférences d'Affichage</h2>
          </div>

          <div class="mb-8">
            <label class="block text-base font-semibold mb-4" style="font-family:Inter,sans-serif" :style="{ color: c.text }">Thème de l'application</label>
            <p class="text-sm mb-5" :style="{ color: c.textSecondary }">Choisissez votre palette de couleurs préférée pour personnaliser votre expérience</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="theme in themes"
                :key="theme.id"
                class="cursor-pointer rounded-[24px] p-6 transition-all relative overflow-hidden"
                :style="{
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  borderColor: selectedTheme === theme.id ? theme.colors.accent : '#E5E5E5',
                  backgroundColor: theme.colors.bg,
                  color: theme.colors.text,
                }"
                @click="selectedTheme = theme.id"
              >
                <div
                  v-if="selectedTheme === theme.id"
                  class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  :style="{ backgroundColor: theme.colors.accent }"
                >
                  <Check :size="16" class="text-white" />
                </div>
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-3xl">{{ theme.emoji }}</span>
                  <h3 class="text-lg font-bold" :style="{ color: theme.colors.text }">{{ theme.name }}</h3>
                </div>
                <p class="text-sm mb-4" :style="{ color: theme.colors.text, opacity: 0.7 }">{{ theme.description }}</p>

                <div class="space-y-2">
                  <div class="h-16 rounded-[12px] p-3 flex items-center gap-2" :style="{ backgroundColor: theme.colors.card }">
                    <div class="w-8 h-8 rounded-full" :style="{ backgroundColor: theme.colors.accent }" />
                    <div class="flex-1">
                      <div class="h-2 rounded-full mb-1" :style="{ backgroundColor: theme.colors.text, opacity: 0.3, width: '60%' }" />
                      <div class="h-2 rounded-full" :style="{ backgroundColor: theme.colors.text, opacity: 0.2, width: '40%' }" />
                    </div>
                  </div>
                  <div class="flex gap-1.5">
                    <div class="h-6 flex-1 rounded-[8px]" :style="{ backgroundColor: theme.colors.bg }" />
                    <div class="h-6 flex-1 rounded-[8px]" :style="{ backgroundColor: theme.colors.card }" />
                    <div class="h-6 flex-1 rounded-[8px]" :style="{ backgroundColor: theme.colors.accent }" />
                    <div class="h-6 flex-1 rounded-[8px]" :style="{ backgroundColor: theme.colors.text }" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-base font-semibold mb-3" style="font-family:Inter,sans-serif" :style="{ color: c.text }">Langue de l'interface</label>
            <select class="w-full md:w-auto px-6 py-3 rounded-[16px] border-2 focus:outline-none font-medium" :style="{ backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text }">
              <option>Français (Suisse)</option>
              <option>Deutsch (Schweiz)</option>
              <option>Italiano (Svizzera)</option>
            </select>
          </div>
        </section>

        <!-- Section 3: Calendrier -->
        <section class="rounded-[32px] p-10 shadow-sm" :style="{ backgroundColor: c.card }">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center" :style="{ backgroundColor: `${c.accent}15` }">
              <Calendar :size="24" :style="{ color: c.accent }" />
            </div>
            <h2 class="text-[2rem] leading-tight" style="font-family:'DM Serif Display',serif" :style="{ color: c.text }">Synchronisation & Calendrier</h2>
          </div>

          <div class="p-6 rounded-[20px]" :style="{ backgroundColor: selectedTheme === 'nuit' ? 'rgba(15, 23, 42, 0.6)' : '#FFF4E6' }">
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-bold text-lg" :style="{ color: c.text }">Google Calendar</h3>
                  <div class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Connecté</div>
                </div>
                <p class="text-sm" :style="{ color: c.textSecondary }">Synchronisé il y a 5 minutes • marc.renaud@gmail.com</p>
              </div>
            </div>
            <div class="flex gap-3">
              <button class="px-6 py-3 rounded-[16px] font-semibold text-white" :style="{ backgroundColor: c.accent }">Forcer la synchronisation</button>
              <button class="px-6 py-3 border-2 rounded-[16px] font-semibold" :style="{ backgroundColor: c.card, borderColor: c.inputBorder, color: c.text }">Déconnecter</button>
            </div>
          </div>
        </section>

        <!-- Section 4: Notifications -->
        <section class="rounded-[32px] p-10 shadow-sm" :style="{ backgroundColor: c.card }">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center" :style="{ backgroundColor: `${c.accent}15` }">
              <Bell :size="24" :style="{ color: c.accent }" />
            </div>
            <h2 class="text-[2rem] leading-tight" style="font-family:'DM Serif Display',serif" :style="{ color: c.text }">Notifications & Alertes</h2>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between p-5 rounded-[20px] transition-all" :style="{ backgroundColor: selectedTheme === 'nuit' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(0, 0, 0, 0.02)' }">
              <div class="flex-1">
                <h3 class="font-semibold text-base mb-1" :style="{ color: c.text }">Nouvelles offres par Email</h3>
                <p class="text-sm" :style="{ color: c.textSecondary }">Recevoir les nouvelles offres de remplacement par email</p>
              </div>
              <ToggleSwitch v-model:checked="emailNotif" :accent-color="c.accent" />
            </div>

            <div class="flex items-center justify-between p-5 rounded-[20px] transition-all" :style="{ backgroundColor: selectedTheme === 'nuit' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(0, 0, 0, 0.02)' }">
              <div class="flex-1">
                <h3 class="font-semibold text-base mb-1" :style="{ color: c.text }">Alertes SMS urgentes</h3>
                <p class="text-sm" :style="{ color: c.textSecondary }">M'alerter par SMS en cas de remplacement de dernière minute</p>
              </div>
              <ToggleSwitch v-model:checked="smsNotif" :accent-color="c.accent" />
            </div>

            <div class="flex items-center justify-between p-5 rounded-[20px] transition-all" :style="{ backgroundColor: selectedTheme === 'nuit' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(0, 0, 0, 0.02)' }">
              <div class="flex-1">
                <h3 class="font-semibold text-base mb-1" :style="{ color: c.text }">Notifications push</h3>
                <p class="text-sm" :style="{ color: c.textSecondary }">Recevoir les nouveaux messages dans le chat en temps réel</p>
              </div>
              <ToggleSwitch v-model:checked="pushNotif" :accent-color="c.accent" />
            </div>
          </div>
        </section>

        <!-- Section 5: Sécurité -->
        <section class="rounded-[32px] p-10 shadow-sm" :style="{ backgroundColor: c.card }">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center" :style="{ backgroundColor: `${c.accent}15` }">
              <Lock :size="24" :style="{ color: c.accent }" />
            </div>
            <h2 class="text-[2rem] leading-tight" style="font-family:'DM Serif Display',serif" :style="{ color: c.text }">Sécurité & Support</h2>
          </div>

          <div class="space-y-4">
            <button class="w-full px-6 py-4 border-2 rounded-[20px] font-semibold flex items-center justify-center gap-3" :style="{ backgroundColor: c.card, borderColor: c.inputBorder, color: c.text }">
              <Lock :size="20" />
              Modifier le mot de passe
            </button>
            <button class="w-full px-6 py-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-[20px] font-semibold flex items-center justify-center gap-3 hover:bg-red-100">
              <Trash2 :size="20" />
              Supprimer mon compte
            </button>
          </div>
        </section>

        <!-- Save -->
        <div class="sticky bottom-8 flex justify-center">
          <button class="px-12 py-5 text-white rounded-[24px] text-lg font-bold shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95" :style="{ backgroundColor: c.accent }">
            <Save :size="24" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Bell, Calendar, Lock, Trash2, Save, Camera, Check } from 'lucide-vue-next'
import Footer from '../components/Footer.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'
import DropdownSelect from '../components/DropdownSelect.vue'
import { useTheme, type ThemeId } from '../composables/useTheme'

interface ThemeColors {
  bg: string
  card: string
  text: string
  textSecondary: string
  accent: string
}

interface Theme {
  id: ThemeId
  name: string
  description: string
  colors: ThemeColors
}

// Preview palettes shown on each selectable card. These mirror the global
// theme definitions in styles/theme.css so the previews match the real themes.
const themes: Theme[] = [
  { id: 'creme', name: 'Papier Crème', description: 'Ton clair doux et reposant', colors: { bg: '#FFFEF9', card: '#FFFFFF', text: '#1A1A1A', textSecondary: '#6B6B6B', accent: '#FD4401' } },
  { id: 'nuit', name: 'Nuit Chaude', description: 'Sombre et chaleureux, repose les yeux', colors: { bg: '#14100D', card: '#211B16', text: '#F2EDE4', textSecondary: '#B5A99A', accent: '#FF5A1F' } },
  { id: 'foret', name: 'Forêt Romande', description: 'Nature et sérénité', colors: { bg: '#F0F4F0', card: '#FFFFFF', text: '#1F3A2E', textSecondary: '#4A6B5A', accent: '#B8621B' } },
  { id: 'lavande', name: 'Lavande Douce', description: 'Relaxant et élégant', colors: { bg: '#F5F3F7', card: '#FFFFFF', text: '#3D2557', textSecondary: '#6B4A8C', accent: '#7C3F8C' } },
  { id: 'vaud', name: 'État de Vaud', description: 'Vert et blanc officiels du canton', colors: { bg: '#F4F8F5', card: '#FFFFFF', text: '#14201A', textSecondary: '#4F6157', accent: '#00843D' } },
]

const { currentTheme, setTheme } = useTheme()

const lang = ref('Français (Suisse)')
const emailNotif = ref(true)
const smsNotif = ref(false)
const pushNotif = ref(true)

// Toggle switches follow the active theme's accent
const accentColor = computed(
  () => themes.find((t) => t.id === currentTheme.value)?.colors.accent ?? '#FD4401',
)

const doodles: Doodle[] = [
  // left gutter
  { name: 'rainbow-fine', top: '18%', left: '3%', size: 80, opacity: 0.45 },
  { name: 'triangle', top: '46%', left: '4%', size: 46, opacity: 0.45 },
  { name: 'bars', top: '72%', left: '4%', size: 56, opacity: 0.4 },
  // right gutter
  { name: 'leaf-branch', top: '14%', right: '4%', size: 74, opacity: 0.45 },
  { name: 'swirl-line', top: '42%', right: '5%', size: 72, opacity: 0.4 },
  { name: 'flower-blue', top: '68%', right: '5%', size: 46, opacity: 0.45 },
  { name: 'sunrise', bottom: '8%', right: '6%', size: 76, opacity: 0.4 },
]
</script>

<template>
  <div class="bg-background" style="min-height:100vh; overflow-x:hidden; position:relative;">
    <DoodleBackground :items="doodles" />

    <div class="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-[clamp(2.25rem,7vw,3.5rem)] mb-3 leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
          Réglages du <span class="text-primary">compte</span>
        </h1>
        <p class="text-lg text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
      </div>

      <div class="space-y-8">
        <!-- Section 1: Profil -->
        <section class="rounded-[32px] p-6 sm:p-10 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
              <User :size="24" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.5rem,5vw,2rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">Profil & Identité</h2>
          </div>

          <div class="flex flex-col md:flex-row gap-8 mb-8">
            <div class="flex flex-col items-center">
              <div class="relative">
                <div class="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold bg-primary">MR</div>
                <button class="absolute bottom-0 right-0 w-10 h-10 rounded-full shadow-lg flex items-center justify-center border-2 bg-card border-border">
                  <Camera :size="18" class="text-primary" />
                </button>
              </div>
              <div class="mt-4 px-4 py-2 rounded-[12px] bg-green-50 flex items-center gap-2">
                <Check :size="16" class="text-green-600" />
                <span class="text-sm font-semibold text-green-700">Profil vérifié DIP</span>
              </div>
            </div>

            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold mb-2 text-foreground" style="font-family:Inter,sans-serif">Prénom</label>
                <input type="text" value="Marc" class="w-full px-4 py-3 rounded-[16px] border-2 border-border bg-input-background text-foreground focus:outline-none focus:border-primary transition-all" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-foreground" style="font-family:Inter,sans-serif">Nom</label>
                <input type="text" value="Renaud" class="w-full px-4 py-3 rounded-[16px] border-2 border-border bg-input-background text-foreground focus:outline-none focus:border-primary transition-all" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-foreground" style="font-family:Inter,sans-serif">Email</label>
                <input type="email" value="marc.renaud@exemple.ch" class="w-full px-4 py-3 rounded-[16px] border-2 border-border bg-input-background text-foreground focus:outline-none focus:border-primary transition-all" />
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2 text-foreground" style="font-family:Inter,sans-serif">Téléphone</label>
                <input type="tel" value="+41 79 123 45 67" class="w-full px-4 py-3 rounded-[16px] border-2 border-border bg-input-background text-foreground focus:outline-none focus:border-primary transition-all" />
              </div>
            </div>
          </div>
        </section>

        <!-- Section 2: Affichage & Thème -->
        <section class="rounded-[32px] p-6 sm:p-10 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
              <span class="text-2xl"></span>
            </div>
            <h2 class="text-[clamp(1.5rem,5vw,2rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">Préférences d'Affichage</h2>
          </div>

          <div class="mb-8">
            <label class="block text-base font-semibold mb-4 text-foreground" style="font-family:Inter,sans-serif">Thème de l'application</label>
            <p class="text-sm mb-5 text-muted-foreground">Choisissez votre palette de couleurs préférée — elle s'applique à toute l'application</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="theme in themes"
                :key="theme.id"
                class="cursor-pointer rounded-[24px] p-6 transition-all relative overflow-hidden"
                :style="{
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  borderColor: currentTheme === theme.id ? theme.colors.accent : 'rgba(128,128,128,0.25)',
                  backgroundColor: theme.colors.bg,
                  color: theme.colors.text,
                }"
                @click="setTheme(theme.id)"
              >
                <div
                  v-if="currentTheme === theme.id"
                  class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  :style="{ backgroundColor: theme.colors.accent }"
                >
                  <Check :size="16" class="text-white" />
                </div>
                <div class="flex items-center gap-3 mb-3">
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
            <label class="block text-base font-semibold mb-3 text-foreground" style="font-family:Inter,sans-serif">Langue de l'interface</label>
            <div class="w-full md:w-72">
              <DropdownSelect v-model="lang" :options="['Français (Suisse)', 'Deutsch (Schweiz)', 'Italiano (Svizzera)']" aria-label="Langue" />
            </div>
          </div>
        </section>

        <!-- Section 3: Calendrier -->
        <section class="rounded-[32px] p-6 sm:p-10 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
              <Calendar :size="24" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.5rem,5vw,2rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">Synchronisation & Calendrier</h2>
          </div>

          <div class="p-6 rounded-[20px] bg-muted">
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-bold text-lg text-foreground">Google Calendar</h3>
                  <div class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Connecté</div>
                </div>
                <p class="text-sm text-muted-foreground">Synchronisé il y a 5 minutes • marc.renaud@gmail.com</p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <button class="px-6 py-3 rounded-[16px] font-semibold text-primary-foreground bg-primary">Forcer la synchronisation</button>
              <button class="px-6 py-3 border-2 rounded-[16px] font-semibold bg-card border-border text-foreground">Déconnecter</button>
            </div>
          </div>
        </section>

        <!-- Section 4: Notifications -->
        <section class="rounded-[32px] p-6 sm:p-10 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
              <Bell :size="24" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.5rem,5vw,2rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">Notifications & Alertes</h2>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between gap-4 p-5 rounded-[20px] bg-foreground/5 transition-all">
              <div class="flex-1">
                <h3 class="font-semibold text-base mb-1 text-foreground">Nouvelles offres par Email</h3>
                <p class="text-sm text-muted-foreground">Recevoir les nouvelles offres de remplacement par email</p>
              </div>
              <ToggleSwitch v-model:checked="emailNotif" :accent-color="accentColor" />
            </div>

            <div class="flex items-center justify-between gap-4 p-5 rounded-[20px] bg-foreground/5 transition-all">
              <div class="flex-1">
                <h3 class="font-semibold text-base mb-1 text-foreground">Alertes SMS urgentes</h3>
                <p class="text-sm text-muted-foreground">M'alerter par SMS en cas de remplacement de dernière minute</p>
              </div>
              <ToggleSwitch v-model:checked="smsNotif" :accent-color="accentColor" />
            </div>

            <div class="flex items-center justify-between gap-4 p-5 rounded-[20px] bg-foreground/5 transition-all">
              <div class="flex-1">
                <h3 class="font-semibold text-base mb-1 text-foreground">Notifications push</h3>
                <p class="text-sm text-muted-foreground">Recevoir les nouveaux messages dans le chat en temps réel</p>
              </div>
              <ToggleSwitch v-model:checked="pushNotif" :accent-color="accentColor" />
            </div>
          </div>
        </section>

        <!-- Section 5: Sécurité -->
        <section class="rounded-[32px] p-6 sm:p-10 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
              <Lock :size="24" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.5rem,5vw,2rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">Sécurité & Support</h2>
          </div>

          <div class="space-y-4">
            <button class="w-full px-6 py-4 border-2 rounded-[20px] font-semibold flex items-center justify-center gap-3 bg-card border-border text-foreground">
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
          <button class="px-12 py-5 text-primary-foreground bg-primary rounded-[24px] text-lg font-bold shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
            <Save :size="24" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

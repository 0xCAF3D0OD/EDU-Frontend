<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import CroppedIcon from '../components/CroppedIcon.vue'
import illustrationSet1 from '../imports/illustrationSet1.png'
import illustrationSet2 from '../imports/illustrationSet2.png'

const showPassword = ref(false)

const decorations = [
  { set: illustrationSet1, row: 0, col: 4, size: 120, opacity: 0.3, pos: 'top-20 left-20' },
  { set: illustrationSet2, row: 1, col: 6, size: 100, opacity: 0.25, pos: 'top-40 right-32' },
  { set: illustrationSet1, row: 5, col: 2, size: 140, opacity: 0.2, pos: 'bottom-32 left-40' },
  { set: illustrationSet2, row: 6, col: 9, size: 110, opacity: 0.3, pos: 'bottom-20 right-20' },
  { set: illustrationSet1, row: 3, col: 7, size: 90, opacity: 0.18, pos: 'top-1/2 left-1/3' },
  { set: illustrationSet2, row: 4, col: 4, size: 130, opacity: 0.22, pos: 'top-1/3 right-1/4' },
  { set: illustrationSet1, row: 2, col: 8, size: 95, opacity: 0.2, pos: 'top-1/4 left-1/2' },
  { set: illustrationSet2, row: 5, col: 1, size: 115, opacity: 0.25, pos: 'bottom-1/3 right-1/3' },
]
</script>

<template>
  <div style="min-height:100vh; overflow:auto; background:var(--background); display:flex;">

    <!-- Left: visual -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 bg-muted">
      <div
        v-for="(deco, i) in decorations"
        :key="i"
        class="absolute pointer-events-none"
        :class="deco.pos"
      >
        <CroppedIcon :image-url="deco.set" :row="deco.row" :col="deco.col" :size="deco.size" :opacity="deco.opacity" />
      </div>

      <div class="relative z-10 text-center max-w-md">
        <h1 class="text-[clamp(2.5rem,8vw,4.5rem)] mb-6 leading-[1.1]" style="font-family:'DM Serif Display',serif">
          Trouvez votre prochain
          <br />
          <span class="text-primary">remplacement</span>
          <br />
          en un clic
        </h1>
        <p class="text-[1.2rem] text-foreground/70" style="font-family:Inter,sans-serif">
          La plateforme qui connecte enseignants et remplaçants en Suisse romande
        </p>
      </div>
    </div>

    <!-- Right: form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
      <div class="w-full max-w-md">
        <div class="mb-12 text-center lg:text-left">
          <h2 class="text-[clamp(1.75rem,5vw,2.5rem)] mb-2" style="font-family:'DM Serif Display',serif">
            Allo <span class="text-primary">Remplaçant</span>
          </h2>
          <p class="text-foreground/60">Bienvenue ! Connectez-vous pour continuer</p>
        </div>

        <!-- OAuth -->
        <div class="space-y-3 mb-8">
          <button class="w-full py-4 px-6 bg-card border-2 border-foreground/10 rounded-[20px] font-semibold flex items-center justify-center gap-3 transition-all hover:border-primary/20">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          <button class="w-full py-4 px-6 bg-card border-2 border-foreground/10 rounded-[20px] font-semibold flex items-center justify-center gap-3 transition-all hover:border-primary/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continuer avec Apple
          </button>

          <button class="w-full py-4 px-6 bg-card border-2 border-foreground/10 rounded-[20px] font-semibold flex items-center justify-center gap-3 transition-all hover:border-primary/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00A4EF">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
            </svg>
            Continuer avec Microsoft
          </button>
        </div>

        <!-- Separator -->
        <div class="relative mb-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-foreground/10"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-background text-foreground/60">ou continuer avec votre email</span>
          </div>
        </div>

        <!-- Email/password -->
        <form class="space-y-5" @submit.prevent>
          <div>
            <label class="block text-sm font-semibold mb-2" style="font-family:Inter,sans-serif">Adresse email</label>
            <div class="relative">
              <Mail :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                placeholder="votre.email@exemple.ch"
                class="w-full pl-12 pr-4 py-4 rounded-[16px] border-2 border-foreground/10 focus:border-primary focus:outline-none transition-all"
                style="font-family:Inter,sans-serif"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2" style="font-family:Inter,sans-serif">Mot de passe</label>
            <div class="relative">
              <Lock :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-12 pr-12 py-4 rounded-[16px] border-2 border-foreground/10 focus:border-primary focus:outline-none transition-all"
                style="font-family:Inter,sans-serif"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" :size="20" />
                <Eye v-else :size="20" />
              </button>
            </div>
            <div class="text-right mt-2">
              <a href="#" class="text-sm text-primary hover:underline font-medium">Mot de passe oublié ?</a>
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-4 bg-primary text-primary-foreground rounded-[20px] text-base font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Se connecter
          </button>
        </form>

        <div class="text-center mt-8">
          <p class="text-foreground/70">
            Pas encore inscrit ?
            <a href="#" class="text-primary font-semibold hover:underline">Créer un compte</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

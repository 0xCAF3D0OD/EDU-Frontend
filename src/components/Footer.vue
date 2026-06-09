<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Mail, MapPin } from 'lucide-vue-next'
import alloBubble from '../assets/allo-bubble.svg'
import alloOrange from '../assets/allo-orange.svg'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const year = new Date().getFullYear()
const socials = ['LinkedIn', 'Twitter', 'Facebook']
const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Missions', to: '/missions' },
  { label: 'À propos', to: '/about' },
  { label: 'Contact', to: '#' },
]
const legalLinks = ['Mentions légales', 'Confidentialité', 'CGU']
</script>

<template>
  <footer class="relative z-10 bg-muted border-t border-border/50 py-20 px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <RouterLink to="/" class="flex items-center gap-3 mb-6 w-fit group">
            <img :src="isDark ? alloOrange : alloBubble" alt="allô" class="h-12 w-auto transition-transform duration-300 group-hover:-rotate-3" />
            <span class="text-[1.5rem] font-semibold text-primary" style="font-family:'DM Serif Display',serif;letter-spacing:-0.01em">
              Remplaçant
            </span>
          </RouterLink>
          <p class="text-foreground/60 mb-6 max-w-md leading-relaxed" style="font-family:Inter,sans-serif">
            La plateforme qui simplifie la recherche de remplaçants pour les établissements scolaires en Suisse romande.
          </p>
          <div class="flex gap-4">
            <a
              v-for="social in socials"
              :key="social"
              href="#"
              class="w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-white transition-colors bg-foreground/10"
            >
              {{ social.charAt(0) }}
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="font-semibold mb-5 text-foreground" style="font-family:Inter,sans-serif">Navigation</h4>
          <ul class="space-y-3">
            <li v-for="link in navLinks" :key="link.label">
              <RouterLink :to="link.to" class="text-foreground/60 hover:text-accent-cta transition-colors" style="font-family:Inter,sans-serif">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-semibold mb-5 text-foreground" style="font-family:Inter,sans-serif">Contact</h4>
          <ul class="space-y-4">
            <li class="flex items-start gap-3 text-foreground/60" style="font-family:Inter,sans-serif">
              <Mail :size="18" class="mt-1 flex-shrink-0" />
              <span>kevin.dinocera@protonmail.com</span>
            </li>
            <li class="flex items-start gap-3 text-foreground/60" style="font-family:Inter,sans-serif">
              <MapPin :size="18" class="mt-1 flex-shrink-0" />
              <span>Lausanne, Suisse</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-foreground/65" style="font-family:Inter,sans-serif">
          © {{ year }} alloremplacement. Tous droits réservés.
        </p>
        <div class="flex gap-6">
          <a v-for="link in legalLinks" :key="link" href="#" class="text-sm text-foreground/65 hover:text-accent-cta transition-colors" style="font-family:Inter,sans-serif">
            {{ link }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { Menu, X, ChevronDown } from 'lucide-vue-next'
import Lenis from 'lenis'
import FloatingShapes from './FloatingShapes.vue'
import ThemeToggle from './ThemeToggle.vue'
import alloBubble from '../assets/allo-bubble.svg'
import alloOrange from '../assets/allo-orange.svg'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()
const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)
const moreOpen = ref(false)
const moreRef = ref<HTMLElement | null>(null)

// Primary links shown inline; secondary links grouped under the "Plus" menu
const primaryLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/missions', label: 'Missions' },
  { to: '/expertise', label: 'Expertise' },
  { to: '/dashboard', label: 'Tableau de bord' },
  { to: '/messages', label: 'Messages' },
]
const moreLinks = [
  { to: '/create-profile', label: 'Créer un profil' },
  { to: '/settings', label: 'Réglages' },
  { to: '/about', label: 'À propos' },
]

function isActive(to: string) {
  return route.path === to
}
const moreActive = computed(() => moreLinks.some((l) => isActive(l.to)))

// Close menus on navigation
watch(() => route.path, () => {
  mobileOpen.value = false
  moreOpen.value = false
})

const lenisRef = ref<Lenis | null>(null)
let rafId: number | null = null

const navBg = computed(() => (scrolled.value ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)'))
const navBorder = computed(() =>
  scrolled.value ? '1px solid var(--nav-border)' : '1px solid transparent',
)

function handleScroll() {
  scrolled.value = window.scrollY > 50
}
function handleDocClick(e: MouseEvent) {
  if (moreRef.value && !moreRef.value.contains(e.target as Node)) moreOpen.value = false
}

onMounted(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  })
  lenisRef.value = lenis
  function raf(time: number) {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', handleDocClick)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  lenisRef.value?.destroy()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleDocClick)
})
</script>

<template>
  <div style="min-height:100vh; position:relative;">
    <FloatingShapes />

    <!-- Glassmorphism Navigation -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :style="{
        backgroundColor: navBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: navBorder,
      }"
    >
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-4 relative">
        <!-- Logo: "allô" speech bubble + Remplaçant, links home -->
        <RouterLink to="/" class="min-w-0 shrink-0" aria-label="Accueil — Allô Remplaçant">
          <div class="flex items-center gap-2 sm:gap-3 group">
            <img
              :src="isDark ? alloOrange : alloBubble"
              alt="allô"
              class="h-10 sm:h-14 w-auto shrink-0 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
            />
            <span
              class="text-[1.05rem] sm:text-[1.55rem] font-semibold text-primary leading-none"
              style="font-family:'DM Serif Display',serif;letter-spacing:-0.01em"
            >
              Remplaçant
            </span>
          </div>
        </RouterLink>

        <!-- Desktop nav links -->
        <div class="hidden xl:flex items-center gap-6">
          <RouterLink v-for="link in primaryLinks" :key="link.to" :to="link.to">
            <div class="relative cursor-pointer group transition-transform hover:-translate-y-0.5">
              <span
                class="text-base font-medium transition-colors"
                :class="isActive(link.to) ? 'text-primary' : 'text-foreground/80 group-hover:text-primary'"
              >
                {{ link.label }}
              </span>
              <div
                v-if="isActive(link.to)"
                class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
              />
            </div>
          </RouterLink>

          <!-- "Plus" dropdown -->
          <div ref="moreRef" class="relative">
            <button
              class="flex items-center gap-1 text-base font-medium transition-colors"
              :class="moreActive || moreOpen ? 'text-primary' : 'text-foreground/80 hover:text-primary'"
              :aria-expanded="moreOpen"
              @click="moreOpen = !moreOpen"
            >
              Plus
              <ChevronDown :size="16" class="transition-transform" :class="moreOpen ? 'rotate-180' : ''" />
            </button>
            <Transition name="dropdown">
              <div
                v-if="moreOpen"
                class="absolute right-0 top-full mt-3 w-56 rounded-[18px] border border-border shadow-xl p-2"
                :style="{ backgroundColor: 'var(--nav-bg-scrolled)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }"
              >
                <RouterLink
                  v-for="l in moreLinks"
                  :key="l.to"
                  :to="l.to"
                  class="block px-4 py-2.5 rounded-[12px] text-sm font-medium transition-colors"
                  :class="isActive(l.to) ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:bg-foreground/5'"
                >
                  {{ l.label }}
                </RouterLink>
              </div>
            </Transition>
          </div>

          <ThemeToggle />

          <RouterLink to="/login">
            <button
              class="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Connexion
            </button>
          </RouterLink>
        </div>

        <!-- Mobile controls -->
        <div class="flex items-center gap-2 xl:hidden shrink-0">
          <ThemeToggle />
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors"
            :aria-expanded="mobileOpen"
            aria-label="Menu"
            @click="mobileOpen = !mobileOpen"
          >
            <X v-if="mobileOpen" :size="24" />
            <Menu v-else :size="24" />
          </button>
        </div>
      </div>

      <!-- Mobile menu panel -->
      <Transition name="mobile-menu">
        <div
          v-if="mobileOpen"
          class="xl:hidden border-t border-border max-h-[80vh] overflow-y-auto"
          :style="{ backgroundColor: 'var(--nav-bg-scrolled)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }"
        >
          <div class="px-5 py-4 flex flex-col gap-1">
            <RouterLink
              v-for="link in primaryLinks"
              :key="link.to"
              :to="link.to"
              class="px-4 py-3 rounded-[16px] text-base font-medium transition-colors"
              :class="isActive(link.to) ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:bg-foreground/5'"
            >
              {{ link.label }}
            </RouterLink>

            <div class="mt-2 mb-1 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Plus</div>
            <RouterLink
              v-for="link in moreLinks"
              :key="link.to"
              :to="link.to"
              class="px-4 py-3 rounded-[16px] text-base font-medium transition-colors"
              :class="isActive(link.to) ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:bg-foreground/5'"
            >
              {{ link.label }}
            </RouterLink>

            <RouterLink to="/login" class="mt-3">
              <button
                class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full text-base font-medium shadow-lg"
              >
                Connexion
              </button>
            </RouterLink>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Page content -->
    <div class="pt-24">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

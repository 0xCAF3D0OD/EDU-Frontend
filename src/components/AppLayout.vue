<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import Lenis from 'lenis'
import FloatingShapes from './FloatingShapes.vue'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)

// Close the mobile menu whenever the route changes
watch(() => route.path, () => { mobileOpen.value = false })
const lenisRef = ref<Lenis | null>(null)
let rafId: number | null = null

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/missions', label: 'Missions' },
  { to: '/dashboard', label: 'Tableau de bord' },
  { to: '/messages', label: 'Messages' },
  { to: '/settings', label: 'Réglages' },
  { to: '/about', label: 'À propos' },
]

function isActive(to: string) {
  return route.path === to
}

const navBg = computed(() =>
  scrolled.value ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg)',
)
const navBorder = computed(() =>
  scrolled.value ? '1px solid var(--nav-border)' : '1px solid transparent',
)

function handleScroll() {
  scrolled.value = window.scrollY > 50
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
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  lenisRef.value?.destroy()
  window.removeEventListener('scroll', handleScroll)
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
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4 relative">
        <!-- Logo -->
        <RouterLink to="/" class="min-w-0">
          <div class="flex items-center gap-3 group">
            <div
              class="w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg]"
              style="background-color:#FD4401"
            >
              <span class="text-white text-lg font-semibold">A</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span
                class="text-[1.15rem] sm:text-[1.3rem] font-semibold text-primary leading-none truncate"
                style="font-family:Inter,sans-serif;letter-spacing:-0.02em"
              >
                Allo Remplaçant
              </span>
              <span class="hidden sm:block text-xs text-muted-foreground" style="font-family:Inter,sans-serif">
                Remplacements scolaires simplifiés
              </span>
            </div>
          </div>
        </RouterLink>

        <!-- Desktop nav links -->
        <div class="hidden lg:flex items-center gap-7 xl:gap-10">
          <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to">
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
        <div class="flex items-center gap-2 lg:hidden shrink-0">
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
          class="lg:hidden border-t border-border"
          :style="{ backgroundColor: 'var(--nav-bg-scrolled)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }"
        >
          <div class="px-5 py-4 flex flex-col gap-1">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="px-4 py-3 rounded-[16px] text-base font-medium transition-colors"
              :class="isActive(link.to) ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:bg-foreground/5'"
            >
              {{ link.label }}
            </RouterLink>
            <RouterLink to="/login" class="mt-2">
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
</style>

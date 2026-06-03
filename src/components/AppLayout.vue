<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import Lenis from 'lenis'
import FloatingShapes from './FloatingShapes.vue'

const route = useRoute()
const scrolled = ref(false)
const lenisRef = ref<Lenis | null>(null)
let rafId: number | null = null

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/missions', label: 'Missions' },
  { to: '/about', label: 'À propos' },
]

function isActive(to: string) {
  return route.path === to
}

const navBg = computed(() =>
  scrolled.value ? 'rgba(255, 254, 249, 0.95)' : 'rgba(255, 254, 249, 0.8)',
)
const navBorder = computed(() =>
  scrolled.value ? '1px solid rgba(253, 68, 1, 0.1)' : '1px solid transparent',
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
      <div class="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between relative">
        <!-- Logo -->
        <RouterLink to="/">
          <div class="flex items-center gap-3 group">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg]"
              style="background-color:#FD4401"
            >
              <span class="text-white text-lg font-semibold">A</span>
            </div>
            <div class="flex flex-col">
              <span
                class="text-[1.3rem] font-semibold text-primary leading-none"
                style="font-family:Inter,sans-serif;letter-spacing:-0.02em"
              >
                Allo Remplaçant
              </span>
              <span class="text-xs text-muted-foreground" style="font-family:Inter,sans-serif">
                Remplacements scolaires simplifiés
              </span>
            </div>
          </div>
        </RouterLink>

        <!-- Nav links -->
        <div class="flex items-center gap-10">
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

          <!-- CTA -->
          <button
            class="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Nous contacter
          </button>
        </div>
      </div>
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
</style>

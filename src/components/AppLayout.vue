<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import Lenis from 'lenis'
import FloatingShapes from './FloatingShapes.vue'

const lenisRef = ref<Lenis | null>(null)
let rafId: number | null = null

const navHovered = ref<string | null>(null)

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
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  lenisRef.value?.destroy()
})
</script>

<template>
  <div class="size-full">
    <FloatingShapes />

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div class="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <RouterLink to="/">
          <span
            class="text-[1.5rem] font-medium transition-transform inline-block hover:scale-105 hover:-rotate-2 active:scale-95"
          >
            <span class="text-primary">Maxima</span>
          </span>
        </RouterLink>

        <div class="flex gap-8">
          <RouterLink to="/">
            <span class="hover:text-primary transition-colors cursor-pointer inline-block hover:scale-105 hover:-translate-y-0.5 active:scale-95">
              Accueil
            </span>
          </RouterLink>
          <RouterLink to="/about">
            <span class="hover:text-primary transition-colors cursor-pointer inline-block hover:scale-105 hover:-translate-y-0.5 active:scale-95">
              À propos
            </span>
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <div class="pt-20">
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

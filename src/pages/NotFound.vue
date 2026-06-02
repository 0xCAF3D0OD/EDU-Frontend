<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { gsap } from 'gsap'
import AnimatedBlob from '../components/AnimatedBlob.vue'
import { Home, Search, Frown } from '@lucide/vue'

const sadIconRef = ref<HTMLElement | null>(null)
const num1Ref = ref<HTMLElement | null>(null)
const num2Ref = ref<HTMLElement | null>(null)
const emojiWrapRef = ref<HTMLElement | null>(null)

const floatingDots = [0, 60, 120, 180, 240, 300]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    // Spinning sad icon
    if (sadIconRef.value) {
      gsap.to(sadIconRef.value, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      })
    }

    // Wobbling 4s
    if (num1Ref.value) {
      gsap.to(num1Ref.value, {
        rotate: -5,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    }
    if (num2Ref.value) {
      gsap.to(num2Ref.value, {
        rotate: 5,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 0.1,
      })
    }

    // Floating emoji wrapper
    if (emojiWrapRef.value) {
      gsap.to(emojiWrapRef.value, {
        y: -20,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    }

    // Entrance animations
    gsap.from('.not-found-main', { opacity: 0, scale: 0.5, duration: 0.6, ease: 'back.out(1.7)' })
    gsap.from('.not-found-text', { opacity: 0, y: 30, duration: 0.6, delay: 0.3, ease: 'power2.out' })
    gsap.from('.not-found-buttons', { opacity: 0, y: 20, duration: 0.6, delay: 0.5, ease: 'power2.out' })
    gsap.from('.not-found-tip', { opacity: 0, duration: 0.6, delay: 0.8, ease: 'power2.out' })

    // Background blob animations
    gsap.to('.blob-top-left', { y: -40, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.to('.blob-top-right', { y: 40, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.to('.blob-bottom-left', { x: 30, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    gsap.to('.blob-bottom-right', { scale: 1.3, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
  })
})

onUnmounted(() => {
  ctx?.revert()
})

function dotX(angle: number, r = 80) {
  return Math.cos((angle * Math.PI) / 180) * r
}
function dotY(angle: number, r = 80) {
  return Math.sin((angle * Math.PI) / 180) * r
}

function onBtnHover(e: MouseEvent, rotate: number) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1.08, rotate, duration: 0.3, ease: 'back.out(1.7)' })
}
function onBtnLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, rotate: 0, duration: 0.3 })
}
function onBtnPress(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 0.92, duration: 0.1 })
}
function onBtnRelease(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, duration: 0.2, ease: 'back.out' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden px-8 bg-background">

    <!-- Background blobs -->
    <div class="blob-top-left absolute top-10 left-10 opacity-20">
      <AnimatedBlob color="#FDCB40" :size="130" />
    </div>
    <div class="blob-top-right absolute top-20 right-20 opacity-20">
      <AnimatedBlob color="#FD4401" :size="120" />
    </div>
    <div class="blob-bottom-left absolute bottom-20 left-1/4 opacity-15">
      <AnimatedBlob color="#FDCB40" :size="150" />
    </div>

    <div class="max-w-4xl mx-auto text-center z-10">

      <!-- 404 animated -->
      <div class="not-found-main mb-12">
        <div class="flex items-center justify-center gap-4 mb-6">
          <span
            ref="num1Ref"
            class="text-[10rem] leading-none"
            style="color: #FD4401"
          >4</span>

          <div ref="emojiWrapRef" class="relative">
            <div
              class="w-40 h-40 rounded-full flex items-center justify-center"
              style="background-color: #FDCB40"
            >
              <div ref="sadIconRef">
                <Frown :size="80" color="#FD4401" :stroke-width="2.5" />
              </div>
            </div>

            <!-- Floating dots -->
            <div
              v-for="(angle, i) in floatingDots"
              :key="angle"
              class="absolute w-4 h-4 rounded-full"
              :style="{
                backgroundColor: i % 2 === 0 ? '#FD4401' : '#FDCB40',
                top: '50%',
                left: '50%',
                transform: `translate(${dotX(angle)}px, ${dotY(angle)}px) translate(-50%, -50%)`,
              }"
            />
          </div>

          <span
            ref="num2Ref"
            class="text-[10rem] leading-none"
            style="color: #FD4401"
          >4</span>
        </div>
      </div>

      <!-- Text -->
      <div class="not-found-text">
        <h1 class="text-[3.5rem] mb-6">Oups ! Page introuvable</h1>
        <p class="text-[1.5rem] text-muted-foreground mb-12 max-w-2xl mx-auto">
          Il semblerait que cette page ait pris des vacances...
          ou qu'elle n'ait jamais existé !
        </p>
      </div>

      <!-- Buttons -->
      <div class="not-found-buttons flex flex-col sm:flex-row gap-6 justify-center">
        <RouterLink to="/">
          <button
            class="px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg shadow-xl flex items-center gap-3"
            @mouseenter="(e) => onBtnHover(e, -2)"
            @mouseleave="onBtnLeave"
            @mousedown="onBtnPress"
            @mouseup="onBtnRelease"
          >
            <Home :size="24" />
            Retour à l'accueil
          </button>
        </RouterLink>

        <button
          class="px-10 py-5 bg-secondary text-secondary-foreground rounded-full text-lg shadow-xl flex items-center gap-3"
          @mouseenter="(e) => onBtnHover(e, 2)"
          @mouseleave="onBtnLeave"
          @mousedown="onBtnPress"
          @mouseup="onBtnRelease"
        >
          <Search :size="24" />
          Rechercher
        </button>
      </div>

      <!-- Tip -->
      <p class="not-found-tip mt-16 text-muted-foreground text-lg">
        En attendant, pourquoi ne pas explorer notre
        <RouterLink to="/about" class="text-primary hover:underline">page À propos</RouterLink>
        ? 😊
      </p>
    </div>

    <!-- Bottom right blob -->
    <div class="blob-bottom-right absolute bottom-10 right-10 opacity-25">
      <AnimatedBlob color="#FD4401" :size="100" />
    </div>
  </div>
</template>

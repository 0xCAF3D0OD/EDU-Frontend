<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedBlob from '../components/AnimatedBlob.vue'
import { Sparkles, Heart, Zap, Circle } from '@lucide/vue'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref<HTMLElement | null>(null)
const featuresRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)

// Hero initial animations
const heroTitle = ref<HTMLElement | null>(null)
const heroParagraph = ref<HTMLElement | null>(null)
const heroButton = ref<HTMLElement | null>(null)

const featureItems = [
  { icon: Sparkles, title: 'Créativité', color: '#FDCB40' },
  { icon: Heart, title: 'Passion', color: '#FD4401' },
  { icon: Zap, title: 'Innovation', color: '#FDCB40' },
  { icon: Circle, title: 'Excellence', color: '#FD4401' },
]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    // Hero entrance animations
    if (heroTitle.value) {
      gsap.from(heroTitle.value, { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' })
    }
    if (heroParagraph.value) {
      gsap.from(heroParagraph.value, { opacity: 0, y: 20, duration: 0.8, delay: 0.2, ease: 'power2.out' })
    }
    if (heroButton.value) {
      gsap.from(heroButton.value, { opacity: 0, scale: 0.8, duration: 0.5, delay: 0.4, ease: 'back.out(1.7)' })
    }

    // Hero parallax
    if (heroRef.value) {
      const circles = heroRef.value.querySelectorAll('.parallax-circle')
      circles.forEach((circle, index) => {
        gsap.to(circle, {
          y: index % 2 === 0 ? -100 : 100,
          scrollTrigger: {
            trigger: heroRef.value,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
    }

    // Features stagger animation
    if (featuresRef.value) {
      const cards = featuresRef.value.querySelectorAll('.feature-card')
      gsap.fromTo(
        cards,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuresRef.value,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        },
      )
    }

    // Cards scale animation
    if (cardsRef.value) {
      const colorCards = cardsRef.value.querySelectorAll('.color-card')
      colorCards.forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
            },
          },
        )
      })
    }
  })
})

onUnmounted(() => {
  ctx?.revert()
})

// Feature card hover handlers
function onFeatureHover(e: MouseEvent, index: number) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, {
    y: -15,
    rotate: index % 2 === 0 ? 2 : -2,
    duration: 0.3,
    ease: 'power2.out',
  })
}

function onFeatureLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' })
}

function onIconHover(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { rotate: 360, duration: 0.6, ease: 'power2.out' })
}

function onIconLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { rotate: 0, duration: 0 })
}

function onCardHover(e: MouseEvent, rotate: number) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { scale: 1.03, rotate, duration: 0.3, ease: 'power2.out' })
}

function onCardLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' })
}

function onBtnHover(e: MouseEvent, rotate: number) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { scale: 1.08, rotate, duration: 0.3, ease: 'back.out(1.7)' })
}

function onBtnLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { scale: 1, rotate: 0, duration: 0.3, ease: 'back.out(1.7)' })
}

function onBtnPress(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { scale: 0.92, duration: 0.1 })
}

function onBtnRelease(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { scale: 1, duration: 0.2, ease: 'back.out' })
}
</script>

<template>
  <div class="size-full overflow-auto bg-background">

    <!-- Hero Section -->
    <section ref="heroRef" class="min-h-screen flex items-center justify-center relative overflow-hidden px-8">
      <div class="parallax-circle absolute top-20 left-20 opacity-30">
        <AnimatedBlob color="#FDCB40" :size="250" />
      </div>
      <div class="parallax-circle absolute bottom-32 right-32 opacity-30">
        <AnimatedBlob color="#FD4401" :size="200" />
      </div>

      <div class="max-w-6xl mx-auto text-center z-10">
        <div ref="heroTitle">
          <h1 class="text-[5rem] leading-[1.1] mb-8">
            Créons ensemble
            <br />
            <span class="text-primary">quelque chose d'unique</span>
          </h1>
        </div>

        <p
          ref="heroParagraph"
          class="text-[1.5rem] mb-12 max-w-3xl mx-auto text-muted-foreground"
        >
          Une expérience visuelle inspirée par la créativité et la couleur
        </p>

        <button
          ref="heroButton"
          class="px-12 py-6 bg-primary text-primary-foreground rounded-full text-lg shadow-xl transition-transform"
          @mouseenter="(e) => onBtnHover(e, 0)"
          @mouseleave="onBtnLeave"
          @mousedown="onBtnPress"
          @mouseup="onBtnRelease"
        >
          Découvrir
        </button>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresRef" class="py-32 px-8">
      <div class="max-w-7xl mx-auto">
        <h2
          class="text-center mb-20 text-[3.5rem] opacity-0"
          v-motion
          :initial="{ opacity: 0 }"
          :visibleOnce="{ opacity: 1, transition: { duration: 600 } }"
        >
          Notre approche
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(item, index) in featureItems"
            :key="item.title"
            class="feature-card bg-card rounded-[2rem] p-10 text-center shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
            @mouseenter="(e) => onFeatureHover(e, index)"
            @mouseleave="onFeatureLeave"
          >
            <div
              class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 cursor-pointer"
              :style="{ backgroundColor: item.color }"
              @mouseenter="onIconHover"
              @mouseleave="onIconLeave"
            >
              <component :is="item.icon" :size="40" color="white" />
            </div>
            <h3 class="text-[1.75rem] mb-4">{{ item.title }}</h3>
            <p class="text-muted-foreground">
              Un engagement fort pour créer des expériences exceptionnelles
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Colorful Cards Section -->
    <section ref="cardsRef" class="py-32 px-8 bg-muted/30">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-center mb-20 text-[3.5rem]">
          Nos réalisations
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            class="color-card rounded-[2rem] p-16 flex items-center justify-center min-h-[400px] cursor-pointer"
            style="background-color: #FDCB40"
            @mouseenter="(e) => onCardHover(e, -1)"
            @mouseleave="onCardLeave"
          >
            <div class="text-center">
              <h3 class="text-[3rem] mb-6 text-foreground">Design Audacieux</h3>
              <p class="text-[1.25rem] text-foreground/80">
                Des créations qui marquent les esprits
              </p>
            </div>
          </div>

          <div
            class="color-card rounded-[2rem] p-16 flex items-center justify-center min-h-[400px] cursor-pointer"
            style="background-color: #FD4401"
            @mouseenter="(e) => onCardHover(e, 1)"
            @mouseleave="onCardLeave"
          >
            <div class="text-center">
              <h3 class="text-[3rem] mb-6 text-white">Expérience Unique</h3>
              <p class="text-[1.25rem] text-white/90">
                Chaque projet est une aventure
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Footer Section -->
    <section class="py-24 px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-[3.5rem] mb-12">
          Prêt à commencer ?
        </h2>

        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            class="px-12 py-6 bg-primary text-primary-foreground rounded-full text-lg shadow-xl"
            @mouseenter="(e) => onBtnHover(e, -2)"
            @mouseleave="onBtnLeave"
            @mousedown="onBtnPress"
            @mouseup="onBtnRelease"
          >
            Contactez-nous
          </button>
          <button
            class="px-12 py-6 bg-secondary text-secondary-foreground rounded-full text-lg shadow-xl"
            @mouseenter="(e) => onBtnHover(e, 2)"
            @mouseleave="onBtnLeave"
            @mousedown="onBtnPress"
            @mouseup="onBtnRelease"
          >
            En savoir plus
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

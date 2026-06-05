<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { UserCheck, Clock, BookOpen } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import IllustratedIcon from '../components/IllustratedIcon.vue'
import CroppedIcon from '../components/CroppedIcon.vue'
import Footer from '../components/Footer.vue'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'
import illustrationSet1 from '../imports/illustrationSet1.png'
import illustrationSet2 from '../imports/illustrationSet2.png'

gsap.registerPlugin(ScrollTrigger)

// Edge-hugging so they stay clear of the centred hero text and section titles.
const doodles: Doodle[] = [
  // left gutter
  { name: 'leaf-sprig', top: '6%', left: '4%', size: 58, rotate: -6, opacity: 0.5 },
  { name: 'rainbow-mini', top: '22%', left: '3%', size: 60, opacity: 0.5 },
  { name: 'heart-line', top: '40%', left: '3%', size: 44, opacity: 0.5 },
  { name: 'rainbow', top: '58%', left: '4%', size: 72, opacity: 0.45 },
  { name: 'grass', top: '78%', left: '5%', size: 78, opacity: 0.4 },
  { name: 'splash', bottom: '4%', left: '10%', size: 48, opacity: 0.45 },
  // right gutter
  { name: 'tree', top: '8%', right: '4%', size: 82, opacity: 0.5 },
  { name: 'cloud-puffy', top: '26%', right: '3%', size: 66, opacity: 0.45 },
  { name: 'leaf3', top: '44%', right: '4%', size: 52, rotate: 8, opacity: 0.45 },
  { name: 'flowers', top: '62%', right: '5%', size: 60, opacity: 0.5 },
  { name: 'petal', top: '80%', right: '6%', size: 46, opacity: 0.5 },
  { name: 'sun-spark', bottom: '5%', right: '11%', size: 44, opacity: 0.55 },
]

const heroRef = ref<HTMLElement | null>(null)
const featuresRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)

const features = [
  { icon: BookOpen, title: 'Professionnels qualifiés', description: 'Tous nos remplaçants sont vérifiés et diplômés', color: '#FD4401' },
  { icon: Clock, title: 'Disponibilité immédiate', description: 'Trouvez un remplaçant en moins de 24h', color: '#FDCB40' },
  { icon: UserCheck, title: 'Gestion simplifiée', description: 'Gérez tous vos remplacements depuis une seule plateforme', color: '#FD4401' },
]

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    if (heroRef.value) {
      const circles = heroRef.value.querySelectorAll('.parallax-circle')
      circles.forEach((circle, index) => {
        gsap.to(circle, {
          y: index % 2 === 0 ? -100 : 100,
          scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: 1 },
        })
      })
    }
    if (featuresRef.value) {
      const cards = featuresRef.value.querySelectorAll('.feature-card')
      gsap.fromTo(cards, { y: 100, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.2,
        scrollTrigger: { trigger: featuresRef.value, start: 'top 70%', end: 'top 30%', scrub: 1 },
      })
    }
    if (cardsRef.value) {
      const colorCards = cardsRef.value.querySelectorAll('.color-card')
      colorCards.forEach((card) => {
        gsap.fromTo(card, { scale: 0.8, opacity: 0 }, {
          scale: 1, opacity: 1,
          scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 50%', scrub: 1 },
        })
      })
    }
  })
})

onUnmounted(() => ctx?.revert())

function onFeatureHover(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { y: -10, scale: 1.02, duration: 0.3, ease: 'power2.out' })
}
function onFeatureLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
}
function onCardHover(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1.02, duration: 0.3, ease: 'power2.out' })
}
function onCardLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, duration: 0.3, ease: 'power2.out' })
}
function onBtnHover(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1.05, duration: 0.3, ease: 'back.out(1.7)' })
}
function onBtnLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, duration: 0.3 })
}
function onBtnPress(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 0.95, duration: 0.1 })
}
function onBtnRelease(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, duration: 0.2, ease: 'back.out' })
}
</script>

<template>
  <div style="min-height:100vh; overflow-x:hidden; background:var(--background); position:relative;">
    <DoodleBackground :items="doodles" />

    <!-- Hero -->
    <section ref="heroRef" class="min-h-screen flex items-center justify-center relative overflow-hidden px-8">
      <div class="max-w-6xl mx-auto text-center relative z-10">
        <h1 class="text-[clamp(2.5rem,9vw,5.5rem)] leading-[1.05] mb-8" style="font-family:'DM Serif Display',serif">
          Trouvez votre remplaçant
          <br />
          <span class="text-primary">en un instant</span>
        </h1>

        <p
          class="text-[1.35rem] mb-14 max-w-3xl mx-auto text-foreground/70 leading-relaxed"
          style="font-family:Inter,sans-serif;font-weight:400"
        >
          La solution moderne qui connecte professionnels de l'enseignement et remplaçants qualifiés en quelques clics
        </p>

        <div class="flex flex-wrap gap-4 justify-center">
          <RouterLink to="/missions">
            <button
              class="px-10 py-4 bg-primary text-primary-foreground rounded-full text-base font-medium shadow-lg"
              @mouseenter="onBtnHover" @mouseleave="onBtnLeave" @mousedown="onBtnPress" @mouseup="onBtnRelease"
            >
              Voir les missions
            </button>
          </RouterLink>
          <RouterLink to="/about">
            <button
              class="px-10 py-4 bg-card text-foreground rounded-full text-base font-medium shadow-sm"
              style="border:2px solid var(--border)"
              @mouseenter="onBtnHover" @mouseleave="onBtnLeave" @mousedown="onBtnPress" @mouseup="onBtnRelease"
            >
              En savoir plus
            </button>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section ref="featuresRef" class="py-32 px-8 relative">
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-20">
          <span class="inline-block text-sm font-semibold text-primary mb-4 tracking-wide uppercase">
            Notre promesse
          </span>
          <h2 class="text-[clamp(2rem,7vw,3.8rem)] leading-tight" style="font-family:'DM Serif Display',serif">
            Simple, rapide, efficace
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div
            v-for="item in features"
            :key="item.title"
            class="feature-card bg-card rounded-[2.5rem] p-12 text-center border border-border/50 hover:border-primary/20 transition-all"
            @mouseenter="onFeatureHover" @mouseleave="onFeatureLeave"
          >
            <div class="flex justify-center mb-8">
              <IllustratedIcon :icon="item.icon" :color="item.color" class="w-28 h-28" />
            </div>
            <h3 class="text-[1.6rem] mb-4 font-semibold" style="font-family:Inter,sans-serif">{{ item.title }}</h3>
            <p class="text-foreground/60 text-[1.05rem] leading-relaxed" style="font-family:Inter,sans-serif">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works (color cards) -->
    <section ref="cardsRef" class="py-32 px-8 bg-muted/30 relative">
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center mb-20">
          <h2 class="text-[clamp(2rem,7vw,3.8rem)] leading-tight mb-6" style="font-family:'DM Serif Display',serif">
            Comment ça marche ?
          </h2>
          <p class="text-[1.2rem] text-foreground/60 max-w-2xl mx-auto" style="font-family:Inter,sans-serif">
            Trois étapes simples pour trouver le remplaçant idéal
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div
            class="color-card rounded-[3rem] p-16 flex flex-col justify-center min-h-[450px] cursor-pointer relative overflow-hidden"
            style="background-color:#FDCB40"
            @mouseenter="onCardHover" @mouseleave="onCardLeave"
          >
            <div class="absolute top-8 right-8">
              <CroppedIcon :image-url="illustrationSet1" :row="5" :col="6" :size="160" :opacity="0.15" />
            </div>
            <div class="absolute bottom-12 left-12">
              <CroppedIcon :image-url="illustrationSet2" :row="4" :col="2" :size="120" :opacity="0.1" />
            </div>
            <div class="relative z-10">
              <span class="inline-block text-7xl font-bold text-white/30 mb-4" style="font-family:'DM Serif Display',serif">01</span>
              <h3 class="text-[clamp(1.875rem,5.5vw,2.8rem)] mb-6 text-[#1A1A1A] leading-tight" style="font-family:'DM Serif Display',serif">
                Publiez votre annonce
              </h3>
              <p class="text-[1.2rem] text-[#1A1A1A]/70 leading-relaxed" style="font-family:Inter,sans-serif">
                Décrivez vos besoins en quelques clics : dates, spécialité, localisation
              </p>
            </div>
          </div>

          <div
            class="color-card rounded-[3rem] p-16 flex flex-col justify-center min-h-[450px] cursor-pointer relative overflow-hidden"
            style="background-color:#FD4401"
            @mouseenter="onCardHover" @mouseleave="onCardLeave"
          >
            <div class="absolute bottom-8 left-8">
              <CroppedIcon :image-url="illustrationSet2" :row="3" :col="3" :size="160" :opacity="0.15" />
            </div>
            <div class="absolute top-12 right-16">
              <CroppedIcon :image-url="illustrationSet1" :row="6" :col="7" :size="140" :opacity="0.1" />
            </div>
            <div class="relative z-10">
              <span class="inline-block text-7xl font-bold text-white/30 mb-4" style="font-family:'DM Serif Display',serif">02</span>
              <h3 class="text-[clamp(1.875rem,5.5vw,2.8rem)] mb-6 text-white leading-tight" style="font-family:'DM Serif Display',serif">
                Recevez des candidatures
              </h3>
              <p class="text-[1.2rem] text-white/85 leading-relaxed" style="font-family:Inter,sans-serif">
                Les professionnels disponibles vous contactent directement
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 px-8">
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <h2 class="text-[clamp(2.25rem,7.5vw,4rem)] mb-6 leading-tight" style="font-family:'DM Serif Display',serif">
          Rejoignez Allo Remplaçant
        </h2>
        <p class="text-[1.25rem] text-foreground/60 mb-12 max-w-2xl mx-auto" style="font-family:Inter,sans-serif">
          Plus de X professionnels de l'enseignement nous font confiance
        </p>
        <div class="flex flex-col sm:flex-row gap-5 justify-center">
          <RouterLink to="/create-profile">
            <button
              class="px-12 py-5 bg-primary text-primary-foreground rounded-full text-base font-medium shadow-xl"
              @mouseenter="onBtnHover" @mouseleave="onBtnLeave" @mousedown="onBtnPress" @mouseup="onBtnRelease"
            >
              Créer un compte gratuitement
            </button>
          </RouterLink>
          <button
            class="px-12 py-5 bg-card text-foreground rounded-full text-base font-medium shadow-lg"
            style="border:2px solid var(--border)"
            @mouseenter="onBtnHover" @mouseleave="onBtnLeave" @mousedown="onBtnPress" @mouseup="onBtnRelease"
          >
            Planifier une démo
          </button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped>
.spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

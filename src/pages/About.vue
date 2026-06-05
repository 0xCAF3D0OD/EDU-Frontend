<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Users, Target, Lightbulb, Rocket, Star, Award } from 'lucide-vue-next'
import AnimatedBlob from '../components/AnimatedBlob.vue'
import Footer from '../components/Footer.vue'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'

gsap.registerPlugin(ScrollTrigger)

const doodles: Doodle[] = [
  { name: 'firework', top: '8%', right: '6%', size: 80, opacity: 0.5 },
  { name: 'shootingstar', top: '26%', left: '4%', size: 84, rotate: -6, opacity: 0.5 },
  { name: 'flower', top: '52%', right: '5%', size: 56, opacity: 0.5 },
  { name: 'heart-orange', top: '70%', left: '6%', size: 50, opacity: 0.5 },
  { name: 'leaf', bottom: '20%', right: '12%', size: 70, opacity: 0.45 },
  { name: 'lollipop', bottom: '8%', left: '16%', size: 60, opacity: 0.5 },
]

const containerRef = ref<HTMLElement | null>(null)
const valuesRef = ref<HTMLElement | null>(null)
const teamRef = ref<HTMLElement | null>(null)
const blob1 = ref<HTMLElement | null>(null)
const blob2 = ref<HTMLElement | null>(null)
const blob3 = ref<HTMLElement | null>(null)
const starRef = ref<HTMLElement | null>(null)
const ctaBlob = ref<HTMLElement | null>(null)

let ctx: gsap.Context | null = null

const values = [
  { icon: Target, title: 'Notre Mission', text: "Garantir l'accès à l'enseignement en facilitant le remplacement dans les classes", color: '#FD4401' },
  { icon: Lightbulb, title: 'Notre Vision', text: 'Une plateforme où chaque professionnel trouve son remplaçant idéal', color: '#FDCB40' },
  { icon: Rocket, title: 'Notre Approche', text: 'Technologie moderne et service humain personnalisé', color: '#FD4401' },
]

const team = [
  { name: 'Hervé Di Nocera', role: 'Enseignant Français Histoire et Géographie', color: '#FD4401' },
  { name: 'Regina Di Nocera', role: 'Enseignante Allemand, mathématiques et sciences', color: '#FDCB40' },
  { name: 'Kevin Di Nocera', role: 'DevOps/plateform engineer', color: '#FD4401' },
  { name: 'İrem Doğantekin', role: 'Sportive de haut niveau', color: '#FDCB40' },
]

onMounted(() => {
  ctx = gsap.context(() => {
    if (starRef.value) {
      gsap.to(starRef.value, { rotate: 10, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }
    if (containerRef.value) {
      if (blob1.value) gsap.to(blob1.value, { y: -150, scrollTrigger: { trigger: containerRef.value, start: 'top top', end: 'bottom bottom', scrub: 1 } })
      if (blob2.value) gsap.to(blob2.value, { y: 150, scrollTrigger: { trigger: containerRef.value, start: 'top top', end: 'bottom bottom', scrub: 1 } })
      if (blob3.value) gsap.to(blob3.value, { y: -200, scrollTrigger: { trigger: containerRef.value, start: 'top top', end: 'bottom bottom', scrub: 1 } })
    }
    if (valuesRef.value) {
      const cards = valuesRef.value.querySelectorAll('.value-card')
      cards.forEach((card, index) => {
        gsap.fromTo(card, { y: 100, opacity: 0, rotation: index % 2 === 0 ? -5 : 5 }, {
          y: 0, opacity: 1, rotation: 0,
          scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 40%', scrub: 1 },
        })
      })
    }
    if (teamRef.value) {
      const members = teamRef.value.querySelectorAll('.team-member')
      gsap.fromTo(members, { y: 80, opacity: 0, scale: 0.8 }, {
        y: 0, opacity: 1, scale: 1, stagger: 0.15,
        scrollTrigger: { trigger: teamRef.value, start: 'top 70%', end: 'top 30%', scrub: 1 },
      })
    }
    const storyLeft = document.querySelector('.story-left')
    const storyRight = document.querySelector('.story-right')
    if (storyLeft) gsap.fromTo(storyLeft, { opacity: 0, x: -50 }, { opacity: 1, x: 0, scrollTrigger: { trigger: storyLeft, start: 'top 80%', end: 'top 50%', scrub: 1 } })
    if (storyRight) gsap.fromTo(storyRight, { opacity: 0, x: 50 }, { opacity: 1, x: 0, scrollTrigger: { trigger: storyRight, start: 'top 80%', end: 'top 50%', scrub: 1 } })
    const cta = document.querySelector('.cta-section')
    if (cta) gsap.fromTo(cta, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, scrollTrigger: { trigger: cta, start: 'top 80%', end: 'top 50%', scrub: 1 } })
  })

  if (ctaBlob.value) {
    gsap.to(ctaBlob.value, { scale: 1.2, rotate: 360, duration: 8, repeat: -1, ease: 'none' })
  }
})

onUnmounted(() => ctx?.revert())

function onValueHover(e: MouseEvent, index: number) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1.08, rotate: index % 2 === 0 ? 3 : -3, y: -10, duration: 0.3, ease: 'power2.out' })
}
function onValueLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, rotate: 0, y: 0, duration: 0.3, ease: 'power2.out' })
}
function onIconHover(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { rotate: 360, duration: 0.6, ease: 'power2.out' })
}
function onIconLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { rotate: 0, duration: 0 })
}
function onTeamHover(e: MouseEvent, index: number) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1.1, rotate: index % 2 === 0 ? 8 : -8, duration: 0.3, ease: 'power2.out' })
}
function onTeamLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' })
}
function onStoryHover(e: MouseEvent, r: number) {
  gsap.to(e.currentTarget as HTMLElement, { rotate: r, scale: 1.05, duration: 0.3, ease: 'power2.out' })
}
function onStoryLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { rotate: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
}
function onInnerHover(e: MouseEvent, r: number) {
  gsap.to(e.currentTarget as HTMLElement, { rotate: r, scale: 1.1, duration: 0.3, ease: 'power2.out' })
}
function onInnerLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { rotate: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
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
  <div ref="containerRef" style="min-height:100vh; overflow-x:hidden; background:var(--background); position:relative;">
    <DoodleBackground :items="doodles" />

    <!-- Hero -->
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden px-8">
      <div ref="blob1" class="absolute top-20 left-10 opacity-25">
        <AnimatedBlob color="#FDCB40" :size="380" />
      </div>
      <div ref="blob2" class="absolute bottom-20 right-20 opacity-25">
        <AnimatedBlob color="#FD4401" :size="260" />
      </div>

      <div class="max-w-5xl mx-auto text-center relative z-10">
        <div class="inline-block mb-8">
          <div ref="starRef">
            <Star :size="80" color="#FD4401" fill="#FDCB40" />
          </div>
        </div>
        <h1 class="text-[clamp(2.5rem,9vw,5.5rem)] leading-[1.05] mb-10" style="font-family:'DM Serif Display',serif">
          Notre mission,
          <br />
          <span class="text-primary">faciliter l'enseignement</span>
        </h1>
        <p class="text-[1.4rem] text-foreground/70 max-w-3xl mx-auto leading-relaxed" style="font-family:Inter,sans-serif;font-weight:400">
          Allo Remplaçant connecte les professionnels de l'enseignement avec des remplaçants qualifiés pour assurer la continuité des classes
        </p>
      </div>
    </section>

    <!-- Values -->
    <section ref="valuesRef" class="py-20 px-8">
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div
            v-for="(item, index) in values"
            :key="item.title"
            class="value-card rounded-[2rem] p-12 text-center cursor-pointer"
            :style="{ backgroundColor: item.color }"
            @mouseenter="(e) => onValueHover(e, index)" @mouseleave="onValueLeave"
          >
            <div class="inline-flex items-center justify-center mb-6 cursor-pointer" @mouseenter="onIconHover" @mouseleave="onIconLeave">
              <component :is="item.icon" :size="60" color="white" :stroke-width="2" />
            </div>
            <h3 class="text-[2rem] mb-4 text-white" style="font-family:Inter,sans-serif;font-weight:600">{{ item.title }}</h3>
            <p class="text-white/90 text-lg" style="font-family:Inter,sans-serif">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Story -->
    <section class="py-32 px-8 relative overflow-hidden">
      <div ref="blob3" class="absolute left-0 top-1/4 w-72 h-72 rounded-full opacity-20" style="background-color:#FDCB40" />

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="story-left grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 class="text-[clamp(2rem,7vw,3.8rem)] mb-8 leading-tight" style="font-family:'DM Serif Display',serif">
              Comment tout a commencé
            </h2>
            <p class="text-[1.25rem] text-foreground/70 leading-relaxed" style="font-family:Inter,sans-serif">
              Créer en 2026, Allo Remplaçant est né d'un constat simple : trouver un remplaçant est souvent long et compliqué. Nous avons créé une plateforme moderne qui simplifie ce processus, permettant aux professionnels de l'enseignement de se concentrer sur l'essentiel : soigner leurs patients.
            </p>
          </div>
          <div
            class="rounded-[2rem] p-16 flex items-center justify-center min-h-[350px] cursor-pointer"
            style="background-color:#FDCB40"
            @mouseenter="(e) => onStoryHover(e, 3)" @mouseleave="onStoryLeave"
          >
            <div @mouseenter="(e) => onInnerHover(e, -6)" @mouseleave="onInnerLeave">
              <Users :size="150" color="white" :stroke-width="1.5" />
            </div>
          </div>
        </div>

        <div class="story-right grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div
            class="rounded-[2rem] p-16 flex items-center justify-center min-h-[350px] order-2 md:order-1 cursor-pointer"
            style="background-color:#FD4401"
            @mouseenter="(e) => onStoryHover(e, -3)" @mouseleave="onStoryLeave"
          >
            <div @mouseenter="(e) => onInnerHover(e, 6)" @mouseleave="onInnerLeave">
              <Award :size="150" color="white" :stroke-width="1.5" />
            </div>
          </div>
          <div class="order-1 md:order-2">
            <h2 class="text-[clamp(2rem,7vw,3.8rem)] mb-8 leading-tight" style="font-family:'DM Serif Display',serif">
              Ce qui nous rend uniques
            </h2>
            <p class="text-[1.25rem] text-foreground/70 leading-relaxed" style="font-family:Inter,sans-serif">
              Nous combinons technologie de pointe et accompagnement humain. Chaque professionnel de l'enseignement bénéficie d'un suivi personnalisé, tandis que notre algorithme intelligent trouve les meilleurs candidats en un temps record.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section ref="teamRef" class="py-32 px-8 bg-muted/20">
      <div class="max-w-7xl mx-auto relative z-10">
        <h2 class="text-center mb-20 text-[clamp(2rem,7vw,3.8rem)] leading-tight" style="font-family:'DM Serif Display',serif">
          Rencontrez l'équipe
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(member, index) in team" :key="member.name" class="team-member text-center">
            <div
              class="w-full aspect-square rounded-[2rem] mb-6 flex items-center justify-center cursor-pointer"
              :style="{ backgroundColor: member.color }"
              @mouseenter="(e) => onTeamHover(e, index)" @mouseleave="onTeamLeave"
            >
              <div class="text-white text-[clamp(2.25rem,7.5vw,4rem)]">{{ member.name.charAt(0) }}</div>
            </div>
            <h3 class="text-[1.5rem] mb-2" style="font-family:Inter,sans-serif;font-weight:600">{{ member.name }}</h3>
            <p class="text-foreground/60 text-base" style="font-family:Inter,sans-serif">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-32 px-8">
      <div class="cta-section max-w-5xl mx-auto rounded-[3rem] p-20 text-center relative overflow-hidden" style="background-color:#FD4401">
        <div ref="ctaBlob" class="absolute top-10 right-10 w-32 h-32 rounded-full opacity-30" style="background-color:#FDCB40" />
        <h2 class="text-[clamp(2.25rem,7.5vw,4rem)] mb-8 text-white leading-tight" style="font-family:'DM Serif Display',serif">
          Rejoignez notre réseau
        </h2>
        <p class="text-[1.4rem] text-white/90 mb-12" style="font-family:Inter,sans-serif">
          Que vous cherchiez un remplaçant ou des missions, nous avons la solution
        </p>
        <button
          class="px-12 py-5 bg-secondary text-secondary-foreground rounded-full text-base font-medium shadow-2xl"
          @mouseenter="onBtnHover" @mouseleave="onBtnLeave" @mousedown="onBtnPress" @mouseup="onBtnRelease"
        >
          Créer mon compte
        </button>
      </div>
    </section>

    <Footer />
  </div>
</template>

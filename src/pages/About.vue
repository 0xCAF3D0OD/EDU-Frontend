<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedBlob from '../components/AnimatedBlob.vue'
import { Users, Target, Lightbulb, Rocket, Star, Award } from '@lucide/vue'

gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const valuesRef = ref<HTMLElement | null>(null)
const teamRef = ref<HTMLElement | null>(null)
const blob1Ref = ref<HTMLElement | null>(null)
const blob2Ref = ref<HTMLElement | null>(null)
const blob3Ref = ref<HTMLElement | null>(null)
const starRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context | null = null

const valueItems = [
  { icon: Target, title: 'Notre Mission', text: 'Créer des designs qui inspirent et connectent les gens', color: '#FD4401' },
  { icon: Lightbulb, title: 'Notre Vision', text: 'Un monde où la créativité transforme chaque expérience', color: '#FDCB40' },
  { icon: Rocket, title: 'Notre Approche', text: 'Innovation constante et attention aux détails', color: '#FD4401' },
]

const teamMembers = [
  { name: 'Sophie Martin', role: 'Directrice Créative', color: '#FD4401' },
  { name: 'Lucas Dubois', role: 'Designer Principal', color: '#FDCB40' },
  { name: 'Marie Laurent', role: 'Développeuse', color: '#FD4401' },
  { name: 'Thomas Petit', role: 'Stratège Digital', color: '#FDCB40' },
]

onMounted(() => {
  ctx = gsap.context(() => {
    // Star wobble loop
    if (starRef.value) {
      gsap.to(starRef.value, {
        rotate: 10,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    }

    // Parallax blobs using scroll
    if (blob1Ref.value && containerRef.value) {
      gsap.to(blob1Ref.value, {
        y: -150,
        scrollTrigger: { trigger: containerRef.value, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
    }
    if (blob2Ref.value && containerRef.value) {
      gsap.to(blob2Ref.value, {
        y: 150,
        scrollTrigger: { trigger: containerRef.value, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
    }
    if (blob3Ref.value && containerRef.value) {
      gsap.to(blob3Ref.value, {
        y: -200,
        scrollTrigger: { trigger: containerRef.value, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
    }

    // Values cards
    if (valuesRef.value) {
      const cards = valuesRef.value.querySelectorAll('.value-card')
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 100, opacity: 0, rotation: index % 2 === 0 ? -5 : 5 },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 40%', scrub: 1 },
          },
        )
      })
    }

    // Team stagger
    if (teamRef.value) {
      const members = teamRef.value.querySelectorAll('.team-member')
      gsap.fromTo(
        members,
        { y: 80, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          scrollTrigger: { trigger: teamRef.value, start: 'top 70%', end: 'top 30%', scrub: 1 },
        },
      )
    }

    // CTA section
    const ctaSection = document.querySelector('.cta-section')
    if (ctaSection) {
      gsap.fromTo(
        ctaSection,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: { trigger: ctaSection, start: 'top 80%', end: 'top 50%', scrub: 1 },
        },
      )
    }

    // Story sections
    const storyLeft = document.querySelector('.story-left')
    const storyRight = document.querySelector('.story-right')
    if (storyLeft) {
      gsap.fromTo(storyLeft, { opacity: 0, x: -50 }, {
        opacity: 1, x: 0,
        scrollTrigger: { trigger: storyLeft, start: 'top 80%', end: 'top 50%', scrub: 1 },
      })
    }
    if (storyRight) {
      gsap.fromTo(storyRight, { opacity: 0, x: 50 }, {
        opacity: 1, x: 0,
        scrollTrigger: { trigger: storyRight, start: 'top 80%', end: 'top 50%', scrub: 1 },
      })
    }
  })

  // Spinning blob inside CTA
  const ctaBlob = document.querySelector('.cta-blob')
  if (ctaBlob) {
    gsap.to(ctaBlob, {
      scale: 1.2,
      rotate: 360,
      duration: 8,
      repeat: -1,
      ease: 'none',
    })
  }
})

onUnmounted(() => {
  ctx?.revert()
})

// Hover helpers
function onValueHover(e: MouseEvent, index: number) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { scale: 1.08, rotate: index % 2 === 0 ? 3 : -3, y: -10, duration: 0.3, ease: 'power2.out' })
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
function onStoryHover(e: MouseEvent, rotate: number) {
  const el = e.currentTarget as HTMLElement
  gsap.to(el, { rotate, scale: 1.05, duration: 0.3, ease: 'power2.out' })
}
function onStoryLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { rotate: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
}
function onInnerHover(e: MouseEvent, rotate: number) {
  gsap.to(e.currentTarget as HTMLElement, { rotate, scale: 1.1, duration: 0.3, ease: 'power2.out' })
}
function onInnerLeave(e: MouseEvent) {
  gsap.to(e.currentTarget as HTMLElement, { rotate: 0, scale: 1, duration: 0.3, ease: 'power2.out' })
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
  <div ref="containerRef" class="size-full overflow-auto bg-background">

    <!-- Hero Section -->
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden px-8">
      <div ref="blob1Ref" class="absolute top-20 left-10 opacity-25">
        <AnimatedBlob color="#FDCB40" :size="380" />
      </div>
      <div ref="blob2Ref" class="absolute bottom-20 right-20 opacity-25">
        <AnimatedBlob color="#FD4401" :size="260" />
      </div>

      <div class="max-w-5xl mx-auto text-center z-10">
        <div class="inline-block mb-8">
          <div ref="starRef">
            <Star :size="80" color="#FD4401" fill="#FDCB40" />
          </div>
        </div>

        <h1 class="text-[5rem] leading-[1.1] mb-8">
          Notre histoire,
          <br />
          <span class="text-primary">notre passion</span>
        </h1>
        <p class="text-[1.5rem] text-muted-foreground max-w-3xl mx-auto">
          Nous sommes une équipe de créatifs passionnés qui transforment
          les idées en expériences visuelles inoubliables
        </p>
      </div>
    </section>

    <!-- Values Section -->
    <section ref="valuesRef" class="py-20 px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div
            v-for="(item, index) in valueItems"
            :key="item.title"
            class="value-card rounded-[2rem] p-12 text-center cursor-pointer"
            :style="{ backgroundColor: item.color }"
            @mouseenter="(e) => onValueHover(e, index)"
            @mouseleave="onValueLeave"
          >
            <div
              class="inline-flex items-center justify-center mb-6 cursor-pointer"
              @mouseenter="onIconHover"
              @mouseleave="onIconLeave"
            >
              <component :is="item.icon" :size="60" color="white" :stroke-width="2" />
            </div>
            <h3 class="text-[2rem] mb-4 text-white">{{ item.title }}</h3>
            <p class="text-white/90 text-lg">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="py-32 px-8 relative overflow-hidden">
      <div
        ref="blob3Ref"
        class="absolute left-0 top-1/4 w-72 h-72 rounded-full opacity-20"
        style="background-color: #FDCB40"
      />

      <div class="max-w-6xl mx-auto relative z-10">
        <!-- Story block 1 -->
        <div class="story-left grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 class="text-[3.5rem] mb-6">Comment tout a commencé</h2>
            <p class="text-[1.25rem] text-muted-foreground leading-relaxed">
              En 2020, une petite équipe de designers passionnés a décidé de
              créer quelque chose de différent. Nous voulions apporter de la
              couleur, de la joie et de l'innovation dans chaque projet.
              Aujourd'hui, nous sommes fiers d'avoir aidé des dizaines
              d'entreprises à transformer leur vision en réalité.
            </p>
          </div>
          <div
            class="rounded-[2rem] p-16 flex items-center justify-center min-h-[350px] cursor-pointer"
            style="background-color: #FDCB40"
            @mouseenter="(e) => onStoryHover(e, 3)"
            @mouseleave="onStoryLeave"
          >
            <div @mouseenter="(e) => onInnerHover(e, -6)" @mouseleave="onInnerLeave">
              <Users :size="150" color="white" :stroke-width="1.5" />
            </div>
          </div>
        </div>

        <!-- Story block 2 -->
        <div class="story-right grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div
            class="rounded-[2rem] p-16 flex items-center justify-center min-h-[350px] order-2 md:order-1 cursor-pointer"
            style="background-color: #FD4401"
            @mouseenter="(e) => onStoryHover(e, -3)"
            @mouseleave="onStoryLeave"
          >
            <div @mouseenter="(e) => onInnerHover(e, 6)" @mouseleave="onInnerLeave">
              <Award :size="150" color="white" :stroke-width="1.5" />
            </div>
          </div>
          <div class="order-1 md:order-2">
            <h2 class="text-[3.5rem] mb-6">Ce qui nous rend uniques</h2>
            <p class="text-[1.25rem] text-muted-foreground leading-relaxed">
              Notre approche combine créativité audacieuse et expertise
              technique. Nous ne créons pas simplement des designs, nous
              créons des expériences qui résonnent avec votre audience et
              racontent votre histoire de manière authentique et mémorable.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section ref="teamRef" class="py-32 px-8 bg-muted/20">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-center mb-20 text-[3.5rem]">
          Rencontrez l'équipe
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(member, index) in teamMembers"
            :key="member.name"
            class="team-member text-center"
          >
            <div
              class="w-full aspect-square rounded-[2rem] mb-6 flex items-center justify-center cursor-pointer"
              :style="{ backgroundColor: member.color }"
              @mouseenter="(e) => onTeamHover(e, index)"
              @mouseleave="onTeamLeave"
            >
              <div class="text-white text-[4rem]">
                {{ member.name.charAt(0) }}
              </div>
            </div>
            <h3 class="text-[1.5rem] mb-2">{{ member.name }}</h3>
            <p class="text-muted-foreground text-lg">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-32 px-8">
      <div
        class="cta-section max-w-5xl mx-auto rounded-[3rem] p-20 text-center relative overflow-hidden"
        style="background-color: #FD4401"
      >
        <div
          class="cta-blob absolute top-10 right-10 w-32 h-32 rounded-full opacity-30"
          style="background-color: #FDCB40"
        />

        <h2 class="text-[3.5rem] mb-8 text-white">
          Prêt à créer ensemble ?
        </h2>
        <p class="text-[1.5rem] text-white/90 mb-12">
          Transformons vos idées en réalité colorée
        </p>
        <button
          class="px-12 py-6 bg-secondary text-secondary-foreground rounded-full text-lg shadow-2xl"
          @mouseenter="(e) => onBtnHover(e, 2)"
          @mouseleave="onBtnLeave"
          @mousedown="onBtnPress"
          @mouseup="onBtnRelease"
        >
          Commençons votre projet
        </button>
      </div>
    </section>

  </div>
</template>

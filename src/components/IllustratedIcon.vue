<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import type { Component } from 'vue'

interface Props {
  icon: Component
  color: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), { class: '' })

const wrapper = ref<HTMLDivElement | null>(null)
const glow = ref<HTMLDivElement | null>(null)
const main = ref<HTMLDivElement | null>(null)
const iconInner = ref<HTMLDivElement | null>(null)
const dots = ref<HTMLDivElement[]>([])

const angles = [0, 120, 240]

function dotPos(angle: number, radius: number) {
  return {
    x: Math.cos((angle * Math.PI) / 180) * radius - 4,
    y: Math.sin((angle * Math.PI) / 180) * radius - 4,
  }
}

function onEnter() {
  gsap.to(glow.value, { scale: 1.2, opacity: 0.5, duration: 0.3 })
  gsap.to(main.value, { rotate: 360, duration: 0.6, ease: 'power1.inOut' })
  gsap.to(iconInner.value, { scale: 1.2, duration: 0.3 })
  dots.value.forEach((dot, i) => {
    const p = dotPos(angles[i], 70)
    gsap.to(dot, { x: p.x, y: p.y, opacity: 1, duration: 0.3, delay: i * 0.05 })
  })
}

function onLeave() {
  gsap.to(glow.value, { scale: 0.8, opacity: 0.3, duration: 0.3 })
  gsap.to(main.value, { rotate: 0, duration: 0.6, ease: 'power1.inOut' })
  gsap.to(iconInner.value, { scale: 1, duration: 0.3 })
  dots.value.forEach((dot, i) => {
    const p = dotPos(angles[i], 50)
    gsap.to(dot, { x: p.x, y: p.y, opacity: 0, duration: 0.3, delay: i * 0.05 })
  })
}
</script>

<template>
  <div
    ref="wrapper"
    :class="`relative ${props.class}`"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div
      ref="glow"
      class="absolute inset-0 rounded-full blur-xl"
      :style="{ backgroundColor: color, opacity: 0.3, transform: 'scale(0.8)' }"
    />
    <div
      ref="main"
      class="relative w-full h-full rounded-full flex items-center justify-center"
      :style="{ backgroundColor: color }"
    >
      <div ref="iconInner">
        <component :is="icon" :size="40" color="white" :stroke-width="2" />
      </div>
    </div>
    <div
      v-for="(angle, i) in angles"
      :key="angle"
      :ref="(el) => { if (el) dots[i] = el as HTMLDivElement }"
      class="absolute w-2 h-2 rounded-full"
      :style="{
        backgroundColor: color,
        top: '50%',
        left: '50%',
        opacity: 0,
        transform: `translate(${dotPos(angle, 50).x}px, ${dotPos(angle, 50).y}px)`,
      }"
    />
  </div>
</template>

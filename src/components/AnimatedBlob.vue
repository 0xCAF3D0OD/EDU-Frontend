<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'

interface Props {
  color: string
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  class: '',
})

const blobRef = ref<SVGPathElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
let tl: gsap.core.Timeline | null = null

function d1(s: number) {
  return `M ${s / 2} 0 Q ${s * 0.9} ${s * 0.2} ${s} ${s / 2} Q ${s * 0.8} ${s * 0.9} ${s / 2} ${s} Q ${s * 0.2} ${s * 0.8} 0 ${s / 2} Q ${s * 0.1} ${s * 0.1} ${s / 2} 0 Z`
}
function d2(s: number) {
  return `M ${s / 2} 0 Q ${s * 0.9} ${s * 0.2} ${s} ${s / 2} Q ${s * 0.85} ${s * 0.85} ${s / 2} ${s} Q ${s * 0.15} ${s * 0.9} 0 ${s / 2} Q ${s * 0.1} ${s * 0.1} ${s / 2} 0 Z`
}
function d3(s: number) {
  return `M ${s / 2} 0 Q ${s * 0.85} ${s * 0.15} ${s} ${s / 2} Q ${s * 0.9} ${s * 0.8} ${s / 2} ${s} Q ${s * 0.1} ${s * 0.85} 0 ${s / 2} Q ${s * 0.15} ${s * 0.2} ${s / 2} 0 Z`
}

function start() {
  if (!blobRef.value) return
  const s = props.size
  tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to(blobRef.value, { attr: { d: d2(s) }, duration: 3, ease: 'sine.inOut' })
    .to(blobRef.value, { attr: { d: d3(s) }, duration: 3, ease: 'sine.inOut' })
}

onMounted(() => {
  start()
  const c = containerRef.value
  if (c) {
    c.addEventListener('mouseenter', () => gsap.to(blobRef.value, { scale: 1.1, duration: 0.3, ease: 'back.out' }))
    c.addEventListener('mouseleave', () => gsap.to(blobRef.value, { scale: 1, duration: 0.3, ease: 'back.out' }))
  }
})

onUnmounted(() => tl?.kill())
watch(() => props.size, () => { tl?.kill(); start() })
</script>

<template>
  <div ref="containerRef" :class="props.class" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <path ref="blobRef" :d="d1(size)" :fill="color" />
    </svg>
  </div>
</template>

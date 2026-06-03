<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

interface Props {
  type?: 'circle' | 'blob' | 'wave'
  color: string
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'blob',
  size: 200,
  class: '',
})

const pathRef = ref<SVGPathElement | null>(null)
let tl: gsap.core.Timeline | null = null
let circleTween: gsap.core.Tween | null = null
const circleRef = ref<HTMLDivElement | null>(null)

const s = props.size

function blobShapes(size: number) {
  return [
    `M ${size / 2} 0 C ${size * 0.8} 0 ${size} ${size * 0.2} ${size} ${size / 2} C ${size} ${size * 0.8} ${size * 0.8} ${size} ${size / 2} ${size} C ${size * 0.2} ${size} 0 ${size * 0.8} 0 ${size / 2} C 0 ${size * 0.2} ${size * 0.2} 0 ${size / 2} 0 Z`,
    `M ${size / 2} 0 C ${size * 0.9} ${size * 0.1} ${size} ${size * 0.3} ${size} ${size / 2} C ${size} ${size * 0.7} ${size * 0.85} ${size} ${size / 2} ${size} C ${size * 0.15} ${size} 0 ${size * 0.7} 0 ${size / 2} C 0 ${size * 0.3} ${size * 0.1} ${size * 0.1} ${size / 2} 0 Z`,
    `M ${size / 2} 0 C ${size * 0.7} ${size * 0.05} ${size} ${size * 0.25} ${size} ${size / 2} C ${size} ${size * 0.75} ${size * 0.9} ${size} ${size / 2} ${size} C ${size * 0.1} ${size} 0 ${size * 0.75} 0 ${size / 2} C 0 ${size * 0.25} ${size * 0.3} ${size * 0.05} ${size / 2} 0 Z`,
  ]
}

onMounted(() => {
  if (props.type === 'blob' && pathRef.value) {
    const shapes = blobShapes(s)
    tl = gsap.timeline({ repeat: -1, yoyo: true })
    shapes.forEach((shape, index) => {
      tl!.to(pathRef.value, { attr: { d: shape }, duration: 2 + index * 0.5, ease: 'sine.inOut' })
    })
  }
  if (props.type === 'circle' && circleRef.value) {
    circleTween = gsap.to(circleRef.value, { scale: 1.1, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }
})

onUnmounted(() => {
  tl?.kill()
  circleTween?.kill()
})

function blobInit(size: number) {
  return `M ${size / 2} 0 C ${size * 0.8} 0 ${size} ${size * 0.2} ${size} ${size / 2} C ${size} ${size * 0.8} ${size * 0.8} ${size} ${size / 2} ${size} C ${size * 0.2} ${size} 0 ${size * 0.8} 0 ${size / 2} C 0 ${size * 0.2} ${size * 0.2} 0 ${size / 2} 0 Z`
}
</script>

<template>
  <div v-if="type === 'circle'" ref="circleRef" :class="props.class" :style="{ width: `${s}px`, height: `${s}px` }">
    <svg :width="s" :height="s" :viewBox="`0 0 ${s} ${s}`">
      <circle :cx="s / 2" :cy="s / 2" :r="s / 2" :fill="color" />
    </svg>
  </div>

  <div v-else :class="props.class" :style="{ width: `${s}px`, height: `${s}px` }">
    <svg :width="s" :height="s" :viewBox="`0 0 ${s} ${s}`">
      <path ref="pathRef" :d="blobInit(s)" :fill="color" />
    </svg>
  </div>
</template>

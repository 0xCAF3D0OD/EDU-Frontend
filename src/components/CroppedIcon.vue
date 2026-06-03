<script setup lang="ts">
import { computed } from 'vue'
import { gsap } from 'gsap'
import { onMounted, ref, onUnmounted } from 'vue'

interface Props {
  imageUrl: string
  row: number
  col: number
  size?: number
  gridCols?: number
  gridRows?: number
  opacity?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
  gridCols: 12,
  gridRows: 7,
  opacity: 0.3,
  class: '',
})

const iconSize = computed(() => 100 / props.gridCols)
const iconHeight = computed(() => 100 / props.gridRows)

const el = ref<HTMLDivElement | null>(null)
let tween: gsap.core.Tween | null = null

onMounted(() => {
  if (el.value) {
    tween = gsap.to(el.value, {
      y: -20,
      rotation: 5,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }
})
onUnmounted(() => tween?.kill())
</script>

<template>
  <div
    ref="el"
    :class="props.class"
    :style="{ width: `${size}px`, height: `${size}px`, opacity: opacity, position: 'relative' }"
  >
    <div
      :style="{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: `${col * iconSize}% ${row * iconHeight}%`,
        backgroundSize: `${gridCols * 100}% ${gridRows * 100}%`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'crisp-edges',
      }"
    />
  </div>
</template>

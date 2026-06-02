<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const containerRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!containerRef.value) return

  const shapes = containerRef.value.querySelectorAll('.floating-shape')
  shapes.forEach((shape, index) => {
    gsap.to(shape, {
      y: `${gsap.utils.random(-30, 30)}`,
      x: `${gsap.utils.random(-20, 20)}`,
      rotation: gsap.utils.random(-15, 15),
      duration: gsap.utils.random(3, 5),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.2,
    })
  })
})
</script>

<template>
  <div ref="containerRef" class="fixed inset-0 pointer-events-none overflow-hidden">
    <!-- Top left -->
    <div
      class="floating-shape absolute top-20 left-10 w-24 h-24 rounded-full opacity-20"
      style="background-color: #FDCB40"
    />
    <!-- Top right -->
    <div
      class="floating-shape absolute top-32 right-20 w-16 h-16 opacity-25"
      style="background-color: #FD4401; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%"
    />
    <!-- Middle left -->
    <div
      class="floating-shape absolute top-1/3 left-1/4 w-20 h-20 opacity-15"
      style="background-color: #FD4401; border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%"
    />
    <!-- Middle right -->
    <div
      class="floating-shape absolute top-1/2 right-1/3 w-32 h-32 rounded-full opacity-20"
      style="background-color: #FDCB40"
    />
    <!-- Bottom left -->
    <div
      class="floating-shape absolute bottom-40 left-20 w-28 h-28 opacity-25"
      style="background-color: #FD4401; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%"
    />
    <!-- Bottom right -->
    <div
      class="floating-shape absolute bottom-20 right-10 w-20 h-20 rounded-full opacity-20"
      style="background-color: #FDCB40"
    />
  </div>
</template>

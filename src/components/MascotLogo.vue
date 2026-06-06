<script setup lang="ts">
import { RouterLink } from 'vue-router'
import sprite from '../assets/telephone-sprite.png'
import alloBubble from '../assets/allo-bubble.svg'
import alloOrange from '../assets/allo-orange.svg'
import { useTheme } from '../composables/useTheme'

// 25-frame horizontal sprite, played at 12 fps (25 / 12 ≈ 2.083s) on hover.
const { isDark } = useTheme()
</script>

<template>
  <RouterLink to="/" class="mascot-link" aria-label="Accueil — Allô Remplaçant">
    <span class="brand">Remplaçant</span>
    <div class="mascot-wrap">
      <!-- "allô" bubble sits to the upper-left of the character, tail toward the phone -->
      <img :src="isDark ? alloOrange : alloBubble" alt="" aria-hidden="true" class="bubble" />
      <!-- animated character on the phone -->
      <div class="mascot" :style="{ backgroundImage: `url(${sprite})` }" />
    </div>
  </RouterLink>
</template>

<style scoped>
.mascot-link {
  display: flex;
  align-items: center;
  gap: 1.6rem; /* room for the bubble between the word and the character */
  min-width: 0;
}
.mascot-wrap {
  position: relative;
  flex-shrink: 0;
}
.mascot {
  --fh: 49px;
  --fw: 45px;
  width: var(--fw);
  height: var(--fh);
  transform: translate(-205px, 5px);
  background-repeat: no-repeat;
  background-size: calc(var(--fw) * 25) var(--fh);
  background-position: 0 0;
}
.mascot-link:hover .mascot {
  animation: mascot-run 2.083s steps(25) infinite;
}
@keyframes mascot-run {
  from { background-position-x: 0; }
  to { background-position-x: calc(var(--fw) * -25); }
}
.bubble {
  position: absolute;
  top: 0;
  left: -26px;
  height: 24px;
  width: auto;
  pointer-events: none;
  transform: rotate(2deg);
  z-index: 1;
}
.brand {
  font-family: 'DM Serif Display', serif;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--primary);
  font-size: 1.05rem;
  line-height: 1;
  white-space: nowrap;
}
@media (min-width: 640px) {
  .mascot { --fh: 56px; --fw: 53px; }
  .bubble { left: -240px; height: 20px; }
  .brand { font-size: 1.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .mascot-link:hover .mascot { animation: none; }
}
</style>

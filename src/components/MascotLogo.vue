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
    <span class="mark">
      <!-- "allô" bubble in the left gutter, tail pointing right toward the phone -->
      <img :src="isDark ? alloOrange : alloBubble" alt="" aria-hidden="true" class="bubble" />
      <!-- animated character on the phone -->
      <span class="mascot" :style="{ backgroundImage: `url(${sprite})` }" />
    </span>
    <span class="brand">Remplaçant</span>
  </RouterLink>
</template>

<style scoped>
.mascot-link {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}
/* The mark hosts the character + an absolutely-placed bubble.
   padding-left reserves an on-screen gutter for the bubble (no off-screen transforms). */
.mark {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  padding-left: 34px;
}
.mascot {
  --fh: 56px;
  --fw: 53px;
  display: block;
  width: var(--fw);
  height: var(--fh);
  transform: translate(10px, 5px);
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
  left: -15px;
  top: -4px;
  height: 30px;
  width: auto;
  pointer-events: none;
  transform: rotate(-3deg);
  z-index: 1;
}
.brand {
  font-family: 'DM Serif Display', serif;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--primary);
  font-size: 1.5rem;
  line-height: 1;
  white-space: nowrap;
}

/* Mobile: only the character + bubble (no word), slightly tighter */
@media (max-width: 639px) {
  .brand { display: none; }
  .mark { padding-left: 28px; }
  .mascot { --fh: 50px; --fw: 47px; transform: translate(25px, 5px);}
  .bubble { left: 0; top: -3px; height: 26px; }
}
@media (prefers-reduced-motion: reduce) {
  .mascot-link:hover .mascot { animation: none; }
}
</style>

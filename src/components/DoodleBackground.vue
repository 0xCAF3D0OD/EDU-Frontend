<script setup lang="ts">
// Hand-drawn doodle decorations used as page backgrounds.
// SVGs live in src/assets/doodles and are referenced by file name (without extension).
const modules = import.meta.glob('../assets/doodles/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const urls: Record<string, string> = {}
for (const path in modules) {
  const name = path.split('/').pop()!.replace('.svg', '')
  urls[name] = modules[path]!
}

export interface Doodle {
  /** file name without extension, e.g. "rocket" */
  name: string
  top?: string
  left?: string
  right?: string
  bottom?: string
  /** rendered width in px (height auto) */
  size?: number
  opacity?: number
  rotate?: number
}

defineProps<{ items: Doodle[] }>()
</script>

<template>
  <div class="doodle-layer" aria-hidden="true">
    <img
      v-for="(it, i) in items"
      :key="i"
      :src="urls[it.name]"
      class="doodle"
      alt=""
      :style="{
        top: it.top,
        left: it.left,
        right: it.right,
        bottom: it.bottom,
        width: (it.size ?? 80) + 'px',
        opacity: it.opacity ?? 0.55,
        transform: `rotate(${it.rotate ?? 0}deg)`,
      }"
    />
  </div>
</template>

<style scoped>
.doodle-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.doodle {
  position: absolute;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
}
/* Lighten clutter on small screens */
@media (max-width: 640px) {
  .doodle {
    opacity: 0.3 !important;
  }
}
</style>

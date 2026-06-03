<script setup lang="ts">
interface Props {
  checked: boolean
  accentColor: string
}
defineProps<Props>()
const emit = defineEmits<{ (e: 'update:checked', value: boolean): void }>()
</script>

<template>
  <button
    class="relative w-14 h-8 rounded-full transition-colors toggle-switch"
    :style="{ backgroundColor: checked ? accentColor : '#D1D5DB' }"
    @click="emit('update:checked', !checked)"
  >
    <div
      class="w-6 h-6 rounded-full bg-white shadow-md absolute top-1 toggle-knob"
      :style="{ transform: checked ? 'translateX(30px)' : 'translateX(4px)' }"
    />
  </button>
</template>

<style scoped>
.toggle-switch:hover { transform: scale(1.05); }
.toggle-switch:active { transform: scale(0.95); }
.toggle-knob { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
</style>

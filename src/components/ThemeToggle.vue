<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '../composables/useTheme'

const { isDark, toggleDark } = useTheme()

function toggleTheme() {
  toggleDark()
}
</script>

<template>
  <button
    class="relative w-16 h-8 rounded-full p-1 transition-colors theme-toggle"
    :style="{ backgroundColor: isDark ? '#374151' : '#FDCB40' }"
    @click="toggleTheme"
  >
    <div
      class="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center toggle-knob"
      :style="{ transform: isDark ? 'translateX(32px)' : 'translateX(0)' }"
    >
      <Moon v-if="isDark" :size="14" class="text-gray-700" />
      <Sun v-else :size="14" class="text-yellow-600" />
    </div>
  </button>
</template>

<style scoped>
.theme-toggle:hover {
  transform: scale(1.05);
}
.theme-toggle:active {
  transform: scale(0.95);
}
.toggle-knob {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>

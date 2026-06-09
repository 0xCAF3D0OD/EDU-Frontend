<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

type Val = string | number
type Option = string | { value: Val; label: string }

const props = withDefaults(
  defineProps<{
    modelValue: Val | null
    options: Option[]
    placeholder?: string
    disabled?: boolean
    ariaLabel?: string
  }>(),
  { placeholder: 'Sélectionner…', disabled: false, ariaLabel: '' },
)
const emit = defineEmits<{ 'update:modelValue': [v: Val] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const normalized = computed(() =>
  props.options.map((o) => (typeof o === 'object' ? o : { value: o, label: o })),
)
const selected = computed(() => normalized.value.find((o) => o.value === props.modelValue))
const isPlaceholder = computed(() => !selected.value)

function toggle() {
  if (!props.disabled) open.value = !open.value
}
function choose(v: Val) {
  emit('update:modelValue', v)
  open.value = false
}
function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => window.addEventListener('click', onDocClick))
onUnmounted(() => window.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="relative w-full">
    <button
      type="button"
      class="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-[14px] border-2 border-border bg-input-background text-foreground text-left transition-colors hover:border-primary/40 focus:outline-none focus:border-primary disabled:opacity-60"
      :disabled="disabled"
      :aria-label="ariaLabel || placeholder"
      :aria-expanded="open"
      @click="toggle"
    >
      <span :class="isPlaceholder ? 'text-muted-foreground' : ''" class="truncate">
        {{ selected ? selected.label : placeholder }}
      </span>
      <ChevronDown :size="18" class="text-foreground/65 transition-transform shrink-0" :class="open ? 'rotate-180' : ''" />
    </button>

    <Transition name="dd-pop">
      <ul
        v-if="open"
        class="absolute left-0 right-0 top-full mt-2 z-30 rounded-[18px] border border-border shadow-xl p-2 max-h-64 overflow-auto"
        :style="{ backgroundColor: 'var(--nav-bg-scrolled)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }"
        data-lenis-prevent
      >
        <li v-for="o in normalized" :key="String(o.value)">
          <button
            type="button"
            class="block w-full text-left px-4 py-2.5 rounded-[12px] text-sm font-medium transition-colors"
            :class="o.value === modelValue ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:bg-foreground/5'"
            @click="choose(o.value)"
          >
            {{ o.label }}
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.dd-pop-enter-active,
.dd-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.dd-pop-enter-from,
.dd-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

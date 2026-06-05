import { ref, computed } from 'vue'

export type ThemeId = 'creme' | 'nuit' | 'foret' | 'lavande' | 'vaud'

export const THEME_IDS: ThemeId[] = ['creme', 'nuit', 'foret', 'lavande', 'vaud']

const STORAGE_KEY = 'theme'
const LIGHT_THEME: ThemeId = 'creme'
const DARK_THEME: ThemeId = 'nuit'

function readStored(): ThemeId {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && (THEME_IDS as string[]).includes(saved)) return saved as ThemeId
  // migrate older light/dark values
  if (saved === 'dark') return DARK_THEME
  return LIGHT_THEME
}

// Module-scoped state shared across every component that calls useTheme()
const currentTheme = ref<ThemeId>(readStored())

function applyTheme(theme: ThemeId) {
  const el = document.documentElement
  THEME_IDS.forEach((t) => el.classList.remove(`theme-${t}`))
  el.classList.add(`theme-${theme}`)
  // Keep the `dark` class in sync so the `dark` custom variant keeps working
  el.classList.toggle('dark', theme === DARK_THEME)
  localStorage.setItem(STORAGE_KEY, theme)
}

// Apply immediately on first import (covers SPA navigation; index.html handles first paint)
applyTheme(currentTheme.value)

export function useTheme() {
  const isDark = computed(() => currentTheme.value === DARK_THEME)

  function setTheme(theme: ThemeId) {
    currentTheme.value = theme
    applyTheme(theme)
  }

  function toggleDark() {
    setTheme(isDark.value ? LIGHT_THEME : DARK_THEME)
  }

  return { currentTheme, isDark, setTheme, toggleDark }
}

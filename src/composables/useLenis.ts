import { ref } from 'vue'
import type Lenis from 'lenis'

// Shared reference to the single Lenis instance created in AppLayout, so any
// page (e.g. a sticky table of contents) can drive smooth scrolling without
// fighting Lenis' wheel hijacking.
const lenis = ref<Lenis | null>(null)

export function useLenis() {
  function setLenis(instance: Lenis | null) {
    lenis.value = instance
  }

  /** Smooth-scroll to an element / selector, leaving room for the fixed navbar. */
  function scrollToEl(target: string | HTMLElement, offset = -112) {
    if (lenis.value) {
      lenis.value.scrollTo(target, { offset, duration: 0.9 })
    } else {
      // Fallback when Lenis isn't running (e.g. reduced-motion users)
      const el = typeof target === 'string' ? document.querySelector(target) : target
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return { lenis, setLenis, scrollToEl }
}

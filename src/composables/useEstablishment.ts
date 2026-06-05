import { ref, computed } from 'vue'

export interface EstablishmentSession {
  name: string
  city: string
}

const KEY = 'establishment-session'

function read(): EstablishmentSession | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as EstablishmentSession) : null
  } catch {
    return null
  }
}

// Mock "establishment membership". In production this would be a real auth
// check (IAM / DGEO), guaranteeing only school secretariats can post offers.
const session = ref<EstablishmentSession | null>(read())

export function useEstablishment() {
  const isAuthenticated = computed(() => session.value !== null)

  function login(est: EstablishmentSession) {
    session.value = est
    sessionStorage.setItem(KEY, JSON.stringify(est))
  }
  function logout() {
    session.value = null
    sessionStorage.removeItem(KEY)
  }

  return { session, isAuthenticated, login, logout }
}

import { ref } from 'vue'

export type DayPart = 'Matin' | 'Après-midi' | 'Journée complète'
export const DAY_PARTS: DayPart[] = ['Matin', 'Après-midi', 'Journée complète']

export interface Offer {
  id: number
  school: string
  subject: string
  level: string
  periods: number
  startDate: string
  endDate: string
  location: string
  daypart: DayPart
  schedule?: string
  match?: number
  urgent?: boolean
  publishedBy?: string
}

// Module-scoped shared list so offers published by an établissement
// immediately appear in the Missions catalogue.
const offers = ref<Offer[]>([
  { id: 1, school: 'Établissement Primaire de Belmont', subject: 'Français', level: '7-8P', periods: 18, startDate: '15 Septembre 2026', endDate: '12 Décembre 2026', location: 'Lausanne, VD', daypart: 'Matin', match: 95 },
  { id: 2, school: "Collège de l'Elysée", subject: 'Mathématiques', level: '9-11S · VP', periods: 22, startDate: '1 Octobre 2026', endDate: '20 Décembre 2026', location: 'Lausanne, VD', daypart: 'Après-midi', match: 88 },
  { id: 3, school: 'École Primaire des Jordils', subject: 'Sciences de la nature', level: '5-6P', periods: 14, startDate: '8 Septembre 2026', endDate: '30 Novembre 2026', location: 'Pully, VD', daypart: 'Journée complète', match: 92 },
])

let nextId = 1000

export function useOffers() {
  function addOffer(o: Omit<Offer, 'id'>) {
    offers.value.unshift({ ...o, id: nextId++ })
  }
  function removeOffer(id: number) {
    const i = offers.value.findIndex((o) => o.id === id)
    if (i !== -1) offers.value.splice(i, 1)
  }
  return { offers, addOffer, removeOffer }
}

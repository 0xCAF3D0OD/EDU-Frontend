import { ref } from 'vue'

export type ReportKind = 'remplacant' | 'etablissement'

export interface Report {
  id: number
  kind: ReportKind
  subject: string // name of the replacement or establishment being rated
  author: string // who wrote the report (secretariat / replacement)
  rating: number // 1..5
  comment: string
  context: string // mission context, e.g. "Français · 5-6P"
  date: string
}

// Shared, in-memory satisfaction reports (no backend yet).
const reports = ref<Report[]>([
  { id: 1, kind: 'remplacant', subject: 'Marc Renaud', author: 'EP Belmont', rating: 5, comment: 'Très professionnel, élèves bien encadrés. À recontacter.', context: 'Français · 5-6P', date: '18 déc. 2025' },
  { id: 2, kind: 'remplacant', subject: 'Marc Renaud', author: "Collège de l'Elysée", rating: 4, comment: 'Bonne gestion de classe, ponctuel.', context: 'Maths · 9-11S', date: '3 nov. 2025' },
  { id: 3, kind: 'remplacant', subject: 'Léa Brunner', author: 'EP des Jordils', rating: 5, comment: 'Excellente, autonome dès le premier jour.', context: 'Allemand · 7-8P', date: '12 déc. 2025' },
  { id: 4, kind: 'remplacant', subject: 'Thomas Aebischer', author: "Collège de l'Elysée", rating: 3, comment: 'Correct mais arrivé en retard une fois.', context: 'Sciences · 9-11S', date: '28 nov. 2025' },
  { id: 5, kind: 'etablissement', subject: 'EP Belmont', author: 'Marc Renaud', rating: 5, comment: 'Accueil chaleureux, documents de transmission complets.', context: 'Français · 5-6P', date: '18 déc. 2025' },
  { id: 6, kind: 'etablissement', subject: "Collège de l'Elysée", author: 'Thomas Aebischer', rating: 4, comment: 'Bonne organisation, locaux un peu éloignés des transports.', context: 'Sciences · 9-11S', date: '28 nov. 2025' },
])

let nextId = 500

export function useReports() {
  function addReport(r: Omit<Report, 'id' | 'date'>) {
    reports.value.unshift({
      ...r,
      id: nextId++,
      date: new Date().toLocaleDateString('fr-CH', { day: 'numeric', month: 'short', year: 'numeric' }),
    })
  }
  function reportsFor(kind: ReportKind, name: string) {
    return reports.value.filter((r) => r.kind === kind && r.subject === name)
  }
  function avgFor(kind: ReportKind, name: string) {
    const rs = reportsFor(kind, name)
    if (!rs.length) return 0
    return rs.reduce((a, b) => a + b.rating, 0) / rs.length
  }
  return { reports, addReport, reportsFor, avgFor }
}

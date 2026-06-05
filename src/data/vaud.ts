// Données officielles de l'école obligatoire vaudoise (HarmoS / LEO).
// Sources : vd.ch — déroulement de l'école obligatoire & grilles horaires (version août 2025).

export interface YearLevel {
  id: string
  label: string
  cycle: 1 | 2 | 3
}

// Niveaux disponibles, par cycle (granularité des grilles horaires)
export const yearLevels: YearLevel[] = [
  { id: '1-2P', label: '1-2P', cycle: 1 },
  { id: '3-4P', label: '3-4P', cycle: 1 },
  { id: '5-6P', label: '5-6P', cycle: 2 },
  { id: '7-8P', label: '7-8P', cycle: 2 },
  { id: '9-11S-VG', label: '9-11S · VG', cycle: 3 },
  { id: '9-11S-VP', label: '9-11S · VP', cycle: 3 },
]

// Disciplines enseignées par niveau (corrélation années ↔ matières).
// L'allemand débute en 5P, l'anglais en 7P ; le primaire 1-6P est généraliste.
export const subjectsByLevel: Record<string, string[]> = {
  '1-2P': [
    'Français', 'Mathématiques', "Connaissance de l'environnement",
    'Arts visuels', 'Musique', 'Activités créatrices et manuelles', 'Éducation physique',
  ],
  '3-4P': [
    'Français', 'Mathématiques', "Connaissance de l'environnement",
    'Arts visuels', 'Musique', 'Activités créatrices et manuelles', 'Éducation physique',
  ],
  '5-6P': [
    'Français', 'Allemand', 'Mathématiques', "Connaissance de l'environnement",
    'Arts visuels', 'Musique', 'Activités créatrices et manuelles', 'Éducation physique',
  ],
  '7-8P': [
    'Français', 'Allemand', 'Anglais', 'Mathématiques', 'Sciences de la nature',
    'Histoire et ECR', 'Géographie et citoyenneté',
    'Arts visuels', 'Musique', 'Activités créatrices et manuelles', 'Éducation physique',
  ],
  '9-11S-VG': [
    'Français', 'Allemand', 'Anglais', 'Mathématiques', 'Sciences de la nature',
    'Histoire et ECR', 'Géographie et citoyenneté',
    'Arts visuels', 'Musique', 'Activités créatrices et manuelles', 'Éducation physique',
    'Éducation nutritionnelle', 'Économie et droit (OCOM/OS)',
  ],
  '9-11S-VP': [
    'Français', 'Allemand', 'Anglais', 'Mathématiques', 'Sciences de la nature',
    'Histoire et ECR', 'Géographie et citoyenneté',
    'Arts visuels', 'Musique', 'Éducation physique',
    'OS Économie et droit', 'OS Italien', 'OS Latin', 'OS Mathématiques et physique',
  ],
}

/** Union triée des disciplines pour un ensemble de niveaux sélectionnés. */
export function subjectsForLevels(levelIds: string[]): string[] {
  if (levelIds.length === 0) {
    // Aucun niveau choisi : proposer l'ensemble des disciplines
    const all = new Set<string>()
    Object.values(subjectsByLevel).forEach((arr) => arr.forEach((s) => all.add(s)))
    return [...all]
  }
  const set = new Set<string>()
  levelIds.forEach((id) => (subjectsByLevel[id] ?? []).forEach((s) => set.add(s)))
  return [...set]
}

// ---- Grilles horaires (périodes hebdomadaires) ------------------------------

export interface GrilleRow {
  discipline: string
  a: string // première colonne
  b: string // seconde colonne
}

export interface Grille {
  id: string
  title: string
  colA: string
  colB: string
  rows: GrilleRow[]
  total: { a: string; b: string }
  notes: string[]
}

export const grilles: Grille[] = [
  {
    id: 'cycle1',
    title: 'Cycle 1 — Primaire (1P à 4P)',
    colA: '1-2P',
    colB: '3-4P',
    rows: [
      { discipline: 'Enseignement généraliste', a: '18–26', b: '28' },
    ],
    total: { a: '18–26', b: '28' },
    notes: [
      'Enseignement essentiellement généraliste : Français, Mathématiques, Connaissance de l’environnement, Arts (visuels et musique), Corps et mouvement.',
      'La dotation augmente progressivement de 18 à 26 périodes en 1-2P, puis 28 périodes en 3-4P.',
    ],
  },
  {
    id: 'cycle2',
    title: 'Cycle 2 — Primaire (5P à 8P)',
    colA: '5-6P',
    colB: '7-8P',
    rows: [
      { discipline: 'Français', a: '9', b: '7' },
      { discipline: 'Allemand', a: '2', b: '3' },
      { discipline: 'Anglais', a: '–', b: '2' },
      { discipline: 'Mathématiques', a: '5', b: '5' },
      { discipline: 'Sciences de la nature', a: '4 (CE)¹', b: '2' },
      { discipline: 'Histoire – Éthique et cultures religieuses', a: '(CE)¹', b: '2' },
      { discipline: 'Géographie – Citoyenneté', a: '(CE)¹', b: '2' },
      { discipline: 'Arts visuels', a: '3²', b: '2' },
      { discipline: 'Musique', a: '3²', b: '2' },
      { discipline: 'Activités créatrices et manuelles', a: '2', b: '2' },
      { discipline: 'Éducation physique', a: '3', b: '3' },
    ],
    total: { a: '28', b: '32' },
    notes: [
      '¹ En 5-6P, « Connaissance de l’environnement » (CE) regroupe Géographie, Histoire–ECR, Sciences de la nature et Citoyenneté (4 périodes).',
      '² En 5-6P, les 3 périodes Arts visuels + Musique sont réparties équitablement sur les deux années.',
      'L’allemand débute en 5P, l’anglais en 7P.',
    ],
  },
  {
    id: 'cycle3',
    title: 'Cycle 3 — Secondaire I (9S à 11S)',
    colA: 'Voie générale (VG)',
    colB: 'Voie prégymnasiale (VP)',
    rows: [
      { discipline: 'Français', a: '6', b: '6' },
      { discipline: 'Allemand', a: '3', b: '3' },
      { discipline: 'Anglais', a: '3', b: '3' },
      { discipline: 'Mathématiques', a: '5', b: '5' },
      { discipline: 'Sciences de la nature', a: '2', b: '2–3' },
      { discipline: 'Histoire – Éthique et cultures religieuses', a: '2', b: '2' },
      { discipline: 'Géographie – Citoyenneté', a: '2', b: '2' },
      { discipline: 'Arts visuels', a: '1–2', b: '1–2' },
      { discipline: 'Musique', a: '1', b: '1' },
      { discipline: 'Activités créatrices et manuelles', a: '1–2', b: '–' },
      { discipline: 'Éducation physique', a: '3', b: '3' },
      { discipline: 'Option spécifique (OS)', a: '(4)', b: '4' },
      { discipline: 'OCOM (Form. générale + AACT)', a: '4', b: '–' },
    ],
    total: { a: '33', b: '33' },
    notes: [
      'OS au choix : Économie et droit, Italien, Latin ou Mathématiques et physique.',
      'OCOM (voie générale) : 2 périodes Formation générale + 2 périodes AACT (artisanales, artistiques, commerciales ou technologiques).',
      'Cours facultatifs hors grille : Grec (10-11S), Italien (11S).',
    ],
  },
]

// ---- Établissements scolaires (échantillon représentatif) -------------------
// Annuaire officiel complet : vd.ch/def/dgeo/les-etablissements-scolaires

export interface Establishment {
  name: string
  city: string
  lat: number
  lng: number
}

export const establishments: Establishment[] = [
  { name: 'Établissements scolaires de Lausanne', city: 'Lausanne', lat: 46.5197, lng: 6.6323 },
  { name: 'Établissement primaire et secondaire', city: 'Yverdon-les-Bains', lat: 46.7785, lng: 6.6413 },
  { name: 'Établissement primaire et secondaire', city: 'Nyon', lat: 46.383, lng: 6.2399 },
  { name: 'Établissement primaire et secondaire', city: 'Morges', lat: 46.5108, lng: 6.4986 },
  { name: 'Établissement primaire et secondaire', city: 'Vevey', lat: 46.4625, lng: 6.8429 },
  { name: 'Établissement secondaire', city: 'Montreux', lat: 46.4312, lng: 6.9107 },
  { name: 'Établissement primaire et secondaire', city: 'Renens', lat: 46.5394, lng: 6.5878 },
  { name: 'Établissement primaire et secondaire', city: 'Pully', lat: 46.5096, lng: 6.6615 },
  { name: 'Établissement primaire et secondaire', city: 'Gland', lat: 46.4203, lng: 6.2696 },
  { name: 'Établissement primaire et secondaire', city: 'Payerne', lat: 46.8222, lng: 6.9374 },
  { name: 'Établissement primaire et secondaire', city: 'Échallens', lat: 46.6423, lng: 6.6336 },
  { name: 'Établissement primaire et secondaire', city: 'Aigle', lat: 46.3173, lng: 6.9669 },
  { name: 'Établissement primaire et secondaire', city: 'Orbe', lat: 46.7256, lng: 6.5318 },
  { name: 'Établissement primaire et secondaire', city: 'Moudon', lat: 46.6684, lng: 6.7986 },
  { name: 'Établissement primaire et secondaire', city: 'Rolle', lat: 46.4589, lng: 6.3382 },
  { name: 'Établissement primaire et secondaire', city: 'Cossonay', lat: 46.6122, lng: 6.5082 },
  { name: 'Établissement primaire et secondaire', city: 'Bex', lat: 46.2517, lng: 6.9988 },
  { name: 'Établissement primaire et secondaire', city: 'Prilly', lat: 46.5353, lng: 6.6047 },
]

export const ESTABLISHMENTS_DIRECTORY_URL = 'https://www.vd.ch/def/dgeo/les-etablissements-scolaires'

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import {
  User, MapPin, Users as UsersIcon, Landmark, GraduationCap, CalendarCheck,
  FileText, Plus, Trash2, ExternalLink, Save, Info, ShieldCheck,
} from 'lucide-vue-next'
import Footer from '../components/Footer.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'
import { useTheme } from '../composables/useTheme'
import { yearLevels, subjectsForLevels } from '../data/vaud'

const MIREO_URL = 'https://prestations.vd.ch/pub/mireo/#/'

const { currentTheme } = useTheme()
const accentColor = computed(() =>
  ({ creme: '#FD4401', nuit: '#FF5A1F', foret: '#B8621B', lavande: '#7C3F8C', vaud: '#00843D' })[currentTheme.value],
)

// All doodles live in the left/right gutters or top/bottom whitespace so they
// never sit on top of form text.
const doodles: Doodle[] = [
  // left gutter (top -> bottom)
  { name: 'rocket', top: '5%', left: '2%', size: 84, rotate: -12, opacity: 0.5 },
  { name: 'pencil', top: '28%', left: '3%', size: 58, rotate: 10, opacity: 0.5 },
  { name: 'schoolbus', top: '52%', left: '2%', size: 88, rotate: -3, opacity: 0.5 },
  { name: 'partyhat', top: '76%', left: '4%', size: 52, opacity: 0.5 },
  // right gutter (top -> bottom)
  { name: 'star', top: '8%', right: '3%', size: 46, opacity: 0.6 },
  { name: 'sun-rays', top: '30%', right: '3%', size: 70, opacity: 0.45 },
  { name: 'bunting', top: '54%', right: '2%', size: 82, opacity: 0.4 },
  { name: 'balloon', top: '78%', right: '4%', size: 52, opacity: 0.5 },
  // corners
  { name: 'sparkle', bottom: '4%', right: '8%', size: 40, opacity: 0.6 },
  { name: 'asterisk', bottom: '5%', left: '9%', size: 42, opacity: 0.5 },
]

// ---- Form state -------------------------------------------------------------
const identity = reactive({
  email: '',
  avs: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  gender: '',
  nationality: 'Suisse',
  mobile: '',
  privatePhone: '',
})

const address = reactive({
  street: '',
  zip: '',
  city: '',
  canton: 'Vaud (VD)',
  sameForCorrespondence: true,
  cStreet: '',
  cZip: '',
  cCity: '',
})

const family = reactive({
  hasChildren: false,
  childrenCount: 1,
  familyAllowance: false,
})

const bank = reactive({
  bankName: '',
  iban: '',
  isAccountHolder: true,
  holderFirstName: '',
  holderLastName: '',
})

interface Diploma {
  system: string
  school: string
  title: string
  country: string
  date: string
  inProgress: boolean
}
const noDiploma = ref(false)
const diplomas = ref<Diploma[]>([
  { system: '', school: '', title: '', country: 'Suisse', date: '', inProgress: false },
])
function addDiploma() {
  diplomas.value.push({ system: '', school: '', title: '', country: 'Suisse', date: '', inProgress: false })
}
function removeDiploma(i: number) {
  diplomas.value.splice(i, 1)
}

const availability = reactive({
  active: true,
  ownVehicle: false,
})
const classTypes = yearLevels
const selectedClasses = ref<string[]>([])
const selectedSubjects = ref<string[]>([])
const availableSubjects = computed(() =>
  selectedClasses.value.length ? subjectsForLevels(selectedClasses.value) : [],
)
const showSubjects = computed(() => availableSubjects.value.length > 0)
// Garde la sélection cohérente avec les niveaux choisis
watch(availableSubjects, (subs) => {
  selectedSubjects.value = selectedSubjects.value.filter((s) => subs.includes(s))
})

const regions = [
  'Lausanne', 'Ouest lausannois', 'Morges', 'Nyon', 'Gros-de-Vaud',
  'Nord vaudois', 'Broye-Vully', 'Lavaux-Oron', 'Riviera-Pays-d\'Enhaut', 'Aigle-Chablais',
]
const selectedRegions = ref<string[]>([])

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
type Slot = 'am' | 'pm'
const dayAvailability = reactive<Record<string, Record<Slot, boolean>>>(
  Object.fromEntries(days.map((d) => [d, { am: false, pm: false }])),
)
function slotOn(d: string, s: Slot): boolean {
  return dayAvailability[d]?.[s] ?? false
}
function toggleSlot(d: string, s: Slot) {
  const day = dayAvailability[d]
  if (day) day[s] = !day[s]
}

const documents = [
  { id: 'avs', label: 'Copie de la carte AVS', required: true },
  { id: 'id', label: "Copie de la carte d'identité (recto-verso)", required: true },
  { id: 'permit', label: 'Permis de séjour (frontaliers / étrangers)', required: false },
  { id: 'tax', label: "Formulaire d'impôt à la source (frontaliers)", required: false },
  { id: 'third', label: 'Attestation tiers (si autre titulaire du compte)', required: false },
]
const uploaded = reactive<Record<string, string>>({})
function onFile(id: string, e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) uploaded[id] = f.name
}

function toggle(list: { value: string[] }, id: string) {
  const i = list.value.indexOf(id)
  if (i === -1) list.value.push(id)
  else list.value.splice(i, 1)
}

const saved = ref(false)
function saveDraft() {
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}
</script>

<template>
  <div class="bg-background relative" style="min-height:100vh; overflow-x:hidden;">
    <DoodleBackground :items="doodles" />

    <div class="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <!-- Header -->
      <div class="mb-10">
        <span class="inline-block text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
          Onboarding remplaçant·e
        </span>
        <h1 class="text-[clamp(2.25rem,7vw,3.75rem)] mb-4 leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
          Créez votre <span class="text-primary">profil</span>
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Préparez ici toutes les coordonnées nécessaires à la création de votre dossier
          <strong>MIREO</strong> (Module d'inscription des remplaçants de l'enseignement obligatoire — Canton de Vaud).
          Une fois complété, reportez-les sur la plateforme officielle.
        </p>

        <!-- MIREO info banner -->
        <div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-[20px] bg-muted">
          <Info :size="22" class="text-primary shrink-0" />
          <p class="text-sm text-foreground/80 flex-1">
            Pour créer un dossier MIREO, vous devez disposer d'une adresse email et d'un numéro de
            téléphone portable <strong>suisse</strong>. Le numéro AVS est obligatoire pour les ressortissant·e·s suisses.
          </p>
          <a
            :href="MIREO_URL" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold whitespace-nowrap shrink-0"
          >
            Ouvrir MIREO
            <ExternalLink :size="16" />
          </a>
        </div>
      </div>

      <form class="space-y-7" @submit.prevent="saveDraft">
        <!-- 1. Identité & contact -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <User :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Identité &amp; contact
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-2 text-foreground">Adresse email *</label>
              <input v-model="identity.email" type="email" placeholder="prenom.nom@exemple.ch" class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Prénom *</label>
              <input v-model="identity.firstName" type="text" placeholder="Marc" class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Nom *</label>
              <input v-model="identity.lastName" type="text" placeholder="Renaud" class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Date de naissance *</label>
              <input v-model="identity.birthDate" type="date" class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Sexe</label>
              <select v-model="identity.gender" class="field">
                <option value="">Sélectionner…</option>
                <option>Féminin</option>
                <option>Masculin</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Numéro AVS</label>
              <input v-model="identity.avs" type="text" placeholder="756.0000.0000.00" class="field" />
              <p class="text-xs text-muted-foreground mt-1.5">Obligatoire si nationalité suisse.</p>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Nationalité *</label>
              <select v-model="identity.nationality" class="field">
                <option>Suisse</option>
                <option>France</option>
                <option>Italie</option>
                <option>Allemagne</option>
                <option>Portugal</option>
                <option>Autre (UE/AELE)</option>
                <option>Autre (hors UE/AELE)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Téléphone portable (CH) *</label>
              <input v-model="identity.mobile" type="tel" placeholder="+41 79 123 45 67" class="field" />
              <p class="text-xs text-muted-foreground mt-1.5">Numéro suisse requis pour la connexion MIREO.</p>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Téléphone privé (optionnel)</label>
              <input v-model="identity.privatePhone" type="tel" placeholder="+41 21 000 00 00" class="field" />
            </div>
          </div>
        </section>

        <!-- 2. Adresse -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <MapPin :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Adresse
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-6 gap-5">
            <div class="md:col-span-6">
              <label class="block text-sm font-semibold mb-2 text-foreground">Rue et numéro *</label>
              <input v-model="address.street" type="text" placeholder="Avenue de la Gare 1" class="field" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-2 text-foreground">NPA *</label>
              <input v-model="address.zip" type="text" placeholder="1003" class="field" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-2 text-foreground">Localité *</label>
              <input v-model="address.city" type="text" placeholder="Lausanne" class="field" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-2 text-foreground">Canton *</label>
              <select v-model="address.canton" class="field">
                <option>Vaud (VD)</option>
                <option>Genève (GE)</option>
                <option>Fribourg (FR)</option>
                <option>Valais (VS)</option>
                <option>Neuchâtel (NE)</option>
                <option>Jura (JU)</option>
                <option>Hors canton</option>
              </select>
            </div>
          </div>
          <label class="flex items-center gap-3 mt-5 cursor-pointer select-none">
            <input v-model="address.sameForCorrespondence" type="checkbox" class="checkbox" />
            <span class="text-sm text-foreground/80">L'adresse de correspondance est identique à l'adresse officielle</span>
          </label>
          <div v-if="!address.sameForCorrespondence" class="grid grid-cols-1 md:grid-cols-6 gap-5 mt-5 pt-5 border-t border-border">
            <div class="md:col-span-6">
              <label class="block text-sm font-semibold mb-2 text-foreground">Adresse de correspondance</label>
              <input v-model="address.cStreet" type="text" placeholder="Rue et numéro" class="field" />
            </div>
            <div class="md:col-span-2">
              <input v-model="address.cZip" type="text" placeholder="NPA" class="field" />
            </div>
            <div class="md:col-span-4">
              <input v-model="address.cCity" type="text" placeholder="Localité" class="field" />
            </div>
          </div>
        </section>

        <!-- 3. Situation familiale -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <UsersIcon :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Situation familiale
            </h2>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4 p-4 rounded-[16px] bg-foreground/5">
              <span class="text-sm font-medium text-foreground">Avez-vous des enfants ?</span>
              <ToggleSwitch v-model:checked="family.hasChildren" :accent-color="accentColor" />
            </div>
            <div v-if="family.hasChildren" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-2 text-foreground">Nombre d'enfants</label>
                <input v-model.number="family.childrenCount" type="number" min="1" class="field" />
              </div>
              <div class="flex items-center justify-between gap-4 p-4 rounded-[16px] bg-foreground/5">
                <span class="text-sm font-medium text-foreground">Percevez-vous les allocations familiales ?</span>
                <ToggleSwitch v-model:checked="family.familyAllowance" :accent-color="accentColor" />
              </div>
            </div>
          </div>
        </section>

        <!-- 4. Données bancaires -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <Landmark :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Données bancaires
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Nom de la banque *</label>
              <input v-model="bank.bankName" type="text" placeholder="Banque Cantonale Vaudoise" class="field" />
              <p class="text-xs text-muted-foreground mt-1.5">Compte Revolut : indiquez la référence de votre compte ici.</p>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">IBAN *</label>
              <input v-model="bank.iban" type="text" placeholder="CH00 0000 0000 0000 0000 0" class="field" />
            </div>
          </div>
          <label class="flex items-center gap-3 mt-5 cursor-pointer select-none">
            <input v-model="bank.isAccountHolder" type="checkbox" class="checkbox" />
            <span class="text-sm text-foreground/80">Je suis le·la titulaire du compte</span>
          </label>
          <div v-if="!bank.isAccountHolder" class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 pt-5 border-t border-border">
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Prénom du·de la titulaire</label>
              <input v-model="bank.holderFirstName" type="text" class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Nom du·de la titulaire</label>
              <input v-model="bank.holderLastName" type="text" class="field" />
            </div>
          </div>
        </section>

        <!-- 5. Titres & formation -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <GraduationCap :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Titres &amp; formation
            </h2>
          </div>

          <label class="flex items-center gap-3 mb-5 cursor-pointer select-none">
            <input v-model="noDiploma" type="checkbox" class="checkbox" />
            <span class="text-sm text-foreground/80">Je n'ai aucun titre significatif</span>
          </label>

          <div v-if="!noDiploma" class="space-y-5">
            <div
              v-for="(d, i) in diplomas" :key="i"
              class="p-5 rounded-[18px] bg-foreground/5 relative"
            >
              <button
                v-if="diplomas.length > 1" type="button"
                class="absolute top-3 right-3 text-foreground/40 hover:text-destructive transition-colors"
                @click="removeDiploma(i)"
              >
                <Trash2 :size="18" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold mb-2 text-foreground">Système de formation</label>
                  <input v-model="d.system" type="text" placeholder="HEP, Université, ES…" class="field" />
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-foreground">École ou faculté</label>
                  <input v-model="d.school" type="text" placeholder="HEP Vaud" class="field" />
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-foreground">Nom du titre</label>
                  <input v-model="d.title" type="text" placeholder="Bachelor en enseignement primaire" class="field" />
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-foreground">Pays d'obtention</label>
                  <input v-model="d.country" type="text" class="field" />
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-foreground">Date d'obtention</label>
                  <input v-model="d.date" type="date" class="field" :disabled="d.inProgress" />
                </div>
                <label class="flex items-center gap-3 mt-7 cursor-pointer select-none">
                  <input v-model="d.inProgress" type="checkbox" class="checkbox" />
                  <span class="text-sm text-foreground/80">Formation en cours</span>
                </label>
              </div>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-border text-foreground font-semibold hover:border-primary/40 transition-colors"
              @click="addDiploma"
            >
              <Plus :size="18" />
              Ajouter un titre
            </button>
          </div>
        </section>

        <!-- 6. Disponibilités & préférences -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <CalendarCheck :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Disponibilités &amp; préférences
            </h2>
          </div>

          <div class="flex items-center justify-between gap-4 p-4 rounded-[16px] bg-foreground/5 mb-6">
            <div>
              <div class="text-sm font-semibold text-foreground">Disponible pour des remplacements</div>
              <div class="text-xs text-muted-foreground">Les établissements pourront vous contacter</div>
            </div>
            <ToggleSwitch v-model:checked="availability.active" :accent-color="accentColor" />
          </div>

          <!-- Types de classes -->
          <label class="block text-sm font-semibold mb-3 text-foreground">Degrés / années préférés</label>
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="ct in classTypes" :key="ct.id" type="button"
              class="px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
              :class="selectedClasses.includes(ct.id)
                ? 'bg-primary text-primary-foreground border-transparent'
                : 'bg-transparent text-foreground/70 border-border hover:border-primary/40'"
              @click="toggle({ value: selectedClasses }, ct.id)"
            >
              {{ ct.label }}
            </button>
          </div>

          <!-- Disciplines en fonction des degrés choisis -->
          <div v-if="showSubjects" class="mb-6">
            <label class="block text-sm font-semibold mb-3 text-foreground">Disciplines (selon les degrés)</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in availableSubjects" :key="s" type="button"
                class="px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
                :class="selectedSubjects.includes(s)
                  ? 'bg-secondary text-secondary-foreground border-transparent'
                  : 'bg-transparent text-foreground/70 border-border hover:border-primary/40'"
                @click="toggle({ value: selectedSubjects }, s)"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Disponibilités habituelles -->
          <label class="block text-sm font-semibold mb-3 text-foreground">Disponibilités habituelles</label>
          <div class="overflow-x-auto -mx-1 px-1 mb-6">
            <table class="w-full min-w-[420px] border-separate" style="border-spacing:6px">
              <thead>
                <tr>
                  <th></th>
                  <th v-for="d in days" :key="d" class="text-xs font-medium text-muted-foreground pb-1">{{ d.slice(0, 3) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="slot in (['am','pm'] as const)" :key="slot">
                  <td class="text-xs font-semibold text-muted-foreground pr-2 whitespace-nowrap">
                    {{ slot === 'am' ? 'Matin' : 'Après-midi' }}
                  </td>
                  <td v-for="d in days" :key="d">
                    <button
                      type="button"
                      class="w-full h-10 rounded-[12px] text-xs font-semibold border-2 transition-all"
                      :class="slotOn(d, slot)
                        ? 'bg-primary text-primary-foreground border-transparent'
                        : 'bg-transparent text-foreground/50 border-border hover:border-primary/40'"
                      @click="toggleSlot(d, slot)"
                    >
                      {{ slotOn(d, slot) ? '✓' : '–' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Régions -->
          <label class="block text-sm font-semibold mb-3 text-foreground">Régions où vous pouvez remplacer (VD)</label>
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="r in regions" :key="r" type="button"
              class="px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
              :class="selectedRegions.includes(r)
                ? 'bg-primary text-primary-foreground border-transparent'
                : 'bg-transparent text-foreground/70 border-border hover:border-primary/40'"
              @click="toggle({ value: selectedRegions }, r)"
            >
              {{ r }}
            </button>
          </div>

          <!-- Transport -->
          <div class="flex items-center justify-between gap-4 p-4 rounded-[16px] bg-foreground/5">
            <div>
              <div class="text-sm font-semibold text-foreground">Véhicule personnel</div>
              <div class="text-xs text-muted-foreground">Utile pour les bâtiments éloignés des transports publics</div>
            </div>
            <ToggleSwitch v-model:checked="availability.ownVehicle" :accent-color="accentColor" />
          </div>
        </section>

        <!-- 7. Documents -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <FileText :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Documents à fournir
            </h2>
          </div>
          <p class="text-sm text-muted-foreground mb-5">
            Préparez ces documents — vous les téléverserez ensuite directement dans MIREO.
          </p>
          <div class="space-y-3">
            <div
              v-for="doc in documents" :key="doc.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[16px] border-2 border-border"
            >
              <div class="flex items-center gap-3">
                <FileText :size="18" class="text-primary shrink-0" />
                <span class="text-sm text-foreground">
                  {{ doc.label }}
                  <span v-if="doc.required" class="text-primary font-semibold">*</span>
                </span>
              </div>
              <div class="flex items-center gap-3">
                <span v-if="uploaded[doc.id]" class="text-xs text-green-600 font-medium truncate max-w-[160px]">
                  ✓ {{ uploaded[doc.id] }}
                </span>
                <label class="cursor-pointer text-sm font-semibold text-primary hover:underline whitespace-nowrap">
                  {{ uploaded[doc.id] ? 'Remplacer' : 'Choisir un fichier' }}
                  <input type="file" class="hidden" @change="(e) => onFile(doc.id, e)" />
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="submit"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save :size="20" />
            {{ saved ? 'Brouillon enregistré ✓' : 'Enregistrer le brouillon' }}
          </button>
          <a
            :href="MIREO_URL" target="_blank" rel="noopener noreferrer"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-border text-foreground text-base font-semibold hover:border-primary/40 transition-colors"
          >
            Continuer la création sur MIREO
            <ExternalLink :size="18" />
          </a>
        </div>

        <p class="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <ShieldCheck :size="14" />
          Vos données restent sur votre appareil tant que vous ne les reportez pas sur MIREO. Le canton décline toute responsabilité quant aux informations saisies sur le module officiel.
        </p>
      </form>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
.field {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 14px;
  border: 2px solid var(--border);
  background-color: var(--input-background);
  color: var(--foreground);
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s ease;
}
.field:focus {
  outline: none;
  border-color: var(--primary);
}
.field::placeholder {
  color: var(--muted-foreground);
  opacity: 0.7;
}
.checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}
</style>

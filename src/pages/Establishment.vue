<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Building2, Lock, LogOut, Send, ShieldCheck, Plus, Trash2, MapPin, Clock, BookOpen, Check, AlertCircle,
  Star, ClipboardCheck, ChevronDown,
} from 'lucide-vue-next'
import Footer from '../components/Footer.vue'
import ToggleSwitch from '../components/ToggleSwitch.vue'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'
import DropdownSelect from '../components/DropdownSelect.vue'
import { useEstablishment } from '../composables/useEstablishment'
import { useOffers, DAY_PARTS, type DayPart } from '../composables/useOffers'
import { useTheme } from '../composables/useTheme'
import { establishments, yearLevels, subjectsForLevels } from '../data/vaud'
import { replacements, contacts } from '../data/users'
import { useReports, type ReportKind } from '../composables/useReports'

const { session, isAuthenticated, login, logout } = useEstablishment()
const { offers, addOffer, removeOffer } = useOffers()
const { currentTheme } = useTheme()
const accentColor = computed(
  () => ({ creme: '#FD4401', nuit: '#FF5A1F', foret: '#B8621B', lavande: '#7C3F8C', vaud: '#00843D' })[currentTheme.value],
)

const doodles: Doodle[] = [
  { name: 'star3', top: '8%', left: '3%', size: 56, opacity: 0.5 },
  { name: 'scribble', top: '30%', left: '4%', size: 60, opacity: 0.45 },
  { name: 'ring', top: '60%', left: '4%', size: 50, opacity: 0.45 },
  { name: 'leaf4', bottom: '8%', left: '6%', size: 54, opacity: 0.45 },
  { name: 'bolt2', top: '14%', right: '4%', size: 48, opacity: 0.5 },
  { name: 'scribble2', top: '44%', right: '5%', size: 52, opacity: 0.45 },
  { name: 'raincloud2', bottom: '12%', right: '6%', size: 56, opacity: 0.45 },
]

// --- Gate (login) ---
const selectedEstId = ref<number | null>(null)
const estOptions = computed(() => establishments.map((e, i) => ({ value: i, label: `${e.city} — ${e.name}` })))
const accessCode = ref('')
const loginError = ref('')

function doLogin() {
  loginError.value = ''
  if (selectedEstId.value === null) {
    loginError.value = 'Sélectionnez votre établissement.'
    return
  }
  if (accessCode.value.trim().length < 4) {
    loginError.value = 'Saisissez le code d’accès (min. 4 caractères).'
    return
  }
  const est = establishments[selectedEstId.value]
  if (est) login({ name: est.name, city: est.city })
}

// --- Offer form ---
const form = ref({
  level: '',
  subject: '',
  periods: 4,
  startDate: '',
  endDate: '',
  schedule: '',
  daypart: 'Matin' as DayPart,
  urgent: false,
})
const formSubjects = computed(() => (form.value.level ? subjectsForLevels([form.value.level]) : []))
const published = ref(false)

const myOffers = computed(() =>
  offers.value.filter((o) => o.publishedBy && session.value && o.publishedBy === session.value.name + ' · ' + session.value.city),
)

function formatDate(d: string) {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString('fr-CH', { day: 'numeric', month: 'long', year: 'numeric' })
}

const canPublish = computed(
  () => form.value.level && form.value.subject && form.value.periods > 0 && form.value.startDate && form.value.endDate,
)

function publish() {
  if (!canPublish.value || !session.value) return
  addOffer({
    school: session.value.name === 'Établissements scolaires de Lausanne'
      ? session.value.name
      : `Établissement scolaire de ${session.value.city}`,
    subject: form.value.subject,
    level: form.value.level,
    periods: form.value.periods,
    startDate: formatDate(form.value.startDate),
    endDate: formatDate(form.value.endDate),
    location: `${session.value.city}, VD`,
    daypart: form.value.daypart,
    schedule: form.value.schedule,
    urgent: form.value.urgent,
    publishedBy: session.value.name + ' · ' + session.value.city,
  })
  published.value = true
  form.value = { level: '', subject: '', periods: 4, startDate: '', endDate: '', schedule: '', daypart: 'Matin', urgent: false }
  setTimeout(() => (published.value = false), 2600)
}

// --- Satisfaction reports ---
const { addReport, reportsFor, avgFor } = useReports()
const schoolNames = [...new Set(contacts.map((c) => c.school).filter(Boolean) as string[])]

const report = ref({
  kind: 'remplacant' as ReportKind,
  target: '',
  rating: 0,
  comment: '',
  level: '',
  discipline: '',
})
const reportTargets = computed(() =>
  report.value.kind === 'remplacant' ? replacements.map((r) => r.name) : schoolNames,
)
// Discipline options follow the selected year (HarmoS correlation)
const reportDisciplines = computed(() =>
  report.value.level ? subjectsForLevels([report.value.level]) : [],
)
const reportSent = ref(false)
const canSendReport = computed(() => report.value.target && report.value.rating > 0)
function setKind(k: ReportKind) {
  report.value.kind = k
  report.value.target = ''
}
function submitReport() {
  if (!canSendReport.value || !session.value) return
  const levelLabel = yearLevels.find((l) => l.id === report.value.level)?.label ?? ''
  const context = [report.value.discipline, levelLabel].filter(Boolean).join(' · ')
  addReport({
    kind: report.value.kind,
    subject: report.value.target,
    author: report.value.kind === 'remplacant' ? `${session.value.name} · ${session.value.city}` : session.value.name,
    rating: report.value.rating,
    comment: report.value.comment.trim() || '—',
    context,
  })
  report.value = { kind: report.value.kind, target: '', rating: 0, comment: '', level: '', discipline: '' }
  reportSent.value = true
  setTimeout(() => (reportSent.value = false), 2600)
}
// Keep discipline consistent if the year changes
watch(() => report.value.level, () => {
  if (!reportDisciplines.value.includes(report.value.discipline)) report.value.discipline = ''
})

// Consultation (viability)
function viability(name: string) {
  const n = reportsFor('remplacant', name).length
  if (n === 0) return { label: 'Pas encore évalué', cls: 'bg-foreground/10 text-foreground/60' }
  const a = avgFor('remplacant', name)
  if (a >= 4.5) return { label: 'Recommandé', cls: 'bg-green-100 text-green-700' }
  if (a >= 3.5) return { label: 'Fiable', cls: 'bg-green-50 text-green-700' }
  if (a >= 2.5) return { label: 'Correct', cls: 'bg-amber-100 text-amber-700' }
  return { label: 'À surveiller', cls: 'bg-red-100 text-red-700' }
}
const expanded = ref<string | null>(null)
function toggleExpand(name: string) {
  expanded.value = expanded.value === name ? null : name
}
</script>

<template>
  <div class="bg-background relative" style="min-height:100dvh; overflow-x:hidden;">
    <DoodleBackground :items="doodles" />

    <div class="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <div class="mb-8">
        <span class="inline-block text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
          Réservé aux établissements
        </span>
        <h1 class="text-[clamp(2.25rem,7vw,3.75rem)] mb-4 leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
          Espace <span class="text-primary">établissement</span>
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Publiez vos besoins de remplacement en quelques secondes. Les remplaçant·e·s qualifié·e·s peuvent
          ensuite postuler directement.
        </p>
      </div>

      <!-- GATE -->
      <div v-if="!isAuthenticated" class="rounded-[28px] p-6 sm:p-10 shadow-sm bg-card max-w-xl">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
            <Lock :size="24" class="text-primary" />
          </div>
          <h2 class="text-2xl leading-tight text-foreground" style="font-family:'DM Serif Display',serif">Accès sécurisé</h2>
        </div>

        <p class="text-sm text-muted-foreground mb-6 flex items-start gap-2">
          <ShieldCheck :size="18" class="text-primary shrink-0 mt-0.5" />
          Pour éviter les fausses offres, la publication est réservée aux secrétariats. Identifiez votre
          établissement avec le code d’accès fourni par la DGEO.
        </p>

        <label class="block text-sm font-semibold mb-2 text-foreground">Établissement</label>
        <div class="mb-5">
          <DropdownSelect
            v-model="selectedEstId"
            :options="estOptions"
            placeholder="Sélectionnez votre établissement…"
            aria-label="Établissement"
          />
        </div>

        <label class="block text-sm font-semibold mb-2 text-foreground">Code d’accès établissement</label>
        <input
          v-model="accessCode"
          type="password"
          placeholder="••••••••"
          class="w-full px-4 py-3 rounded-[14px] border-2 border-border bg-input-background text-foreground focus:outline-none focus:border-primary mb-2"
          @keyup.enter="doLogin"
        />
        <p class="text-xs text-muted-foreground mb-5">Démo : saisissez n’importe quel code d’au moins 4 caractères.</p>

        <p v-if="loginError" class="text-sm text-destructive mb-4 flex items-center gap-2">
          <AlertCircle :size="16" /> {{ loginError }}
        </p>

        <button
          class="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-full text-base font-bold shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.98]"
          @click="doLogin"
        >
          <Building2 :size="20" />
          Accéder à l’espace
        </button>
      </div>

      <!-- AUTHENTICATED -->
      <template v-else>
        <!-- Bandeau établissement -->
        <div class="rounded-[20px] p-5 bg-primary/10 border border-primary/20 flex items-center justify-between gap-4 mb-8">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary text-primary-foreground shrink-0">
              <Building2 :size="22" />
            </div>
            <div class="min-w-0">
              <div class="text-xs text-foreground/60">Connecté en tant que</div>
              <div class="font-bold text-foreground truncate">{{ session?.name }} — {{ session?.city }}</div>
            </div>
          </div>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-border text-sm font-semibold text-foreground hover:border-primary/40 transition-colors shrink-0"
            @click="logout"
          >
            <LogOut :size="16" />
            Quitter
          </button>
        </div>

        <!-- Formulaire rapide -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card mb-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <Plus :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Publier une offre
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Degré *</label>
              <DropdownSelect
                v-model="form.level"
                :options="yearLevels.map((l) => ({ value: l.id, label: l.label }))"
                placeholder="Sélectionner…"
                aria-label="Degré"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Discipline *</label>
              <DropdownSelect
                v-model="form.subject"
                :options="formSubjects"
                :disabled="!form.level"
                :placeholder="form.level ? 'Sélectionner…' : 'Choisissez d’abord un degré'"
                aria-label="Discipline"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Périodes / semaine *</label>
              <input v-model.number="form.periods" type="number" min="1" max="32" class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Horaire (optionnel)</label>
              <input v-model="form.schedule" type="text" placeholder="Lun-Mar-Mer 08:30-11:45" class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Début *</label>
              <input v-model="form.startDate" type="date" class="field" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Fin *</label>
              <input v-model="form.endDate" type="date" class="field" />
            </div>
          </div>

          <div class="mt-5">
            <label class="block text-sm font-semibold mb-3 text-foreground">Moment de la journée *</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="dp in DAY_PARTS" :key="dp" type="button"
                class="px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
                :class="form.daypart === dp
                  ? 'bg-primary text-primary-foreground border-transparent'
                  : 'bg-transparent text-foreground/70 border-border hover:border-primary/40'"
                @click="form.daypart = dp"
              >
                {{ dp }}
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between gap-4 p-4 rounded-[16px] bg-foreground/5 mt-5">
            <div>
              <div class="text-sm font-semibold text-foreground">Remplacement urgent</div>
              <div class="text-xs text-muted-foreground">Mis en avant dans le catalogue</div>
            </div>
            <ToggleSwitch v-model:checked="form.urgent" :accent-color="accentColor" />
          </div>

          <div class="flex items-center gap-4 mt-6">
            <button
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              :disabled="!canPublish"
              @click="publish"
            >
              <Send :size="20" />
              Publier l’offre
            </button>
            <span v-if="published" class="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
              <Check :size="16" /> Offre publiée — visible dans « Missions »
            </span>
          </div>
        </section>

        <!-- Offres publiées -->
        <section v-if="myOffers.length">
          <h3 class="text-lg font-bold text-foreground mb-4">Vos offres publiées ({{ myOffers.length }})</h3>
          <div class="space-y-4">
            <div
              v-for="o in myOffers"
              :key="o.id"
              class="rounded-[18px] p-5 bg-card border-2 border-border flex items-start justify-between gap-4"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 class="font-bold text-foreground">{{ o.subject }} · {{ o.level }}</h4>
                  <span v-if="o.urgent" class="px-2 py-0.5 rounded-full bg-destructive/15 text-destructive text-xs font-semibold">Urgent</span>
                </div>
                <div class="text-sm text-foreground/70 flex flex-wrap gap-x-4 gap-y-1">
                  <span class="inline-flex items-center gap-1"><Clock :size="14" /> {{ o.periods }} périodes/sem · {{ o.daypart }}</span>
                  <span class="inline-flex items-center gap-1"><BookOpen :size="14" /> {{ o.startDate }} → {{ o.endDate }}</span>
                  <span class="inline-flex items-center gap-1"><MapPin :size="14" /> {{ o.location }}</span>
                </div>
              </div>
              <button
                class="p-2 rounded-full text-foreground/55 hover:text-destructive hover:bg-foreground/5 transition-colors shrink-0"
                title="Retirer l’offre"
                @click="removeOffer(o.id)"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </section>
        <p v-else class="text-sm text-muted-foreground">Aucune offre publiée pour le moment.</p>

        <!-- Rapports de satisfaction -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card mt-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <ClipboardCheck :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Rapport de satisfaction
            </h2>
          </div>

          <!-- kind toggle -->
          <div class="flex flex-wrap gap-2 mb-5">
            <button
              type="button"
              class="px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
              :class="report.kind === 'remplacant' ? 'bg-primary text-primary-foreground border-transparent' : 'bg-transparent text-foreground/70 border-border hover:border-primary/40'"
              @click="setKind('remplacant')"
            >Sur un·e remplaçant·e</button>
            <button
              type="button"
              class="px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
              :class="report.kind === 'etablissement' ? 'bg-primary text-primary-foreground border-transparent' : 'bg-transparent text-foreground/70 border-border hover:border-primary/40'"
              @click="setKind('etablissement')"
            >Sur un établissement</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-2 text-foreground">
                {{ report.kind === 'remplacant' ? 'Remplaçant·e' : 'Établissement' }} *
              </label>
              <DropdownSelect v-model="report.target" :options="reportTargets" placeholder="Sélectionner…" aria-label="Sujet du rapport" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Année / degré</label>
              <DropdownSelect
                v-model="report.level"
                :options="yearLevels.map((l) => ({ value: l.id, label: l.label }))"
                placeholder="Sélectionner…"
                aria-label="Année"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-foreground">Discipline</label>
              <DropdownSelect
                v-model="report.discipline"
                :options="reportDisciplines"
                :disabled="!report.level"
                :placeholder="report.level ? 'Sélectionner…' : 'Choisissez d’abord une année'"
                aria-label="Discipline"
              />
            </div>
          </div>

          <div class="mt-5">
            <label class="block text-sm font-semibold mb-2 text-foreground">Note *</label>
            <div class="flex gap-1">
              <button v-for="n in 5" :key="n" type="button" @click="report.rating = n" :aria-label="`${n} étoile(s)`">
                <Star :size="28" :class="n <= report.rating ? 'text-amber-400 fill-amber-400' : 'text-foreground/25'" />
              </button>
            </div>
          </div>

          <div class="mt-5">
            <label class="block text-sm font-semibold mb-2 text-foreground">Commentaire</label>
            <textarea v-model="report.comment" rows="3" placeholder="Ponctualité, gestion de classe, autonomie…" class="field resize-none"></textarea>
          </div>

          <div class="flex items-center gap-4 mt-6">
            <button
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              :disabled="!canSendReport"
              @click="submitReport"
            >
              <Send :size="20" />
              Envoyer le rapport
            </button>
            <span v-if="reportSent" class="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
              <Check :size="16" /> Rapport enregistré
            </span>
          </div>
        </section>

        <!-- Viabilité des remplaçant·e·s -->
        <section class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card mt-8">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <ShieldCheck :size="22" class="text-primary" />
            </div>
            <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Viabilité des remplaçant·e·s
            </h2>
          </div>
          <p class="text-sm text-muted-foreground mb-5">Consultez la réputation d'un·e candidat·e avant de l'engager.</p>

          <div class="space-y-3">
            <div v-for="r in replacements" :key="r.id" class="rounded-[18px] border-2 border-border overflow-hidden">
              <button class="w-full p-4 flex items-center gap-4 text-left hover:bg-foreground/5 transition-colors" @click="toggleExpand(r.name)">
                <div class="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shrink-0" style="background-color:#FD4401">{{ r.avatar }}</div>
                <div class="min-w-0 flex-1">
                  <div class="font-bold text-foreground truncate">{{ r.name }}</div>
                  <div class="text-xs text-foreground/60 truncate">{{ r.subject }} · {{ r.level }}</div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <Star v-for="n in 5" :key="n" :size="15" :class="n <= Math.round(avgFor('remplacant', r.name)) ? 'text-amber-400 fill-amber-400' : 'text-foreground/20'" />
                </div>
                <span class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold" :class="viability(r.name).cls">{{ viability(r.name).label }}</span>
                <ChevronDown :size="18" class="text-foreground/55 transition-transform shrink-0" :class="expanded === r.name ? 'rotate-180' : ''" />
              </button>
              <div v-if="expanded === r.name" class="px-4 pb-4 space-y-3">
                <p v-if="reportsFor('remplacant', r.name).length === 0" class="text-sm text-foreground/65">Aucun avis pour l'instant.</p>
                <div v-for="rep in reportsFor('remplacant', r.name)" :key="rep.id" class="p-3 rounded-[14px] bg-foreground/5">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <div class="flex items-center gap-1">
                      <Star v-for="n in 5" :key="n" :size="13" :class="n <= rep.rating ? 'text-amber-400 fill-amber-400' : 'text-foreground/20'" />
                    </div>
                    <span class="text-xs text-foreground/65">{{ rep.context }} · {{ rep.date }}</span>
                  </div>
                  <p class="text-sm text-foreground/80">{{ rep.comment }}</p>
                  <p class="text-xs text-foreground/65 mt-1">— {{ rep.author }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
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
.field:disabled {
  opacity: 0.6;
}
.field::placeholder {
  color: var(--muted-foreground);
  opacity: 0.7;
}
</style>

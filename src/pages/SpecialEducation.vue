<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  HeartHandshake, Users, ClipboardList, Building2, ArrowRight, Info, ShieldCheck, GraduationCap, ExternalLink,
} from 'lucide-vue-next'
import Footer from '../components/Footer.vue'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'

const VD_URL =
  'https://www.vd.ch/formation/enseignement-obligatoire-et-pedagogie-specialisee/enseignement-specialise'

const doodles: Doodle[] = [
  { name: 'heart', top: '10%', left: '4%', size: 50, opacity: 0.5 },
  { name: 'people', top: '40%', left: '5%', size: 70, opacity: 0.45 },
  { name: 'leaf', top: '70%', left: '4%', size: 56, opacity: 0.45 },
  { name: 'star2', top: '14%', right: '5%', size: 52, opacity: 0.5 },
  { name: 'sparkle3', top: '44%', right: '6%', size: 44, opacity: 0.5 },
  { name: 'rainbow-mini', bottom: '10%', right: '8%', size: 64, opacity: 0.45 },
]

const measures = [
  {
    tag: 'MO',
    title: 'Mesures ordinaires',
    by: 'Décidées par la direction d’établissement',
    text: 'Aides pédagogiques et aménagements mis en place dans le cadre de l’école régulière (appui, différenciation, adaptations).',
  },
  {
    tag: 'MR',
    title: 'Mesures renforcées',
    by: 'Décidées par la DGEO (via la PES)',
    text: 'Pour les élèves présentant des difficultés très importantes ou un trouble/déficience invalidant, lorsque les mesures ordinaires ne suffisent pas.',
  },
]

const pesSteps = [
  'Analyse d’éligibilité initiale',
  'Dépôt de la demande (formulaire en ligne)',
  'Réseau interdisciplinaire avec les parents',
  'Signature du protocole et décision (octroi / refus)',
]

const pros = [
  'Enseignant·e·s spécialisé·e·s',
  'Psychologues (PPLS)',
  'Logopédistes',
  'Psychomotricien·ne·s',
  'Médecins scolaires',
  'Pédopsychiatres',
  'Doyen·ne·s & coordinateur·rice·s',
]
</script>

<template>
  <div class="bg-background relative" style="min-height:100vh; overflow-x:hidden;">
    <DoodleBackground :items="doodles" />

    <div class="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <!-- Header -->
      <div class="mb-10">
        <span class="inline-block text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
          Pédagogie spécialisée — Canton de Vaud
        </span>
        <h1 class="text-[clamp(2.25rem,7vw,3.75rem)] mb-4 leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
          Enseignement <span class="text-primary">spécialisé</span>
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Accompagner les élèves dont un trouble avéré entrave durablement les capacités d’apprentissage,
          lorsque les mesures usuelles ne suffisent pas.
        </p>
      </div>

      <!-- Pour qui -->
      <div class="rounded-[24px] p-6 sm:p-8 bg-card shadow-sm mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
            <HeartHandshake :size="22" class="text-primary" />
          </div>
          <h2 class="text-[clamp(1.4rem,4.5vw,1.85rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
            Pour qui ?
          </h2>
        </div>
        <p class="text-foreground/80 leading-relaxed">
          Pour les élèves de l’enseignement obligatoire présentant des besoins éducatifs particuliers
          (troubles, déficiences) qui limitent leur participation à la scolarité ordinaire et leurs perspectives.
        </p>
      </div>

      <!-- MO vs MR -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div
          v-for="m in measures" :key="m.tag"
          class="rounded-[24px] p-6 sm:p-7 border-2 bg-card"
          :class="m.tag === 'MR' ? 'border-primary/30' : 'border-border'"
        >
          <div class="flex items-center gap-3 mb-3">
            <span
              class="inline-flex items-center justify-center w-10 h-10 rounded-[12px] font-bold"
              :class="m.tag === 'MR' ? 'bg-primary text-primary-foreground' : 'bg-foreground/10 text-foreground'"
            >{{ m.tag }}</span>
            <h3 class="text-lg font-bold text-foreground">{{ m.title }}</h3>
          </div>
          <p class="text-xs font-semibold text-primary mb-2">{{ m.by }}</p>
          <p class="text-sm text-foreground/75 leading-relaxed">{{ m.text }}</p>
        </div>
      </div>

      <!-- PES -->
      <div class="rounded-[28px] p-6 sm:p-8 bg-card shadow-sm mb-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
            <ClipboardList :size="22" class="text-primary" />
          </div>
          <div>
            <div class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Accès aux mesures renforcées</div>
            <h2 class="text-[clamp(1.3rem,4vw,1.7rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
              Procédure d’évaluation standardisée (PES)
            </h2>
          </div>
        </div>
        <ol class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <li v-for="(s, i) in pesSteps" :key="i" class="flex items-start gap-3 p-4 rounded-[16px] bg-foreground/5">
            <span class="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">{{ i + 1 }}</span>
            <span class="text-sm text-foreground/80">{{ s }}</span>
          </li>
        </ol>
      </div>

      <!-- Professionnels + structures -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div class="rounded-[24px] p-6 sm:p-7 bg-card shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <Users :size="20" class="text-primary" />
            <h3 class="font-bold text-foreground">Professionnel·le·s impliqué·e·s</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="p in pros" :key="p" class="px-3 py-1.5 rounded-full bg-foreground/5 text-sm text-foreground/80">{{ p }}</span>
          </div>
        </div>
        <div class="rounded-[24px] p-6 sm:p-7 bg-card shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <Building2 :size="20" class="text-primary" />
            <h3 class="font-bold text-foreground">Structures</h3>
          </div>
          <p class="text-sm text-foreground/75 leading-relaxed">
            Les <strong>Classes régionales de pédagogie spécialisée (CRPS)</strong> sont intégrées aux écoles
            régulières, sous la responsabilité de la direction d’établissement.
          </p>
        </div>
      </div>

      <!-- Remplacer dans le spécialisé -->
      <div class="rounded-[24px] p-6 sm:p-8 bg-muted mb-8">
        <div class="flex items-start gap-4">
          <GraduationCap :size="24" class="text-primary shrink-0 mt-0.5" />
          <div>
            <h3 class="text-lg font-bold text-foreground mb-2">Remplacer dans l’enseignement spécialisé</h3>
            <p class="text-sm text-foreground/80 leading-relaxed">
              Les remplacements en pédagogie spécialisée demandent idéalement un <strong>titre en enseignement
              spécialisé</strong> (Master, HEP) ou une solide expérience validée. Indiquez vos titres et votre
              intérêt pour ce domaine dans votre profil — les établissements pourront vous solliciter.
            </p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <RouterLink to="/create-profile" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
            Compléter mon profil
            <ArrowRight :size="18" />
          </button>
        </RouterLink>
        <a :href="VD_URL" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-border text-foreground text-base font-semibold hover:border-primary/40 transition-colors">
            Documentation officielle (vd.ch)
            <ExternalLink :size="18" />
          </button>
        </a>
      </div>

      <p class="flex items-center gap-2 text-xs text-muted-foreground mt-6">
        <Info :size="14" />
        Informations indicatives — DGEO / pédagogie spécialisée, Canton de Vaud.
      </p>
      <p class="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <ShieldCheck :size="14" />
        Acronymes : PES (procédure d’évaluation standardisée), MO/MR (mesures ordinaires/renforcées), CRPS, PPLS.
      </p>
    </div>

    <Footer />
  </div>
</template>

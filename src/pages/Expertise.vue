<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  ClipboardCheck, Users, GraduationCap, Coins, ArrowRight, Info, ShieldCheck, School,
} from 'lucide-vue-next'
import Footer from '../components/Footer.vue'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'
import EstablishmentsMap from '../components/EstablishmentsMap.vue'
import GrilleHoraire from '../components/GrilleHoraire.vue'

const doodles: Doodle[] = [
  // left gutter
  { name: 'star2', top: '18%', left: '4%', size: 56, rotate: -8, opacity: 0.5 },
  { name: 'sparkle3', top: '40%', left: '5%', size: 44, opacity: 0.55 },
  { name: 'droplet', top: '62%', left: '5%', size: 40, opacity: 0.5 },
  { name: 'snowflake', bottom: '9%', left: '6%', size: 52, opacity: 0.45 },
  // right gutter
  { name: 'diamond', top: '10%', right: '5%', size: 52, opacity: 0.5 },
  { name: 'people', top: '36%', right: '5%', size: 74, opacity: 0.45 },
  { name: 'kite', top: '62%', right: '6%', size: 66, opacity: 0.45 },
  { name: 'heart-fill', bottom: '9%', right: '6%', size: 46, opacity: 0.5 },
]

const criteria = [
  {
    icon: Users,
    title: 'Sélection & recrutement',
    subtitle: 'Qui vous choisit ?',
    remplacement:
      'Vous postulez largement. Dès que votre profil est validé, vous apparaissez dans un catalogue général : les secrétariats d\'école y piochent directement, au jour le jour, selon les urgences (maladie, congé maternité).',
    expert:
      'Vous ne pouvez pas vous proposer librement. Les experts des examens de certificat (11e HarmoS) sont strictement mandatés et nommés à l\'avance par la DGEO ou la direction des collèges. Ce sont surtout des enseignant·e·s en place ou des spécialistes très ciblé·e·s.',
  },
  {
    icon: GraduationCap,
    title: 'Diplômes & profil',
    subtitle: 'Quelles exigences ?',
    remplacement:
      'Critères flexibles. En cas de forte pénurie, l\'État de Vaud accepte des étudiant·e·s de la HEP Vaud, des universitaires ou des personnes sans diplôme pédagogique complet pour de courtes durées.',
    expert:
      'Exigences strictes et non négociables. Pour évaluer un examen cantonal, vous devez maîtriser le Plan d\'études romand (PER), connaître précisément les barèmes officiels et posséder les titres requis dans la discipline.',
  },
  {
    icon: Coins,
    title: 'Rémunération',
    subtitle: 'Comment êtes-vous payé·e ?',
    remplacement:
      'Au taux horaire / à la période effective de cours donnée en classe.',
    expert:
      'Au forfait d\'indemnisation : une indemnité fixe englobant la relecture des écrits et/ou la présence aux oraux, régie par la Décision officielle n°156 de l\'État de Vaud.',
  },
]
</script>

<template>
  <div class="bg-background relative" style="min-height:100vh; overflow-x:hidden;">
    <DoodleBackground :items="doodles" />

    <div class="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <!-- Header -->
      <div class="mb-10">
        <span class="inline-block text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
          Deux statuts, une plateforme
        </span>
        <h1 class="text-[clamp(2.25rem,7vw,3.75rem)] mb-4 leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
          Expertise aux <span class="text-primary">examens</span>
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl">
          Le portail MIREO gère la paie des remplaçant·e·s <strong>et</strong> des expert·e·s aux examens — mais selon
          des règles opposées. Voici comment distinguer les deux rôles.
        </p>
      </div>

      <!-- Quick comparison cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        <div class="rounded-[24px] p-6 sm:p-7 border-2 border-primary/30 bg-primary/5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
              <School :size="22" />
            </div>
            <h2 class="text-xl font-bold text-foreground">Remplacement en classe</h2>
          </div>
          <p class="text-sm text-foreground/70 leading-relaxed">
            Vous assurez la continuité des cours quand un·e enseignant·e est absent·e. Profil souple, mise en relation
            rapide, paiement à la période.
          </p>
          <div class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Géré depuis « Missions »
          </div>
        </div>

        <div class="rounded-[24px] p-6 sm:p-7 border-2 border-secondary bg-secondary/15">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
              <ClipboardCheck :size="22" />
            </div>
            <h2 class="text-xl font-bold text-foreground">Expertise aux examens</h2>
          </div>
          <p class="text-sm text-foreground/70 leading-relaxed">
            Vous évaluez les examens de certificat (11e HarmoS). Rôle mandaté, exigences strictes, indemnité forfaitaire.
          </p>
          <div class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary-foreground/80">
            Sur nomination de la DGEO
          </div>
        </div>
      </div>

      <!-- Detailed criteria -->
      <div class="space-y-6">
        <article
          v-for="(c, i) in criteria" :key="i"
          class="rounded-[28px] p-6 sm:p-8 shadow-sm bg-card"
        >
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full flex items-center justify-center bg-primary/10">
              <component :is="c.icon" :size="22" class="text-primary" />
            </div>
            <div>
              <div class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{{ c.subtitle }}</div>
              <h3 class="text-[clamp(1.3rem,4vw,1.7rem)] leading-tight text-foreground" style="font-family:'DM Serif Display',serif">
                {{ c.title }}
              </h3>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="rounded-[18px] p-5 bg-primary/5 border-l-4 border-primary">
              <div class="flex items-center gap-2 mb-2">
                <School :size="16" class="text-primary" />
                <span class="text-sm font-bold text-foreground">Remplacement</span>
              </div>
              <p class="text-sm text-foreground/75 leading-relaxed">{{ c.remplacement }}</p>
            </div>
            <div class="rounded-[18px] p-5 border-l-4 border-secondary" style="background-color:color-mix(in srgb, var(--secondary) 14%, transparent)">
              <div class="flex items-center gap-2 mb-2">
                <ClipboardCheck :size="16" class="text-secondary-foreground" />
                <span class="text-sm font-bold text-foreground">Expertise</span>
              </div>
              <p class="text-sm text-foreground/75 leading-relaxed">{{ c.expert }}</p>
            </div>
          </div>
        </article>
      </div>

      <!-- Summary -->
      <div class="mt-10 rounded-[24px] p-6 sm:p-8 bg-muted">
        <div class="flex items-start gap-4">
          <Info :size="24" class="text-primary shrink-0 mt-0.5" />
          <div>
            <h3 class="text-lg font-bold text-foreground mb-2">En résumé</h3>
            <p class="text-sm text-foreground/80 leading-relaxed">
              Si vous cochez uniquement « Remplaçant » sur votre profil, vous ne serez <strong>jamais</strong> appelé·e
              pour les examens de fin d'année. Pour devenir expert·e, votre dossier doit montrer une solide expérience
              pédagogique validée par la DGEO, ou vous devez avoir été sollicité·e personnellement par un doyen ou une
              direction d'établissement.
            </p>
          </div>
        </div>
      </div>

      <!-- Carte des établissements + grilles horaires -->
      <div class="mt-10 space-y-6">
        <EstablishmentsMap />
        <GrilleHoraire />
      </div>

      <!-- CTA -->
      <div class="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <RouterLink to="/create-profile" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
            Compléter mon profil
            <ArrowRight :size="18" />
          </button>
        </RouterLink>
        <RouterLink to="/missions" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-border text-foreground text-base font-semibold hover:border-primary/40 transition-colors">
            Voir les remplacements
          </button>
        </RouterLink>
      </div>

      <p class="flex items-center gap-2 text-xs text-muted-foreground mt-6">
        <ShieldCheck :size="14" />
        Informations indicatives basées sur le fonctionnement de MIREO (DGEO — Canton de Vaud).
      </p>
    </div>

    <Footer />
  </div>
</template>

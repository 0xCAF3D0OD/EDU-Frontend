<script setup lang="ts">
import { ref } from 'vue'
import { Clock, ChevronDown } from 'lucide-vue-next'
import { grilles } from '../data/vaud'

const open = ref(false)
</script>

<template>
  <div class="rounded-[24px] border-2 border-border bg-card overflow-hidden">
    <button
      class="w-full p-5 flex items-center justify-between gap-4 text-left"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="flex items-center gap-2 font-bold text-foreground">
        <Clock :size="20" class="text-primary" />
        Grilles horaires officielles (VD)
      </span>
      <ChevronDown :size="20" class="text-muted-foreground transition-transform" :class="open ? 'rotate-180' : ''" />
    </button>

    <div v-if="open" class="px-5 pb-6 space-y-8">
      <div v-for="g in grilles" :key="g.id">
        <h4 class="font-bold text-foreground mb-3">{{ g.title }}</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="text-muted-foreground">
                <th class="text-left font-semibold py-2 pr-3">Discipline</th>
                <th class="text-center font-semibold py-2 px-3 whitespace-nowrap">{{ g.colA }}</th>
                <th class="text-center font-semibold py-2 px-3 whitespace-nowrap">{{ g.colB }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in g.rows" :key="i" class="border-t border-border">
                <td class="py-2 pr-3 text-foreground/85">{{ r.discipline }}</td>
                <td class="py-2 px-3 text-center text-foreground/85">{{ r.a }}</td>
                <td class="py-2 px-3 text-center text-foreground/85">{{ r.b }}</td>
              </tr>
              <tr class="border-t-2 border-primary/40 font-bold text-foreground">
                <td class="py-2 pr-3">Total</td>
                <td class="py-2 px-3 text-center">{{ g.total.a }}</td>
                <td class="py-2 px-3 text-center">{{ g.total.b }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul class="mt-3 space-y-1">
          <li v-for="(n, i) in g.notes" :key="i" class="text-xs text-muted-foreground leading-relaxed">• {{ n }}</li>
        </ul>
      </div>
      <p class="text-xs text-muted-foreground">Périodes hebdomadaires — version août 2025 (LEO / vd.ch).</p>
    </div>
  </div>
</template>

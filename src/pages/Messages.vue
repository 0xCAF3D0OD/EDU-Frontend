<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Paperclip, Smile, Send, FileText, Download, Circle } from 'lucide-vue-next'
import CroppedIcon from '../components/CroppedIcon.vue'
import illustrationSet1 from '../imports/illustrationSet1.png'
import illustrationSet2 from '../imports/illustrationSet2.png'

const selectedChat = ref(1)

const conversations = [
  { id: 1, name: 'Sophie Ducret', role: 'Titulaire 5H-6H', school: 'EP Belmont', avatar: 'SD', lastMessage: 'Merci beaucoup pour votre aide !', time: '10:32', unread: 0, online: true },
  { id: 2, name: 'Jean-Marc Favre', role: 'Titulaire 9H-11H', school: "Collège de l'Elysée", avatar: 'JF', lastMessage: 'Les documents sont prêts', time: 'Hier', unread: 2, online: false },
  { id: 3, name: 'Claire Monnier', role: 'Titulaire 7H-8H', school: 'EP des Jordils', avatar: 'CM', lastMessage: 'À quelle heure arrivez-vous ?', time: 'Mar', unread: 0, online: true },
]

const messages = [
  { id: 1, sender: 'other', text: "Bonjour ! Merci d'avoir accepté le remplacement. Je vous prépare les documents.", time: '09:15' },
  { id: 2, sender: 'me', text: 'Bonjour Sophie ! Merci beaucoup. Y a-t-il des consignes particulières pour cette semaine ?', time: '09:18' },
  { id: 3, sender: 'other', text: 'Oui, les élèves travaillent sur un projet de lecture. J\'ai mis le programme dans les documents ci-dessus.', time: '09:22' },
  { id: 4, sender: 'me', text: 'Parfait, j\'ai bien reçu les documents. Je les consulte tout de suite.', time: '09:25' },
  { id: 5, sender: 'other', text: 'Merci beaucoup pour votre aide !', time: '10:32' },
]

const transmissionDocs = [
  { id: 1, name: 'Programme_Semaine_15-19_Sept.pdf', size: '245 KB', type: 'pdf' },
  { id: 2, name: 'Plan_de_Classe_5H.pdf', size: '128 KB', type: 'pdf' },
  { id: 3, name: 'Exercices_Français_Lecture.docx', size: '1.2 MB', type: 'doc' },
]

const currentConversation = computed(() => conversations.find((c) => c.id === selectedChat.value))
</script>

<template>
  <div style="height:calc(100vh - 6rem); overflow:hidden; background:var(--background); display:flex; flex-direction:column; position:relative;">
    <div class="absolute top-24 right-16 pointer-events-none z-0">
      <CroppedIcon :image-url="illustrationSet1" :row="3" :col="5" :size="100" :opacity="0.06" />
    </div>
    <div class="absolute bottom-32 left-24 pointer-events-none z-0">
      <CroppedIcon :image-url="illustrationSet2" :row="2" :col="8" :size="120" :opacity="0.07" />
    </div>

    <div class="flex-1 flex overflow-hidden relative z-10">
      <!-- Conversations list -->
      <div class="w-full lg:w-[30%] border-r border-foreground/10 flex flex-col bg-white">
        <div class="p-6 border-b border-foreground/10">
          <h1 class="text-[2rem] mb-4" style="font-family:'DM Serif Display',serif">Messages</h1>
          <div class="relative">
            <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher un contact..."
              class="w-full pl-11 pr-4 py-3 rounded-[16px] border-2 border-foreground/10 focus:border-primary focus:outline-none transition-all"
              style="font-family:Inter,sans-serif"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            class="p-5 border-b border-foreground/5 cursor-pointer transition-all relative hover:bg-[#FAFAFA]"
            :style="{ backgroundColor: selectedChat === conv.id ? '#FFF4E6' : 'transparent' }"
            @click="selectedChat = conv.id"
          >
            <div class="flex gap-4">
              <div class="relative">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style="background-color:#FD4401">
                  {{ conv.avatar }}
                </div>
                <Circle v-if="conv.online" :size="12" class="absolute bottom-0 right-0 fill-green-500 text-green-500" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-1">
                  <h3 class="font-semibold text-base truncate">{{ conv.name }}</h3>
                  <span class="text-xs text-foreground/60 ml-2">{{ conv.time }}</span>
                </div>
                <div class="text-xs text-foreground/60 mb-1">{{ conv.role }} • {{ conv.school }}</div>
                <p class="text-sm text-foreground/70 truncate">{{ conv.lastMessage }}</p>
              </div>
              <div
                v-if="conv.unread > 0"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style="background-color:#FD4401"
              >
                {{ conv.unread }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active chat -->
      <div class="hidden lg:flex lg:w-[70%] flex-col">
        <!-- Header -->
        <div class="p-6 border-b border-foreground/10 bg-white">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl" style="background-color:#FD4401">
                {{ currentConversation?.avatar }}
              </div>
              <Circle v-if="currentConversation?.online" :size="14" class="absolute bottom-0 right-0 fill-green-500 text-green-500" />
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ currentConversation?.name }}</h2>
              <p class="text-sm text-foreground/60">{{ currentConversation?.role }} • {{ currentConversation?.school }}</p>
            </div>
          </div>
        </div>

        <!-- Transmission docs -->
        <div class="p-6 border-b border-foreground/10" style="background-color:#FFF4E6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <FileText :size="20" class="text-primary" />
              Documents de transmission
            </h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              v-for="doc in transmissionDocs"
              :key="doc.id"
              class="p-4 rounded-[16px] bg-white border-2 border-foreground/5 hover:border-primary/30 transition-all cursor-pointer"
            >
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText :size="20" class="text-primary" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold truncate">{{ doc.name }}</p>
                  <p class="text-xs text-foreground/60">{{ doc.size }}</p>
                </div>
                <Download :size="16" class="text-foreground/40 flex-shrink-0 mt-1" />
              </div>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="message.sender === 'me' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[70%] px-5 py-3 rounded-[20px]"
              :style="{
                backgroundColor: message.sender === 'me' ? '#FD4401' : '#F5F5F5',
                color: message.sender === 'me' ? 'white' : '#1A1A1A',
                borderBottomRightRadius: message.sender === 'me' ? '4px' : '20px',
                borderBottomLeftRadius: message.sender === 'me' ? '20px' : '4px',
              }"
            >
              <p class="text-[0.95rem] leading-relaxed mb-1">{{ message.text }}</p>
              <p class="text-xs text-right" :style="{ opacity: message.sender === 'me' ? 0.8 : 0.6 }">{{ message.time }}</p>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-6 border-t border-foreground/10 bg-white">
          <div class="flex items-end gap-3">
            <div class="flex-1 relative">
              <input
                type="text"
                placeholder="Écrivez votre message..."
                class="w-full pl-5 pr-24 py-4 rounded-[20px] border-2 border-foreground/10 focus:border-primary focus:outline-none transition-all"
                style="font-family:Inter,sans-serif"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <button class="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                  <Paperclip :size="20" class="text-foreground/40" />
                </button>
                <button class="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                  <Smile :size="20" class="text-foreground/40" />
                </button>
              </div>
            </div>
            <button class="px-6 py-4 bg-primary text-primary-foreground rounded-[20px] flex items-center gap-2 font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95">
              <Send :size="20" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

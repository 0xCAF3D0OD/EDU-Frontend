<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  Search, Paperclip, Smile, Send, FileText, Download, Circle,
  Info, X, Mail, Phone, MapPin, BookOpen, GraduationCap, Building2,
} from 'lucide-vue-next'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'

const doodles: Doodle[] = [
  { name: 'envelope', top: '12%', right: '4%', size: 60, rotate: -6, opacity: 0.5 },
  { name: 'paperplane', top: '40%', left: '3%', size: 64, opacity: 0.5 },
  { name: 'heart', bottom: '16%', right: '5%', size: 44, opacity: 0.5 },
  { name: 'dots', top: '70%', left: '4%', size: 56, opacity: 0.45 },
  { name: 'smiley-sun', bottom: '10%', left: '5%', size: 48, opacity: 0.5 },
  { name: 'cat', top: '24%', right: '6%', size: 52, opacity: 0.5 },
]

interface Conversation {
  id: number
  name: string
  role: string
  school: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  email: string
  phone: string
  location: string
  subject: string
  level: string
}

const conversations: Conversation[] = [
  { id: 1, name: 'Sophie Ducret', role: 'Enseignante titulaire', school: 'EP Belmont', avatar: 'SD', lastMessage: 'Merci beaucoup pour votre aide !', time: '10:32', unread: 0, online: true, email: 'sophie.ducret@edu-vd.ch', phone: '+41 21 555 12 34', location: 'Belmont-sur-Lausanne, VD', subject: 'Français', level: '5-6P' },
  { id: 2, name: 'Jean-Marc Favre', role: 'Enseignant titulaire', school: "Collège de l'Elysée", avatar: 'JF', lastMessage: 'Les documents sont prêts', time: 'Hier', unread: 2, online: false, email: 'jm.favre@edu-vd.ch', phone: '+41 22 555 88 21', location: 'Lausanne, VD', subject: 'Mathématiques', level: '9-11S · VP' },
  { id: 3, name: 'Claire Monnier', role: 'Enseignante titulaire', school: 'EP des Jordils', avatar: 'CM', lastMessage: 'À quelle heure arrivez-vous ?', time: 'Mar', unread: 0, online: true, email: 'claire.monnier@edu-vd.ch', phone: '+41 21 555 47 09', location: 'Pully, VD', subject: 'Sciences de la nature', level: '7-8P' },
]

const selectedChat = ref(1)
const currentConversation = computed(() => conversations.find((c) => c.id === selectedChat.value))

interface Message {
  id: number
  sender: 'me' | 'other'
  text: string
  time: string
  file?: string
}
const chatMessages = ref<Message[]>([
  { id: 1, sender: 'other', text: "Bonjour ! Merci d'avoir accepté le remplacement. Je vous prépare les documents.", time: '09:15' },
  { id: 2, sender: 'me', text: 'Bonjour Sophie ! Merci beaucoup. Y a-t-il des consignes particulières pour cette semaine ?', time: '09:18' },
  { id: 3, sender: 'other', text: "Oui, les élèves travaillent sur un projet de lecture. J'ai mis le programme dans les documents ci-dessus.", time: '09:22' },
  { id: 4, sender: 'me', text: "Parfait, j'ai bien reçu les documents. Je les consulte tout de suite.", time: '09:25' },
  { id: 5, sender: 'other', text: 'Merci beaucoup pour votre aide !', time: '10:32' },
])

const transmissionDocs = [
  { id: 1, name: 'Programme_Semaine_15-19_Sept.pdf', size: '245 KB' },
  { id: 2, name: 'Plan_de_Classe_5P.pdf', size: '128 KB' },
  { id: 3, name: 'Exercices_Français_Lecture.docx', size: '1.2 MB' },
]

const messageText = ref('')
const showEmoji = ref(false)
const showProfile = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const messagesEnd = ref<HTMLElement | null>(null)
const emojis = ['😀', '😊', '👍', '🙏', '🎉', '📚', '✅', '❤️', '😅', '👋', '🕘', '📝', '👏', '🙌', '✏️', '📌']

function nowTime() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
function scrollToEnd() {
  nextTick(() => messagesEnd.value?.scrollIntoView({ behavior: 'smooth', block: 'end' }))
}
function sendMessage() {
  const t = messageText.value.trim()
  if (!t) return
  chatMessages.value.push({ id: Date.now(), sender: 'me', text: t, time: nowTime() })
  messageText.value = ''
  showEmoji.value = false
  scrollToEnd()
}
function addEmoji(e: string) {
  messageText.value += e
}
function triggerFile() {
  fileInput.value?.click()
}
function onFile(ev: Event) {
  const input = ev.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) {
    chatMessages.value.push({ id: Date.now(), sender: 'me', text: f.name, time: nowTime(), file: f.name })
    scrollToEnd()
  }
  input.value = ''
}
</script>

<template>
  <div style="height:calc(100vh - 6rem); overflow:hidden; background:var(--background); display:flex; flex-direction:column; position:relative;">
    <DoodleBackground :items="doodles" />

    <div class="flex-1 flex overflow-hidden relative z-10">
      <!-- Conversations list -->
      <div class="w-full lg:w-[30%] border-r border-foreground/10 flex flex-col bg-card">
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

        <div class="flex-1 overflow-y-auto" data-lenis-prevent>
          <div
            v-for="conv in conversations"
            :key="conv.id"
            class="p-5 border-b border-foreground/5 cursor-pointer transition-all relative hover:bg-foreground/5"
            :style="{ backgroundColor: selectedChat === conv.id ? 'var(--muted)' : 'transparent' }"
            @click="selectedChat = conv.id; showProfile = false"
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
                <div class="text-xs text-foreground/60 mb-1 truncate">{{ conv.role }} • {{ conv.school }}</div>
                <p class="text-sm text-foreground/70 truncate">{{ conv.lastMessage }}</p>
              </div>
              <div
                v-if="conv.unread > 0"
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style="background-color:#FD4401"
              >
                {{ conv.unread }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active chat -->
      <div class="hidden lg:flex lg:w-[70%] flex-col relative">
        <!-- Header (click to open profile) -->
        <div class="p-6 border-b border-foreground/10 bg-card flex items-center justify-between gap-4">
          <button class="flex items-center gap-4 text-left group" @click="showProfile = true">
            <div class="relative">
              <div class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl" style="background-color:#FD4401">
                {{ currentConversation?.avatar }}
              </div>
              <Circle v-if="currentConversation?.online" :size="14" class="absolute bottom-0 right-0 fill-green-500 text-green-500" />
            </div>
            <div>
              <h2 class="text-xl font-bold group-hover:text-primary transition-colors">{{ currentConversation?.name }}</h2>
              <p class="text-sm text-foreground/60">{{ currentConversation?.role }} • {{ currentConversation?.school }}</p>
            </div>
          </button>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-border text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
            @click="showProfile = true"
          >
            <Info :size="16" />
            Voir le profil
          </button>
        </div>

        <!-- Transmission docs -->
        <div class="p-6 border-b border-foreground/10 bg-muted">
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
              class="p-4 rounded-[16px] bg-card border-2 border-foreground/5 hover:border-primary/30 transition-all cursor-pointer"
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

        <!-- Messages (scrollable — data-lenis-prevent so the smooth-scroll wrapper doesn't hijack it) -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4" data-lenis-prevent>
          <div
            v-for="message in chatMessages"
            :key="message.id"
            class="flex"
            :class="message.sender === 'me' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[70%] px-5 py-3 rounded-[20px]"
              :style="{
                backgroundColor: message.sender === 'me' ? '#FD4401' : 'var(--muted)',
                color: message.sender === 'me' ? 'white' : 'var(--foreground)',
                borderBottomRightRadius: message.sender === 'me' ? '4px' : '20px',
                borderBottomLeftRadius: message.sender === 'me' ? '20px' : '4px',
              }"
            >
              <div v-if="message.file" class="flex items-center gap-2 mb-1">
                <Paperclip :size="16" />
                <span class="text-[0.95rem] font-medium underline underline-offset-2">{{ message.file }}</span>
              </div>
              <p v-else class="text-[0.95rem] leading-relaxed mb-1">{{ message.text }}</p>
              <p class="text-xs text-right" :style="{ opacity: message.sender === 'me' ? 0.8 : 0.6 }">{{ message.time }}</p>
            </div>
          </div>
          <div ref="messagesEnd" />
        </div>

        <!-- Input -->
        <div class="p-6 border-t border-foreground/10 bg-card">
          <div class="flex items-end gap-3">
            <div class="flex-1 relative">
              <!-- Emoji picker -->
              <Transition name="emoji">
                <div
                  v-if="showEmoji"
                  class="absolute bottom-full right-0 mb-3 p-3 rounded-[18px] border border-border shadow-xl bg-card grid grid-cols-8 gap-1 w-[18rem] z-20"
                >
                  <button
                    v-for="e in emojis"
                    :key="e"
                    type="button"
                    class="text-xl hover:bg-foreground/10 rounded-lg p-1 transition-colors"
                    @click="addEmoji(e)"
                  >
                    {{ e }}
                  </button>
                </div>
              </Transition>

              <input
                v-model="messageText"
                type="text"
                placeholder="Écrivez votre message..."
                class="w-full pl-5 pr-24 py-4 rounded-[20px] border-2 border-foreground/10 focus:border-primary focus:outline-none transition-all bg-input-background text-foreground"
                style="font-family:Inter,sans-serif"
                @keyup.enter="sendMessage"
              />
              <input ref="fileInput" type="file" class="hidden" @change="onFile" />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <button class="p-2 hover:bg-foreground/5 rounded-full transition-colors" title="Joindre un fichier" @click="triggerFile">
                  <Paperclip :size="20" class="text-foreground/50" />
                </button>
                <button
                  class="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                  :class="showEmoji ? 'text-primary' : 'text-foreground/50'"
                  title="Emojis"
                  @click="showEmoji = !showEmoji"
                >
                  <Smile :size="20" />
                </button>
              </div>
            </div>
            <button
              class="px-6 py-4 bg-primary text-primary-foreground rounded-[20px] flex items-center gap-2 font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              :disabled="!messageText.trim()"
              @click="sendMessage"
            >
              <Send :size="20" />
              Envoyer
            </button>
          </div>
        </div>

        <!-- Profile drawer -->
        <Transition name="drawer">
          <div v-if="showProfile" class="absolute inset-0 z-30 flex justify-end">
            <div class="absolute inset-0 bg-black/30" @click="showProfile = false" />
            <div class="relative w-full max-w-sm h-full bg-card border-l border-border shadow-2xl overflow-y-auto" data-lenis-prevent>
              <div class="p-6 border-b border-border flex items-center justify-between">
                <h3 class="text-lg font-bold">Profil du contact</h3>
                <button class="p-2 hover:bg-foreground/10 rounded-full transition-colors" @click="showProfile = false">
                  <X :size="20" />
                </button>
              </div>

              <div class="p-6">
                <div class="flex flex-col items-center text-center mb-6">
                  <div class="relative mb-3">
                    <div class="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl" style="background-color:#FD4401">
                      {{ currentConversation?.avatar }}
                    </div>
                    <Circle v-if="currentConversation?.online" :size="18" class="absolute bottom-1 right-1 fill-green-500 text-green-500" />
                  </div>
                  <h2 class="text-xl font-bold">{{ currentConversation?.name }}</h2>
                  <p class="text-sm text-foreground/60">{{ currentConversation?.role }}</p>
                  <span
                    class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    :class="currentConversation?.online ? 'bg-green-100 text-green-700' : 'bg-foreground/10 text-foreground/60'"
                  >
                    <Circle :size="8" :class="currentConversation?.online ? 'fill-green-500 text-green-500' : 'fill-current'" />
                    {{ currentConversation?.online ? 'En ligne' : 'Hors ligne' }}
                  </span>
                </div>

                <div class="space-y-1">
                  <div class="flex items-center gap-3 p-3 rounded-[14px] hover:bg-foreground/5">
                    <Building2 :size="18" class="text-primary shrink-0" />
                    <div class="min-w-0">
                      <div class="text-xs text-foreground/50">Établissement</div>
                      <div class="text-sm font-medium truncate">{{ currentConversation?.school }}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-3 rounded-[14px] hover:bg-foreground/5">
                    <GraduationCap :size="18" class="text-primary shrink-0" />
                    <div class="min-w-0">
                      <div class="text-xs text-foreground/50">Degré</div>
                      <div class="text-sm font-medium">{{ currentConversation?.level }}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-3 rounded-[14px] hover:bg-foreground/5">
                    <BookOpen :size="18" class="text-primary shrink-0" />
                    <div class="min-w-0">
                      <div class="text-xs text-foreground/50">Discipline</div>
                      <div class="text-sm font-medium">{{ currentConversation?.subject }}</div>
                    </div>
                  </div>
                  <a :href="`mailto:${currentConversation?.email}`" class="flex items-center gap-3 p-3 rounded-[14px] hover:bg-foreground/5">
                    <Mail :size="18" class="text-primary shrink-0" />
                    <div class="min-w-0">
                      <div class="text-xs text-foreground/50">Email</div>
                      <div class="text-sm font-medium truncate">{{ currentConversation?.email }}</div>
                    </div>
                  </a>
                  <a :href="`tel:${currentConversation?.phone}`" class="flex items-center gap-3 p-3 rounded-[14px] hover:bg-foreground/5">
                    <Phone :size="18" class="text-primary shrink-0" />
                    <div class="min-w-0">
                      <div class="text-xs text-foreground/50">Téléphone</div>
                      <div class="text-sm font-medium">{{ currentConversation?.phone }}</div>
                    </div>
                  </a>
                  <div class="flex items-center gap-3 p-3 rounded-[14px] hover:bg-foreground/5">
                    <MapPin :size="18" class="text-primary shrink-0" />
                    <div class="min-w-0">
                      <div class="text-xs text-foreground/50">Localité</div>
                      <div class="text-sm font-medium">{{ currentConversation?.location }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emoji-enter-active,
.emoji-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.emoji-enter-from,
.emoji-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-enter-active .relative,
.drawer-leave-active .relative {
  transition: transform 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .relative,
.drawer-leave-to .relative {
  transform: translateX(100%);
}
</style>

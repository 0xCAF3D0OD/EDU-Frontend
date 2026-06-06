<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  Search, Paperclip, Smile, Send, FileText, Download, Circle,
  Info, X, Mail, Phone, MapPin, BookOpen, GraduationCap, Building2, ArrowLeft, Upload, ChevronDown,
} from 'lucide-vue-next'
import DoodleBackground, { type Doodle } from '../components/DoodleBackground.vue'
import { contacts, transmissionDocs, shareableFiles } from '../data/users'

const doodles: Doodle[] = [
  { name: 'envelope', top: '12%', right: '4%', size: 60, rotate: -6, opacity: 0.5 },
  { name: 'paperplane', top: '40%', left: '3%', size: 64, opacity: 0.5 },
  { name: 'heart', bottom: '16%', right: '5%', size: 44, opacity: 0.5 },
  { name: 'dots', top: '70%', left: '4%', size: 56, opacity: 0.45 },
  { name: 'smiley-sun', bottom: '10%', left: '5%', size: 48, opacity: 0.5 },
  { name: 'cat', top: '24%', right: '6%', size: 52, opacity: 0.5 },
]

// Conversation list = contacts + light chat metadata
const meta: Record<number, { last: string; time: string; unread: number }> = {
  1: { last: 'Merci beaucoup pour votre aide !', time: '10:32', unread: 0 },
  2: { last: 'Les documents sont prêts', time: 'Hier', unread: 2 },
  3: { last: 'À quelle heure arrivez-vous ?', time: 'Mar', unread: 0 },
}
const conversations = contacts.map((c) => ({
  ...c,
  lastMessage: meta[c.id]?.last ?? '',
  time: meta[c.id]?.time ?? '',
  unread: meta[c.id]?.unread ?? 0,
}))

const selectedChat = ref(1)
const currentConversation = computed(() => conversations.find((c) => c.id === selectedChat.value))

// Contact search
const searchQuery = ref('')
const filteredConversations = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return conversations
  return conversations.filter((c) =>
    [c.name, c.school, c.role, c.subject].some((v) => (v ?? '').toLowerCase().includes(q)),
  )
})

// Transmission docs collapsed by default
const docsOpen = ref(false)

interface Message {
  id: number
  sender: 'me' | 'other'
  text: string
  time: string
  file?: string
  fileUrl?: string
}
const chatMessages = ref<Message[]>([
  { id: 1, sender: 'other', text: "Bonjour ! Merci d'avoir accepté le remplacement. Je vous prépare les documents.", time: '09:15' },
  { id: 2, sender: 'me', text: 'Bonjour Sophie ! Merci beaucoup. Y a-t-il des consignes particulières pour cette semaine ?', time: '09:18' },
  { id: 3, sender: 'other', text: "Oui, les élèves travaillent sur un projet de lecture. J'ai mis le programme dans les documents ci-dessus.", time: '09:22' },
  { id: 4, sender: 'me', text: "Parfait, j'ai bien reçu les documents. Je les consulte tout de suite.", time: '09:25' },
  { id: 5, sender: 'other', text: 'Merci beaucoup pour votre aide !', time: '10:32' },
])

const messageText = ref('')
const showEmoji = ref(false)
const showAttach = ref(false)
const showProfile = ref(false)
const mobileChatOpen = ref(false)
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
function openChat(id: number) {
  selectedChat.value = id
  mobileChatOpen.value = true
  showProfile.value = false
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
function shareFile(name: string, url: string) {
  chatMessages.value.push({ id: Date.now(), sender: 'me', text: name, time: nowTime(), file: name, fileUrl: url })
  showAttach.value = false
  scrollToEnd()
}
function onDeviceFile(ev: Event) {
  const input = ev.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) {
    const url = URL.createObjectURL(f)
    chatMessages.value.push({ id: Date.now(), sender: 'me', text: f.name, time: nowTime(), file: f.name, fileUrl: url })
    scrollToEnd()
  }
  input.value = ''
  showAttach.value = false
}
</script>

<template>
  <div style="height:calc(100dvh - 6rem); overflow:hidden; background:var(--background); display:flex; flex-direction:column; position:relative;">
    <DoodleBackground :items="doodles" />

    <div class="flex-1 flex overflow-hidden relative z-10">
      <!-- Conversations list (hidden on mobile when a chat is open) -->
      <div
        class="w-full lg:w-[30%] border-r border-foreground/10 flex-col bg-card"
        :class="mobileChatOpen ? 'hidden lg:flex' : 'flex'"
      >
        <div class="p-6 border-b border-foreground/10">
          <h1 class="text-[2rem] mb-4" style="font-family:'DM Serif Display',serif">Messages</h1>
          <div class="relative">
            <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un contact..."
              class="w-full pl-11 pr-4 py-3 rounded-[16px] border-2 border-foreground/10 focus:border-primary focus:outline-none transition-all bg-input-background text-foreground"
              style="font-family:Inter,sans-serif"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto" data-lenis-prevent>
          <p v-if="filteredConversations.length === 0" class="p-6 text-sm text-foreground/50 text-center">
            Aucun contact pour « {{ searchQuery }} ».
          </p>
          <div
            v-for="conv in filteredConversations"
            :key="conv.id"
            class="p-5 border-b border-foreground/5 cursor-pointer transition-all relative hover:bg-foreground/5"
            :style="{ backgroundColor: selectedChat === conv.id ? 'var(--muted)' : 'transparent' }"
            @click="openChat(conv.id)"
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

      <!-- Active chat (full-screen on mobile when open) -->
      <div
        class="w-full lg:w-[70%] flex-col relative"
        :class="mobileChatOpen ? 'flex' : 'hidden lg:flex'"
      >
        <!-- Header -->
        <div class="p-4 sm:p-6 border-b border-foreground/10 bg-card flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <button class="lg:hidden p-2 -ml-2 rounded-full hover:bg-foreground/10 transition-colors shrink-0" aria-label="Retour" @click="mobileChatOpen = false">
              <ArrowLeft :size="22" />
            </button>
            <button class="flex items-center gap-3 text-left group min-w-0" @click="showProfile = true">
              <div class="relative shrink-0">
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl" style="background-color:#FD4401">
                  {{ currentConversation?.avatar }}
                </div>
                <Circle v-if="currentConversation?.online" :size="14" class="absolute bottom-0 right-0 fill-green-500 text-green-500" />
              </div>
              <div class="min-w-0">
                <h2 class="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors truncate">{{ currentConversation?.name }}</h2>
                <p class="text-xs sm:text-sm text-foreground/60 truncate">{{ currentConversation?.role }} • {{ currentConversation?.school }}</p>
              </div>
            </button>
          </div>
          <button
            class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 border-border text-sm font-semibold text-foreground hover:border-primary/40 transition-colors shrink-0"
            @click="showProfile = true"
          >
            <Info :size="16" />
            <span class="hidden sm:inline">Voir le profil</span>
          </button>
        </div>

        <!-- Transmission docs (collapsed by default) -->
        <div class="p-4 sm:p-6 border-b border-foreground/10 bg-muted">
          <button class="w-full flex items-center justify-between gap-3" :aria-expanded="docsOpen" @click="docsOpen = !docsOpen">
            <h3 class="text-base sm:text-lg font-bold flex items-center gap-2">
              <FileText :size="20" class="text-primary" />
              Documents de transmission
              <span class="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {{ transmissionDocs.length }}
              </span>
            </h3>
            <ChevronDown :size="20" class="text-foreground/50 transition-transform" :class="docsOpen ? 'rotate-180' : ''" />
          </button>
          <Transition name="pop">
            <div v-if="docsOpen" class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <a
              v-for="doc in transmissionDocs"
              :key="doc.name"
              :href="doc.url"
              :download="doc.name"
              target="_blank"
              rel="noopener"
              class="p-4 rounded-[16px] bg-card border-2 border-foreground/5 hover:border-primary/30 transition-all cursor-pointer block"
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
            </a>
            </div>
          </Transition>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" data-lenis-prevent>
          <div
            v-for="message in chatMessages"
            :key="message.id"
            class="flex"
            :class="message.sender === 'me' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] sm:max-w-[70%] px-5 py-3 rounded-[20px]"
              :style="{
                backgroundColor: message.sender === 'me' ? '#FD4401' : 'var(--muted)',
                color: message.sender === 'me' ? 'white' : 'var(--foreground)',
                borderBottomRightRadius: message.sender === 'me' ? '4px' : '20px',
                borderBottomLeftRadius: message.sender === 'me' ? '20px' : '4px',
              }"
            >
              <a
                v-if="message.file"
                :href="message.fileUrl"
                :download="message.file"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-2 mb-1 underline underline-offset-2"
              >
                <Paperclip :size="16" />
                <span class="text-[0.95rem] font-medium break-all">{{ message.file }}</span>
              </a>
              <p v-else class="text-[0.95rem] leading-relaxed mb-1">{{ message.text }}</p>
              <p class="text-xs text-right" :style="{ opacity: message.sender === 'me' ? 0.8 : 0.6 }">{{ message.time }}</p>
            </div>
          </div>
          <div ref="messagesEnd" />
        </div>

        <!-- Input -->
        <div class="p-4 sm:p-6 border-t border-foreground/10 bg-card">
          <div class="flex items-end gap-3">
            <div class="flex-1 relative">
              <!-- Emoji picker -->
              <Transition name="pop">
                <div
                  v-if="showEmoji"
                  class="absolute bottom-full right-0 mb-3 p-3 rounded-[18px] border border-border shadow-xl bg-card grid grid-cols-8 gap-1 w-[18rem] max-w-[80vw] z-20"
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

              <!-- Attach menu (my files + device) -->
              <Transition name="pop">
                <div
                  v-if="showAttach"
                  class="absolute bottom-full left-0 mb-3 p-2 rounded-[18px] border border-border shadow-xl bg-card w-[20rem] max-w-[85vw] z-20"
                >
                  <div class="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mes documents</div>
                  <button
                    v-for="f in shareableFiles"
                    :key="f.url"
                    type="button"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-foreground/5 transition-colors text-left"
                    @click="shareFile(f.name, f.url)"
                  >
                    <FileText :size="18" class="text-primary shrink-0" />
                    <span class="flex-1 min-w-0">
                      <span class="block text-sm font-medium truncate">{{ f.name }}</span>
                      <span class="block text-xs text-foreground/60">{{ f.size }}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-foreground/5 transition-colors text-left border-t border-border mt-1 pt-3"
                    @click="fileInput?.click()"
                  >
                    <Upload :size="18" class="text-primary shrink-0" />
                    <span class="text-sm font-medium">Importer depuis l'appareil…</span>
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
              <input ref="fileInput" type="file" class="hidden" @change="onDeviceFile" />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  class="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                  :class="showAttach ? 'text-primary' : 'text-foreground/50'"
                  title="Joindre un fichier"
                  @click="showAttach = !showAttach; showEmoji = false"
                >
                  <Paperclip :size="20" />
                </button>
                <button
                  class="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                  :class="showEmoji ? 'text-primary' : 'text-foreground/50'"
                  title="Emojis"
                  @click="showEmoji = !showEmoji; showAttach = false"
                >
                  <Smile :size="20" />
                </button>
              </div>
            </div>
            <button
              class="px-5 sm:px-6 py-4 bg-primary text-primary-foreground rounded-[20px] flex items-center gap-2 font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              :disabled="!messageText.trim()"
              @click="sendMessage"
            >
              <Send :size="20" />
              <span class="hidden sm:inline">Envoyer</span>
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
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.pop-enter-from,
.pop-leave-to {
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

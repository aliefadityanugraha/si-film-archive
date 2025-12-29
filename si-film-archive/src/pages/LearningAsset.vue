<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Printer, Download, ArrowLeft, FileText } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()

// Route params
const filmId = computed(() => route.params.filmId || '1')
const assetSlug = computed(() => route.params.assetSlug || 'naskah-film')

// Mock data - in real app, fetch based on filmId and assetSlug
const assetData = ref({
  filmTitle: 'The Silent Echo',
  assetTitle: 'Naskah Film (Script)',
  fileType: 'PDF',
  fileSize: '2.4 MB',
  totalPages: 24,
  screenplayBy: 'Aditya Mulya & Sarah Jenkins',
  draftInfo: 'Draft 4.2 • July 14, 2023'
})

// Viewer state
const currentPage = ref(1)
const zoomLevel = ref(100)

const zoomIn = () => {
  if (zoomLevel.value < 200) zoomLevel.value += 25
}

const zoomOut = () => {
  if (zoomLevel.value > 50) zoomLevel.value -= 25
}

const nextPage = () => {
  if (currentPage.value < assetData.value.totalPages) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const goBack = () => {
  router.push({ name: 'Detail', params: { id: filmId.value } })
}

// Breadcrumb items
const breadcrumbs = computed(() => [
  { label: 'Home', path: '/' },
  { label: 'Films', path: '/' },
  { label: assetData.value.filmTitle, path: `/detail/${filmId.value}` },
  { label: assetData.value.assetTitle.split(' (')[0], active: true }
])
</script>

<template>
  <div class="min-h-screen bg-stone-100">
    <Navbar />
    
    <main class="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-12">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm mb-6">
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <router-link 
            v-if="!crumb.active" 
            :to="crumb.path"
            class="font-bold uppercase tracking-wide text-stone-400 hover:text-stone-600 transition-colors"
          >
            {{ crumb.label }}
          </router-link>
          <span v-else class="font-bold uppercase tracking-wide text-stone-800 border-b-2 border-orange-400 pb-0.5">
            {{ crumb.label }}
          </span>
          <span v-if="index < breadcrumbs.length - 1" class="text-stone-300">/</span>
        </template>
      </nav>

      <!-- Toolbar -->
      <div class="bg-stone-200 rounded-xl border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(43,38,38,1)] p-4 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Back Button & Title -->
          <div class="flex items-center gap-4">
            <Button 
              variant="ghost" 
              @click="goBack"
              class="flex items-center gap-2 hover:bg-stone-300"
            >
              <ArrowLeft class="w-5 h-5" />
              <span class="font-bold">Back to Details</span>
            </Button>
            
            <div class="hidden sm:block w-px h-8 bg-stone-300" />
            
            <div class="hidden sm:flex items-center gap-3">
              <div class="w-11 h-10 bg-stone-100 rounded-lg border border-stone-300 flex items-center justify-center">
                <FileText class="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h1 class="text-xl font-serif text-stone-800">{{ assetData.assetTitle }}</h1>
                <p class="text-xs font-mono uppercase text-stone-600">{{ assetData.fileType }} • {{ assetData.fileSize }}</p>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-3">
            <!-- Zoom Controls -->
            <div class="flex items-center bg-white rounded-lg border-2 border-stone-800 overflow-hidden">
              <Button variant="ghost" size="icon" @click="zoomOut" class="rounded-none">
                <ZoomOut class="w-4 h-4" />
              </Button>
              <span class="px-3 font-mono font-bold text-sm min-w-[60px] text-center">{{ zoomLevel }}%</span>
              <Button variant="ghost" size="icon" @click="zoomIn" class="rounded-none">
                <ZoomIn class="w-4 h-4" />
              </Button>
            </div>

            <!-- Page Navigation -->
            <div class="flex items-center bg-white rounded-lg border-2 border-stone-800 overflow-hidden">
              <Button variant="ghost" size="icon" @click="prevPage" :disabled="currentPage === 1" class="rounded-none">
                <ChevronLeft class="w-4 h-4" />
              </Button>
              <span class="px-3 font-mono text-sm">
                <span class="font-bold">{{ currentPage }}</span>
                <span class="text-stone-400 mx-1">/</span>
                <span class="font-bold">{{ assetData.totalPages }}</span>
              </span>
              <Button variant="ghost" size="icon" @click="nextPage" :disabled="currentPage === assetData.totalPages" class="rounded-none">
                <ChevronRight class="w-4 h-4" />
              </Button>
            </div>

            <div class="hidden md:block w-px h-8 bg-stone-300" />

            <!-- Action Buttons -->
            <Button variant="outline" class="hidden md:flex items-center gap-2 border-2 border-stone-300">
              <Printer class="w-4 h-4" />
              <span class="font-bold">Print</span>
            </Button>
            
            <Button class="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white border-2 border-stone-800 shadow-[2px_2px_0px_0px_rgba(43,38,38,1)]">
              <Download class="w-4 h-4" />
              <span class="font-bold">Download</span>
            </Button>
          </div>
        </div>
      </div>

      <!-- Document Viewer -->
      <div class="bg-stone-700 rounded-xl border-2 border-stone-800 shadow-inner overflow-hidden min-h-[600px] lg:min-h-[800px]">
        <div class="relative w-full h-full flex items-start justify-center p-8 lg:p-12">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-20">
            <img src="https://placehold.co/1212x982" alt="" class="w-full h-full object-cover" />
          </div>
          
          <!-- Document Preview -->
          <div 
            class="relative bg-white shadow-2xl max-w-sm lg:max-w-md overflow-hidden"
            :style="{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }"
          >
            <!-- Paper Texture Overlay -->
            <div class="absolute inset-0 opacity-30 mix-blend-multiply">
              <img src="https://placehold.co/316x1100" alt="" class="w-full h-full object-cover" />
            </div>
            
            <!-- Watermark -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
              <div class="absolute -left-20 bottom-40 -rotate-45 text-black/5 text-7xl lg:text-8xl font-black whitespace-nowrap">
                CINEARCHIVE
              </div>
            </div>

            <!-- Document Content -->
            <div class="relative p-8 lg:p-12">
              <!-- Header -->
              <div class="border-b-2 border-black/10 pb-6 mb-8">
                <p class="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
                  CineArchive<br/>Original
                </p>
                <h2 class="font-serif text-4xl lg:text-5xl text-black leading-tight">
                  The<br/>Silent<br/>Echo
                </h2>
              </div>

              <!-- Credits -->
              <div class="text-center mb-8">
                <p class="font-serif text-xs uppercase tracking-wider text-gray-900 font-bold mb-1">Screenplay by</p>
                <p class="font-serif text-lg text-gray-900">{{ assetData.screenplayBy }}</p>
                <p class="font-mono text-xs text-gray-500 mt-2">{{ assetData.draftInfo }}</p>
              </div>

              <!-- Scene Content -->
              <div class="space-y-6 font-serif text-gray-900 leading-relaxed">
                <div>
                  <p class="text-sm uppercase tracking-wide text-gray-500 mb-2">Scene 1</p>
                  <p class="font-bold tracking-wide">EXT. MOUNTAIN VILLAGE - DAWN</p>
                </div>
                
                <p>
                  Mist clings to the pines like a heavy blanket. The silence is profound, 
                  broken only by the distant, harsh CAW of a crow. The village looks abandoned, 
                  though thin smoke rises lazily from a single chimney near the ridge.
                </p>

                <p>
                  We PAN across empty streets. Shutters bang rhythmically against stone walls. 
                  A bicycle lies rusted in a ditch, half-swallowed by wildflowers.
                </p>

                <p class="text-right font-bold tracking-wider">CUT TO:</p>

                <div>
                  <p class="text-sm uppercase tracking-wide text-gray-500 mb-2">Scene 2</p>
                  <p class="font-bold tracking-wide">INT. TOWN HALL BASEMENT - DAY</p>
                </div>

                <p>
                  Dust motes dance in a sharp shaft of sunlight piercing the gloom. 
                  <span class="font-bold uppercase">Maya</span> (20s, disheveled, determined) 
                  pushes open a heavy oak door. It CREAKS, protesting decades of disuse.
                </p>
              </div>

              <!-- Footer -->
              <div class="mt-12 pt-4 border-t border-black/5 flex justify-between text-xs font-mono uppercase tracking-wide text-gray-400">
                <span>Restricted Access • Educational Use Only</span>
                <span>Page {{ currentPage }} of {{ assetData.totalPages }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Page Indicator (Mobile) -->
        <div class="flex justify-center pb-6 lg:hidden">
          <div class="bg-stone-800/90 text-stone-50 px-6 py-2 rounded-full text-sm font-medium backdrop-blur">
            Page {{ currentPage }} of {{ assetData.totalPages }}
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/api'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import PageHeader from '@/components/PageHeader.vue'
import FilmCard from '@/components/FilmCard.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Film, Trash2, Eye, Loader2, Bookmark, BookmarkX,
  ArrowRight, Search
} from 'lucide-vue-next'
import Toast from '@/components/Toast.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Koleksi Simpanan Saya - CineArchive'
})

const router = useRouter()
const collections = ref([])
const loading = ref(true)
const toast = ref({ show: false, type: 'success', message: '' })

const showToast = (message, type = 'success') => {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const fetchCollections = async () => {
  loading.value = true
  try {
    const res = await api.get('/api/collections/my-collections')
    collections.value = res.data || []
  } catch (err) {
    console.error('Failed to fetch collections:', err)
    showToast('Gagal memuat koleksi', 'error')
  } finally {
    loading.value = false
  }
}

const removeFromCollection = async (filmIdToRemove) => {
  try {
    await api.post(`/api/collections/toggle/${filmIdToRemove}`, {})
    collections.value = collections.value.filter(item => item.film_id !== filmIdToRemove)
    showToast('Film dihapus dari koleksi')
  } catch (err) {
    console.error('Failed to remove from collection:', err)
    showToast('Gagal menghapus film', 'error')
  }
}

onMounted(fetchCollections)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F2EEE3]">
    <Navbar />
    <Toast v-bind="toast" @close="toast.show = false" />

    <main class="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16">
      <!-- Header -->
      <PageHeader
        title="Simpanan Saya"
        description="Kumpulan karya film favorit yang telah Anda simpan untuk ditonton kembali atau dipelajari aset pembelajarannya."
        :icon="Bookmark"
        icon-color="bg-brand-orange"
      />

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <Loader2 class="w-10 h-10 animate-spin text-brand-teal mb-4" />
        <p class="text-stone-500 font-mono text-sm animate-pulse">MEMUAT KOLEKSI...</p>
      </div>

      <!-- Content -->
      <div v-else>
        <div v-if="collections.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FilmCard 
            v-for="item in collections" 
            :key="item.collection_id" 
            :film="item.film"
            variant="landscape"
            :show-play-overlay="false"
            class="hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-brutal-sm"
          >
            <template #overlay>
              <!-- Category Badge -->
              <div class="absolute top-3 left-3">
                <Badge class="bg-brand-red text-white border-2 border-black shadow-brutal-xs">
                  {{ item.film?.category?.nama_kategori }}
                </Badge>
              </div>
            </template>

            <template #content>
              <div class="flex justify-between items-start gap-2 mb-2">
                <h3 class="text-xl font-display font-bold text-stone-900 line-clamp-1 group-hover:text-brand-red transition-colors">
                  {{ item.film?.judul }}
                </h3>
                <span class="text-xs font-mono font-bold text-stone-400">{{ item.film?.tahun_karya }}</span>
              </div>
              
              <p class="text-sm text-stone-500 font-body line-clamp-2 mb-6">
                {{ item.film?.sinopsis || 'Tidak ada deskripsi.' }}
              </p>
            </template>

            <template #actions>
              <Button 
                class="flex-1 gap-2 shadow-brutal-xs" 
                @click="router.push(`/detail/${item.film_id}`)"
              >
                <Eye class="w-4 h-4" /> Tonton
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                class="border-2 border-stone-200 hover:border-brand-red hover:text-brand-red transition-all"
                @click="removeFromCollection(item.film_id)"
              >
                <BookmarkX class="w-5 h-5" />
              </Button>
            </template>
          </FilmCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-24 bg-white border-2 border-dashed border-stone-300 shadow-inner">
          <div class="max-w-md mx-auto">
            <Bookmark class="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <h3 class="text-2xl font-display font-bold text-stone-800 mb-2">Belum Ada Simpanan</h3>
            <p class="text-stone-500 font-body mb-8">
              Jelajahi arsip film dan klik tombol "Save" pada film yang Anda sukai untuk menyimpannya di sini.
            </p>
            <Button @click="router.push('/')" size="lg" class="gap-2 shadow-brutal">
              <Search class="w-5 h-5" /> Jelajahi Arsip
              <ArrowRight class="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

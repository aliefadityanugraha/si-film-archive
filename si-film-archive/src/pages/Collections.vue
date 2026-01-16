<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/api'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Film, Trash2, Eye, Loader2, Bookmark, BookmarkX,
  ArrowRight, Search
} from 'lucide-vue-next'
import Toast from '@/components/Toast.vue'
import { useToast } from '@/composables/useToast'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Koleksi Simpanan Saya - PF Space'
})

const router = useRouter()
const collections = ref([])
const loading = ref(true)
const { toast, showToast } = useToast()

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

const removeFromCollection = async (filmId) => {
  try {
    await api.post(`/api/collections/toggle/${filmId}`, {})
    collections.value = collections.value.filter(item => item.film_id !== filmId)
    showToast('Film dihapus dari koleksi')
  } catch (err) {
    showToast('Gagal menghapus film', 'error')
  }
}

onMounted(fetchCollections)
</script>

<template>
  <div class="min-h-screen bg-[#F2EEE3]">
    <Navbar />
    <Toast v-bind="toast" @close="toast.show = false" />

    <main class="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16">
      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-brand-orange border-2 border-black flex items-center justify-center shadow-brutal-sm">
            <Bookmark class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-3xl md:text-5xl font-display font-bold text-stone-900">Simpanan Saya</h1>
        </div>
        <p class="text-stone-500 font-body max-w-2xl">
          Kumpulan karya film favorit yang telah Anda simpan untuk ditonton kembali atau dipelajari aset pembelajarannya.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <Loader2 class="w-10 h-10 animate-spin text-brand-teal mb-4" />
        <p class="text-stone-500 font-mono text-sm animate-pulse">MEMUAT KOLEKSI...</p>
      </div>

      <!-- Content -->
      <div v-else>
        <div v-if="collections.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card 
            v-for="item in collections" 
            :key="item.collection_id" 
            class="group bg-white border-2 border-black shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-brutal-sm transition-all"
          >
            <CardContent class="p-0">
              <!-- Thumbnail -->
              <div class="aspect-video bg-stone-200 border-b-2 border-black relative overflow-hidden">
                <img 
                  v-if="item.film?.gambar_poster" 
                  :src="item.film.gambar_poster" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Film class="w-12 h-12 text-stone-400" />
                </div>
                
                <!-- Category Badge -->
                <div class="absolute top-3 left-3">
                  <Badge class="bg-brand-red text-white border-2 border-black shadow-brutal-xs">
                    {{ item.film?.category?.nama_kategori }}
                  </Badge>
                </div>
              </div>

              <!-- Body -->
              <div class="p-5">
                <div class="flex justify-between items-start gap-2 mb-2">
                  <h3 class="text-xl font-display font-bold text-stone-900 line-clamp-1 group-hover:text-brand-red transition-colors">
                    {{ item.film?.judul }}
                  </h3>
                  <span class="text-xs font-mono font-bold text-stone-400">{{ item.film?.tahun_karya }}</span>
                </div>
                
                <p class="text-sm text-stone-500 font-body line-clamp-2 mb-6">
                  {{ item.film?.sinopsis || 'Tidak ada deskripsi.' }}
                </p>

                <!-- Actions -->
                <div class="flex items-center gap-2">
                  <Button 
                    class="flex-1 gap-2 shadow-brutal-xs" 
                    @click="router.push(`/film/${item.film?.slug}`)"
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-24 bg-white border-2 border-dashed border-stone-300 shadow-inner">
          <div class="max-w-md mx-auto">
            <Bookmark class="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <h3 class="text-2xl font-display font-bold text-stone-800 mb-2">Belum Ada Simpanan</h3>
            <p class="text-stone-500 font-body mb-8">
              Jelajahi arsip film dan klik tombol "Simpan ke Koleksi" pada film yang Anda sukai untuk menyimpannya di sini.
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

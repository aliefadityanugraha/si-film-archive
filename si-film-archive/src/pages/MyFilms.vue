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
  Film, Plus, Pencil, Trash2, Eye, Loader2, Clock, CheckCircle, XCircle,
  AlertTriangle, X, ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import Toast from '@/components/Toast.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Manajemen Film Saya - CineArchive'
})

const router = useRouter()
const films = ref([])
const loading = ref(true)
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 0 })
const statusFilter = ref('all')

// Modal & Toast
const showConfirm = ref(false)
const filmToDelete = ref(null)
const deleting = ref(false)
const toast = ref({ show: false, type: 'success', message: '' })

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  published: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300'
}

const statusLabels = {
  pending: 'Menunggu Review',
  published: 'Dipublikasi',
  rejected: 'Ditolak'
}

const fetchFilms = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', pagination.value.page)
    params.append('limit', pagination.value.limit)
    if (statusFilter.value !== 'all') {
      params.append('status', statusFilter.value)
    }
    
    const res = await api.get(`/api/films/my-films?${params}`)
    films.value = res.data
    if (res.pagination) {
      pagination.value = { ...pagination.value, ...res.pagination }
    }
  } catch (err) {
    console.error('Failed to fetch films:', err)
    showToast('error', 'Gagal memuat data film')
  } finally {
    loading.value = false
  }
}

const confirmDelete = (film) => {
  filmToDelete.value = film
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!filmToDelete.value) return
  deleting.value = true
  try {
    await api.delete(`/api/films/${filmToDelete.value.film_id}`)
    showToast('success', 'Film berhasil dihapus')
    showConfirm.value = false
    await fetchFilms()
  } catch (err) {
    showToast('error', err.message || 'Gagal menghapus film')
  } finally {
    deleting.value = false
    filmToDelete.value = null
  }
}

const changeFilter = (status) => {
  statusFilter.value = status
  pagination.value.page = 1
  fetchFilms()
}

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    pagination.value.page = newPage
    fetchFilms()
  }
}

onMounted(fetchFilms)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F2EEE3]">
    <Navbar />

    <main class="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16">
      <!-- Header -->
      <PageHeader 
        title="Film Saya" 
        description="Kelola semua film yang sudah kamu upload."
      >
        <template #actions>
          <Button @click="router.push('/upload')" class="gap-2">
            <Plus class="w-4 h-4" />
            Upload Film Baru
          </Button>
        </template>
      </PageHeader>

      <!-- Status Filter -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <Button 
          v-for="status in ['all', 'pending', 'published', 'rejected']" 
          :key="status"
          :variant="statusFilter === status ? 'default' : 'outline'"
          size="sm"
          @click="changeFilter(status)"
          class="gap-2"
        >
          <Clock v-if="status === 'pending'" class="w-4 h-4" />
          <CheckCircle v-else-if="status === 'published'" class="w-4 h-4" />
          <XCircle v-else-if="status === 'rejected'" class="w-4 h-4" />
          <Film v-else class="w-4 h-4" />
          {{ status === 'all' ? 'Semua' : statusLabels[status] }}
        </Button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <Loader2 class="w-8 h-8 animate-spin text-stone-400" />
      </div>

      <!-- Empty State -->
      <div v-else-if="films.length === 0" class="text-center py-20">
        <Film class="w-16 h-16 mx-auto mb-4 text-stone-300" />
        <h3 class="text-xl font-bold text-stone-600 mb-2">Belum ada film</h3>
        <p class="text-stone-500 mb-6">Mulai upload film pertamamu sekarang!</p>
        <Button @click="router.push('/upload')" class="gap-2">
          <Plus class="w-4 h-4" />
          Upload Film
        </Button>
      </div>

      <!-- Films Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FilmCard 
          v-for="film in films" 
          :key="film.film_id" 
          :film="film"
          variant="landscape"
          :show-play-overlay="false"
        >
          <template #overlay>
            <!-- Status Badge -->
            <Badge :class="['absolute top-2 right-2', statusColors[film.status]]">
              {{ statusLabels[film.status] }}
            </Badge>
          </template>

          <template #extra-content>
            <p class="text-xs text-stone-400 mb-4">{{ film.tahun_karya || '-' }}</p>

            <!-- Rejected Message -->
            <div v-if="film.status === 'rejected'" class="p-2 bg-red-50 border border-red-200 text-red-600 text-xs mb-4 rounded">
              Film ditolak. Silakan edit dan submit ulang.
            </div>
          </template>

          <template #actions>
            <Button 
              variant="outline" 
              size="sm" 
              class="flex-1 gap-1"
              @click="router.push(`/detail/${film.film_id}`)"
            >
              <Eye class="w-4 h-4" /> Lihat
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              class="flex-1 gap-1"
              @click="router.push(`/edit-film/${film.film_id}`)"
            >
              <Pencil class="w-4 h-4" /> Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              class="text-red-600 hover:bg-red-50"
              @click="confirmDelete(film)"
            >
              <Trash2 class="w-4 h-4" />
            </Button>
          </template>
        </FilmCard>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-4 mt-8">
        <Button 
          variant="outline" 
          size="sm" 
          :disabled="pagination.page <= 1"
          @click="changePage(pagination.page - 1)"
        >
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <span class="text-sm text-stone-600">
          Halaman {{ pagination.page }} dari {{ pagination.totalPages }}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          :disabled="pagination.page >= pagination.totalPages"
          @click="changePage(pagination.page + 1)"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </main>

    <Footer />

    <!-- Confirm Delete Dialog -->
    <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="showConfirm = false"></div>
      <div class="relative bg-white border-2 border-black shadow-brutal w-full max-w-sm mx-4">
        <div class="flex items-center gap-3 px-6 py-4 border-b-2 border-black bg-red-50">
          <AlertTriangle class="w-5 h-5 text-red-600" />
          <h2 class="font-bold text-lg text-red-800">Hapus Film</h2>
        </div>
        <div class="p-6">
          <p class="text-stone-600 mb-6">
            Hapus film "{{ filmToDelete?.judul }}"? Aksi ini tidak dapat dibatalkan.
          </p>
          <div class="flex gap-3">
            <Button variant="outline" class="flex-1" @click="showConfirm = false" :disabled="deleting">
              Batal
            </Button>
            <Button class="flex-1 gap-2 bg-red-600 hover:bg-red-700" @click="executeDelete" :disabled="deleting">
              <Loader2 v-if="deleting" class="w-4 h-4 animate-spin" />
              <Trash2 v-else class="w-4 h-4" />
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Toast 
      :show="toast.show" 
      :type="toast.type" 
      :message="toast.message" 
      @close="toast.show = false" 
    />
  </div>
</template>

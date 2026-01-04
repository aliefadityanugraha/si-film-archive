<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/lib/api'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Film, Plus, Trash2, Loader2, Save, ArrowLeft, AlertTriangle,
  CheckCircle, XCircle, X
} from 'lucide-vue-next'
import Toast from '@/components/Toast.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

const router = useRouter()
const route = useRoute()
const filmId = route.params.id

const loading = ref(true)
const saving = ref(false)
const categories = ref([])
const originalStatus = ref('')

// Form data
const form = ref({
  judul: '',
  category_id: '',
  sinopsis: '',
  tahun_karya: new Date().getFullYear(),
  link_video_utama: '',
  link_trailer: '',
  gambar_poster: '',
  deskripsi_lengkap: '',
  file_naskah: '',
  file_storyboard: '',
  file_rab: '',
  crew: [{ jabatan: '', anggota: [''] }]
})

const formError = ref('')
const uploading = ref(false)
const toast = ref({ show: false, type: 'success', message: '' })

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const handleFileUpload = async (event, fieldName) => {
  const file = event.target.files[0]
  if (!file) return

  // Validasi ukuran (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    showToast('error', 'Ukuran file terlalu besar (maksimal 10MB)')
    event.target.value = '' // Reset input
    return
  }

  // Validasi tipe file jika perlu (misal poster harus gambar)
  if (fieldName === 'gambar_poster' && !file.type.startsWith('image/')) {
    showToast('error', 'File harus berupa gambar')
    event.target.value = ''
    return
  }
  
  if ((fieldName === 'file_naskah' || fieldName === 'file_storyboard' || fieldName === 'file_rab') && file.type !== 'application/pdf') {
     showToast('error', 'File harus berupa PDF')
     event.target.value = ''
     return
  }

  const formData = new FormData()
  formData.append('file', file)

  uploading.value = true
  try {
    const res = await api.upload('/api/upload', formData)
    
    if (res.success) {
      form.value[fieldName] = res.data.url
      showToast('success', 'File berhasil diupload')
    }
  } catch (err) {
    console.error('Upload failed:', err)
    showToast('error', 'Gagal mengupload file: ' + (err.message || 'Server error'))
    event.target.value = '' // Reset input pada error
  } finally {
    uploading.value = false
  }
}

// Fetch film data
const fetchFilm = async () => {
  loading.value = true
  try {
    const res = await api.get(`/api/films/${filmId}`)
    const film = res.data
    
    originalStatus.value = film.status
    
    form.value = {
      judul: film.judul || '',
      category_id: film.category_id || '',
      sinopsis: film.sinopsis || '',
      tahun_karya: film.tahun_karya || new Date().getFullYear(),
      link_video_utama: film.link_video_utama || '',
      link_trailer: film.link_trailer || '',
      gambar_poster: film.gambar_poster || '',
      deskripsi_lengkap: film.deskripsi_lengkap || '',
      file_naskah: film.file_naskah || '',
      file_storyboard: film.file_storyboard || '',
      file_rab: film.file_rab || '',
      crew: film.crew && film.crew.length > 0 
        ? film.crew 
        : [{ jabatan: '', anggota: [''] }]
    }
  } catch (err) {
    showToast('error', 'Gagal memuat data film')
    router.push('/my-films')
  } finally {
    loading.value = false
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const res = await api.get('/api/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

// Crew management
const addCrew = () => {
  form.value.crew.push({ jabatan: '', anggota: [''] })
}

const removeCrew = (index) => {
  form.value.crew.splice(index, 1)
}

const addCrewMember = (crewIndex) => {
  form.value.crew[crewIndex].anggota.push('')
}

const removeCrewMember = (crewIndex, memberIndex) => {
  form.value.crew[crewIndex].anggota.splice(memberIndex, 1)
}

// Submit form
const submitFilm = async () => {
  formError.value = ''
  
  if (!form.value.judul.trim()) {
    formError.value = 'Judul film wajib diisi'
    return
  }
  if (!form.value.category_id) {
    formError.value = 'Kategori wajib dipilih'
    return
  }

  saving.value = true
  try {
    const cleanCrew = form.value.crew
      .filter(c => c.jabatan.trim())
      .map(c => ({
        jabatan: c.jabatan.trim(),
        anggota: c.anggota.filter(a => a.trim())
      }))

    const payload = {
      ...form.value,
      category_id: parseInt(form.value.category_id),
      tahun_karya: parseInt(form.value.tahun_karya),
      crew: cleanCrew.length > 0 ? cleanCrew : null
    }

    await api.put(`/api/films/${filmId}`, payload)
    
    if (originalStatus.value === 'published') {
      showToast('success', 'Film diupdate! Status berubah ke "Menunggu Review".')
    } else {
      showToast('success', 'Film berhasil diupdate!')
    }
    
    setTimeout(() => {
      router.push('/my-films')
    }, 1500)
  } catch (err) {
    formError.value = err.message || 'Gagal menyimpan film'
    showToast('error', formError.value)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchFilm()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F2EEE3]">
    <Navbar />

    <main class="max-w-4xl mx-auto px-4 md:px-8 pt-28 pb-16">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" @click="router.push('/my-films')">
          <ArrowLeft class="w-4 h-4" />
        </Button>
        <div>
          <h1 class="text-3xl md:text-4xl font-display text-stone-900">Edit Film</h1>
          <p class="text-stone-500">Perubahan pada film yang sudah dipublikasi akan memerlukan review ulang.</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <Loader2 class="w-8 h-8 animate-spin text-stone-400" />
      </div>

      <template v-else>
        <!-- Warning for published films -->
        <div v-if="originalStatus === 'published'" class="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-bold text-yellow-800">Perhatian</p>
            <p class="text-sm text-yellow-700">Film ini sudah dipublikasi. Jika kamu menyimpan perubahan, status akan berubah menjadi "Menunggu Review" dan film tidak akan tampil di beranda sampai disetujui kembali.</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="formError" class="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600">
          {{ formError }}
        </div>

        <form @submit.prevent="submitFilm" class="space-y-8">
          <!-- Basic Info -->
          <Card>
            <CardContent class="p-6 space-y-4">
              <h2 class="text-xl font-bold flex items-center gap-2 mb-4">
                <Film class="w-5 h-5" /> Informasi Dasar
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold mb-2">Judul Film *</label>
                  <Input v-model="form.judul" placeholder="Masukkan judul film" />
                </div>

                <div>
                  <label class="block text-sm font-bold mb-2">Kategori *</label>
                  <select 
                    v-model="form.category_id"
                    class="w-full h-10 px-3 border-2 border-black bg-white text-sm"
                  >
                    <option value="">Pilih kategori</option>
                    <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">
                      {{ cat.nama_kategori }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-bold mb-2">Tahun Karya</label>
                  <Input v-model="form.tahun_karya" type="number" min="1900" :max="new Date().getFullYear()" />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-bold mb-2">Sinopsis</label>
                  <textarea 
                    v-model="form.sinopsis"
                    rows="4"
                    placeholder="Ceritakan sinopsis film..."
                    class="w-full p-3 border-2 border-black bg-white text-sm resize-none"
                  ></textarea>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Links -->
          <Card>
            <CardContent class="p-6 space-y-4">
              <h2 class="text-xl font-bold mb-4">Link Video</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Link Video Utama</label>
                  <Input v-model="form.link_video_utama" placeholder="https://youtube.com/..." />
                </div>
                <div>
                  <label class="block text-sm font-bold mb-2">Link Trailer</label>
                  <Input v-model="form.link_trailer" placeholder="https://youtube.com/..." />
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Visual Assets -->
          <Card>
            <CardContent class="p-6 space-y-4">
              <h2 class="text-xl font-bold mb-4">Visual & Dokumen</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold mb-2">Gambar Poster</label>
                  <div class="space-y-3">
                    <div v-if="form.gambar_poster" class="relative w-40 h-60 bg-stone-100 border border-stone-300 rounded overflow-hidden">
                      <img :src="form.gambar_poster" class="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        @click="form.gambar_poster = ''"
                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                      >
                        <X class="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div class="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept="image/*"
                        @change="(e) => handleFileUpload(e, 'gambar_poster')"
                        class="block w-full text-sm text-stone-500
                          file:mr-4 file:py-2 file:px-4
                          file:border-0 file:text-sm file:font-semibold
                          file:bg-brand-teal file:text-white
                          hover:file:bg-teal-700
                          cursor-pointer"
                        :disabled="uploading"
                      />
                      <Loader2 v-if="uploading" class="w-5 h-5 animate-spin text-stone-400" />
                    </div>
                    <p class="text-xs text-stone-500">Format: JPG, PNG. Max 10MB.</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-bold mb-2">File Naskah (PDF)</label>
                    <div class="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept=".pdf"
                        @change="(e) => handleFileUpload(e, 'file_naskah')"
                        class="block w-full text-sm text-stone-500
                          file:mr-4 file:py-2 file:px-4
                          file:border-0 file:text-sm file:font-semibold
                          file:bg-stone-800 file:text-white
                          hover:file:bg-stone-700
                          cursor-pointer"
                        :disabled="uploading"
                      />
                      <CheckCircle v-if="form.file_naskah" class="w-5 h-5 text-green-500" />
                    </div>
                    <p v-if="form.file_naskah" class="text-xs text-green-600 mt-1 truncate">
                      File terupload: {{ form.file_naskah.split('/').pop() }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-bold mb-2">File Storyboard (PDF)</label>
                    <div class="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept=".pdf"
                        @change="(e) => handleFileUpload(e, 'file_storyboard')"
                        class="block w-full text-sm text-stone-500
                          file:mr-4 file:py-2 file:px-4
                          file:border-0 file:text-sm file:font-semibold
                          file:bg-stone-800 file:text-white
                          hover:file:bg-stone-700
                          cursor-pointer"
                        :disabled="uploading"
                      />
                      <CheckCircle v-if="form.file_storyboard" class="w-5 h-5 text-green-500" />
                    </div>
                    <p v-if="form.file_storyboard" class="text-xs text-green-600 mt-1 truncate">
                      File terupload: {{ form.file_storyboard.split('/').pop() }}
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-bold mb-2">File RAB (PDF)</label>
                    <div class="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept=".pdf"
                        @change="(e) => handleFileUpload(e, 'file_rab')"
                        class="block w-full text-sm text-stone-500
                          file:mr-4 file:py-2 file:px-4
                          file:border-0 file:text-sm file:font-semibold
                          file:bg-stone-800 file:text-white
                          hover:file:bg-stone-700
                          cursor-pointer"
                        :disabled="uploading"
                      />
                      <CheckCircle v-if="form.file_rab" class="w-5 h-5 text-green-500" />
                    </div>
                    <p v-if="form.file_rab" class="text-xs text-green-600 mt-1 truncate">
                      File terupload: {{ form.file_rab.split('/').pop() }}
                    </p>
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-bold mb-2">Informasi Tambahan (Backstory, Director Statement, dll)</label>
                  <RichTextEditor 
                    v-model="form.deskripsi_lengkap"
                    placeholder="Ceritakan sejarah pembuatan film, statement sutradara, atau info menarik lainnya..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Crew -->
          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold">Crew Film</h2>
                <Button type="button" variant="outline" size="sm" @click="addCrew" class="gap-1">
                  <Plus class="w-4 h-4" /> Tambah Jabatan
                </Button>
              </div>

              <div class="space-y-4">
                <div v-for="(crew, crewIdx) in form.crew" :key="crewIdx" class="p-4 bg-stone-100 border border-stone-300">
                  <div class="flex items-center gap-2 mb-3">
                    <Input 
                      v-model="crew.jabatan" 
                      placeholder="Jabatan (cth: Sutradara, Penulis)"
                      class="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      class="text-red-600"
                      @click="removeCrew(crewIdx)"
                      v-if="form.crew.length > 1"
                    >
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>

                  <div class="space-y-2 ml-4">
                    <div v-for="(member, memberIdx) in crew.anggota" :key="memberIdx" class="flex items-center gap-2">
                      <span class="text-xs text-stone-500 w-4">{{ memberIdx + 1 }}.</span>
                      <Input 
                        v-model="crew.anggota[memberIdx]" 
                        placeholder="Nama anggota"
                        class="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        @click="removeCrewMember(crewIdx, memberIdx)"
                        v-if="crew.anggota.length > 1"
                      >
                        <X class="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      @click="addCrewMember(crewIdx)"
                      class="text-xs"
                    >
                      + Tambah Anggota
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Submit -->
          <div class="flex gap-4 justify-end">
            <Button type="button" variant="outline" @click="router.push('/my-films')">
              Batal
            </Button>
            <Button type="submit" :disabled="saving" class="gap-2">
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </template>
    </main>

    <Footer />

    <!-- Toast -->
    <!-- Toast -->
    <Toast 
      :show="toast.show" 
      :type="toast.type" 
      :message="toast.message" 
      @close="toast.show = false" 
    />
  </div>
</template>

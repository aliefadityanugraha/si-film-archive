<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/api'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import Toast from '@/components/Toast.vue'
import { useToast } from '@/composables/useToast'
import FilmForm from '@/components/FilmForm.vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Upload Karya Baru - PF Space'
})

const router = useRouter()
const loading = ref(false)
const formError = ref('')
const { toast, showToast } = useToast()

const handleSubmit = async (formData) => {
  formError.value = ''
  
  if (!formData.judul.trim()) {
    formError.value = 'Judul film wajib diisi'
    showToast('error', formError.value)
    return
  }
  if (!formData.category_id) {
    formError.value = 'Kategori wajib dipilih'
    showToast('error', formError.value)
    return
  }

  loading.value = true
  try {
    const cleanCrew = formData.crew
      .filter(c => c.jabatan.trim())
      .map(c => ({
        jabatan: c.jabatan.trim(),
        anggota: c.anggota.filter(a => a.trim())
      }))

    const payload = {
      ...formData,
      category_id: parseInt(formData.category_id),
      tahun_karya: parseInt(formData.tahun_karya),
      crew: cleanCrew.length > 0 ? cleanCrew : null
    }

    await api.post('/api/films', payload)
    showToast('success', 'Film berhasil disubmit! Menunggu review admin.')
    
    setTimeout(() => {
      router.push('/my-films')
    }, 1500)
  } catch (err) {
    formError.value = err.message || 'Gagal menyimpan film'
    showToast('error', formError.value)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/my-films')
}

const handleError = (message) => {
    showToast('error', message)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F2EEE3]">
    <Navbar />

    <main class="max-w-4xl mx-auto px-4 md:px-8 pt-28 pb-16">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" @click="handleCancel">
          <ArrowLeft class="w-4 h-4" />
        </Button>
        <div>
          <h1 class="text-3xl md:text-4xl font-display text-stone-900">Upload Film Baru</h1>
          <p class="text-stone-500">Film akan direview oleh admin sebelum dipublikasi.</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="formError" class="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600">
        {{ formError }}
      </div>

      <FilmForm 
        :loading="loading" 
        @submit="handleSubmit" 
        @cancel="handleCancel"
        @error="handleError"
      />
    </main>

    <Footer />

    <!-- Toast -->
    <Toast 
      :show="toast.show" 
      :type="toast.type" 
      :message="toast.message" 
      @close="toast.show = false" 
    />
  </div>
</template>

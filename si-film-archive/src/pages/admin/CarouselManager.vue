<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'
import AdminSidebar from '@/components/AdminSidebar.vue'
import PageHeader from '@/components/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, Pencil, Trash2, Loader2, ImageIcon, X, Save, AlertTriangle, ArrowUp, ArrowDown
} from 'lucide-vue-next'
import Toast from '@/components/Toast.vue'
import { useToast } from '@/composables/useToast'

const sidebarCollapsed = ref(false)
const items = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const uploading = ref(false) // Upload state

// Modal state
const showModal = ref(false)
const editingItem = ref(null)
const formData = ref({ title: '', summary: '', quote: '', image_url: '', is_active: true })
const formError = ref('')

// Confirm dialog state
const showConfirm = ref(false)
const confirmData = ref({ title: '', message: '' })

// Toast state
const { toast, showToast } = useToast()

const normalizeActiveFlag = (raw) => {
  const source =
    typeof raw.is_active !== 'undefined'
      ? raw.is_active
      : typeof raw.active !== 'undefined'
      ? raw.active
      : typeof raw.status !== 'undefined'
      ? raw.status
      : false

  if (typeof source === 'boolean') return source
  if (typeof source === 'number') return source === 1
  if (typeof source === 'string') {
    const v = source.toLowerCase()
    return v === '1' || v === 'true' || v === 'active' || v === 'yes'
  }
  return false
}

const fetchItems = async () => {
  loading.value = true
  try {
    const res = await api.get('/api/carousel')
    const data = Array.isArray(res.data) ? res.data : []
    items.value = data.map(item => ({
      ...item,
      is_active: normalizeActiveFlag(item)
    }))
  } catch (err) {
    console.error('Failed to fetch carousel items:', err)
    showToast('error', 'Gagal memuat carousel')
  } finally {
    loading.value = false
  }
}

const openModal = (item = null) => {
  editingItem.value = item
  if (item) {
    formData.value = {
      title: item.title || '',
      summary: item.summary || '',
      quote: item.quote || '',
      image_url: item.image_url || '',
      is_active: normalizeActiveFlag(item)
    }
  } else {
    formData.value = { title: '', summary: '', quote: '', image_url: '', is_active: true }
  }
  formError.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
}

const saveItem = async () => {
  if (!formData.value.image_url.trim()) {
    formError.value = 'URL Gambar wajib diisi'
    return
  }

  saving.value = true
  formError.value = ''

  try {
    if (editingItem.value) {
      await api.put(`/api/carousel/${editingItem.value.id}`, formData.value)
      showToast('success', 'Item berhasil diperbarui')
    } else {
      await api.post('/api/carousel', formData.value)
      showToast('success', 'Item berhasil ditambahkan')
    }
    closeModal()
    await fetchItems()
  } catch (err) {
    formError.value = err.message || 'Gagal menyimpan item'
  } finally {
    saving.value = false
  }
}

const itemToDelete = ref(null)

const confirmDelete = (item) => {
  itemToDelete.value = item
  confirmData.value = {
    title: 'Hapus Item',
    message: `Apakah Anda yakin ingin menghapus item ini?`
  }
  showConfirm.value = true
}

const executeDelete = async () => {
  if (!itemToDelete.value) return
  
  deleting.value = true
  try {
    await api.delete(`/api/carousel/${itemToDelete.value.id}`)
    showToast('success', 'Item berhasil dihapus')
    await fetchItems()
  } catch (err) {
    showToast('error', err.message || 'Gagal menghapus item')
  } finally {
    deleting.value = false
    showConfirm.value = false
    itemToDelete.value = null
  }
}

const moveItem = async (index, direction) => {
  const newItems = [...items.value]
  const targetIndex = index + direction
  
  if (targetIndex < 0 || targetIndex >= newItems.length) return
  
  // Swap
  const temp = newItems[index]
  newItems[index] = newItems[targetIndex]
  newItems[targetIndex] = temp
  
  // Update local state first
  items.value = newItems
  
  // Prepare payload for backend
  const payload = {
    items: newItems.map((item, idx) => ({ id: item.id, order: idx }))
  }
  
  try {
    await api.post('/api/carousel/reorder', payload)
    // No need to fetchItems if successful, as local state is already updated
  } catch (err) {
    console.error('Failed to reorder:', err)
    showToast('error', 'Gagal mengubah urutan')
    await fetchItems() // Revert on error
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validasi ukuran (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('error', 'Ukuran file terlalu besar (maksimal 5MB)')
    event.target.value = '' 
    return
  }

  // Validasi tipe
  if (!file.type.startsWith('image/')) {
    showToast('error', 'File harus berupa gambar')
    event.target.value = ''
    return
  }

  const formDataPayload = new FormData()
  formDataPayload.append('file', file)

  uploading.value = true
  try {
    const res = await api.upload('/api/upload', formDataPayload)
    if (res.success) {
      formData.value.image_url = res.data.url
      showToast('success', 'Gambar berhasil diupload')
    }
  } catch (err) {
    console.error('Upload failed:', err)
    showToast('error', 'Gagal mengupload gambar')
    event.target.value = ''
  } finally {
    uploading.value = false
  }
}

onMounted(fetchItems)
</script>

<template>
  <div class="min-h-screen bg-stone-100">
    <AdminSidebar @update:collapsed="sidebarCollapsed = $event" />
    
    <main :class="['p-4 md:p-8 transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-64']">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-4">
        <a href="/" class="text-brand-teal hover:underline">Home</a>
        <span class="text-stone-400">/</span>
        <span class="text-stone-600">Administration</span>
        <span class="text-stone-400">/</span>
        <Badge variant="outline" class="bg-orange-100 text-orange-700 border-orange-300">Carousel</Badge>
      </nav>

      <!-- Header -->
      <PageHeader 
        title="Manage Carousel" 
        description="Atur konten carousel di halaman utama."
        :icon="ImageIcon"
        icon-color="bg-teal-500"
      >
        <template #actions>
          <Button @click="openModal()" class="gap-2">
            <Plus class="w-4 h-4" />
            Tambah Item
          </Button>
        </template>
      </PageHeader>

      <!-- Items Table -->
      <Card>
        <CardHeader class="bg-teal-50 border-b-2 border-stone-800">
          <div class="flex items-center gap-3">
            <ImageIcon class="w-5 h-5" />
            <CardTitle class="text-lg font-bold uppercase">Daftar Item</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <Loader2 class="w-8 h-8 animate-spin text-stone-400" />
          </div>

          <div v-else-if="items.length === 0" class="text-center py-12 text-stone-400">
            <ImageIcon class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Belum ada item carousel</p>
          </div>

          <template v-else>
            <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-lime-50 border-b-2 border-stone-800 text-xs font-bold uppercase tracking-wider">
              <div class="col-span-1">Order</div>
              <div class="col-span-2">Image</div>
              <div class="col-span-3">Title</div>
              <div class="col-span-3">Quote</div>
              <div class="col-span-1 text-center">Active</div>
              <div class="col-span-2 text-right">Aksi</div>
            </div>
            <div 
              v-for="(item, index) in items" 
              :key="item.id" 
              class="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center border-b border-stone-200 hover:bg-stone-50"
            >
              <div class="md:col-span-1 flex flex-col gap-1">
                <button @click="moveItem(index, -1)" :disabled="index === 0" class="disabled:opacity-30 hover:text-brand-teal">
                  <ArrowUp class="w-4 h-4" />
                </button>
                <button @click="moveItem(index, 1)" :disabled="index === items.length - 1" class="disabled:opacity-30 hover:text-brand-teal">
                  <ArrowDown class="w-4 h-4" />
                </button>
              </div>
              <div class="md:col-span-2">
                <img :src="item.image_url" class="w-20 h-12 object-cover border border-stone-300" />
              </div>
              <div class="md:col-span-3 font-bold">{{ item.title || '-' }}</div>
              <div class="md:col-span-3 text-sm text-stone-600 line-clamp-2">{{ item.quote || '-' }}</div>
              <div class="md:col-span-1 text-center">
                <Badge :variant="item.is_active ? 'default' : 'secondary'">
                  {{ item.is_active ? 'Yes' : 'No' }}
                </Badge>
              </div>
              <div class="md:col-span-2 flex gap-2 md:justify-end">
                <Button variant="outline" size="sm" @click="openModal(item)">
                  <Pencil class="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" class="text-red-600 hover:bg-red-50" @click="confirmDelete(item)">
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </template>
        </CardContent>
      </Card>
    </main>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
      <div class="relative bg-white border-2 border-black shadow-brutal w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-stone-100">
          <h2 class="font-bold text-lg">{{ editingItem ? 'Edit Item' : 'Tambah Item' }}</h2>
          <button @click="closeModal" class="p-1 hover:bg-stone-200">
            <X class="w-5 h-5" />
          </button>
        </div>
        <form @submit.prevent="saveItem" class="p-6 space-y-4">
          <div v-if="formError" class="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
            {{ formError }}
          </div>
          <div>
            <label class="block text-sm font-bold mb-2">Judul</label>
            <Input v-model="formData.title" placeholder="Contoh: The Battleship Potemkin" />
          </div>
          <div>
            <label class="block text-sm font-bold mb-2">Ringkasan / Tag</label>
            <Input v-model="formData.summary" placeholder="Contoh: Montage Editing" />
          </div>
          <div>
            <label class="block text-sm font-bold mb-2">Quote / Deskripsi</label>
            <textarea 
              v-model="formData.quote" 
              class="w-full p-2 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-bold mb-2">Gambar Carousel *</label>
            <div class="space-y-3">
              <div v-if="formData.image_url" class="relative w-full h-40 bg-stone-100 border border-stone-300 rounded overflow-hidden">
                <img :src="formData.image_url" class="w-full h-full object-cover" />
                <button 
                  type="button" 
                  @click="formData.image_url = ''"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
              
              <div class="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*"
                  @change="handleFileUpload"
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
              <p class="text-xs text-stone-500">Format: JPG, PNG. Max 5MB. Rasio landscape direkomendasikan.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="active" v-model="formData.is_active" class="w-4 h-4" />
            <label for="active" class="text-sm font-bold">Aktif</label>
          </div>
          <div class="flex gap-3 pt-4">
            <Button type="button" variant="outline" class="flex-1" @click="closeModal">Batal</Button>
            <Button type="submit" class="flex-1 gap-2" :disabled="saving">
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="showConfirm = false"></div>
      <div class="relative bg-white border-2 border-black shadow-brutal w-full max-w-sm mx-4">
        <div class="flex items-center gap-3 px-6 py-4 border-b-2 border-black bg-red-50">
          <AlertTriangle class="w-5 h-5 text-red-600" />
          <h2 class="font-bold text-lg text-red-800">{{ confirmData.title }}</h2>
        </div>
        <div class="p-6">
          <p class="text-stone-600 mb-6">{{ confirmData.message }}</p>
          <div class="flex gap-3">
            <Button type="button" variant="outline" class="flex-1" @click="showConfirm = false" :disabled="deleting">
              Batal
            </Button>
            <Button type="button" class="flex-1 gap-2 bg-red-600 hover:bg-red-700" @click="executeDelete" :disabled="deleting">
              <Loader2 v-if="deleting" class="w-4 h-4 animate-spin" />
              <Trash2 v-else class="w-4 h-4" />
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>

    <Toast v-bind="toast" @close="toast.show = false" />
  </div>
</template>

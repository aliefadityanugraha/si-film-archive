import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/api'
import { useAuth } from './useAuth'

export function useCollection(filmId) {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  
  const isInCollection = ref(false)
  const processing = ref(false)
  const loading = ref(false)

  // Fetch collection status for a film
  const fetchStatus = async () => {
    if (!isLoggedIn.value || !filmId.value) return
    
    loading.value = true
    try {
      const res = await api.get(`/api/collections/status/${filmId.value}`)
      isInCollection.value = res.data?.is_in_collection || false
    } catch (err) {
      console.error('Failed to fetch collection status:', err)
      isInCollection.value = false
    } finally {
      loading.value = false
    }
  }

  // Toggle collection (add/remove)
  const toggle = async (showToast = null) => {
    if (!isLoggedIn.value) {
      router.push('/auth/login')
      return { success: false, message: 'Please login first' }
    }

    if (!filmId.value) {
      return { success: false, message: 'Film ID is required' }
    }

    processing.value = true
    try {
      const res = await api.post(`/api/collections/toggle/${filmId.value}`, {})
      isInCollection.value = res.data?.is_in_collection || false
      
      const message = isInCollection.value 
        ? 'Film disimpan ke koleksi' 
        : 'Film dihapus dari koleksi'
      
      if (showToast) {
        showToast(message, 'success')
      }
      
      return { 
        success: true, 
        isInCollection: isInCollection.value,
        message 
      }
    } catch (err) {
      console.error('Failed to toggle collection:', err)
      const message = err.data?.message || 'Gagal memproses koleksi'
      
      if (showToast) {
        showToast(message, 'error')
      }
      
      return { success: false, message }
    } finally {
      processing.value = false
    }
  }

  // Remove from collection (used in Collections page)
  const remove = async (showToast = null) => {
    if (!isLoggedIn.value || !filmId.value) return false

    processing.value = true
    try {
      await api.post(`/api/collections/toggle/${filmId.value}`, {})
      isInCollection.value = false
      
      if (showToast) {
        showToast('Film dihapus dari koleksi', 'success')
      }
      
      return true
    } catch (err) {
      console.error('Failed to remove from collection:', err)
      if (showToast) {
        showToast('Gagal menghapus film', 'error')
      }
      return false
    } finally {
      processing.value = false
    }
  }

  return {
    isInCollection,
    processing,
    loading,
    fetchStatus,
    toggle,
    remove
  }
}



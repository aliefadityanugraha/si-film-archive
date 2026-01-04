import { ref, watch, unref } from 'vue'
import { api } from '@/lib/api'

export function useLiveSearch(options = {}) {
  const { 
    endpoint = '/api/films', 
    limit = 10, 
    debounceMs = 300,
    initialStatus = 'published',
    status: statusOption = null
  } = options

  const searchQuery = ref('')
  const searchResults = ref([])
  const isSearching = ref(false)
  const showResults = ref(false)
  // Use ref for status so it can be reactive
  const status = ref(statusOption !== null ? unref(statusOption) : initialStatus)
  let searchTimeout = null
  let currentSearchQuery = ''

  // Watch status option if it's reactive (computed/ref)
  if (statusOption !== null) {
    watch(() => unref(statusOption), (newStatus) => {
      status.value = newStatus
    }, { immediate: true })
  }

  const performSearch = async () => {
    const query = searchQuery.value.trim()
    if (!query) {
      searchResults.value = []
      showResults.value = false
      return
    }

    currentSearchQuery = query
    isSearching.value = true
    showResults.value = true
    
    try {
      const searchParams = { 
        search: query, 
        limit,
        status: status.value
      }

      const res = await api.get(endpoint, {
        params: searchParams
      })
      
      if (currentSearchQuery === query) {
        searchResults.value = res.data || []
      }
    } catch (err) {
      if (currentSearchQuery === query) {
        console.error('Search failed:', err)
        searchResults.value = []
      }
    } finally {
      if (currentSearchQuery === query) {
        isSearching.value = false
      }
    }
  }

  watch(searchQuery, (newVal) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    const query = newVal.trim()
    
    if (!query) {
      searchResults.value = []
      showResults.value = false
      currentSearchQuery = ''
      return
    }
    
    searchTimeout = setTimeout(performSearch, debounceMs)
  })

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    showResults.value = false
    currentSearchQuery = ''
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    showResults,
    performSearch,
    clearSearch
  }
}

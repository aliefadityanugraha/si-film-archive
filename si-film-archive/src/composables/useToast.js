import { ref } from 'vue'

export function useToast() {
  const toast = ref({ show: false, type: 'success', message: '' })

  const showToast = (type, message) => {
    toast.value = { show: true, type, message }
    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }

  return {
    toast,
    showToast
  }
}


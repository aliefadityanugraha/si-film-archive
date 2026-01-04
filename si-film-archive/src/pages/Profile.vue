<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { api } from '@/lib/api'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Lock, Eye, EyeOff, Camera, Save, Film, Loader2 } from 'lucide-vue-next'
import { useHead } from '@unhead/vue'

const router = useRouter()
const { user, refreshUser, initialized, isLoggedIn } = useAuth()
const fileInput = ref(null)

// Redirect if not logged in
watch([initialized, isLoggedIn], ([init, loggedIn]) => {
  if (init && !loggedIn) {
    router.push('/auth/login')
  }
}, { immediate: true })

// Setup head after user is defined
useHead({
  title: () => user.value ? `Profil: ${user.value.name} - CineArchive` : 'Profil Saya - CineArchive'
})

// Form state
const editName = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Loading & messages
const savingProfile = ref(false)
const savingPassword = ref(false)
const profileMessage = ref('')
const passwordMessage = ref('')

// Watch user and init form
watch(user, (newUser) => {
  if (newUser) {
    editName.value = newUser.name || ''
  }
}, { immediate: true })

// Computed
const roleName = computed(() => user.value?.role?.name || 'user')
const joinDate = computed(() => {
  if (!user.value?.created_at) return 'Unknown'
  return new Date(user.value.created_at).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })
})

const stats = ref([
  { label: 'Films Uploaded', value: 0 },
  { label: 'Films Watched', value: 0 },
  { label: 'Collections', value: 0 },
  { label: 'Comments', value: 0 }
])

// Save profile
const saveProfile = async () => {
  savingProfile.value = true
  profileMessage.value = ''
  
  try {
    // Check if we have a file to upload or just name update
    const formData = new FormData()
    formData.append('name', editName.value)
    
    // Only append file if selected (needs to be handled)
    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    // Use upload helper if file exists, otherwise standard patch
    if (selectedFile.value) {
       await api.upload('/api/auth/update-user', formData, { method: 'PATCH' })
    } else {
       await api.patch('/api/auth/update-user', { name: editName.value })
    }

    await refreshUser()
    profileMessage.value = 'Profile updated successfully!'
    selectedFile.value = null // Reset file
  } catch (err) {
    profileMessage.value = err.message || 'Failed to update profile'
  } finally {
    savingProfile.value = false
  }
}

const selectedFile = ref(null)
const previewImage = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Change password
const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    passwordMessage.value = 'Passwords do not match'
    return
  }
  
  savingPassword.value = true
  passwordMessage.value = ''
  
  try {
    await api.post('/api/auth/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordMessage.value = 'Password changed successfully!'
  } catch (err) {
    passwordMessage.value = err.message || 'Failed to change password'
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F2EEE3]">
    <Navbar />

    <!-- Loading State -->
    <div v-if="!initialized" class="min-h-screen flex items-center justify-center pt-20">
      <Loader2 class="w-8 h-8 animate-spin text-brand-teal" />
    </div>

    <!-- Content -->
    <main v-else class="max-w-4xl mx-auto px-4 md:px-8 pt-28 pb-16">
      <!-- Profile Header -->
      <Card class="mb-8">
        <CardContent class="p-6 md:p-8">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
            <!-- Avatar -->
            <div class="relative">
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden" 
                accept="image/*"
                @change="handleFileChange"
              />
              <img 
                v-if="previewImage || user?.image"
                :src="previewImage || user.image" 
                :alt="user?.name"
                class="w-28 h-28 border-2 border-black shadow-brutal object-cover"
              />
              <div v-else class="w-28 h-28 border-2 border-black shadow-brutal bg-stone-200 flex items-center justify-center">
                <User class="w-12 h-12 text-stone-400" />
              </div>
              <button 
                @click="triggerFileInput"
                class="absolute bottom-0 right-0 w-8 h-8 bg-brand-teal border-2 border-black flex items-center justify-center hover:bg-brand-teal/80 transition-colors cursor-pointer"
              >
                <Camera class="w-4 h-4 text-white" />
              </button>
            </div>

            <!-- Info -->
            <div class="flex-1 text-center md:text-left">
              <div class="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 class="text-3xl font-display font-semibold text-stone-900">{{ user?.name || 'User' }}</h1>
                <Badge variant="secondary" class="capitalize">{{ roleName }}</Badge>
              </div>
              <p class="text-stone-500 font-body mb-1">{{ user?.email }}</p>
              <p class="text-sm text-stone-400 font-body">Member since {{ joinDate }}</p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4">
              <div v-for="stat in stats" :key="stat.label" class="text-center px-4 py-2 bg-stone-100 border border-stone-200">
                <div class="text-2xl font-display font-bold text-stone-900">{{ stat.value }}</div>
                <div class="text-xs font-body text-stone-500">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Personal Information -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <User class="w-5 h-5 text-brand-teal" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-if="profileMessage" :class="profileMessage.includes('success') ? 'text-green-600' : 'text-red-500'" class="text-sm">
              {{ profileMessage }}
            </div>
            <div>
              <label class="block text-sm font-bold font-body text-stone-700 mb-2">Full Name</label>
              <Input v-model="editName" placeholder="Enter your name" />
            </div>
            <div>
              <label class="block text-sm font-bold font-body text-stone-700 mb-2">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input :value="user?.email" type="email" class="pl-10" disabled />
              </div>
              <p class="text-xs text-stone-400 mt-1">Email cannot be changed</p>
            </div>
            <Button class="w-full" @click="saveProfile" :disabled="savingProfile">
              <Loader2 v-if="savingProfile" class="w-4 h-4 mr-2 animate-spin" />
              <Save v-else class="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <!-- Change Password -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Lock class="w-5 h-5 text-brand-teal" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-if="passwordMessage" :class="passwordMessage.includes('success') ? 'text-green-600' : 'text-red-500'" class="text-sm">
              {{ passwordMessage }}
            </div>
            <div>
              <label class="block text-sm font-bold font-body text-stone-700 mb-2">Current Password</label>
              <div class="relative">
                <Input 
                  v-model="currentPassword" 
                  :type="showCurrentPassword ? 'text' : 'password'" 
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <Eye v-if="!showCurrentPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold font-body text-stone-700 mb-2">New Password</label>
              <div class="relative">
                <Input 
                  v-model="newPassword" 
                  :type="showNewPassword ? 'text' : 'password'" 
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <Eye v-if="!showNewPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold font-body text-stone-700 mb-2">Confirm New Password</label>
              <div class="relative">
                <Input 
                  v-model="confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <Button variant="secondary" class="w-full" @click="changePassword" :disabled="savingPassword">
              <Loader2 v-if="savingPassword" class="w-4 h-4 mr-2 animate-spin" />
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Recent Activity -->
      <Card class="mt-6">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Film class="w-5 h-5 text-brand-teal" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-center py-8 text-stone-400">
            <Film class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        </CardContent>
      </Card>
    </main>

    <Footer />
  </div>
</template>

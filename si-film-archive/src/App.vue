<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import AIChatSidebar from './components/AIChatSidebar.vue'

const { init, initialized } = useAuth()

onMounted(() => {
  init()
})
</script>

<template>
  <template v-if="initialized">
    <router-view />
    <AIChatSidebar />
    
    <!-- Global Pattern Overlay -->
    <!-- 
      Tips: Ganti URL di bawah ini dengan path gambar pattern Anda.
      Contoh: url('/images/paper-texture.png') 
    -->
    <!-- <div 
      class="fixed inset-0 pointer-events-none z-[40] opacity-[0.2] mix-blend-overlay bg-repeat global-pattern"
      style="background-image: url('/1155.jpg'); background-size: 300px;"
    ></div> -->

    <!-- Style to hide pattern on hero section using CSS clip-path or masking is tricky globally.
         Instead, we will set z-index of hero section to be HIGHER than this pattern.
         Current pattern z-index is 40. We need to check HeroSection z-index.
    -->
    <!-- <component is="style">
      /* Custom style to ensure Hero Section sits ABOVE the global pattern */
      .hero-section-container {
        position: relative;
        z-index: 50; /* Higher than pattern z-40 */
      }
    </component> -->
  </template>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
</template>

<style>
/* Global styles handled in style.css */
</style>

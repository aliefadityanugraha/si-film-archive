<script setup>
import { Film } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-[#F2EEE3] border-t border-stone-800 py-10 mt-auto">
    <div class="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Left: Logo & Copyright -->
      <div class="flex items-center gap-3">
        <Film class="w-5 h-5 text-stone-800" />
        <span class="text-lg font-display font-semibold text-stone-800">PF Space</span>
        <span class="text-stone-400 font-body">|</span>
        <span class="text-sm font-medium font-body text-stone-800">
          © 2025. Dibuat untuk memenuhi tugas akhir mata kuliah Sistem Informasi.
        </span>
       </div>

      <!-- Right: Links -->
      <div class="flex items-center gap-6">
        <router-link to="/privacy" class="text-sm font-bold font-body uppercase tracking-wide text-stone-800 hover:text-brand-red transition-colors">
          Privacy Policy
        </router-link>
        <router-link to="/terms" class="text-sm font-bold font-body uppercase tracking-wide text-stone-800 hover:text-brand-red transition-colors">
          Terms
        </router-link>
        <router-link to="/contact" class="text-sm font-bold font-body uppercase tracking-wide text-stone-800 hover:text-brand-red transition-colors">
          Contact
        </router-link>
      </div>
    </div>
  </footer>
</template>

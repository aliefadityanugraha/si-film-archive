<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, CheckCircle, AlertTriangle } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F2EEE3]">
    <Navbar />

    <main class="max-w-4xl mx-auto px-4 md:px-8 py-12 pt-25">
      <SectionHeader 
        title="Terms of Service" 
        subtitle="Syarat dan ketentuan penggunaan platform CineArchive."
        :light-text="false"
      />

      <Card class="mt-8 border-2 border-black shadow-brutal">
        <CardContent class="p-6 md:p-8 space-y-6 text-stone-800">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
            <FileText class="w-8 h-8 text-brand-red" />
            <p class="text-sm text-stone-500">Berlaku mulai: 31 Desember 2024</p>
          </div>

          <section>
            <h3 class="text-xl font-display font-bold mb-3">1. Penerimaan Syarat</h3>
            <p class="leading-relaxed">
              Dengan mengakses atau menggunakan CineArchive, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-display font-bold mb-3 flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-stone-400" />
              2. Akun Pengguna
            </h3>
            <p class="leading-relaxed">
              Untuk mengakses fitur tertentu, Anda mungkin perlu membuat akun. Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi Anda dan untuk semua aktivitas yang terjadi di bawah akun Anda.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-display font-bold mb-3 flex items-center gap-2">
              <AlertTriangle class="w-5 h-5 text-stone-400" />
              3. Konten Pengguna
            </h3>
            <p class="leading-relaxed">
              Anda memegang hak cipta atas konten yang Anda unggah. Namun, dengan mengunggah konten ke CineArchive, Anda memberikan kami lisensi non-eksklusif untuk menampilkan, mendistribusikan, dan mempromosikan konten tersebut dalam platform kami untuk tujuan pendidikan dan pengarsipan.
            </p>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-stone-600">
              <li>Konten tidak boleh melanggar hak cipta pihak lain.</li>
              <li>Konten tidak boleh mengandung ujaran kebencian atau kekerasan eksplisit.</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-display font-bold mb-3">4. Hak Kekayaan Intelektual</h3>
            <p class="leading-relaxed">
              Layanan dan konten aslinya (tidak termasuk Konten yang disediakan oleh pengguna), fitur, dan fungsionalitas adalah dan akan tetap menjadi milik eksklusif CineArchive dan pemberi lisensinya.
            </p>
          </section>

          <section>
            <h3 class="text-xl font-display font-bold mb-3">5. Penghentian</h3>
            <p class="leading-relaxed">
              Kami dapat menghentikan atau menangguhkan akses Anda segera, tanpa pemberitahuan sebelumnya atau kewajiban, dengan alasan apa pun, termasuk tanpa batasan jika Anda melanggar Syarat.
            </p>
          </section>
        </CardContent>
      </Card>
    </main>

    <Footer />
  </div>
</template>

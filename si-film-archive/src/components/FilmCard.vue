<script setup>
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Film, Play } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps({
  film: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'portrait', // 'portrait' | 'landscape'
    validator: (value) => ['portrait', 'landscape'].includes(value)
  },
  aspectRatio: {
    type: String,
    default: ''
  },
  showPlayOverlay: {
    type: Boolean,
    default: true
  },
  imageSrc: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
})

const aspectClass = computed(() => {
  if (props.aspectRatio) return props.aspectRatio
  return props.variant === 'portrait' ? 'aspect-[2/3]' : 'aspect-video'
})

const displayImage = computed(() => {
  return props.imageSrc || props.film?.gambar_poster || props.film?.image
})

const displayTitle = computed(() => {
  return props.title || props.film?.judul || props.film?.title
})

const displaySubtitle = computed(() => {
  if (props.subtitle) return props.subtitle
  if (props.film?.creator?.name) return props.film.creator.name
  if (props.film?.category?.nama_kategori) return props.film.category.nama_kategori
  return ''
})
</script>

<template>
  <Card 
    :class="cn(
      'overflow-hidden group bg-white border-2 border-black shadow-brutal transition-all',
      'hover:shadow-brutal-sm', 
      className
    )"
  >
    <!-- Image Section -->
    <div :class="[aspectClass, 'bg-stone-200 relative overflow-hidden border-b-2 border-black']">
      <img 
        v-if="displayImage" 
        :src="displayImage" 
        :alt="displayTitle"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Film class="w-12 h-12 text-stone-400" />
      </div>

      <!-- Overlays/Badges Slot -->
      <slot name="overlay"></slot>
      
      <!-- Hover Overlay (Play) -->
      <div v-if="showPlayOverlay" class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Play class="w-12 h-12 text-white" />
      </div>
    </div>

    <!-- Content Section -->
    <CardContent class="p-4">
      <slot name="content">
        <h3 class="font-bold text-lg text-stone-900 line-clamp-1 mb-1">{{ displayTitle }}</h3>
        <p v-if="displaySubtitle" class="text-sm text-stone-500 mb-1 flex items-center gap-1">
          <slot name="subtitle-icon"></slot>
          {{ displaySubtitle }}
        </p>
        <slot name="extra-content"></slot>
      </slot>
      
      <!-- Footer/Actions Slot -->
      <div v-if="$slots.actions" class="mt-4 pt-4 border-t-2 border-stone-100 flex gap-2">
        <slot name="actions"></slot>
      </div>
    </CardContent>
  </Card>
</template>

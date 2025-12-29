<template>
  <!-- Floating AI Chat Button -->
  <button 
    v-if="!isOpen"
    @click="isOpen = true"
    class="fixed bottom-6 right-6 z-50 size-14 bg-orange-600 shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8V4H8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 8H6C4.89543 8 4 8.89543 4 10V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 14H4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 14H22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 13V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 13V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <!-- Sidebar Panel -->
  <Transition name="slide">
    <div 
      v-if="isOpen"
      class="fixed top-0 right-0 z-50 w-[500px] h-screen bg-white shadow-[-10px_0px_30px_0px_rgba(0,0,0,0.15)] border-l-4 border-zinc-900 flex flex-col"
    >
      <!-- Header -->
      <div class="h-24 bg-stone-100 border-b-2 border-zinc-900 flex items-center px-6 shrink-0">
        <div class="size-12 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 flex items-center justify-center relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V4H8" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 8H6C4.89543 8 4 8.89543 4 10V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8Z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 14H4" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 14H22" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 13V15" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 13V15" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border border-zinc-900"></div>
        </div>
        <div class="ml-4">
          <div class="text-zinc-900 text-xl font-bold font-['Space_Grotesk']">DEV.ASSISTANT</div>
          <div class="text-zinc-500 text-xs font-['IBM_Plex_Mono'] tracking-tight">/// CINE_ARCHIVE_MODULE_V2.1</div>
        </div>
        <button 
          @click="isOpen = false"
          class="ml-auto size-10 flex items-center justify-center hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Chat Messages Area -->
      <div class="flex-1 bg-stone-100/50 overflow-y-auto p-6 space-y-6">
        <!-- Session Start -->
        <div class="flex items-center gap-4">
          <div class="h-px flex-1 bg-zinc-900/20"></div>
          <span class="text-zinc-500 text-[10px] font-bold font-['IBM_Plex_Mono'] uppercase tracking-wide">Session Start: Today</span>
          <div class="h-px flex-1 bg-zinc-900/20"></div>
        </div>

        <!-- System Message -->
        <div class="flex gap-4">
          <div class="size-10 shrink-0 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15.8333H16.6667" stroke="#E85D04" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.33301 14.1667L8.33301 9.16667L3.33301 4.16667" stroke="#E85D04" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center mb-2">
              <span class="text-zinc-900 text-xs font-bold font-['IBM_Plex_Mono'] uppercase tracking-wide">System</span>
              <span class="text-zinc-500 text-[10px] font-['IBM_Plex_Mono']">10:02 AM</span>
            </div>
            <div class="bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 p-4">
              <p class="text-zinc-900 text-sm font-['IBM_Plex_Mono'] leading-6">Ready for input. I can assist with technical production queries, lens calculation, or script formatting standards.</p>
            </div>
          </div>
        </div>

        <!-- User Message -->
        <div class="flex gap-4 justify-end">
          <div class="flex-1 max-w-[350px]">
            <div class="flex justify-end items-center mb-2 gap-2">
              <span class="text-zinc-500 text-[10px] font-['IBM_Plex_Mono']">10:04 AM</span>
              <span class="text-zinc-900 text-xs font-bold font-['IBM_Plex_Mono'] uppercase tracking-wide">User</span>
            </div>
            <div class="bg-orange-600 shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 p-4">
              <p class="text-white text-sm font-medium font-['IBM_Plex_Mono'] leading-6">What is the best lens for a claustrophobic scene?</p>
            </div>
          </div>
          <img class="size-10 shrink-0 shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] border-2 border-zinc-900 object-cover" src="https://placehold.co/40x40" alt="User avatar" />
        </div>

        <!-- System Response with Details -->
        <div class="flex gap-4">
          <div class="size-10 shrink-0 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15.8333H16.6667" stroke="#E85D04" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.33301 14.1667L8.33301 9.16666L3.33301 4.16666" stroke="#E85D04" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center mb-2">
              <span class="text-zinc-900 text-xs font-bold font-['IBM_Plex_Mono'] uppercase tracking-wide">System</span>
              <span class="text-zinc-500 text-[10px] font-['IBM_Plex_Mono']">10:04 AM</span>
            </div>
            <div class="bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 overflow-hidden">
              <!-- Main Answer -->
              <div class="p-4 bg-yellow-50/30 border-b border-zinc-900">
                <p class="text-zinc-900 text-sm font-['IBM_Plex_Mono'] leading-5">
                  To induce claustrophobia, utilizing a 
                  <span class="bg-orange-600/20 px-1 text-orange-600 font-bold">Telephoto Lens (85mm-100mm+)</span>
                  is recommended.
                </p>
              </div>
              <!-- Technical Logic -->
              <div class="p-4 bg-stone-100">
                <div class="flex items-center gap-2 mb-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#2A9D8F" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 8V6" stroke="#2A9D8F" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 4H6.005" stroke="#2A9D8F" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="text-teal-600 text-xs font-bold font-['IBM_Plex_Mono'] uppercase">Technical Logic:</span>
                </div>
                <p class="text-zinc-500 text-xs font-['IBM_Plex_Mono'] leading-5">Compresses the z-axis. The background appears larger and closer to the subject, reducing perceived depth and creating a "trapped" visual effect.</p>
              </div>
              <!-- Alternative -->
              <div class="p-4 border-t border-zinc-900">
                <p class="text-zinc-500 text-xs font-['IBM_Plex_Mono'] leading-4">> Alternative: Wide angle (14mm) at close proximity for distortion effect.</p>
              </div>
            </div>
            <!-- Action Buttons -->
            <div class="flex gap-3 mt-3">
              <button class="h-8 px-4 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 flex items-center gap-2 hover:bg-stone-100 transition-colors cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 4.50151C4.49974 4.41278 4.52309 4.32557 4.56766 4.24884C4.61223 4.17212 4.67642 4.10863 4.75363 4.06491C4.83085 4.02119 4.91831 3.9988 5.00703 4.00005C5.09576 4.0013 5.18255 4.02613 5.2585 4.07201L7.757 5.57051C7.83139 5.61484 7.89298 5.67773 7.93575 5.75302C7.97853 5.82831 8.00102 5.91342 8.00102 6.00001C8.00102 6.0866 7.97853 6.17171 7.93575 6.247C7.89298 6.32229 7.83139 6.38518 7.757 6.42951L5.2585 7.92801C5.18251 7.97391 5.09567 7.99874 5.0069 7.99997C4.91814 8.0012 4.83064 7.97877 4.75341 7.93498C4.67618 7.8912 4.612 7.82765 4.56747 7.75085C4.52293 7.67405 4.49965 7.58678 4.5 7.49801V4.50151Z" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-zinc-900 text-xs font-bold font-['IBM_Plex_Mono']">Load_Examples</span>
              </button>
              <button class="h-8 px-4 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 flex items-center gap-2 hover:bg-stone-100 transition-colors cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4H7" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 10.5V6" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 4V1.5" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.5 8H10.5" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.5 6V1.5" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.5 10.5V8" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M1.5 7H3.5" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2.5 5V1.5" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2.5 10.5V7" stroke="#18181B" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-zinc-900 text-xs font-bold font-['IBM_Plex_Mono']">Settings.config</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Another User Message -->
        <div class="flex gap-4 justify-end">
          <div class="flex-1 max-w-[320px]">
            <div class="flex justify-end items-center mb-2 gap-2">
              <span class="text-zinc-500 text-[10px] font-['IBM_Plex_Mono']">10:05 AM</span>
              <span class="text-zinc-900 text-xs font-bold font-['IBM_Plex_Mono'] uppercase tracking-wide">User</span>
            </div>
            <div class="bg-orange-600 shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 p-4">
              <p class="text-white text-sm font-medium font-['IBM_Plex_Mono'] leading-6">Show me a lighting diagram for that.</p>
            </div>
          </div>
          <img class="size-10 shrink-0 shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] border-2 border-zinc-900 object-cover" src="https://placehold.co/40x40" alt="User avatar" />
        </div>

        <!-- Typing Indicator -->
        <div class="flex gap-4">
          <div class="size-10 shrink-0 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15.8333H16.6667" stroke="#E85D04" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.33301 14.1667L8.33301 9.16666L3.33301 4.16666" stroke="#E85D04" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <span class="text-zinc-900 text-xs font-bold font-['IBM_Plex_Mono'] uppercase tracking-wide">System</span>
            <div class="mt-2 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 px-4 py-3 flex gap-2">
              <div class="size-2 bg-zinc-900 opacity-20 animate-pulse"></div>
              <div class="size-2 bg-zinc-900 opacity-40 animate-pulse" style="animation-delay: 0.2s"></div>
              <div class="size-2 bg-zinc-900 opacity-60 animate-pulse" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="h-60 bg-white border-t-2 border-zinc-900 p-5 shrink-0">
        <!-- Quick Actions -->
        <div class="flex gap-2 mb-4 overflow-x-auto">
          <button class="h-7 px-3 bg-stone-100 outline outline-1 outline-offset-[-1px] outline-zinc-900 whitespace-nowrap hover:bg-stone-200 transition-colors cursor-pointer">
            <span class="text-zinc-900 text-xs font-medium font-['IBM_Plex_Mono']">> lighting_noir.setup</span>
          </button>
          <button class="h-7 px-3 bg-stone-100 outline outline-1 outline-offset-[-1px] outline-zinc-900 whitespace-nowrap hover:bg-stone-200 transition-colors cursor-pointer">
            <span class="text-zinc-900 text-xs font-medium font-['IBM_Plex_Mono']">> script_structure.xml</span>
          </button>
          <button class="h-7 px-3 bg-stone-100 outline outline-1 outline-offset-[-1px] outline-zinc-900 whitespace-nowrap hover:bg-stone-200 transition-colors cursor-pointer">
            <span class="text-zinc-900 text-xs font-medium font-['IBM_Plex_Mono']">> shot_composition.lib</span>
          </button>
        </div>

        <!-- Input Box -->
        <div class="relative">
          <div class="absolute left-1 top-1 w-full h-full bg-zinc-900"></div>
          <div class="relative bg-white outline outline-2 outline-offset-[-2px] outline-zinc-900">
            <textarea 
              v-model="inputMessage"
              placeholder="// Enter query regarding film production..."
              class="w-full h-14 px-4 py-3 text-sm font-['IBM_Plex_Mono'] text-zinc-900 placeholder:text-neutral-500 resize-none focus:outline-none"
            ></textarea>
            <div class="flex items-center justify-between px-2 py-2 bg-stone-100/30 border-t border-zinc-900/50">
              <button class="size-9 flex items-center justify-center hover:bg-stone-200 transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="#71717A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7.49967 9.16665C8.42015 9.16665 9.16634 8.42045 9.16634 7.49998C9.16634 6.57951 8.42015 5.83331 7.49967 5.83331C6.5792 5.83331 5.83301 6.57951 5.83301 7.49998C5.83301 8.42045 6.5792 9.16665 7.49967 9.16665Z" stroke="#71717A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17.5 12.5L14.9283 9.92835C14.6158 9.61589 14.1919 9.44037 13.75 9.44037C13.3081 9.44037 12.8842 9.61589 12.5717 9.92835L5 17.5" stroke="#71717A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="h-8 px-4 bg-orange-600 shadow-[2px_2px_0px_0px_rgba(24,24,27,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-900 flex items-center gap-2 hover:bg-orange-500 transition-colors cursor-pointer">
                <span class="text-white text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wide">Run</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.2679 10.843C7.2869 10.8904 7.31992 10.9308 7.36254 10.9588C7.40516 10.9868 7.45533 11.0012 7.50632 10.9998C7.55732 10.9985 7.60669 10.9817 7.64782 10.9515C7.68894 10.9213 7.71986 10.8793 7.7364 10.831L10.9864 1.33103C11.0024 1.28672 11.0055 1.23878 10.9952 1.19281C10.985 1.14683 10.9618 1.10472 10.9285 1.07142C10.8952 1.03811 10.8531 1.01498 10.8071 1.00472C10.7612 0.994472 10.7132 0.997526 10.6689 1.01353L1.1689 4.26353C1.12065 4.28008 1.07862 4.31099 1.04844 4.35211C1.01826 4.39324 1.00139 4.44261 1.00008 4.49361C0.998776 4.5446 1.0131 4.59477 1.04113 4.63739C1.06916 4.68001 1.10956 4.71303 1.1569 4.73203L5.1219 6.32203C5.24725 6.37221 5.36113 6.44726 5.45669 6.54264C5.55224 6.63803 5.62749 6.75178 5.6779 6.87703L7.2679 10.843Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.927 1.07349L5.45703 6.54299" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between mt-4">
          <span class="text-zinc-500 text-[10px] font-['IBM_Plex_Mono']">AI Output v2.1. Verify critical data.</span>
          <div class="flex items-center gap-1">
            <div class="size-1.5 bg-teal-600 rounded-full"></div>
            <span class="text-teal-600 text-[10px] font-bold font-['IBM_Plex_Mono'] uppercase">Online</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const inputMessage = ref('')
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>

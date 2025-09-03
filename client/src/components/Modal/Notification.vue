<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  showNotification: boolean
  notificationType: string
  notificationMessage?: string
   notificationMessageHtml?: string
}>()

const emit = defineEmits(['close'])

const closeNotification = () => {
  emit('close') // Emit event ke parent
}
</script>

<template>
  <teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="showNotification"
        class="fixed inset-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 relative">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div v-if="notificationType === 'success'" class="bg-green-100 rounded-full p-2">
                <svg
                  class="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div v-else class="bg-red-100 rounded-full p-2">
                <svg
                  class="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h3
                class="text-2xl font-medium"
                :class="notificationType === 'success' ? 'text-green-900' : 'text-red-900'"
              >
                {{ notificationType === 'success' ? 'Berhasil' : 'Gagal' }}
              </h3>
              <p class="mt-1 text-lg text-gray-500" v-if="notificationMessage">
                {{ notificationMessage }}
              </p>
              <p class="mt-1 text-lg text-gray-500" v-else v-html="notificationMessageHtml">
              </p>
            </div>
          </div>
          <button
            @click="closeNotification"
            class="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

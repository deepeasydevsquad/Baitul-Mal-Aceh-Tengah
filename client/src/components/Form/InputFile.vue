<template>
  <div>
    <label v-if="label_status == true" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <div class="flex items-center">
      <input type="file" class="hidden" :id="id" :accept="accept" @change="onFileChange" ref="fileInput" />
      <label :for="id" class="px-4 py-2 bg-gray-100 border text-gray-700 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
        {{ buttonText }}
      </label>
      <div class="ml-4 flex items-center space-x-2">
        <span class="text-gray-500 text-sm truncate max-w-[150px]">
          {{ fileName || 'No file chosen' }}
        </span>
      </div>
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    <p class="text-xs text-gray-500 mt-2">Ukuran maksimum: {{ props.maxSize }} KB. Tipe file: {{ props.accept.toUpperCase() }}.</p>
    <div class="mt-3">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const props = defineProps({
    id: { type: String, default: 'photo-upload' },
    label: { type: String, default: 'Upload Photo' },
    buttonText: { type: String, default: 'Choose File' },
    accept: { type: String, default: '.jpg,.jpeg,.png' },
    error: { type: String, default: '' },
    label_status: { type: Boolean, default: true },
    maxSize: { type: Number, default: 600 } // Default 600 KB
  })

  const emit = defineEmits(['file-selected'])

  const fileName = ref('')
  const fileInput = ref(null)

  function onFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      fileName.value = file.name
      emit('file-selected', file)
    }
  }
</script>

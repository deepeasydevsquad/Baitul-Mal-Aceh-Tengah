<template>
  <div>
    <!-- Label -->
    <label
      v-if="label_status"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
    </label>

    <!-- Input File -->
    <div class="flex items-center">
      <input
        type="file"
        class="hidden"
        :id="id"
        :accept="accept"
        @change="onFileChange"
        ref="fileInput"
      />
      <label
        :for="id"
        class="px-4 py-2 bg-gray-100 border text-gray-700 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
      >
        {{ buttonText }}
      </label>

      <!-- File Name -->
      <div class="ml-4 flex items-center space-x-2">
        <span class="text-gray-500 text-sm truncate max-w-[150px]">
          {{ fileName || 'No file chosen' }}
        </span>
      </div>
    </div>

    <!-- Error -->
    <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
      {{ errorMessage }}
    </p>

    <!-- Info -->
    <p v-if="!hideInfo" class="text-xs text-gray-500 mt-2">
      Ukuran maksimum: {{ maxSize }} KB. Tipe file: {{ accept }}.
    </p>
    <p v-if="!hideInfo" class="text-xs text-gray-500">
      Dimensi: {{ dimensionsInfo }}
    </p>

    <!-- Preview (opsional) -->
    <div v-if="showPreview && previewUrl" class="mt-3">
      <p class="text-sm text-gray-500 mb-2 font-bold">Preview:</p>
      <img
        :src="previewUrl"
        alt="Preview"
        class="h-24 rounded-md border object-contain"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"

const props = defineProps({
  id: { type: String, default: "photo-upload" },
  label: { type: String, default: "Upload Photo" },
  buttonText: { type: String, default: "Choose File" },
  accept: { type: String, default: ".jpg,.jpeg,.png" },
  error: { type: String, default: "" },
  label_status: { type: Boolean, default: true },
  maxSize: { type: Number, default: 600 }, // KB
  dimensionsInfo: { type: String, default: "-" },
  hideInfo: { type: Boolean, default: false },

  // Support edit
  initialFileName: { type: String, default: "" },
  initialPreview: { type: String, default: "" },

  // Baru: toggle preview
  showPreview: { type: Boolean, default: true },
})

const emit = defineEmits<{
  (e: "file-selected", file: File | null): void
}>()

const fileName = ref(props.initialFileName)
const internalError = ref("")
const previewUrl = ref(props.initialPreview)

// Combine parent + internal error
const errorMessage = computed(() => {
  return props.error || internalError.value
})

// Update kalau props berubah
watch(() => props.initialFileName, (val) => {
  if (!fileName.value) fileName.value = val
})
watch(() => props.initialPreview, (val) => {
  if (!previewUrl.value) previewUrl.value = val
})

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0] || null

  if (!file) {
    fileName.value = props.initialFileName
    previewUrl.value = props.initialPreview
    internalError.value = ""
    emit("file-selected", null)
    return
  }

  // Validasi ukuran
  const fileSizeKB = Math.round(file.size / 1024)
  if (fileSizeKB > props.maxSize) {
    internalError.value = `Ukuran file terlalu besar (maks ${props.maxSize} KB)`
    fileName.value = ""
    previewUrl.value = props.initialPreview
    emit("file-selected", null)
    return
  }

  internalError.value = ""
  fileName.value = file.name
  previewUrl.value = URL.createObjectURL(file)
  emit("file-selected", file)
}
</script>

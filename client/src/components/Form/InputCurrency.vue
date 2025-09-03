<template>
  <div>
    <label v-if="label_status" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <input
      :id="id"
      type="text"
      :value="formattedValue"
      @input="onInput"
      :placeholder="placeholder"
      class="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    <p v-if="note" class="text-xs text-gray-500 mt-2">{{ note }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  id: String,
  label: String,
  modelValue: {
    type: Number,
    required: true,
  },
  note: String,
  label_status: {
    type: Boolean,
    default: true,
  },
  placeholder: String,
  error: String,
  max: {
    type: Number,
    default: 100_000_000, // batas maksimum default Rp100 juta
  },
})

const emit = defineEmits(['update:modelValue'])

const formattedValue = computed(() => {
  return formatRupiah(props.modelValue)
})

const onInput = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value
  const cleaned = raw.replace(/[^\d]/g, '') // Hapus semua kecuali angka
  let number = parseInt(cleaned, 10)

  if (isNaN(number)) number = 0

  // Batas maksimum
  if (number > props.max) {
    number = props.max
  }

  emit('update:modelValue', number)
}

const formatRupiah = (val: number): string => {
  return 'Rp ' + val.toLocaleString('id-ID')
}
</script>

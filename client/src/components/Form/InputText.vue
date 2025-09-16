<!-- InputText.vue -->
<template>
  <div>
    <label
      v-if="label_status"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      :readonly="readonly"
      :required="required"
      :class="[
        'text-gray-700 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-900 focus:border-green-900',
        error ? 'border-red-500' : 'border-gray-300',
        readonly ? 'bg-gray-100 cursor-not-allowed' : '',
      ]"
    />

    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    <p v-if="note" class="text-xs text-gray-500 mt-2">{{ note }}</p>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>()

defineProps({
  label: String,
  id: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  error: String,
  note: String,
  required: { type: Boolean, default: false },
  label_status: { type: Boolean, default: true },
  readonly: { type: Boolean, default: false },
})
</script>

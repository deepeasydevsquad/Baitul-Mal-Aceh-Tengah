<template>
  <div>
    <label
      v-if="label_status == true"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      v-model="model"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value)"
      :class="[
        'w-full text-gray-700 px-4 py-2 border rounded-lg transition-all duration-200',
        error
          ? 'border-red-500 focus:ring-2 focus:ring-red-400 focus:border-red-400'
          : 'border-gray-300 focus:ring-2 focus:ring-green-900 focus:border-green-900',
        disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-80' : 'bg-white',
      ]"
    >
      <option v-for="option in options" :key="option.id" :value="option.id" class="text-gray-700">
        {{ option.name }}
      </option>
    </select>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    <p v-if="note" class="text-xs text-gray-600 mt-2">{{ note }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  id: String,
  placeholder: {
    type: String,
    default: 'Pilih salah satu',
  },
  error: String,
  options: {
    type: Array,
    required: true,
  },
  note: String,
  label_status: { type: Boolean, default: true },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const model = defineModel({ default: '' });

defineEmits(['update:modelValue']);
</script>

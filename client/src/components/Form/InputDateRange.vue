<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label_status" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Date Range Container -->
    <div class="grid gap-3" :class="gridClass">
      <!-- Start Date -->
      <div :class="startSpanClass">
        <input
          type="date"
          :id="id + '-start'"
          v-model="startDate"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :min="minDate"
          :max="maxDateForStart"
          :class="[
            'text-gray-700 w-full px-4 py-2 border rounded-lg shadow-sm',
            'transition-all duration-200 ease-in-out',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-400 focus:border-red-400'
              : 'border-gray-300 focus:ring-2 focus:ring-green-900 focus:border-green-900',
            readonly || disabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-80'
              : 'bg-white',
          ]"
          @change="updateModel"
        />
      </div>

      <!-- End Date -->
      <div :class="endSpanClass">
        <input
          type="date"
          :id="id + '-end'"
          v-model="endDate"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :min="minDateForEnd"
          :max="maxDate"
          :class="[
            'text-gray-700 w-full px-4 py-2 border rounded-lg shadow-sm',
            'transition-all duration-200 ease-in-out',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-400 focus:border-red-400'
              : 'border-gray-300 focus:ring-2 focus:ring-green-900 focus:border-green-900',
            readonly || disabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-80'
              : 'bg-white',
          ]"
          @change="updateModel"
        />
      </div>
    </div>

    <!-- Error message -->
    <transition name="fade">
      <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </transition>

    <!-- Note -->
    <transition name="fade">
      <p v-if="note" class="text-xs text-gray-600 mt-2">{{ note }}</p>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface DateRange {
  start: string | null;
  end: string | null;
}

const model = defineModel<DateRange>();

const props = defineProps({
  label: String,
  id: { type: String, default: 'date-range' },
  error: String,
  note: String,
  required: { type: Boolean, default: false },
  label_status: { type: Boolean, default: true },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },

  // Span controls untuk start date (default: span 1 kolom)
  startSpan: { type: Number, default: 1 },

  // Span controls untuk end date (default: span 1 kolom)
  endSpan: { type: Number, default: 1 },

  // Total columns di grid (default: 2 untuk 2 kolom sama besar)
  columns: { type: Number, default: 2 },

  // Tahun untuk restrict date range (optional)
  year: { type: Number, default: null },
});

const startDate = ref<string>(model.value?.start || '');
const endDate = ref<string>(model.value?.end || '');

const minDate = computed(() => {
  if (!props.year) return undefined;
  return `${props.year}-01-01`;
});

const maxDate = computed(() => {
  if (!props.year) return undefined;
  return `${props.year}-12-31`;
});

const maxDateForStart = computed(() => {
  if (endDate.value) return endDate.value;
  return maxDate.value;
});

const minDateForEnd = computed(() => {
  if (startDate.value) return startDate.value;
  return minDate.value;
});

const gridClass = computed(() => {
  return `grid-cols-${props.columns}`;
});

const startSpanClass = computed(() => {
  return `col-span-${props.startSpan}`;
});

const endSpanClass = computed(() => {
  return `col-span-${props.endSpan}`;
});

// Watch model changes from parent
watch(
  () => model.value,
  (newVal) => {
    if (newVal) {
      startDate.value = newVal.start || '';
      endDate.value = newVal.end || '';
    }
  },
  { deep: true },
);

watch(
  () => props.year,
  (newYear, oldYear) => {
    if (newYear && oldYear && newYear !== oldYear) {
      startDate.value = '';
      endDate.value = '';
      updateModel();
    }
  },
);

const updateModel = () => {
  model.value = {
    start: startDate.value || null,
    end: endDate.value || null,
  };
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styling untuk date input */
input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

input[type='date']::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>

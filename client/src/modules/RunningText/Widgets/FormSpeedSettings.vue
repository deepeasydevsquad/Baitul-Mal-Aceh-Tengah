<script setup lang="ts">
import BaseButton from '@/components/Button/BaseButton.vue';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  showModal: boolean;
  currentSpeed: number;
}>();

const emit = defineEmits<{
  close: [];
  save: [speed: number];
}>();

const speed = ref(80);
const error = ref('');
const isSubmitting = ref(false);

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue) {
      speed.value = props.currentSpeed;
      error.value = '';
      isSubmitting.value = false;
    } else {
      error.value = '';
      isSubmitting.value = false;
    }
  },
);

watch(
  () => props.currentSpeed,
  (newValue) => {
    if (props.showModal) {
      speed.value = newValue;
    }
  },
);

const validateForm = (): boolean => {
  error.value = '';

  if (speed.value < 20 || speed.value > 200) {
    error.value = 'Kecepatan harus antara 20-200 pixel per detik';
    return false;
  }

  return true;
};

const handleSubmit = () => {
  if (isSubmitting.value) return;

  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  emit('save', speed.value);
};

const closeModal = () => {
  if (isSubmitting.value) return;
  emit('close');
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.showModal && !isSubmitting.value) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape);
});

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget && !isSubmitting.value) {
    closeModal();
  }
};

const getSpeedLabel = (value: number): string => {
  if (value <= 40) return 'Sangat Lambat';
  if (value <= 60) return 'Lambat';
  if (value <= 100) return 'Normal';
  if (value <= 140) return 'Cepat';
  return 'Sangat Cepat';
};
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-75 backdrop-blur-sm"
      @click="handleBackdropClick"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="w-full max-w-md mx-4 p-6 bg-white rounded-lg shadow-xl" @click.stop>
        <!-- Header Modal -->
        <div class="flex justify-between items-center mb-4">
          <h2 id="modal-title" class="text-xl font-bold text-gray-800">
            <font-awesome-icon icon="fa-solid fa-gauge-high" class="mr-2 text-green-900" />
            Pengaturan Kecepatan
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
            :disabled="isSubmitting"
            aria-label="Close modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label for="speedRange" class="block text-sm font-medium text-gray-700 mb-2">
              Kecepatan Running Text
            </label>

            <!-- Speed Display -->
            <div class="flex justify-between items-center mb-3">
              <span class="text-2xl font-bold text-green-900">{{ speed }}</span>
              <span
                class="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800"
              >
                {{ getSpeedLabel(speed) }}
              </span>
            </div>

            <!-- Range Slider -->
            <input
              id="speedRange"
              type="range"
              v-model.number="speed"
              min="20"
              max="200"
              step="10"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              :disabled="isSubmitting"
              :class="{ 'opacity-50': isSubmitting }"
            />

            <!-- Range Labels -->
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>20</span>
              <span>110</span>
              <span>200</span>
            </div>

            <p class="text-sm text-gray-600 mt-3">
              <font-awesome-icon icon="fa-solid fa-info-circle" class="mr-1" />
              Nilai dalam pixel per detik. Semakin tinggi nilai, semakin cepat teks bergerak.
            </p>

            <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex justify-end gap-3">
            <BaseButton
              @click="closeModal"
              type="button"
              :disabled="isSubmitting"
              variant="secondary"
            >
              Batal
            </BaseButton>
            <BaseButton type="submit" :disabled="isSubmitting" variant="primary">
              <span v-if="isSubmitting">
                <font-awesome-icon icon="fa-solid fa-spinner" class="mr-2 animate-spin" />
                Menyimpan...
              </span>
              <span v-else>
                <font-awesome-icon icon="fa-solid fa-floppy-disk" class="mr-2" />
                Simpan
              </span>
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Custom slider styling */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #14532d;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 8px rgba(20, 83, 45, 0.1);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #14532d;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease-in-out;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 8px rgba(20, 83, 45, 0.1);
}

.slider:disabled {
  cursor: not-allowed;
}
</style>

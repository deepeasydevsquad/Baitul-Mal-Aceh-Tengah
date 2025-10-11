<script setup lang="ts">
// Library
import { ref, watch, computed, reactive, onMounted } from 'vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';
import { edit_target_pengumpulan } from '@/service/target_pengumpulan';

// Props & Emits
const props = defineProps<{
  isModalOpen: boolean;
  selectedTarget: any;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'status', payload: { error: boolean; error_msg?: string }): void;
}>();

// --- State ---
const isSubmitting = ref(false);
const isLoadingData = ref(false);

const formData = ref({
  id: '',
  tahun: '',
  infaq: '',
  zakat: '',
  donasi: '',
});

const errors = reactive({
  tahun: '',
  infaq: '',
  zakat: '',
  donasi: '',
});

// Generate year options
const currentYear = new Date().getFullYear();
const yearOptions = computed(() => {
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push(i);
  }
  return years;
});

// Format Rupiah functions
const formatRupiah = (value: string | number): string => {
  const numericValue = typeof value === 'number' ? value.toString() : value.replace(/[^\d]/g, '');

  if (!numericValue) return '';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseInt(numericValue));
};

const parseRupiahToNumber = (rupiahString: string): number => {
  const numericString = rupiahString.replace(/[^\d]/g, '');
  return parseInt(numericString) || 0;
};

const selectRef = ref<HTMLSelectElement | null>(null);

const handleSelectFocus = () => {
  if (!formData.value.tahun) {
    formData.value.tahun = currentYear.toString();
  }

  setTimeout(() => {
    if (selectRef.value) {
      const select = selectRef.value;
      const selectedYear = parseInt(formData.value.tahun);
      const selectedYearIndex = yearOptions.value.findIndex((year) => year === selectedYear);

      if (selectedYearIndex !== -1) {
        const optionHeight = 24;
        const visibleOptions = Math.floor(200 / optionHeight);
        const scrollPosition = Math.max(
          0,
          (selectedYearIndex - Math.floor(visibleOptions / 2)) * optionHeight,
        );

        select.scrollTop = scrollPosition;
      }
    }
  }, 10);
};

// Reactive formatted values for display
const displayValues = reactive({
  infaq: '',
  zakat: '',
  donasi: '',
});

watch(
  () => formData.value.infaq,
  (newVal) => {
    if (newVal !== '') {
      displayValues.infaq = formatRupiah(newVal);
    } else {
      displayValues.infaq = '';
    }
  },
);

watch(
  () => formData.value.zakat,
  (newVal) => {
    if (newVal !== '') {
      displayValues.zakat = formatRupiah(newVal);
    } else {
      displayValues.zakat = '';
    }
  },
);

watch(
  () => formData.value.donasi,
  (newVal) => {
    if (newVal !== '') {
      displayValues.donasi = formatRupiah(newVal);
    } else {
      displayValues.donasi = '';
    }
  },
);

const handleCurrencyInput = (field: 'infaq' | 'zakat' | 'donasi', event: Event) => {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value.replace(/[^\d]/g, '');
  formData.value[field] = rawValue;
};

const loadTargetData = () => {
  console.log('Loading target data:', props.selectedTarget);

  if (props.selectedTarget) {
    formData.value = {
      id: props.selectedTarget.id?.toString() || '',
      tahun: props.selectedTarget.tahun?.toString() || '',
      infaq: props.selectedTarget.infaq?.toString() || '',
      zakat: props.selectedTarget.zakat?.toString() || '',
      donasi: props.selectedTarget.donasi?.toString() || '',
    };

    console.log('Form data loaded:', formData.value);

    displayValues.infaq = props.selectedTarget.infaq
      ? formatRupiah(props.selectedTarget.infaq)
      : '';
    displayValues.zakat = props.selectedTarget.zakat
      ? formatRupiah(props.selectedTarget.zakat)
      : '';
    displayValues.donasi = props.selectedTarget.donasi
      ? formatRupiah(props.selectedTarget.donasi)
      : '';

    console.log('Display values updated:', displayValues);
  }
};

const resetForm = () => {
  formData.value = {
    id: '',
    tahun: '',
    infaq: '',
    zakat: '',
    donasi: '',
  };
  displayValues.infaq = '';
  displayValues.zakat = '';
  displayValues.donasi = '';
  Object.keys(errors).forEach((key) => (errors[key] = ''));
  isSubmitting.value = false;
};

const closeModal = () => {
  if (isSubmitting.value) return;
  emit('close');
};

const validateForm = (): boolean => {
  Object.keys(errors).forEach((key) => (errors[key] = ''));
  let isValid = true;

  if (!formData.value.tahun) {
    errors.tahun = 'Tahun harus dipilih';
    isValid = false;
  }

  if (!formData.value.infaq) {
    errors.infaq = 'Infaq tidak boleh kosong';
    isValid = false;
  }

  if (!formData.value.zakat) {
    errors.zakat = 'Zakat tidak boleh kosong';
    isValid = false;
  }

  if (!formData.value.donasi) {
    errors.donasi = 'Donasi tidak boleh kosong';
    isValid = false;
  }

  return isValid;
};

async function handleSubmit() {
  if (!validateForm() || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const submitData = {
      id: parseInt(formData.value.id),
      tahun: parseInt(formData.value.tahun),
      infaq: parseInt(formData.value.infaq),
      zakat: parseInt(formData.value.zakat),
      donasi: parseInt(formData.value.donasi),
    };

    console.log('Submitting data:', submitData);

    await edit_target_pengumpulan(submitData);

    emit('status', { error: false, error_msg: 'Target pengumpulan berhasil diperbarui!' });
    emit('close');
  } catch (error: any) {
    console.error('Submit error:', error);
    
    let errorMessage = 'Gagal memperbarui target pengumpulan.';
    
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error_msg || 
                    error.response.data.message || 
                    errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    emit('status', { error: true, error_msg: errorMessage });
    isSubmitting.value = false;
  }
}

// Watch modal open state
watch(
  () => props.isModalOpen,
  (newVal) => {
    console.log('Modal open state changed:', newVal);
    if (newVal) {
      Object.keys(errors).forEach((key) => (errors[key] = ''));
      isSubmitting.value = false;
      loadTargetData();
    } else {
      resetForm();
    }
  },
);

watch(
  () => props.selectedTarget,
  (newTarget) => {
    console.log('Selected target changed:', newTarget);
    if (props.isModalOpen && newTarget) {
      loadTargetData();
    }
  },
  {
    deep: true,
    immediate: true,
  },
);
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
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-75 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="w-full max-w-lg mx-4 p-6 bg-white rounded-lg shadow-xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Edit Target Pengumpulan</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
            :disabled="isSubmitting"
          >
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>

        <LoadingSpinner v-if="isLoadingData" label="Memuat data..." />
        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Tahun -->
          <div>
            <label for="tahun" class="block text-sm font-medium text-gray-700 mb-1"
              >Tahun <span class="text-red-500">*</span></label
            >
            <select
              id="tahun"
              ref="selectRef"
              v-model="formData.tahun"
              @focus="handleSelectFocus"
              @click="handleSelectFocus"
              :class="[
                'block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-900 focus:border-green-900',
                errors.tahun ? 'border-red-500' : 'border-gray-300',
              ]"
              :disabled="isSubmitting"
              style="max-height: 200px; overflow-y: auto"
            >
              <option value="">Pilih Tahun</option>
              <option v-for="year in yearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <p v-if="errors.tahun" class="mt-1 text-xs text-red-600">{{ errors.tahun }}</p>
          </div>

          <!-- Infaq -->
          <div>
            <label for="infaq" class="block text-sm font-medium text-gray-700 mb-1"
              >Target Infaq <span class="text-red-500">*</span></label
            >
            <input
              id="infaq"
              :value="displayValues.infaq"
              @input="handleCurrencyInput('infaq', $event)"
              type="text"
              :class="[
                'block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-900 focus:border-green-900',
                errors.infaq ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="Masukkan target infaq..."
              :disabled="isSubmitting"
            />
            <p v-if="errors.infaq" class="mt-1 text-xs text-red-600">{{ errors.infaq }}</p>
          </div>

          <!-- Zakat -->
          <div>
            <label for="zakat" class="block text-sm font-medium text-gray-700 mb-1"
              >Target Zakat <span class="text-red-500">*</span></label
            >
            <input
              id="zakat"
              :value="displayValues.zakat"
              @input="handleCurrencyInput('zakat', $event)"
              type="text"
              :class="[
                'block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-900 focus:border-green-900',
                errors.zakat ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="Masukkan target zakat..."
              :disabled="isSubmitting"
            />
            <p v-if="errors.zakat" class="mt-1 text-xs text-red-600">{{ errors.zakat }}</p>
          </div>

          <!-- Donasi -->
          <div>
            <label for="donasi" class="block text-sm font-medium text-gray-700 mb-1"
              >Target Donasi <span class="text-red-500">*</span></label
            >
            <input
              id="donasi"
              :value="displayValues.donasi"
              @input="handleCurrencyInput('donasi', $event)"
              type="text"
              :class="[
                'block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-900 focus:border-green-900',
                errors.donasi ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="Masukkan target donasi..."
              :disabled="isSubmitting"
            />
            <p v-if="errors.donasi" class="mt-1 text-xs text-red-600">{{ errors.donasi }}</p>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <BaseButton
              type="button"
              variant="secondary"
              @click="closeModal"
              :disabled="isSubmitting"
              >Batal</BaseButton
            >
            <BaseButton
              type="submit"
              variant="primary"
              :loading="isSubmitting"
              :disabled="
                !(formData.tahun && formData.infaq && formData.zakat && formData.donasi) ||
                isSubmitting
              "
            >
              <span>Perbarui</span>
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

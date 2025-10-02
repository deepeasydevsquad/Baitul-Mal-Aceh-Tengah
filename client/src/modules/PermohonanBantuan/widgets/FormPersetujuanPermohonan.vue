<script setup lang="ts">
// Library
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import InputFile from '@/components/Form/InputFile.vue';
import InputText from '@/components/Form/InputText.vue';
import SelectField from '@/components/Form/SelectField.vue';
import InputCurrency from '@/components/Form/InputCurrency.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';

// Composable
import { useNotification } from '@/composables/useNotification';

// Service
import {
  get_info_persetujuan_permohonan_bantuan,
  persetujuan_permohonan_bantuan
} from '@/service/permohonan_bantuan';

// State: Loading
const isLoading = ref(false);

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

interface Props {
  isModalOpen: boolean;
  selectedPermohonanBantuan: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'status', payload: { error_msg?: string; error?: boolean }): void;
}>();

// Function: Close modal
const closeModal = () => {
  if (isSubmitting.value) return;
  resetForm();
  emit('close');
};

// Function: Reset form
const resetForm = () => {
  form.value = {
    nominal_yang_disetujui: 0,
  };

  // Reset errors
  errors.value = {};

};

// Function: Fetch data
const dataPersetujuan = ref<Record<string, any>>({});

async function fetchData() {
  isLoading.value = true;
  try {
    const response = await get_info_persetujuan_permohonan_bantuan(props.selectedPermohonanBantuan.id);
    dataPersetujuan.value = response.data;
    console.log(dataPersetujuan);

  } catch (error: any) {
    displayNotification('Gagal memuat data. Silakan coba lagi.', 'error');
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

// Function: Validate form
const errors = ref<Record<string, string>>({
  nominal_yang_disetujui: '',
});

const validateForm = () => {
  let isValid = true;
  errors.value = {};

  const nominal = form.value.nominal_yang_disetujui;

  // Pastikan dataPersetujuan sudah ada
  if (!dataPersetujuan.value) {
    errors.value.nominal_yang_disetujui = "Data persetujuan belum tersedia";
    return false;
  }

  // Validasi angka dulu
  if (nominal === null || nominal === undefined) {
    errors.value.nominal_yang_disetujui = "Nominal yang disetujui harus diisi";
    isValid = false;
  } else if (!/^\d+$/.test(nominal.toString())) {
    errors.value.nominal_yang_disetujui = "Nominal yang disetujui harus berupa angka bulat";
    isValid = false;
  } else {
    const value = Number(nominal);
    if (value <= 0) {
      errors.value.nominal_yang_disetujui = "Nominal yang disetujui harus lebih besar dari 0";
      isValid = false;
    } else if (value > dataPersetujuan.value.sisa_dana) {
      errors.value.nominal_yang_disetujui = `Nominal tidak boleh melebihi sisa dana sebesar ${dataPersetujuan.value.sisa_dana}`;
      isValid = false;
    } else if (value > dataPersetujuan.value.jumlah_maksimal_nominal_bantuan) {
      errors.value.nominal_yang_disetujui = `Nominal tidak boleh melebihi batas maksimal bantuan sebesar ${dataPersetujuan.value.jumlah_maksimal_nominal_bantuan}`;
      isValid = false;
    }
  }
  return isValid;
};


// Function: Handle submit
const isSubmitting = ref(false);

const formUploadDynamic = ref<Record<string, File | null>>({});
const form = ref<{
  nominal_yang_disetujui: number;
}>({
  nominal_yang_disetujui: 0,
});

const handleSubmit = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;

  const formData = {
    id: props.selectedPermohonanBantuan.id,
    nominal_yang_disetujui: form.value.nominal_yang_disetujui,
  };
  try {
    const response = await persetujuan_permohonan_bantuan(formData);
    emit('status', { error_msg: response.error_msg || response, error: response.error });
  } catch (error: any) {
    console.error(error);
    displayNotification(error.response.data.error_msg || error.response.data.message, 'error');
  } finally {
    isSubmitting.value = false;
    closeModal();
  }
};

// Function: Handle escape
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isModalOpen) closeModal();
};
onMounted(async () => {
  document.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(async () => {
  document.removeEventListener('keydown', handleEscape);
});

// Watch: Handler
watch(
  () => props.isModalOpen,
  (newVal) => {
    if (newVal) {
      fetchData();
    }
  },
);
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <LoadingSpinner v-if="isLoading" label="Memuat halaman..." />
      <div v-else class="relative max-w-xl w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 id="modal-title" class="text-xl font-bold text-gray-800">
            Konfirmasi Persetujuan Permohonan
          </h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <div class="px-1 py-1 space-y-4 max-h-[64vh] overflow-y-auto pr-2">
          <div>
            <InputCurrency
              v-model="dataPersetujuan.sisa_dana"
              label="Sisa Dana"
              :disabled="true"
            />
          </div>
          <div>
            <InputCurrency
              v-model="dataPersetujuan.jumlah_maksimal_nominal_bantuan"
              label="Maksimal Nominal Bantuan Per Pemohon"k
              :disabled="true"
            />
          </div>
          <div>
            <InputCurrency
              id="nominal_yang_disetujui"
              v-model="form.nominal_yang_disetujui"
              label="Nominal Bantuan Yang Disetujui"
              placeholder="Masukkan nominal yang disetujui"
              note="Jumlah nominal bantuan yang disetujui tidak boleh melebihi SISA DANA dan JUMLAH MAKSIMAL NOMINAL BANTUAN PER PEMOHON."
              :error="errors.nominal_yang_disetujui"
              :required="true"
              />
          </div>
        </div>
        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <BaseButton
            @click="closeModal"
            type="button"
            :disabled="isSubmitting"
            variant="secondary"
          >
            Batal
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            :disabled="isSubmitting"
            @click="handleSubmit"
          >
            <span v-if="isSubmitting">Menyimpan...</span>
            <span v-else>Simpan</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Notification -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>

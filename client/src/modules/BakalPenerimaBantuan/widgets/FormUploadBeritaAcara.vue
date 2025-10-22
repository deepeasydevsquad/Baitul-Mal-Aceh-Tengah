<script setup lang="ts">
// Library
import BaseButton from '@/components/Button/BaseButton.vue';
import InputFile from '@/components/Form/InputFile.vue';
import Notification from '@/components/Modal/Notification.vue';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// Composable
import { useNotification } from '@/composables/useNotification';

// Service
import {
  get_info_upload_berita_acara,
  upload_berita_acara,
} from '@/service/bakal_penerima_bantuan';

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

interface Props {
  isModalOpen: boolean;
  selectedData: any;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'status', payload: { error_msg?: string; error?: boolean }): void;
}>();

// State
const isLoading = ref(false);
const isSubmitting = ref(false);

// Form
const beritaAcaraFile = ref<File | null>(null);
const errors = ref<Record<string, string>>({
  berita_acara: '',
});

// Function: Close modal
const closeModal = () => {
  if (isSubmitting.value) return;
  resetForm();
  emit('close');
};

// Function: Reset form
const resetForm = () => {
  beritaAcaraFile.value = null;
  errors.value = {};
};

// Function: fetch data
interface DataBeritaAcara {
  id: number;
  kegiatan_id: number;
  member_name: string;
  kegiatan_name: string;
}

const dataBeritaAcara = ref<DataBeritaAcara>({
  id: 0,
  kegiatan_id: 0,
  member_name: '',
  kegiatan_name: '',
});

async function fetchData() {
  if (!props.selectedData.id) {
    displayNotification('Data tidak valid silahkan tutup dan buka kembali', 'error');
    return;
  }
  isLoading.value = true;
  try {
    console.log(props.selectedData.id);
    const response = await get_info_upload_berita_acara(props.selectedData.id);

    dataBeritaAcara.value = response.data;
    console.log(dataBeritaAcara.value);
  } catch (error: any) {
    displayNotification(error.response.data.error_msg || error.response.data.message, 'error');
  } finally {
    isLoading.value = false;
  }
}

// Function: Handle file upload
const handleFileUpload = (file: File | null) => {
  beritaAcaraFile.value = file;
  errors.value.berita_acara = '';
};

// Function: Validate form
const validateForm = () => {
  let isValid = true;
  errors.value = {};

  if (!beritaAcaraFile.value) {
    errors.value.berita_acara = 'Berita acara harus diupload';
    isValid = false;
  }

  return isValid;
};

// Function: Handle submit
const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  const formData = new FormData();
  formData.append('id', props.selectedData.id);
  formData.append('berita_acara', beritaAcaraFile.value!);

  try {
    const response = await upload_berita_acara(formData);

    if (response.error) {
      displayNotification(response.error_msg || 'Gagal upload berita acara', 'error');
    } else {
      emit('status', {
        error_msg: response.error_msg || 'Berita acara berhasil diupload',
        error: false,
      });
      closeModal();
    }
  } catch (error: any) {
    console.error('Error upload berita acara:', error);
    displayNotification(
      error.response?.data?.error_msg ||
        error.response?.data?.message ||
        'Gagal upload berita acara',
      'error',
    );
  } finally {
    isSubmitting.value = false;
    closeModal();
  }
};

// Function: Handle escape
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isModalOpen) closeModal();
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape);
});

// Watch: Reset when modal opens
watch(
  () => props.isModalOpen,
  (newVal) => {
    if (newVal) {
      resetForm();
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
      <div class="relative max-w-xl w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 id="modal-title" class="text-xl font-bold text-gray-800">
              Form Upload Berita Acara
            </h2>
            <p class="text-sm text-gray-500">Upload berita acara untuk realisasi bantuan</p>
          </div>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <!-- Info Kegiatan & Pemohon -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 class="font-semibold text-blue-800 text-sm mb-3 flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-circle-info" />
            Informasi Realisasi
          </h3>
          <div class="space-y-2 text-xs text-blue-800">
            <div class="flex gap-2">
              <span class="font-semibold">Nama Kegiatan:</span>
              <span class="text-right">{{ dataBeritaAcara?.kegiatan_name || '-' }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-semibold">Nama Pemohon:</span>
              <span>{{ dataBeritaAcara?.member_name || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <InputFile
            id="berita_acara"
            label="Berita Acara"
            accept=".jpg,.jpeg,.png"
            :max-size="1000"
            note="Ukuran maksimal file berita acara adalah 1MB"
            :error="errors.berita_acara"
            :required="true"
            @file-selected="handleFileUpload"
          />
        </div>

        <!-- Warning -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <font-awesome-icon
              icon="fa-solid fa-triangle-exclamation"
              class="text-yellow-600 mt-0.5"
            />
            <p class="text-xs text-yellow-800">
              <span class="font-semibold">Perhatian:</span> Silahkan pilih salah satu permohonan
              bantuan yang sesuai dengan berita acara yang akan diupload.
            </p>
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
            Tutup
          </BaseButton>
          <BaseButton
            type="button"
            variant="success"
            :disabled="!beritaAcaraFile || isSubmitting"
            @click="handleSubmit"
          >
            <span v-if="isSubmitting">Mengupload...</span>
            <span v-else>
              <font-awesome-icon icon="fa-solid fa-cloud-arrow-up" class="mr-2" />
              Upload
            </span>
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

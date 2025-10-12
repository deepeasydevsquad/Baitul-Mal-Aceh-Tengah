<script setup lang="ts">
// Library
import BaseButton from '@/components/Button/BaseButton.vue';
import InputFile from '@/components/Form/InputFile.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';
import Notification from '@/components/Modal/Notification.vue';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// Composable
import { useNotification } from '@/composables/useNotification';

// Service
import {
  edit_permohonan_bantuan,
  get_info_edit_permohonan_bantuan,
} from '@/service/permohonan_bantuan';

// State: Loading
const isLoading = ref(false);

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

interface Props {
  isModalOpen: boolean;
  selectedValidasiPermohonanBantuan: any;
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
    kegiatan_id: null,
    bank_id: null,
    member_id: null,
    nomor_rekening: '',
    atas_nama: '',
  };

  formUploadDynamic.value = {};

  // Reset errors
  errors.value = {};
};

async function fetchData() {
  if (!props.selectedValidasiPermohonanBantuan?.id) {
    displayNotification('Gagal memuat data. Silakan coba lagi.', 'error');
    return;
  }
  isLoading.value = true;
  try {
    const [InitialResponse] = await Promise.all([
      get_info_edit_permohonan_bantuan(props.selectedValidasiPermohonanBantuan.id),
    ]);

    // bikin formUploadDynamic konsisten (punya id, path, status)
    formUploadDynamic.value = Object.fromEntries(
      InitialResponse.data.syarat.map((syarat: any) => [
        `dokumen_${syarat.path}`, // pake id biar unique
        {
          id: syarat.id,
          path: syarat.path || '', // path lama dari backend
          file: null, // default belum ada file baru
          status: 'keep', // default keep
        },
      ]),
    );

    console.log('formUploadDynamic init:', formUploadDynamic.value);
    console.log('form init:', form.value);
  } catch (error: any) {
    displayNotification('Gagal memuat data. Silakan coba lagi.', 'error');
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

// Function: Validate form
const errors = ref<Record<string, string>>({
  kegiatan_id: '',
  bank_id: '',
  member_id: '',
  nomor_rekening: '',
  atas_nama: '',
});

const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.value = {};

  // Validate kegiatan_id
  if (!props.selectedValidasiPermohonanBantuan?.realisasi_id) {
    errors.value.kegiatan_id =
      'Realisasi ID tidak ditemukan, Silahkan keluar dan buka form kembali.';
    isValid = false;
  }

  // Validate atas_nama
  if (!form.value.atas_nama.trim()) {
    errors.value.atas_nama = 'Atas nama harus diisi';
    isValid = false;
  }

  // if (dataKriteriaSyarat.value.syarat.length) {
  //   dataKriteriaSyarat.value.syarat.forEach((syarat) => {
  //     if (!formUploadDynamic.value[`dokumen_${syarat.path}`]) {
  //       errors.value[`dokumen_${syarat.path}`] = `${syarat.name} harus diunggah`;
  //       isValid = false;
  //     }
  //   });
  // }
  return isValid;
};

// Function: Handle file
const handleFile = (file: File | null, path: string) => {
  const key = `dokumen_${path}`;
  if (!formUploadDynamic.value[key]) {
    formUploadDynamic.value[key] = {};
  }

  formUploadDynamic.value[key] = {
    ...formUploadDynamic.value[key],
    file: file, // simpan file (bisa null)
    status: file ? 'replace' : 'keep', // simple flag
  };

  errors.value[key] = '';
};

// Function: Handle submit
const isSubmitting = ref(false);

const formUploadDynamic = ref<
  Record<string, { file: File | null; id: number; path: string; status: 'replace' | 'keep' }>
>({});
const form = ref<{
  kegiatan_id: number | null;
  bank_id: number | null;
  member_id: number | null;
  nomor_rekening: string;
  atas_nama: string;
}>({
  kegiatan_id: null,
  bank_id: null,
  member_id: null,
  nomor_rekening: '',
  atas_nama: '',
});

const handleSubmit = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;

  const formData = new FormData();

  formData.append('validasi_id', Number(props.selectedValidasiPermohonanBantuan.realisasi_id));
  Object.entries(formUploadDynamic.value).forEach(([key, val]) => {
    if (val.file) {
      // kirim file baru
      formData.append(key, val.file);

      // kirim metadata
      formData.append(
        `${key}_meta`,
        JSON.stringify({
          id: val.id,
          path: val.path,
          status: val.status || 'replace',
        }),
      );
    } else {
      // kalau gak ada file, tetap kirim metadata
      formData.append(
        `${key}_meta`,
        JSON.stringify({
          id: val.id,
          path: val.path,
          status: val.status || 'keep',
        }),
      );
    }
  });

  // tambahin field lain (bank_id, member_id, dll)
  Object.entries(form.value).forEach(([k, v]) => {
    formData.append(k, v as any);
  });
  try {
    const response = await edit_permohonan_bantuan(formData);
    console.log(response);
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

// watch(
//   () => form.value.kegiatan_id,
//   (newVal) => {
//     if (newVal !== null) {
//       fetchKriteriaSyarat(newVal);
//     } else {
//       dataKriteriaSyarat.value = { kriteria: [], syarat: [] };
//     }
//   },
// );
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
      <div v-else class="relative max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 id="modal-title" class="text-xl font-bold text-gray-800">Edit File Permohonan</h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <div class="px-1 py-1 space-y-4 max-h-[64vh] overflow-y-auto pr-2">
          <InputFile />
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
            :disabled="!formUploadDynamic || isSubmitting"
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

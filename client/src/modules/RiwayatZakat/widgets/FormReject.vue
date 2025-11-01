<script setup lang="ts">
// Library
import { ref, watchEffect } from 'vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import TextArea from '@/components/Form/TextArea.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';

// Composable
import { useNotification } from '@/composables/useNotification';

// Service
import { tolak_pembayaran_zakat } from '@/service/riwayat_zakat';

// Composable: notification
const { displayNotification } = useNotification();

interface Props {
  isModalOpen: boolean;
  id: number;
}

const props = defineProps<Props>();
const isLoading = ref(false);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'status', payload: { error_msg?: string; error?: boolean }): void;
}>();

// Function:
const errors = ref<Record<string, string>>({
  alasan: '',
});

// Function: Handle submit
const isSubmitting = ref(false);
const form = ref<{
  id: number;
  alasan: string;
}>({
  id: 0,
  alasan: '',
});

// Function: Reset form
const resetForm = () => {
  form.value = {
    id: 0,
    alasan: '',
  };

  // Reset errors
  errors.value = {};
};

// Function: Close modal
const closeModal = () => {
  if (isSubmitting.value) return;
  resetForm();
  emit('close');
};

const validateForm = () => {
  let isValid = true;
  // Reset errors
  errors.value = {};

  if (!form.value.id) {
    errors.value.alasan = 'ID wajib diisi.';
    isValid = false;
  }

  if (!form.value.alasan) {
    errors.value.alasan = 'Alasan penolakan wajib diisi.';
    isValid = false;
  }

  console.log(errors.value);
  return isValid;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  if (!validateForm()) return;

  const formData = {
    id: form.value.id,
    alasan: form.value.alasan,
  };

  try {
    const response = await tolak_pembayaran_zakat(formData);
    emit('status', { error_msg: response.error_msg || response, error: response.error });
  } catch (error: any) {
    console.error(error);
    displayNotification(error.response.data.error_msg || error.response.data.message, 'error');
  } finally {
    isSubmitting.value = false;
    closeModal();
  }
};

// watch(
//   () => props.id,
//   (newId) => {
//     if (props.id != 0) {
//       form.value.id = newId;
//     }
//   },
// );

watchEffect(async () => {
  form.value.id = props.id;
});
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
          <h2 id="modal-title" class="text-xl font-bold text-gray-800">Alasan Penolakan</h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div>
          {{ form.id }}
          <TextArea
            v-model="form.alasan"
            id="alasan"
            label="Alasan penolakan"
            :error="errors.alasan"
            :placeholder="'Tulis alasan penolakan di sini...'"
            :required="true"
          />
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
            :disabled="!(form.id && form.alasan) || isSubmitting"
            @click="handleSubmit"
          >
            <span v-if="isSubmitting">Menyimpan...</span>
            <span v-else>Simpan</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Library
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import InputFile from '@/components/Form/InputFile.vue';
import InputText from '@/components/Form/InputText.vue';

// Composable
import { useNotification } from '@/composables/useNotification';

// Service
import { pertanyaan_evaluasi, kirim_jawaban_evaluasi } from '@/service/monev'; // pastikanimport

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

interface Props {
  isModalOpen: boolean;
  monev_id: number;
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
  form.value.name = '';
  errors.value = {};
  jawaban.value = {};
};

// Function:
const errors = ref<Record<string, string>>({
  name: '',
});

const validateForm = () => {
  let isValid = true;
  errors.value = {};

  if (form.value.name === '') {
    errors.value.name = 'Nama tidak boleh kosong.';
    isValid = false;
  }

  return isValid;
};

interface PertanyaanEvaluasi {
  id: number;
  pertanyaan: string;
}

const data_pertanyaan_evaluasi = ref<PertanyaanEvaluasi[]>([]);
const jawaban = ref<Record<number, string>>({});

const fetch_pertanyaan = async () => {
  try {
    const response = await pertanyaan_evaluasi();
    console.log('Response pertanyaan:', response);
    data_pertanyaan_evaluasi.value = response.data;

    // Inisialisasi jawaban kosong
    response.data.forEach((item: PertanyaanEvaluasi) => {
      jawaban.value[item.id] = '';
    });
  } catch (error: any) {
    console.error(error);
    displayNotification(error.response?.data?.error_msg || 'Gagal memuat pertanyaan', 'error');
  }
};

onMounted(async () => {
  fetch_pertanyaan();
});

// Function: Handle submit
const isSubmitting = ref(false);
const form = ref<{ teammonev1: string; teammonev2: string; teammonev3: string }>({
  teammonev1: '',
  teammonev2: '',
  teammonev3: '',
});

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    // Bentuk payload sesuai format backend
    const payload = {
      monev_id: props.monev_id,
      jawaban: Object.entries(jawaban.value).map(([pertanyaan_id, jawaban]) => ({
        pertanyaan_id: Number(pertanyaan_id),
        jawaban,
      })),
    };

    console.log('Payload dikirim ke backend:', payload);

    // 🔹 Kirim ke API
    const response = await kirim_jawaban_evaluasi(payload);
    console.log('Jawaban evaluasi terkirim:', response);

    // 🔹 Emit ke parent (monev.vue) untuk update status & refresh data
    emit('status', { error: false, error_msg: '' });

    // 🔹 Tutup modal
    emit('close');
  } catch (error: any) {
    console.error('Gagal kirim jawaban:', error);
    emit('status', {
      error: true,
      error_msg: error.response?.data?.error_msg || 'Gagal mengirim jawaban',
    });
    displayNotification(error.response?.data?.error_msg || 'Gagal mengirim jawaban', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// Function: Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isModalOpen) closeModal();
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape);
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
      <div
        class="relative max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6 overflow-y-auto max-h-[90vh]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 id="modal-title" class="text-xl font-bold text-gray-800">Evaluasi Monev</h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <!-- Input Team -->
        <InputText
          id="Team Monev 1"
          v-model="form.teammonev1"
          label="Team Monev 1"
          type="text"
          placeholder="Masukkan nama"
          :error="errors.name"
        />
        <InputText
          id="Team Monev 2"
          v-model="form.teammonev2"
          label="Team Monev 2"
          type="text"
          placeholder="Masukkan nama"
          :error="errors.name"
        />
        <InputText
          id="Team Monev 3"
          v-model="form.teammonev3"
          label="Team Monev 3"
          type="text"
          placeholder="Masukkan nama"
          :error="errors.name"
        />

        <!-- Pertanyaan dari API -->
        <div class="space-y-4 border-t border-gray-200 pt-4">
          <h3 class="font-semibold text-gray-700">Pertanyaan Evaluasi</h3>

          <div
            v-for="item in data_pertanyaan_evaluasi"
            :key="item.id"
            class="grid grid-cols-2 gap-4 items-start"
          >
            <!-- Kiri: pertanyaan -->
            <div class="text-gray-800 font-medium">
              {{ item.pertanyaan }}
            </div>

            <!-- Kanan: input jawaban -->
            <InputText
              v-model="jawaban[item.id]"
              :id="`jawaban-${item.id}`"
              label=""
              type="text"
              placeholder="Masukkan jawaban..."
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

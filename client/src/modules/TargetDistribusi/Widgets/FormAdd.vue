<script setup lang="ts">
// Library
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import InputText from '@/components/Form/InputText.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';

// Composable
import { useNotification } from '@/composables/useNotification';

// Service
import { add_target, daftar_asnaf } from '@/service/target_distribusi';

// Notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

// Props
interface Props {
  isModalOpen: boolean;
}
const props = defineProps<Props>();

// Emit
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'status', payload: { error_msg?: string; error?: boolean }): void;
}>();

// State
const isSubmitting = ref(false);
const tahun = ref('');
const asnafList = ref<{ id: number; name: string; target_orang: string; target_rupiah: string }[]>(
  [],
);
const errors = ref<Record<string, string>>({});

// Reset form
const resetForm = () => {
  tahun.value = '';
  asnafList.value = asnafList.value.map((a) => ({
    ...a,
    target_orang: '',
    target_rupiah: '',
  }));
  errors.value = {};
};

const fetchData = async () => {
  try {
    const response = await daftar_asnaf();
    asnafList.value = response.map((item: any) => ({
      ...item,
      target_orang: '',
      target_rupiah: '',
    }));
  } catch (error) {
    console.error(error);
    displayNotification('Gagal mengambil data asnaf', 'error');
  }
};

onMounted(() => {
  fetchData();
});

// Validasi
const validateForm = () => {
  let isValid = true;
  errors.value = {};

  if (!tahun.value) {
    errors.value.tahun = 'Tahun tidak boleh kosong.';
    isValid = false;
  }

  return isValid;
};

// Submit
const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    const payload = {
      tahun: tahun.value,
      targets: asnafList.value.map((a) => ({
        asnaf_id: a.id,
        target_orang: parseInt(a.target_orang) || 0,
        target_rupiah: parseInt(a.target_rupiah) || 0,
      })),
    };

    const response = await add_target(payload);
    emit('status', { error_msg: response.error_msg, error: response.error });
    closeModal();
    emit('close');
  } catch (error: any) {
    const msg =
      error.response?.data?.error_msg || error.response?.data?.message || 'Terjadi kesalahan';
    displayNotification(msg, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const formatRupiah = (value: string | number) => {
  let numberString = value.toString().replace(/[^,\d]/g, '');
  let split = numberString.split(',');
  let sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    let separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  return rupiah ? `Rp ${rupiah}` : '';
};

const handleRupiahInput = (a: any, e: Event) => {
  const rawValue = (e.target as HTMLInputElement).value;
  // simpen versi angka mentah buat payload
  a.target_rupiah = rawValue.replace(/[^0-9]/g, '');
  // tampilin versi format rupiah
  (e.target as HTMLInputElement).value = formatRupiah(rawValue);
};

// Close modal
const closeModal = () => {
  console.log('closeModal jalan');
  if (isSubmitting.value) return;
  resetForm();
  emit('close');
};

// Escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isModalOpen) closeModal();
};
onMounted(() => document.addEventListener('keydown', handleEscape));
onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape));
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
    >
      <LoadingSpinner v-if="isSubmitting" label="Menyimpan..." />
      <div v-else class="relative max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">TAMBAH TARGET DISTRIBUSI</h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <!-- Tahun -->
        <div class="max-w-xs">
          <InputText
            v-model="tahun"
            label="Tahun"
            type="text"
            placeholder="Masukkan tahun"
            :error="errors.tahun"
            class="w-32"
          />
        </div>

        <!-- Daftar Asnaf -->
        <div class="space-y-4">
          <div
            v-for="(a, idx) in asnafList"
            :key="a.id"
            class="grid grid-cols-3 gap-3 items-center"
          >
            <div class="font-medium text-gray-700">{{ a.name }}</div>
            <InputText
              v-model="a.target_orang"
              label="Target Orang"
              type="number"
              placeholder="0"
            />
            <InputText
              :modelValue="formatRupiah(a.target_rupiah)"
              label="Target Rupiah"
              type="text"
              placeholder="Rp 0"
              @input="handleRupiahInput(a, $event)"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-4">
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
            :disabled="!tahun.trim() || isSubmitting"
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

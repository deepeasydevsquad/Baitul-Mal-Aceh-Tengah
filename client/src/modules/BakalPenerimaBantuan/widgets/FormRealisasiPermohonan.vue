<script setup lang="ts">
// Library
import BaseButton from '@/components/Button/BaseButton.vue';
import InputCurrency from '@/components/Form/InputCurrency.vue';
import InputDate from '@/components/Form/InputDate.vue';
import InputFile from '@/components/Form/InputFile.vue';
import SelectField from '@/components/Form/SelectField.vue';
import Confirmation from '@/components/Modal/Confirmation.vue';
import Notification from '@/components/Modal/Notification.vue';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// Composable
import { useConfirmation } from '@/composables/useConfirmation';
import { useNotification } from '@/composables/useNotification';

// Service
import { get_info_permohonan, upload_realisasi_bantuan } from '@/service/bakal_penerima_bantuan';

// Composable: notification & confirmation
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

const { showConfirmDialog, confirmTitle, confirmMessage, displayConfirmation, confirm, cancel } =
  useConfirmation();

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
const currentStep = ref(1);
const sendWaOption = ref<boolean | null>(null);

// Form
const form = ref({
  tanggal_realisasi: '',
  nominal_realisasi: 0,
  tipe: null,
  bukti_transfer: null as File | null,
  mou: null as File | null,
});

// Options
const tipeOptions = ref([
  { id: null, name: 'Pilih Tipe' },
  { id: 'transfer', name: 'Transfer' },
  { id: 'bantuan_langsung', name: 'Bantuan Langsung' },
]);

// Function: Close modal
const closeModal = () => {
  if (isSubmitting.value) return;
  resetForm();
  emit('close');
};

// Function: Reset form
const resetForm = () => {
  currentStep.value = 1;
  sendWaOption.value = null;
  form.value = {
    tanggal_realisasi: '',
    nominal_realisasi: 0,
    tipe: null,
    bukti_transfer: null,
    mou: null,
  };
  errors.value = {};
};

// Function: Step 1 - Pilih WA atau tidak
const handleStep1 = (withWa: boolean) => {
  sendWaOption.value = withWa;
  currentStep.value = 2;
};

// Function: Back to step 1
const backToStep1 = () => {
  currentStep.value = 1;
  sendWaOption.value = null;
};

// Function Fetch Data
interface PermohonanItem {
  id: number;
  kegiatan_id: number;
  biaya_disetujui: number;
  member_name: string;
  kegiatan_name: string;
}

const dataPermohonan = ref<PermohonanItem>({
  id: 0,
  kegiatan_id: 0,
  biaya_disetujui: 0,
  member_name: '',
  kegiatan_name: '',
});

async function fetchData() {
  isLoading.value = true;
  try {
    const response = await get_info_permohonan(props.selectedData.id);

    dataPermohonan.value = response.data;
    console.log(dataPermohonan.value);
  } catch (error: any) {
    displayNotification(error.response.data.error_msg || error.response.data.message, 'error');
  } finally {
    isLoading.value = false;
  }
}

// Function: Validate form
const errors = ref<Record<string, string>>({
  tanggal_realisasi: '',
  nominal_realisasi: '',
  bukti_transfer: '',
  mou: '',
});

const validateForm = () => {
  let isValid = true;
  errors.value = {};

  // Validate tanggal realisasi
  if (!form.value.tanggal_realisasi) {
    errors.value.tanggal_realisasi = 'Tanggal realisasi harus diisi';
    isValid = false;
  }

  // Validate nominal realisasi
  if (!form.value.nominal_realisasi || form.value.nominal_realisasi <= 0) {
    errors.value.nominal_realisasi = 'Nominal realisasi harus lebih dari 0';
    isValid = false;
  }

  // Validate nominal tidak melebihi biaya disetujui
  if (form.value.nominal_realisasi > (props.selectedData?.biaya_disetujui || 0)) {
    errors.value.nominal_realisasi = `Nominal tidak boleh melebihi biaya disetujui`;
    isValid = false;
  }

  // Validate file upload
  if (form.value.tipe === 'transfer') {
    if (!form.value.bukti_transfer) {
      errors.value.bukti_transfer = 'Bukti transfer harus diupload';
      ``;
      isValid = false;
    }
  } else {
    // upload MOU + Bukti Transaksi + PKS
    if (!form.value.mou) {
      errors.value.mou = 'MOU + Bukti Transaksi + PKS harus diupload';
      isValid = false;
    }
  }

  return isValid;
};

// Function: Handle file upload
const handleFileUpload = (file: File | null, field: 'bukti_transfer' | 'mou') => {
  if (field === 'bukti_transfer') {
    form.value.bukti_transfer = file;
    errors.value.bukti_transfer = '';
  } else {
    form.value.mou = file;
    errors.value.mou = '';
  }
};

// Function: Handle submit
const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (!validateForm()) return;

  const confirmMsg = sendWaOption.value
    ? 'Realisasi bantuan akan disimpan dan notifikasi WhatsApp akan dikirim. Lanjutkan?'
    : 'Realisasi bantuan akan disimpan tanpa mengirim notifikasi WhatsApp. Lanjutkan?';

  displayConfirmation('Konfirmasi Realisasi Bantuan', confirmMsg, async () => {
    isSubmitting.value = true;

    const formData = new FormData();
    formData.append('id', props.selectedData.id);
    formData.append('tanggal_realisasi', form.value.tanggal_realisasi);
    formData.append('nominal_realisasi', form.value.nominal_realisasi.toString());
    formData.append('tipe', form.value.tipe);
    formData.append('send_wa', sendWaOption.value ? 'true' : 'false');

    if (form.value.tipe === 'transfer' && form.value.bukti_transfer) {
      formData.append('bukti_realisasi', form.value.bukti_transfer);
    } else if (form.value.tipe === 'bantuan_langsung' && form.value.mou) {
      formData.append('bukti_realisasi', form.value.mou);
    }

    console.log(formData);

    try {
      const response = await upload_realisasi_bantuan(formData);

      if (response.error) {
        displayNotification(response.error_msg || 'Gagal menyimpan realisasi', 'error');
      } else {
        emit('status', {
          error_msg:
            response.error_msg ||
            `Realisasi berhasil disimpan${sendWaOption.value ? ' dan notifikasi WA terkirim' : ''}`,
          error: false,
        });
        closeModal();
      }
    } catch (error: any) {
      console.error('Error upload realisasi:', error);
      displayNotification(
        error.response?.data?.error_msg ||
          error.response?.data?.message ||
          'Gagal menyimpan realisasi',
        'error',
      );
    } finally {
      isSubmitting.value = false;
      closeModal();
    }
  });
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

// Watch: Fetch data when modal opens
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
      <div class="relative max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 id="modal-title" class="text-xl font-bold text-gray-800">
              {{
                currentStep === 1
                  ? 'Realisasi Bantuan'
                  : `Realisasi Bantuan - ${dataPermohonan?.kegiatan_name || ''}`
              }}
            </h2>
            <p class="text-sm text-gray-500">
              {{
                currentStep === 1 ? 'Pilih metode pemberitahuan' : 'Lengkapi data realisasi bantuan'
              }}
            </p>
          </div>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <!-- Step Indicator -->
        <div class="flex items-center justify-center gap-2">
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                currentStep === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600',
              ]"
            >
              1
            </div>
            <span class="text-xs font-semibold text-gray-600">Pilih Metode</span>
          </div>
          <div class="w-16 h-1 bg-gray-200">
            <div
              :class="['h-full transition-all', currentStep === 2 ? 'bg-green-600' : 'bg-gray-200']"
              :style="{ width: currentStep === 2 ? '100%' : '0%' }"
            ></div>
          </div>
          <div class="flex items-center gap-2">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                currentStep === 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500',
              ]"
            >
              2
            </div>
            <span class="text-xs font-semibold text-gray-600">Input Data</span>
          </div>
        </div>

        <!-- Info Pemohon -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 class="font-semibold text-blue-800 text-sm mb-3 flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-user" />
            Informasi Pemohon
          </h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-blue-800">
            <p>
              <span class="font-semibold">Nama:</span>
              {{ dataPermohonan?.member_name || '-' }}
            </p>
            <p>
              <span class="font-semibold">Kegiatan:</span>
              {{ dataPermohonan?.kegiatan_name || '-' }}
            </p>
            <p>
              <span class="font-semibold">Biaya Disetujui:</span>
              <span class="font-bold text-green-700">{{
                $formatToRupiah(dataPermohonan?.biaya_disetujui || 0)
              }}</span>
            </p>
          </div>
        </div>

        <!-- STEP 1: Pilih Metode Pemberitahuan -->
        <div v-if="currentStep === 1" class="space-y-4">
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-4">
              Apakah Anda ingin mengirim notifikasi WhatsApp setelah realisasi?
            </p>
            <div class="flex flex-col gap-3">
              <button
                @click="handleStep1(true)"
                class="flex items-center justify-between px-6 py-4 bg-green-50 border-2 border-green-300 rounded-lg hover:bg-green-100 hover:border-green-400 transition-all group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <font-awesome-icon icon="fa-brands fa-whatsapp" class="text-white text-lg" />
                  </div>
                  <div class="text-left">
                    <p class="font-bold text-gray-800">Realisasi + Kirim WhatsApp</p>
                    <p class="text-xs text-gray-600">Pemohon akan menerima notifikasi WhatsApp</p>
                  </div>
                </div>
                <font-awesome-icon
                  icon="fa-solid fa-arrow-right"
                  class="text-green-600 group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                @click="handleStep1(false)"
                class="flex items-center justify-between px-6 py-4 bg-gray-50 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                    <font-awesome-icon icon="fa-solid fa-check" class="text-white text-lg" />
                  </div>
                  <div class="text-left">
                    <p class="font-bold text-gray-800">Realisasi Saja</p>
                    <p class="text-xs text-gray-600">Tanpa mengirim notifikasi WhatsApp</p>
                  </div>
                </div>
                <font-awesome-icon
                  icon="fa-solid fa-arrow-right"
                  class="text-gray-600 group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          <div class="flex justify-center">
            <BaseButton @click="closeModal" type="button" variant="secondary" class="w-full">
              <font-awesome-icon icon="fa-solid fa-xmark" class="mr-2" />
              Batal
            </BaseButton>
          </div>
        </div>

        <!-- STEP 2: Input Data Realisasi -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div class="space-y-4 max-h-[50vh] overflow-y-auto p-1">
            <!-- Tanggal Realisasi -->
            <InputDate
              id="tanggal_realisasi"
              v-model="form.tanggal_realisasi"
              label="Tanggal Realisasi"
              :error="errors.tanggal_realisasi"
              :required="true"
            />

            <!-- Nominal Realisasi -->
            <InputCurrency
              id="nominal_realisasi"
              v-model.number="form.nominal_realisasi"
              label="Nominal Realisasi"
              placeholder="Masukkan nominal realisasi"
              note="Nominal Realisasi Harus Sama Dengan Nominal Bantuan."
              :error="errors.nominal_realisasi"
              :required="true"
            />

            <!-- Pilih Tipe Realisasi -->
            <SelectField
              id="tipe"
              v-model="form.tipe"
              :options="tipeOptions"
              label="Pilih Tipe Realisasi"
              placeholder="Pilih tipe realisasi"
              :error="errors.tipe"
              :required="true"
            />

            <!-- Upload Bukti Transfer (jika tipe = transfer) -->
            <InputFile
              v-if="form.tipe === 'transfer'"
              id="bukti_transfer"
              label="Upload Bukti Transfer"
              accept=".pdf,.jpg,.jpeg,.png"
              :max-size="1000"
              note="Ukuran file berkas maksimal 1MB"
              :error="errors.bukti_transfer"
              :required="true"
              @file-selected="(file) => handleFileUpload(file, 'bukti_transfer')"
            />

            <!-- Upload MOU (jika tipe = bantuan_langsung) -->
            <InputFile
              v-if="form.tipe === 'bantuan_langsung'"
              id="mou"
              label="Upload MOU + Bukti Transaksi + PKS"
              accept=".pdf,.jpg,.jpeg,.png"
              :max-size="1000"
              note="Ukuran file berkas maksimal 1MB"
              :error="errors.mou"
              :required="true"
              @file-selected="(file) => handleFileUpload(file, 'mou')"
            />
          </div>

          <!-- Info Badge -->
          <div class="flex items-center gap-2 text-xs">
            <span
              :class="[
                'px-3 py-1 rounded-full font-semibold',
                sendWaOption ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
              ]"
            >
              <font-awesome-icon
                :icon="sendWaOption ? 'fa-brands fa-whatsapp' : 'fa-solid fa-check'"
                class="mr-1"
              />
              {{ sendWaOption ? 'Dengan WhatsApp' : 'Tanpa WhatsApp' }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex justify-between gap-3">
            <BaseButton
              @click="backToStep1"
              type="button"
              :disabled="isSubmitting"
              variant="secondary"
            >
              <font-awesome-icon icon="fa-solid fa-arrow-left" class="mr-2" />
              Kembali
            </BaseButton>

            <BaseButton
              type="button"
              variant="success"
              :disabled="isSubmitting"
              @click="handleSubmit"
            >
              <span v-if="isSubmitting">Menyimpan...</span>
              <span v-else>
                <font-awesome-icon icon="fa-solid fa-check" class="mr-2" />
                {{ sendWaOption ? 'Realisasi Bantuan & Kirim WA' : 'Realisasi Bantuan' }}
              </span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Confirmation -->
  <Confirmation
    :showConfirmDialog="showConfirmDialog"
    :confirmTitle="confirmTitle"
    :confirmMessage="confirmMessage"
  >
    <BaseButton variant="secondary" @click="cancel">Batal</BaseButton>
    <BaseButton variant="success" @click="confirm">Ya, Simpan</BaseButton>
  </Confirmation>

  <!-- Notification -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>

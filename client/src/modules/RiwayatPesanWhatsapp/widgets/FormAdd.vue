<script setup lang="ts">
// Library
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import SelectField from '@/components/Form/SelectField.vue';
import InputText from '@/components/Form/InputText.vue';
import TextArea from '@/components/Form/TextArea.vue';

// Composable
import { useNotification } from '@/composables/useNotification';

// Service
import { get_info_Whatsapp_message } from '@/service/riwayat_pesan_whatsapp';

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

interface Props {
  isModalOpen: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'status', payload: { error_msg?: string; error?: boolean }): void;
}>();

// 🧱 ENUM: Jenis Pesan (statis)
// enum JenisPesanEnum {
//   pesan_biasa = 'Pesan Biasa',
//   munfiq = 'Munfiq',
//   muzakki = 'Muzakki',
//   semua_member = 'Semua Member',
//   surveyor = 'Surveyor',
//   otp = 'OTP',
// }

// 🔄 Convert enum ke array untuk SelectField
const jenisPesanOption = ref<{ id: string; name: string }[]>([
  { id: 'pilih_jenis', name: 'Pilih Jenis Pesan' },
  { id: 'pesan_biasa', name: 'Pesan Biasa' },
  { id: 'munfiq', name: 'Munfiq' },
  { id: 'muzakki', name: 'Muzakki' },
  { id: 'sumber_member', name: 'Sumber Member' },
  { id: 'surveyor', name: 'Surveyor' },
  { id: 'otp', name: 'OTP' },
]);

// 'surveyor','pemohon','otp','munfiq','muzakki','pesan_biasa'
// Object.entries(JenisPesanEnum).map(([key, value]) => ({
//   id: key,
//   name: value,
// })),

// 🧩 TEMPLATE PESAN (dinamis dari database)
const templatePesanOption = ref<Array<{ id: number; name: string }>>([]);

// 🔍 Fungsi ambil data dari database
async function fetchTemplatePesan() {
  try {
    const response = await get_info_Whatsapp_message();
    // Asumsi response.data = [{ id: 1, name: "Template Ucapan" }, ...]
    templatePesanOption.value = response.data || [];

    console.log('Template pesan berhasil diambil:', templatePesanOption.value);
  } catch (error) {
    console.error('Gagal mengambil data template pesan:', error);
    displayNotification('Gagal mengambil data template pesan', 'error');
  }
}

// 🧾 Data Form
const form = ref<{
  name: string;
  jenis_pesan: string | null;
  nomor_tujuan?: string;
  isi_pesan: string;
  template_pesan: number;
}>({
  name: '',
  jenis_pesan: 'pilih_jenis',
  isi_pesan: '',
  template_pesan: 0,
});

// Error state
const errors = ref<Record<string, string>>({});

// 🔁 Reset form
const resetForm = () => {
  form.value = { name: '', jenis_pesan: null, template_pesan: null, isi_pesan: '' };
  errors.value = {};
};

// ✅ Validasi
const validateForm = () => {
  let isValid = true;
  errors.value = {};

  if (!form.value.name) {
    errors.value.name = 'Nomor asal tidak boleh kosong.';
    isValid = false;
  }
  if (!form.value.jenis_pesan) {
    errors.value.jenis_pesan = 'Jenis pesan harus dipilih.';
    isValid = false;
  }

  if (!form.value.isi_pesan) {
    errors.value.isi_pesan = 'Isi pesan tidak boleh kosong.';
    isValid = false;
  }

  return isValid;
};

// 💾 Submit form
const isSubmitting = ref(false);
const handleSubmit = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;

  try {
    const payload = {
      name: form.value.name,
      jenis_pesan: form.value.jenis_pesan,
      template_pesan: form.value.template_pesan,
      isi_pesan: form.value.isi_pesan,
    };

    console.log('Payload dikirim:', payload);

    // const response = await add_desa(payload);
    const response = { error: false, error_msg: '' }; // dummy

    emit('status', {
      error_msg: response?.error_msg || '',
      error: response?.error || false,
    });

    resetForm();
    emit('close');
  } catch (error: any) {
    console.error('Error saat tambah pesan:', error);
    displayNotification('Terjadi kesalahan saat menyimpan data', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// 🔒 Tutup modal
const closeModal = () => {
  resetForm();
  emit('close');
};

// ⌨️ Escape untuk close modal
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isModalOpen) closeModal();
};

// 🚀 Fetch data saat modal dibuka
watch(
  () => props.isModalOpen,
  async (val) => {
    if (val) {
      await fetchTemplatePesan();
    }
  },
);

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape);
});

// Watch perubahan modal + data
watch(
  () => form.value.jenis_pesan,
  (v) => {
    if (v != 'pilih_pesan') {
      get_template_pesan_whatsapp();
    }
    // if (val && props.selectedAsnaf?.id) {
    //   fetchData()
    // } else if (!val) {
    //   resetForm()
    // }
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
      <div class="relative max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 id="modal-title" class="text-xl font-semibold text-gray-800">Kirim Pesan WhatsApp</h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <!-- Nomor Asal -->
        <!-- <InputText
          id="nomorAsal"
          readonly
          v-model="form.name"
          label="Nomor Asal"
          placeholder="Masukkan nomor asal"
          :error="errors.name"
        /> -->

        <!-- Jenis Pesan -->
        <SelectField
          id="jenis_pesan"
          v-model="form.jenis_pesan"
          :options="jenisPesanOption"
          label="Jenis Pesan"
          placeholder="--- Pilih Jenis Pesan ---"
          :error="errors.jenis_pesan"
        />

        <InputText
          v-if="form.jenis_pesan == 'pesan_biasa'"
          id="nomor_tujuan"
          v-model="form.nomor_tujuan"
          label="Nomor Tujuan"
          placeholder="Masukkan nomor tujuan anda"
          :error="errors.nomor_tujuan"
        />

        <!-- Template Pesan -->
        <!-- <SelectField
          id="jenis_pesan"
          v-model="form.template_pesan"
          :options="templatePesanOption"
          label="Jenis Pesan"
          placeholder="--- Pilih Template Pesan ---"
          :error="errors.jenis_pesan"
        /> -->

        <!-- Isi Pesan -->
        <TextArea
          id="isi_pesan"
          readonly
          v-model="form.isi_pesan"
          label="Isi Pesan"
          placeholder="Tulis isi pesan di sini..."
          :error="errors.isi_pesan"
        />

        <!-- Tombol Simpan -->
        <BaseButton
          type="submit"
          fullWidth
          variant="primary"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          <span v-if="isSubmitting">Menyimpan...</span>
          <span v-else>Simpan</span>
        </BaseButton>
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

<script setup lang="ts">
// Library
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import SelectField from '@/components/Form/SelectField.vue';
import InputText from '@/components/Form/InputText.vue';
import TextArea from '@/components/Form/TextArea.vue';

// Composable
import { useNotification } from '@/composables/useNotification';

// Service
import {
  get_template_pesan_whatsapp,
  get_pesan_template_pesan_whatsapp,
} from '@/service/riwayat_pesan_whatsapp';

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

// 🧾 Data Form
const form = ref<{
  name: string;
  jenis_pesan: string;
  nomor_tujuan?: string;
  isi_pesan: string;
  template_pesan?: string;
}>({
  name: '',
  jenis_pesan: 'pilih_jenis',
  isi_pesan: '',
  template_pesan: 'pilih_template',
});

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

// 🧩 TEMPLATE PESAN (dinamis dari database)
const templatePesanOption = ref<Array<{ id: number; name: string }>>([]);

// 🔍 Fungsi ambil data dari database
async function get_template_pesan_whatsapp_fn() {
  try {
    const response = await get_template_pesan_whatsapp({ type: form.value.jenis_pesan });
    templatePesanOption.value = [
      { id: 'pilih_template', name: '-- Pilih Template --' },
      ...response.data,
    ];
    form.value.template_pesan = 'pilih_template';
  } catch (error) {
    console.error('Gagal mengambil data template pesan:', error);
    displayNotification('Gagal mengambil data template pesan', 'error');
  }
}

async function get_pesan_template_pesan_whatsapp_fn() {
  console.log('XXXX');
  try {
    const response = await get_pesan_template_pesan_whatsapp({
      template_id: form.value.template_pesan,
    });
    form.value.isi_pesan = response.data;
  } catch (error) {
    console.error('Gagal mengambil data template pesan:', error);
    displayNotification('Gagal mengambil data template pesan', 'error');
  }
}

// Error state
const errors = ref<Record<string, string>>({});

// 🔁 Reset form
const resetForm = () => {
  form.value = {
    name: '',
    jenis_pesan: 'pilih_jenis',
    template_pesan: 'pilih_template',
    isi_pesan: '',
  };
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

  if (form.value.jenis_pesan == 'pesan_biasa') {
    if (form.value.nomor_tujuan == '') {
      errors.value.nomor_tujuan = 'Untuk jenis pesan "Pesan Biasa", Nomor tujuan wajib diisi.';
    }
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
    if (v != 'pilih_jenis') {
      get_template_pesan_whatsapp_fn();
    }
  },
);

watch(
  () => form.value.template_pesan,
  (v) => {
    if (v != 'pilih_template') {
      get_pesan_template_pesan_whatsapp_fn();
    }
  },
);

const isDisbaled = computed(() => {
  let status = true;

  if (form.value.jenis_pesan != 'pilih_jenis' && form.value.isi_pesan) {
    if (form.value.jenis_pesan == 'pesan_biasa') {
      if (form.value.nomor_tujuan !== undefined && form.value.nomor_tujuan !== '') {
        status = false;
        console.log('1----');
        console.log(form.value.nomor_tujuan);
        console.log('1----');
      }
    } else {
      console.log('2----');
      status = false;
    }
  }

  console.log('Status ==== ');
  console.log(form.value.jenis_pesan);
  console.log(form.value.isi_pesan);
  console.log(status);
  console.log('Status ==== ');

  return status;
  // if (!apiData.value) return 0;
  // return (
  //   apiData.value.infaq.realisasi_pengumpulan +
  //   apiData.value.zakat.realisasi_pengumpulan +
  //   apiData.value.donasi.realisasi_pengumpulan
  // );
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
          :note="'Silahkan masukkan nomor tujuan pada kolom diatas. Untuk nomor tujuan yang lebih dari satu, maka setiap nomor dipisahkan oleh tanda koma.'"
        />

        <!-- Template Pesan -->
        <SelectField
          v-if="form.jenis_pesan != 'pilih_jenis'"
          id="jenis_pesan"
          v-model="form.template_pesan"
          :options="templatePesanOption"
          label="Jenis Pesan"
          placeholder="--- Pilih Template Pesan ---"
          :error="errors.jenis_pesan"
        />

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
        <!-- <BaseButton
          type="submit"
          fullWidth
          variant="primary"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          <span v-if="isSubmitting">Menyimpan...</span>
          <span v-else>Simpan</span>
        </BaseButton> -->
        <div class="flex justify-end gap-3">
          <BaseButton
            @click="closeModal"
            type="button"
            :disabled="isSubmitting"
            variant="secondary"
          >
            Batal
          </BaseButton>
          <BaseButton type="submit" variant="primary" :disabled="isDisbaled" @click="handleSubmit">
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

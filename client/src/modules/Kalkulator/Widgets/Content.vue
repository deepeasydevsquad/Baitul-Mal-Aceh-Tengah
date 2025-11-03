<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue';
import Input from '@/components/Form/InputText.vue';
import SelectField from '@/components/Form/SelectField.vue';
import Notification from '@/components/Modal/Notification.vue';
import { useNotification } from '@/composables/useNotification';

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

// Tipe zakat yang dipilih
const tipeZakat = ref<
  'zakat-perusahaan' | 'zakat-emas' | 'zakat-perdagangan' | 'zakat-profesi' | ''
>('');

// Tipe perusahaan untuk zakat perusahaan
const tipePerusahaan = ref<'jasa' | 'dagang' | ''>('');

// Data form untuk setiap tipe zakat (nilai asli angka)
const formData = reactive({
  // Zakat Profesi
  penghasilanPerBulan: '',

  // Zakat Perdagangan
  asetLancarPerdagangan: '',
  utangJangkaPendek: '',

  // Zakat Perusahaan Dagang
  asetLancarPerusahaan: '',
  utangLancarPerusahaan: '',

  // Zakat Perusahaan Jasa
  labaSebelumPajak: '',

  // Zakat Emas
  jumlahEmas: '', // dalam gram
  hargaEmasPerGram: '1300000', // harga default emas per gram
});

// Data form yang ditampilkan dengan format Rupiah
const formDataDisplay = reactive({
  penghasilanPerBulan: '',
  asetLancarPerdagangan: '',
  utangJangkaPendek: '',
  asetLancarPerusahaan: '',
  utangLancarPerusahaan: '',
  labaSebelumPajak: '',
  hargaEmasPerGram: 'Rp 1.300.000',
});

// Fungsi untuk format input Rupiah
function formatRupiahInput(value: string): string {
  // Hapus semua karakter selain angka
  const numbers = value.replace(/[^\d]/g, '');
  if (!numbers) return '';

  // Format dengan separator ribuan
  return 'Rp ' + parseInt(numbers).toLocaleString('id-ID');
}

// Fungsi untuk mengambil nilai numerik dari format Rupiah
function parseRupiahInput(value: string): string {
  return value.replace(/[^\d]/g, '');
}

// Watch untuk format penghasilan
watch(
  () => formDataDisplay.penghasilanPerBulan,
  (newValue) => {
    const numericValue = parseRupiahInput(newValue);
    formData.penghasilanPerBulan = numericValue;
    if (numericValue) {
      formDataDisplay.penghasilanPerBulan = formatRupiahInput(numericValue);
    }
  },
);

// Watch untuk format aset lancar perdagangan
watch(
  () => formDataDisplay.asetLancarPerdagangan,
  (newValue) => {
    const numericValue = parseRupiahInput(newValue);
    formData.asetLancarPerdagangan = numericValue;
    if (numericValue) {
      formDataDisplay.asetLancarPerdagangan = formatRupiahInput(numericValue);
    }
  },
);

// Watch untuk format utang jangka pendek
watch(
  () => formDataDisplay.utangJangkaPendek,
  (newValue) => {
    const numericValue = parseRupiahInput(newValue);
    formData.utangJangkaPendek = numericValue;
    if (numericValue) {
      formDataDisplay.utangJangkaPendek = formatRupiahInput(numericValue);
    }
  },
);

// Watch untuk format aset lancar perusahaan
watch(
  () => formDataDisplay.asetLancarPerusahaan,
  (newValue) => {
    const numericValue = parseRupiahInput(newValue);
    formData.asetLancarPerusahaan = numericValue;
    if (numericValue) {
      formDataDisplay.asetLancarPerusahaan = formatRupiahInput(numericValue);
    }
  },
);

// Watch untuk format utang lancar perusahaan
watch(
  () => formDataDisplay.utangLancarPerusahaan,
  (newValue) => {
    const numericValue = parseRupiahInput(newValue);
    formData.utangLancarPerusahaan = numericValue;
    if (numericValue) {
      formDataDisplay.utangLancarPerusahaan = formatRupiahInput(numericValue);
    }
  },
);

// Watch untuk format laba sebelum pajak
watch(
  () => formDataDisplay.labaSebelumPajak,
  (newValue) => {
    const numericValue = parseRupiahInput(newValue);
    formData.labaSebelumPajak = numericValue;
    if (numericValue) {
      formDataDisplay.labaSebelumPajak = formatRupiahInput(numericValue);
    }
  },
);

// Watch untuk format harga emas per gram
watch(
  () => formDataDisplay.hargaEmasPerGram,
  (newValue) => {
    const numericValue = parseRupiahInput(newValue);
    formData.hargaEmasPerGram = numericValue;
    if (numericValue) {
      formDataDisplay.hargaEmasPerGram = formatRupiahInput(numericValue);
    }
  },
);

// Hasil perhitungan zakat
const hasilZakat = ref<number | null>(null);
const nisabTercapai = ref(false);

// Konstanta nisab (85 gram emas)
const NISAB_GRAM_EMAS = 85;

// Hitung nisab dalam rupiah
const nisabRupiah = computed(() => {
  const hargaEmas = parseFloat(formData.hargaEmasPerGram) || 0;
  return NISAB_GRAM_EMAS * hargaEmas;
});

// Reset form ketika tipe zakat berubah
watch(tipeZakat, () => {
  resetForm();
});

// Reset form ketika tipe perusahaan berubah
watch(tipePerusahaan, () => {
  if (tipeZakat.value === 'zakat-perusahaan') {
    formData.asetLancarPerusahaan = '';
    formData.utangLancarPerusahaan = '';
    formData.labaSebelumPajak = '';
    formDataDisplay.asetLancarPerusahaan = '';
    formDataDisplay.utangLancarPerusahaan = '';
    formDataDisplay.labaSebelumPajak = '';
    hasilZakat.value = null;
    nisabTercapai.value = false;
  }
});

function resetForm() {
  // Reset nilai asli
  formData.penghasilanPerBulan = '';
  formData.asetLancarPerdagangan = '';
  formData.utangJangkaPendek = '';
  formData.asetLancarPerusahaan = '';
  formData.utangLancarPerusahaan = '';
  formData.labaSebelumPajak = '';
  formData.jumlahEmas = '';
  formData.hargaEmasPerGram = ' 2250341';

  // Reset nilai display
  formDataDisplay.penghasilanPerBulan = '';
  formDataDisplay.asetLancarPerdagangan = '';
  formDataDisplay.utangJangkaPendek = '';
  formDataDisplay.asetLancarPerusahaan = '';
  formDataDisplay.utangLancarPerusahaan = '';
  formDataDisplay.labaSebelumPajak = '';
  formDataDisplay.hargaEmasPerGram = 'Rp  2.250.341';

  tipePerusahaan.value = '';
  hasilZakat.value = null;
  nisabTercapai.value = false;
}

function hitungZakat(event: Event) {
  event.preventDefault();

  try {
    let totalHarta = 0;
    let zakat = 0;

    if (tipeZakat.value === 'zakat-profesi') {
      // Zakat Profesi = Penghasilan x 2.5%
      const penghasilan = parseFloat(formData.penghasilanPerBulan) || 0;
      totalHarta = penghasilan * 12; // setahun

      if (totalHarta >= nisabRupiah.value) {
        zakat = penghasilan * 0.025;
        nisabTercapai.value = true;
      } else {
        nisabTercapai.value = false;
        showNotificationMessage('Penghasilan Anda belum mencapai nisab', 'warning');
        return;
      }
    } else if (tipeZakat.value === 'zakat-perdagangan') {
      // Zakat Perdagangan = (Aset Lancar - Utang Jangka Pendek) x 2.5%
      const aset = parseFloat(formData.asetLancarPerdagangan) || 0;
      const utang = parseFloat(formData.utangJangkaPendek) || 0;
      totalHarta = aset - utang;

      if (totalHarta >= nisabRupiah.value) {
        zakat = totalHarta * 0.025;
        nisabTercapai.value = true;
      } else {
        nisabTercapai.value = false;
        showNotificationMessage('Aset perdagangan Anda belum mencapai nisab', 'warning');
        return;
      }
    } else if (tipeZakat.value === 'zakat-perusahaan') {
      if (tipePerusahaan.value === 'dagang') {
        // Zakat Perusahaan Dagang = (Aset Lancar - Utang Lancar) x 2.5%
        const aset = parseFloat(formData.asetLancarPerusahaan) || 0;
        const utang = parseFloat(formData.utangLancarPerusahaan) || 0;
        totalHarta = aset - utang;

        if (totalHarta >= nisabRupiah.value) {
          zakat = totalHarta * 0.025;
          nisabTercapai.value = true;
        } else {
          nisabTercapai.value = false;
          showNotificationMessage('Aset perusahaan Anda belum mencapai nisab', 'warning');
          return;
        }
      } else if (tipePerusahaan.value === 'jasa') {
        // Zakat Perusahaan Jasa = Laba Sebelum Pajak x 2.5%
        const laba = parseFloat(formData.labaSebelumPajak) || 0;
        totalHarta = laba;

        if (totalHarta >= nisabRupiah.value) {
          zakat = totalHarta * 0.025;
          nisabTercapai.value = true;
        } else {
          nisabTercapai.value = false;
          showNotificationMessage('Laba perusahaan Anda belum mencapai nisab', 'warning');
          return;
        }
      } else {
        showNotificationMessage('Silakan pilih tipe perusahaan', 'error');
        return;
      }
    } else if (tipeZakat.value === 'zakat-emas') {
      // Zakat Emas = Jumlah Emas (gram) x Harga Emas per Gram x 2.5%
      const jumlahEmas = parseFloat(formData.jumlahEmas) || 0;
      const hargaEmas = parseFloat(formData.hargaEmasPerGram) || 0;

      if (jumlahEmas >= NISAB_GRAM_EMAS) {
        const nilaiEmas = jumlahEmas * hargaEmas;
        zakat = nilaiEmas * 0.025;
        nisabTercapai.value = true;
      } else {
        nisabTercapai.value = false;
        showNotificationMessage(
          `Jumlah emas Anda belum mencapai nisab (${NISAB_GRAM_EMAS} gram)`,
          'warning',
        );
        return;
      }
    } else {
      showNotificationMessage('Silakan pilih tipe zakat', 'error');
      return;
    }

    hasilZakat.value = zakat;
    showNotificationMessage('Perhitungan zakat berhasil!', 'success');
  } catch (error) {
    showNotificationMessage('Terjadi kesalahan dalam perhitungan', 'error');
  }
}

function showNotificationMessage(message: string, type: string) {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}
</script>

<template>
  <div class="bg-white min-h-screen flex items-start justify-center bg-gray-100 py-10 pt-10">
    <div class="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-lg">
      <h2 class="text-2xl text-center font-bold text-green-900 mb-4">Kalkulator Zakat</h2>
      <p class="text-sm text-gray-600 italic text-center mb-10">
        "Islam itu dibangun atas lima perkara: bersaksi bahwa tiada Tuhan selain Allah dan bahwa
        Muhammad adalah Utusan Allah, mendirikan shalat, menunaikan zakat, berhaji ke Baitullah, dan
        berpuasa di bulan Ramadan. (HR. Bukhari). "
      </p>

      <form @submit="hitungZakat" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Select tipe zakat -->
        <SelectField
          v-model="tipeZakat"
          id="tipe_zakat"
          label="Tipe Zakat"
          placeholder="Pilih Tipe Zakat"
          :options="[
            { id: '', name: '-- Pilih Tipe Zakat --' },
            { id: 'zakat-profesi', name: 'Zakat Profesi' },
            { id: 'zakat-perdagangan', name: 'Zakat Perdagangan' },
            { id: 'zakat-perusahaan', name: 'Zakat Perusahaan' },
            { id: 'zakat-emas', name: 'Zakat Emas' },
          ]"
          class="md:col-span-2"
          :note="`Silakan pilih jenis zakat yang akan Anda hitung`"
        />

        <!-- Input untuk Zakat Profesi -->
        <template v-if="tipeZakat === 'zakat-profesi'">
          <Input
            v-model="formDataDisplay.penghasilanPerBulan"
            id="penghasilan"
            label="Penghasilan Per Bulan"
            placeholder="Rp 0"
            type="text"
            class="md:col-span-2"
            :note="`Masukkan penghasilan kotor per bulan dalam Rupiah. Nisab zakat profesi: ${formatRupiah(nisabRupiah)}/tahun`"
          />
        </template>

        <!-- Input untuk Zakat Perdagangan -->
        <template v-if="tipeZakat === 'zakat-perdagangan'">
          <Input
            v-model="formDataDisplay.asetLancarPerdagangan"
            id="aset_lancar"
            label="Aset Lancar"
            placeholder="Rp 0"
            type="text"
            class="md:col-span-2"
            :note="`Masukkan total aset lancar dalam Rupiah (modal, stok barang, piutang, kas)`"
          />
          <Input
            v-model="formDataDisplay.utangJangkaPendek"
            id="utang_pendek"
            label="Utang Jangka Pendek"
            placeholder="Rp 0"
            type="text"
            class="md:col-span-2"
            :note="`Masukkan total utang yang jatuh tempo dalam 1 tahun. Nisab: ${formatRupiah(nisabRupiah)}`"
          />
        </template>

        <!-- Input untuk Zakat Perusahaan -->
        <template v-if="tipeZakat === 'zakat-perusahaan'">
          <SelectField
            v-model="tipePerusahaan"
            id="tipe_perusahaan"
            label="Tipe Perusahaan"
            placeholder="Pilih Tipe Perusahaan"
            :options="[
              { id: '', name: '-- Pilih Tipe Perusahaan --' },
              { id: 'dagang', name: 'Perusahaan Dagang' },
              { id: 'jasa', name: 'Perusahaan Jasa' },
            ]"
            class="md:col-span-2"
            :note="`Pilih jenis perusahaan Anda`"
          />

          <!-- Input untuk Perusahaan Dagang -->
          <template v-if="tipePerusahaan === 'dagang'">
            <Input
              v-model="formDataDisplay.asetLancarPerusahaan"
              id="aset_lancar_perusahaan"
              label="Aset Lancar"
              placeholder="Rp 0"
              type="text"
              class="md:col-span-2"
              :note="`Masukkan total aset lancar perusahaan dalam Rupiah`"
            />
            <Input
              v-model="formDataDisplay.utangLancarPerusahaan"
              id="utang_lancar"
              label="Utang Lancar"
              placeholder="Rp 0"
              type="text"
              class="md:col-span-2"
              :note="`Masukkan total utang lancar perusahaan. Nisab: ${formatRupiah(nisabRupiah)}`"
            />
          </template>

          <!-- Input untuk Perusahaan Jasa -->
          <template v-if="tipePerusahaan === 'jasa'">
            <Input
              v-model="formDataDisplay.labaSebelumPajak"
              id="laba_pajak"
              label="Laba Sebelum Pajak"
              placeholder="Rp 0"
              type="text"
              class="md:col-span-2"
              :note="`Masukkan laba sebelum pajak dalam Rupiah. Nisab: ${formatRupiah(nisabRupiah)}`"
            />
          </template>
        </template>

        <!-- Input untuk Zakat Emas -->
        <template v-if="tipeZakat === 'zakat-emas'">
          <Input
            v-model="formData.jumlahEmas"
            id="jumlah_emas"
            label="Jumlah Emas (gram)"
            placeholder="Masukkan jumlah emas dalam gram"
            type="number"
            class="md:col-span-2"
            :note="`Masukkan jumlah emas yang disimpan selama 1 tahun. Nisab: ${NISAB_GRAM_EMAS} gram`"
          />
          <Input
            v-model="formDataDisplay.hargaEmasPerGram"
            id="harga_emas"
            label="Harga Emas Per Gram"
            placeholder="Rp 0"
            type="text"
            class="md:col-span-2"
            :note="`Masukkan harga emas per gram saat ini (default: Rp 1.300.000)`"
          />
        </template>

        <!-- Hasil Perhitungan -->
        <div
          v-if="hasilZakat !== null && nisabTercapai"
          class="md:col-span-2 mt-4 p-6 bg-green-50 border-2 border-green-500 rounded-lg"
        >
          <h3 class="text-lg font-bold text-green-900 mb-2">Hasil Perhitungan Zakat</h3>
          <div class="text-2xl font-bold text-green-700">
            {{ formatRupiah(hasilZakat) }}
          </div>
          <p class="text-sm text-gray-600 mt-2">
            <span v-if="tipeZakat === 'zakat-profesi'">Zakat yang harus dibayar per bulan</span>
            <span v-else>Zakat yang harus dibayar</span>
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Nisab tercapai. Alhamdulillah, Anda wajib membayar zakat.
          </p>
        </div>

        <!-- Tombol Submit dan Reset -->
        <div class="md:col-span-2 flex justify-end gap-2">
          <button
            type="submit"
            class="bg-[#0E561E] hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Hitung Zakat
          </button>
          <button
            type="button"
            @click="resetForm"
            class="bg-[#DC2626] hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  </div>

  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import Logos from '@/components/Logo/Logo.vue';
import FooterCetak from '../FooterCetak/FooterCetak.vue';
import { useNotification } from '@/composables/useNotification';
import { list } from '@/service/laporan_umum';

const isLoading = ref(false);

const { displayNotification } = useNotification();

const data = ref<any>(null);

const selectedYear = ref<number>(new Date().getFullYear());
const selectedMonth = ref<number>(new Date().getMonth() + 1);

// Generate tahun options (5 tahun ke belakang)
const yearOptions = ref<number[]>([]);
for (let i = 0; i < 5; i++) {
  yearOptions.value.push(new Date().getFullYear() - i);
}

// Generate bulan options
const monthOptions = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
];

// Function: Fetch Data
async function fetchData() {
  isLoading.value = true;
  try {
    const response = await list(selectedYear.value, selectedMonth.value);
    if (response && response.status) {
      data.value = response.data;
      console.log('Data laporan umum:', data.value);
    } else {
      displayNotification('Gagal mengambil data laporan umum', 'error');
    }
  } catch (error) {
    displayNotification('Terjadi kesalahan saat mengambil data laporan umum', 'error');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await fetchData();
    await nextTick();

    if (Object.keys(data.value).length > 0) {
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          window.close();
        }, 400);
      }, 1000);
    } else {
      console.warn('❗ Data kosong atau tidak valid');
    }
  } catch (error) {
    console.error('❌ Error saat mounting:', error);
  }
});

// Utils
const formatRupiah = (value: number) => {
  if (!value) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};
</script>
<template>
  <div
    class="min-h-screen p-4 print:p-0 print:m-0"
    style="color: black; font-size: 9pt; line-height: 1.3"
  >
    <div
      v-if="data"
      class="print-area font-sans flex flex-col print:p-[10mm] print:m-0 print:shadow-none"
      style="color: black; font-size: 9pt; line-height: 1.3; background: white"
    >
      <!-- Header dengan Logo -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Laporan Umum</h1>
        </div>
        <div class="flex-shrink-0">
          <Logos />
        </div>
      </div>
      <!-- <div class="grid grid-cols-3 gap-4 mb-4"></div> -->

      <div class="grid grid-cols-2 md:grid-cols-2 gap-6 mt-4">
        <!-- Kiri -->
        <div class="space-y-6">
          <!-- Info Umum -->
          <div>
            <div
              class="bg-gray-200 px-4 py-2 border-t border-l border-r border-gray-300 font-medium"
            >
              INFO UMUM
            </div>
            <div class="border border-t-0 border-gray-300 divide-y divide-gray-300">
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Member</span>
                <span>:</span>
                <span>{{ data.info_umum.totalMember }} Orang</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Asnaf</span>
                <span>:</span>
                <span>{{ data.info_umum.totalAsnaf }} Asnaf</span>
              </div>
              <div class="border border-t-0 border-gray-300 divide-y divide-gray-300">
                <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                  <span>Total Member</span>
                  <span>:</span>
                  <span>{{ data.info_umum.totalMember }} Orang</span>
                </div>
                <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                  <span>Total Asnaf</span>
                  <span>:</span>
                  <span>{{ data.info_umum.totalAsnaf }} Asnaf</span>
                </div>
                <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                  <span>Total Program</span>
                  <span>:</span>
                  <span>{{ data.info_umum.totalProgram }} Program</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              class="bg-gray-200 px-4 mt-8 py-2 border-t border-l border-r border-gray-300 font-medium"
            >
              INFO PROGRAM BANTUAN
            </div>
            <div class="border border-t-0 border-gray-300 divide-y divide-gray-300">
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Program Penyaluran</span>
                <span>:</span>
                <span>{{ data.info_program_bantuan.totalProgramPenyaluran }} Program Bantuan</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerima Bantuan</span>
                <span>:</span>
                <span>{{ data.info_program_bantuan.totalPenerimaBantuan }} Pemohon</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penyaluran Bantuan</span>
                <span>:</span>
                <span>{{ formatRupiah(data.info_program_bantuan.totalPenyaluranBantuan) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-6">
          <!-- Total Penerimaan Zakat -->
          <div>
            <div
              class="bg-gray-200 px-4 py-2 border-t border-l border-r border-gray-300 font-medium"
            >
              TOTAL PENERIMAAN ZAKAT
            </div>
            <div class="border border-t-0 border-gray-300 divide-y divide-gray-300">
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Zakat Hari Ini</span>
                <span>:</span>
                <span>{{
                  formatRupiah(data.total_penerimaan_zakat.totalPenerimaanZakatHariIni)
                }}</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Zakat Bulan Ini</span>
                <span>:</span>
                <span>{{
                  formatRupiah(data.total_penerimaan_zakat.totalPenerimaanZakatBulanIni)
                }}</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Zakat Tahun Ini</span>
                <span>:</span>
                <span>{{
                  formatRupiah(data.total_penerimaan_zakat.totalPenerimaanZakatTahunIni)
                }}</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Zakat</span>
                <span>:</span>
                <span>{{ formatRupiah(data.total_penerimaan_zakat.totalPenerimaanZakat) }}</span>
              </div>
            </div>
          </div>

          <!-- Total Penerimaan Infaq -->
          <div>
            <div
              class="bg-gray-200 mt-8 px-4 py-2 border-t border-l border-r border-gray-300 font-medium"
            >
              TOTAL PENERIMAAN INFAQ
            </div>
            <div class="border border-t-0 border-gray-300 divide-y divide-gray-300">
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Infaq Hari Ini</span>
                <span>:</span>
                <span>{{
                  formatRupiah(data.total_penerimaan_infaq.totalPenerimaanInfaqHariIni)
                }}</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Infaq Bulan Ini</span>
                <span>:</span>
                <span>{{
                  formatRupiah(data.total_penerimaan_infaq.totalPenerimaanInfaqBulanIni)
                }}</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Infaq Tahun Ini</span>
                <span>:</span>
                <span>{{
                  formatRupiah(data.total_penerimaan_infaq.totalPenerimaanInfaqTahunIni)
                }}</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Infaq</span>
                <span>:</span>
                <span>{{ formatRupiah(data.total_penerimaan_infaq.totalPenerimaanInfaq) }}</span>
              </div>
            </div>
          </div>

          <!-- Total Penerimaan Donasi -->
          <div>
            <div
              class="bg-gray-200 mt-8 px-4 py-2 border-t border-l border-r border-gray-300 font-medium"
            >
              TOTAL PENERIMAAN DONASI
            </div>
            <div class="border border-t-0 border-gray-300 divide-y divide-gray-300">
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Donasi Hari Ini</span>
                <span>:</span>
                <span>{{
                  formatRupiah(data.total_penerimaan_donasi.totalPenerimaanDonasiHariIni)
                }}</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Donasi Bulan Ini</span>
                <span>:</span>
                <span>{{
                  formatRupiah(data.total_penerimaan_donasi.totalPenerimaanDonasiBulanIni)
                }}</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Donasi Tahun Ini</span>
                <span>:</span>
                <span>{{
                  formatRupiah(data.total_penerimaan_donasi.totalPenerimaanDonasiTahunIni)
                }}</span>
              </div>
              <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
                <span>Total Penerimaan Donasi</span>
                <span>:</span>
                <span>{{ formatRupiah(data.total_penerimaan_donasi.totalPenerimaanDonasi) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <FooterCetak />
  </div>
</template>

<style scoped>
.print-area {
  max-width: 297mm;
  min-height: 210mm;
  margin: 0 auto;
  padding: 5mm;
  background: white;
}

@media screen {
  body {
    background: #f3f4f6;
  }
  .print-area {
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    margin-top: 20px;
  }
}

@media print {
  @page {
    size: A4 landscape;
    margin: 0 !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body,
  html {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid black !important;
    word-wrap: break-word;
  }

  thead th {
    background: #f3f4f6 !important;
    font-weight: 700 !important;
  }

  tbody tr {
    page-break-inside: avoid !important;
  }

  .bg-gray-100 {
    background: #f3f4f6 !important;
  }
}
</style>

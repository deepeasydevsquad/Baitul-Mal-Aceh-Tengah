<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Logos from '@/components/Logo/Logo.vue';
import { daftar_rekap_distribusi_kecamatan } from '@/service/rekap_distribusi_kecamatan';

const route = useRoute();
const tahun = route.params.tahun as string;

const isLoading = ref(true);

interface DetailBulan {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
  11: number;
}

interface KecamatanData {
  name: string;
  kode: string;
  detail_rupiah: DetailBulan;
  detail_pemohon: DetailBulan;
}

const kecamatanList = ref<Array<{ id: string; data: KecamatanData }>>([]);

const bulanNames = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MEI',
  'JUN',
  'JUL',
  'AGS',
  'SEP',
  'OKT',
  'NOV',
  'DES',
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateTotal(detail: DetailBulan): number {
  return Object.values(detail).reduce((sum, val) => sum + val, 0);
}

function calculateGrandTotalBulan(bulanIndex: number): number {
  let total = 0;
  kecamatanList.value.forEach((item) => {
    total += item.data.detail_rupiah[bulanIndex as keyof DetailBulan] || 0;
  });
  return total;
}

function calculateGrandTotal(): number {
  let total = 0;
  for (let i = 0; i < 12; i++) {
    total += calculateGrandTotalBulan(i);
  }
  return total;
}

async function fetchData() {
  isLoading.value = true;

  try {
    const params = tahun === '0' ? { tahun: '0' } : { tahun: parseInt(tahun) };
    const response = await daftar_rekap_distribusi_kecamatan(params);

    if (response.error || !response.data) {
      console.error('Data tidak ditemukan');
      return;
    }

    const rekapData = response.data.feedBack || {};

    kecamatanList.value = Object.entries(rekapData)
      .map(([id, data]) => ({ id, data: data as KecamatanData }))
      .sort((a, b) => {
        if (a.data.kode === 'KAT') return -1;
        if (b.data.kode === 'KAT') return 1;
        if (a.data.kode === 'INS') return 1;
        if (b.data.kode === 'INS') return -1;
        return a.data.name.localeCompare(b.data.name, 'id');
      });
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
  await nextTick();

  if (kecamatanList.value.length > 0) {
    setTimeout(() => {
      window.print();
    }, 800);
  }
});
</script>

<template>
  <div
    class="bg-white mx-auto font-sans print-area"
    style="color: black; font-size: 7pt; line-height: 1.2"
  >
    <!-- Header dengan Logo -->
    <div class="flex justify-between items-start mb-3 px-4 pt-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900 mb-1">Laporan Rekap Distribusi Per Kecamatan</h1>
        <p class="text-xs text-gray-700">Tahun: {{ tahun === '0' ? 'Semua Tahun' : tahun }}</p>
        <p class="text-xs text-gray-700">
          Tanggal Cetak: {{ new Date().toLocaleDateString('id-ID') }}
        </p>
      </div>
      <div class="flex-shrink-0">
        <Logos />
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-500">Memuat data...</p>
    </div>

    <div v-else-if="kecamatanList.length === 0" class="text-center py-12">
      <p class="text-gray-500">Data tidak tersedia</p>
    </div>

    <div v-else class="px-4 pb-4">
      <div class="border border-gray-300">
        <table class="w-full text-[7pt] border-collapse table-fixed">
          <thead class="bg-gray-100 border-b-2 border-gray-400">
            <tr>
              <th
                rowspan="2"
                class="w-[15%] px-2 py-1 text-left font-semibold text-gray-900 border-r border-gray-300"
              >
                KECAMATAN
              </th>
              <th
                colspan="12"
                class="px-2 py-1 text-center font-semibold text-gray-900 border-r border-gray-300"
              >
                BULAN
              </th>
              <th rowspan="2" class="w-[10%] px-2 py-1 text-center font-semibold text-gray-900">
                JUMLAH
              </th>
            </tr>
            <tr>
              <th
                v-for="bulan in bulanNames"
                :key="bulan"
                class="w-[5.5%] px-1 py-1 text-center font-semibold text-gray-900 border-r border-gray-300"
              >
                {{ bulan }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in kecamatanList" :key="item.id" class="border-b">
              <td class="px-2 py-1 text-left font-medium text-gray-700 border-r border-gray-300">
                {{ item.data.name }}
              </td>
              <td
                v-for="index in 12"
                :key="`rupiah-${index - 1}`"
                class="px-1 py-1 text-right border-r border-gray-300 whitespace-nowrap"
              >
                {{ formatRupiah(item.data.detail_rupiah[(index - 1) as keyof DetailBulan]) }}
              </td>
              <td
                class="px-2 py-1 text-right font-medium bg-gray-50 text-gray-700 whitespace-nowrap"
              >
                {{ formatRupiah(calculateTotal(item.data.detail_rupiah)) }}
              </td>
            </tr>
            <tr class="bg-gray-100 font-bold border-t-2 border-gray-400">
              <td class="px-2 py-1 text-left border-r border-gray-300">TOTAL KESELURUHAN</td>
              <td
                v-for="index in 12"
                :key="`total-${index - 1}`"
                class="px-1 py-1 text-right border-r border-gray-300 whitespace-nowrap"
              >
                {{ formatRupiah(calculateGrandTotalBulan(index - 1)) }}
              </td>
              <td class="px-2 py-1 text-right whitespace-nowrap">
                {{ formatRupiah(calculateGrandTotal()) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen {
  body {
    background-color: #f3f4f6;
  }

  .print-area {
    width: 297mm;
    min-height: 210mm;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    margin: 20px auto;
  }
}

@media print {
  @page {
    size: A4 landscape;
    margin: 8mm;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: white;
    overflow: visible;
  }

  .print-area {
    width: 100%;
    max-width: 100%;
    box-shadow: none;
    margin: 0;
    padding: 0;
    overflow: visible;
  }

  table {
    width: 100% !important;
    table-layout: fixed !important;
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  thead {
    display: table-header-group;
  }

  * {
    overflow: visible !important;
  }

  .border {
    border-radius: 0 !important;
  }
}
</style>

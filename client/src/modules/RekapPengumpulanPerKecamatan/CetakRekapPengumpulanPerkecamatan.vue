<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Logos from '@/components/Logo/Logo.vue';
import { list } from '@/service/rekap_pengumpulan_per_kecamatan';

const route = useRoute();
const tahun = route.params.tahun as string;

const isLoading = ref(true);
const rows = ref<any[]>([]);

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

const months = [
  { key: '01', label: 'JAN' },
  { key: '02', label: 'FEB' },
  { key: '03', label: 'MAR' },
  { key: '04', label: 'APR' },
  { key: '05', label: 'MEI' },
  { key: '06', label: 'JUN' },
  { key: '07', label: 'JUL' },
  { key: '08', label: 'AGS' },
  { key: '09', label: 'SEP' },
  { key: '10', label: 'OKT' },
  { key: '11', label: 'NOV' },
  { key: '12', label: 'DES' },
];

// Format Rupiah yang lebih ringkas dan rapi
function formatRupiah(value: any) {
  const safeValue = Number(value) || 0;

  if (safeValue === 0) return '-';

  // Format dalam Miliar
  if (safeValue >= 1000000000) {
    const miliar = safeValue / 1000000000;
    return miliar.toFixed(2) + ' M';
  }

  // Format dalam Juta
  if (safeValue >= 1000000) {
    const juta = safeValue / 1000000;
    return juta.toFixed(2) + ' Jt';
  }

  // Format dalam Ribu
  if (safeValue >= 1000) {
    const ribu = safeValue / 1000;
    return ribu.toFixed(0) + ' Rb';
  }

  return safeValue.toLocaleString('id-ID');
}

async function fetchData() {
  isLoading.value = true;

  try {
    const yearParam = tahun === '0' ? 0 : parseInt(tahun);
    const res = await list({ year: yearParam || new Date().getFullYear() });
    const data = res.data || [];

    if (!data.length) {
      console.error('Data tidak ditemukan');
      return;
    }

    const groupedByKecamatan = data.reduce((acc, item) => {
      if (!acc[item.nama_kecamatan]) {
        acc[item.nama_kecamatan] = {
          nama_kecamatan: item.nama_kecamatan,
          year: item.year,
          monthly: {},
          total: 0,
        };
      }
      acc[item.nama_kecamatan].monthly[item.month] = item.total_semua || 0;
      acc[item.nama_kecamatan].total += item.total_semua || 0;
      return acc;
    }, {});

    rows.value = Object.values(groupedByKecamatan);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
  await nextTick();

  if (rows.value.length > 0) {
    setTimeout(() => {
      window.print();
    }, 800);
  }
});
</script>

<template>
  <div
    class="bg-white mx-auto font-sans print-area"
    style="color: black; font-size: 6.5pt; line-height: 1.15"
  >
    <!-- Header dengan Logo -->
    <div class="flex justify-between items-start mb-2 px-3 pt-3">
      <div>
        <h1 class="text-lg font-bold text-gray-900 mb-1">
          Laporan Rekap Pengumpulan Per Kecamatan
        </h1>
        <p class="text-[9pt] text-gray-700">Tahun: {{ tahun === '0' ? 'Semua Tahun' : tahun }}</p>
        <p class="text-[9pt] text-gray-700">
          Tanggal Cetak: {{ new Date().toLocaleDateString('id-ID') }}
        </p>
        <p class="text-[8pt] text-gray-600 italic mt-1">
          *Keterangan: M = Miliar, Jt = Juta, Rb = Ribu
        </p>
      </div>
      <div class="flex-shrink-0">
        <Logos />
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-500">Memuat data...</p>
    </div>

    <div v-else-if="rows.length === 0" class="text-center py-12">
      <p class="text-gray-500">Data tidak tersedia</p>
    </div>

    <div v-else class="px-3 pb-3">
      <div class="border border-gray-300">
        <table class="w-full text-[6.5pt] border-collapse table-fixed">
          <thead class="bg-gray-100 border-b-2 border-gray-400">
            <tr>
              <th
                rowspan="2"
                class="w-[14%] px-1.5 py-1 text-left font-semibold text-gray-900 border-r border-gray-300"
              >
                KECAMATAN
              </th>
              <th
                colspan="12"
                class="px-1 py-1 text-center font-semibold text-gray-900 border-r border-gray-300"
              >
                BULAN
              </th>
              <th rowspan="2" class="w-[9%] px-1 py-1 text-center font-semibold text-gray-900">
                JUMLAH
              </th>
            </tr>
            <tr>
              <th
                v-for="bulan in bulanNames"
                :key="bulan"
                class="w-[5.8%] px-0.5 py-1 text-center font-semibold text-gray-900 border-r border-gray-300"
              >
                {{ bulan }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="r in rows" :key="r.nama_kecamatan" class="border-b">
              <td
                class="px-1.5 py-0.5 text-left font-medium text-gray-700 border-r border-gray-300 leading-tight"
              >
                {{ r.nama_kecamatan }}
              </td>
              <td
                v-for="m in months"
                :key="m.key"
                class="px-0.5 py-0.5 text-right border-r border-gray-300 leading-tight"
              >
                {{ formatRupiah(r.monthly[m.key] ?? 0) }}
              </td>
              <td
                class="px-1 py-0.5 text-right font-semibold bg-gray-50 text-gray-700 leading-tight"
              >
                {{ formatRupiah(r.total ?? 0) }}
              </td>
            </tr>
            <tr class="bg-gray-100 font-bold border-t-2 border-gray-400">
              <td class="px-1.5 py-0.5 text-left border-r border-gray-300">Total</td>
              <td
                v-for="m in months"
                :key="m.key"
                class="px-0.5 py-0.5 text-right border-r border-gray-300 leading-tight"
              >
                {{ formatRupiah(rows.reduce((acc, curr) => acc + (curr.monthly[m.key] || 0), 0)) }}
              </td>
              <td class="px-1 py-0.5 text-right leading-tight">
                {{ formatRupiah(rows.reduce((acc, curr) => acc + (curr.total || 0), 0)) }}
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
    margin: 6mm;
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

  td,
  th {
    overflow: hidden;
    text-overflow: clip;
    word-wrap: break-word;
  }

  * {
    overflow: visible !important;
  }

  .border {
    border-radius: 0 !important;
  }
}
</style>

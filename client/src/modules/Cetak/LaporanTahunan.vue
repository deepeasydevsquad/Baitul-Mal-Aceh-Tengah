<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import VueApexCharts from 'vue3-apexcharts';
import Logos from '@/components/Logo/Logo.vue';
import { get_laporan_tahunan } from '@/service/laporan_tahunan';

const route = useRoute();
const tahun = route.params.tahun;

// State Data
interface Pengumpulan {
  zakat: string;
  infaq: string;
  donasi: string;
  total: string;
}

interface Distribusi {
  zakat: string;
  infaq: string;
  total: string;
}

interface Data {
  tahun: string;
  pengumpulan: Pengumpulan;
  distribusi: Distribusi;
}

const datas = ref<Data[]>([]);
const totalPengumpulan = ref(0);
const totalDistribusi = ref(0);
const persentase = ref(0);

// Chart State
const seriesPengumpulan = ref<any[]>([]);
const seriesDistribusi = ref<any[]>([]);
const chartOptionsPengumpulan = ref<any>({});
const chartOptionsDistribusi = ref<any>({});

// Helper format angka jadi Miliar
const formatMiliar = (val: number) => {
  if (val >= 1000000000) {
    return (val / 1000000000).toFixed(2) + ' M';
  } else if (val >= 1000000) {
    return (val / 1000000).toFixed(0) + ' JT';
  }
  return val.toString();
};

// Helper format Rupiah detail
const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

// Function: Fetch Data
async function fetchData() {
  try {
    const response = await get_laporan_tahunan({
      search: tahun || '',
      perpage: 100,
      pageNumber: 1,
    });

    datas.value = response.data;

    // Hitung total
    totalPengumpulan.value = datas.value.reduce((acc, d) => acc + Number(d.pengumpulan.total), 0);
    totalDistribusi.value = datas.value.reduce((acc, d) => acc + Number(d.distribusi.total), 0);
    persentase.value =
      totalPengumpulan.value > 0 ? (totalDistribusi.value / totalPengumpulan.value) * 100 : 0;

    // Chart Pengumpulan
    seriesPengumpulan.value = [
      { name: 'Zakat', data: datas.value.map((d) => Number(d.pengumpulan.zakat)) },
      { name: 'Infaq', data: datas.value.map((d) => Number(d.pengumpulan.infaq)) },
      { name: 'Donasi', data: datas.value.map((d) => Number(d.pengumpulan.donasi)) },
    ];

    // Chart Distribusi
    seriesDistribusi.value = [
      { name: 'Zakat', data: datas.value.map((d) => Number(d.distribusi.zakat)) },
      { name: 'Infaq', data: datas.value.map((d) => Number(d.distribusi.infaq)) },
    ];

    // Options Chart
    const baseOptions = {
      chart: {
        type: 'bar',
        foreColor: '#000',
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 6,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: datas.value.map((d) => d.tahun),
        title: {
          text: 'Tahun',
          style: { color: '#000' },
        },
        labels: {
          style: {
            colors: Array(datas.value.length).fill('#000'),
            fontSize: '11px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Nominal (Rp)',
          style: { color: '#000' },
        },
        labels: {
          formatter: (val: number) => formatMiliar(val),
          style: {
            colors: ['#000'],
            fontSize: '11px',
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        labels: {
          colors: ['#000'],
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => formatRupiah(val),
        },
      },
    };

    chartOptionsPengumpulan.value = {
      ...baseOptions,
      title: { text: 'Pengumpulan per Tahun', style: { color: '#000' } },
    };
    chartOptionsDistribusi.value = {
      ...baseOptions,
      title: { text: 'Distribusi per Tahun', style: { color: '#000' } },
    };
  } catch (error) {
    console.error('❌ Gagal mengambil data laporan tahunan:', error);
  }
}

onMounted(async () => {
  try {
    await fetchData();
    await nextTick();

    if (datas.value.length > 0) {
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      console.warn('❗ Data kosong atau tidak valid');
    }
  } catch (error) {
    console.error('❌ Error saat mounting:', error);
  }
});
</script>

<template>
  <div
    class="bg-white max-w-[210mm] mx-auto p-[15mm] font-sans print:p-[10mm] print:m-0 print:shadow-none print-area"
    style="color: black; font-size: 10pt; line-height: 1.4"
  >
    <!-- Header dengan Logo -->
    <div class="flex justify-between items-start mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Laporan Tahunan</h1>
        <p class="text-sm text-gray-600">Periode: {{ tahun }}</p>
      </div>
      <div class="flex-shrink-0">
        <Logos />
      </div>
    </div>

    <!-- Ringkasan -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="p-3 rounded-lg bg-green-50 text-center border border-green-200">
        <h3 class="font-semibold text-gray-700 text-sm mb-1">Total Pengumpulan</h3>
        <p class="text-base font-bold text-gray-900">{{ formatRupiah(totalPengumpulan) }}</p>
      </div>
      <div class="p-3 rounded-lg bg-blue-50 text-center border border-blue-200">
        <h3 class="font-semibold text-gray-700 text-sm mb-1">Total Distribusi</h3>
        <p class="text-base font-bold text-gray-900">{{ formatRupiah(totalDistribusi) }}</p>
      </div>
      <div class="p-3 rounded-lg bg-yellow-50 text-center border border-yellow-200">
        <h3 class="font-semibold text-gray-700 text-sm mb-1">Persentase Distribusi</h3>
        <p class="text-base font-bold text-gray-900">{{ persentase.toFixed(2) }} %</p>
      </div>
    </div>

    <!-- Tabel Data -->
    <div class="mb-6 overflow-hidden border border-gray-300 rounded-lg">
      <table class="w-full border-collapse bg-white text-xs">
        <thead class="bg-gray-100 text-gray-900 text-center border-b-2 border-gray-400">
          <tr>
            <th rowspan="2" class="px-3 py-2 font-bold align-middle border-r border-gray-300">
              Tahun
            </th>
            <th colspan="4" class="px-3 py-2 font-bold border-r border-gray-300">Pengumpulan</th>
            <th colspan="3" class="px-3 py-2 font-bold">Distribusi</th>
          </tr>
          <tr>
            <th class="px-2 py-2 font-semibold border-r border-gray-300">Zakat</th>
            <th class="px-2 py-2 font-semibold border-r border-gray-300">Infaq</th>
            <th class="px-2 py-2 font-semibold border-r border-gray-300">Donasi</th>
            <th class="px-2 py-2 font-semibold border-r border-gray-300">Total</th>
            <th class="px-2 py-2 font-semibold border-r border-gray-300">Zakat</th>
            <th class="px-2 py-2 font-semibold border-r border-gray-300">Infaq</th>
            <th class="px-2 py-2 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(data, index) in datas" :key="index" class="text-center">
            <td class="px-3 py-2 font-semibold text-gray-900 border-r border-gray-300">
              {{ data.tahun }}
            </td>
            <td class="px-2 py-2 text-gray-700 border-r border-gray-300">
              {{ formatRupiah(Number(data.pengumpulan.zakat)) }}
            </td>
            <td class="px-2 py-2 text-gray-700 border-r border-gray-300">
              {{ formatRupiah(Number(data.pengumpulan.infaq)) }}
            </td>
            <td class="px-2 py-2 text-gray-700 border-r border-gray-300">
              {{ formatRupiah(Number(data.pengumpulan.donasi)) }}
            </td>
            <td class="px-2 py-2 font-bold text-gray-900 border-r border-gray-300">
              {{ formatRupiah(Number(data.pengumpulan.total)) }}
            </td>
            <td class="px-2 py-2 text-gray-700 border-r border-gray-300">
              {{ formatRupiah(Number(data.distribusi.zakat)) }}
            </td>
            <td class="px-2 py-2 text-gray-700 border-r border-gray-300">
              {{ formatRupiah(Number(data.distribusi.infaq)) }}
            </td>
            <td class="px-2 py-2 font-bold text-gray-900">
              {{ formatRupiah(Number(data.distribusi.total)) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Chart -->
    <div class="grid grid-cols-2 gap-4 page-break-avoid">
      <div class="p-3 rounded-lg border border-gray-300 bg-white">
        <h3 class="font-bold text-sm mb-2 text-gray-900">Grafik Pengumpulan</h3>
        <VueApexCharts
          type="bar"
          height="280"
          :options="chartOptionsPengumpulan"
          :series="seriesPengumpulan"
        />
      </div>
      <div class="p-3 rounded-lg border border-gray-300 bg-white">
        <h3 class="font-bold text-sm mb-2 text-gray-900">Grafik Distribusi</h3>
        <VueApexCharts
          type="bar"
          height="280"
          :options="chartOptionsDistribusi"
          :series="seriesDistribusi"
        />
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
    width: 210mm;
    min-height: 297mm;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    margin: 20px auto;
  }
}

@media print {
  @page {
    size: A4;
    margin: 15mm;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: white;
  }

  .print-area {
    width: 210mm;
    box-shadow: none;
    margin: 0;
    padding: 0;
  }

  .page-break-avoid {
    page-break-inside: avoid;
  }
}

:deep(.apexcharts-text),
:deep(.apexcharts-legend-text),
:deep(.apexcharts-xaxis-label),
:deep(.apexcharts-yaxis-label),
:deep(.apexcharts-title-text) {
  fill: #000 !important;
  color: #000 !important;
  font-size: 11px !important;
}
</style>

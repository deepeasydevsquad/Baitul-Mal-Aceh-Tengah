<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import VueApexCharts from 'vue3-apexcharts';
import Logos from '@/components/Logo/Logo.vue';
import { get_laporan_pengumpulan } from '@/service/laporan_pengumpulan';

const route = useRoute();
const tahun = parseInt(route.params.tahun as string);

interface DataPerJenis {
  jenis: string;
  target: number;
  realisasi: number;
  persentase: number;
}

interface Data {
  tahun: number;
  dataPerJenis: DataPerJenis[];
  totalTarget: number;
  totalRealisasi: number;
  persentaseTotal: number;
}

const data = ref<Data | null>(null);

// Chart
const series = ref<any[]>([]);
const chartOptions = ref<any>({});
const zakatChart = ref<any>({});
const infakChart = ref<any>({});
const donasiChart = ref<any>({});

// Helper format
const formatMiliar = (val: number) => {
  if (val >= 1000000) return (val / 1000000).toFixed(0) + ' jt';
  return val.toLocaleString('id-ID');
};

const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val);

async function fetchData() {
  try {
    const response = await get_laporan_pengumpulan({ tahun });

    data.value = Array.isArray(response) ? response[0] : response;

    console.log('Data laporan pengumpulan:', data.value);

    if (data.value) {
      setupCharts();
    }
  } catch (error) {
    console.error('❌ Error fetching data:', error);
  }
}

function setupCharts() {
  if (!data.value || !data.value.dataPerJenis) {
    return;
  }

  const monthLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  const getMonthlyDistribution = (totalRealisasi: number) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    if (data.value!.tahun === currentYear) {
      return Array.from({ length: 12 }, (_, i) =>
        i <= currentMonth ? totalRealisasi / (currentMonth + 1) : 0,
      );
    } else if (data.value!.tahun < currentYear) {
      return Array.from({ length: 12 }, () => totalRealisasi / 12);
    } else {
      return Array(12).fill(0);
    }
  };

  const zakatData = data.value.dataPerJenis.find((j) => j.jenis === 'Zakat');
  const infaqData = data.value.dataPerJenis.find((j) => j.jenis === 'Infaq');
  const donasiData = data.value.dataPerJenis.find((j) => j.jenis === 'Donasi');

  // Bar Chart (Stacked)
  series.value = [
    {
      name: 'Zakat',
      data: zakatData ? getMonthlyDistribution(zakatData.realisasi) : Array(12).fill(0),
    },
    {
      name: 'Infaq',
      data: infaqData ? getMonthlyDistribution(infaqData.realisasi) : Array(12).fill(0),
    },
    {
      name: 'Donasi',
      data: donasiData ? getMonthlyDistribution(donasiData.realisasi) : Array(12).fill(0),
    },
  ];

  chartOptions.value = {
    chart: { type: 'bar', stacked: true, toolbar: { show: false }, foreColor: '#000' },
    plotOptions: { bar: { horizontal: false, borderRadius: 4, columnWidth: '60%' } },
    xaxis: {
      categories: monthLabels,
      labels: { style: { colors: '#000', fontSize: '10px' } },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatMiliar(val),
        style: { colors: '#000', fontSize: '10px' },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '10px',
      labels: { colors: '#000' },
    },
    tooltip: { y: { formatter: (val: number) => formatRupiah(val) } },
    colors: ['#3b82f6', '#06b6d4', '#ef4444'],
    dataLabels: { enabled: false },
  };

  // Line Charts
  const makeLineChart = (title: string, jenisData: DataPerJenis | undefined) => {
    if (!jenisData) {
      return { series: [], options: {} };
    }

    const targetPerMonth = jenisData.target / 12;
    const realisasiPerMonth = jenisData.realisasi / 12;

    const targetData = Array.from({ length: 12 }, () => targetPerMonth);
    const targetSD = Array.from({ length: 12 }, (_, i) => targetPerMonth * (i + 1));
    const realisasiData = Array.from({ length: 12 }, () => realisasiPerMonth);
    const realisasiSD = Array.from({ length: 12 }, (_, i) => realisasiPerMonth * (i + 1));

    return {
      series: [
        { name: 'Target', data: targetData },
        { name: 'Target s.d', data: targetSD },
        { name: 'Realisasi', data: realisasiData },
        { name: 'Realisasi s.d', data: realisasiSD },
      ],
      options: {
        chart: { type: 'line', toolbar: { show: false }, height: 240 },
        stroke: { curve: 'smooth', width: [2, 2, 2, 2] },
        xaxis: {
          categories: monthLabels,
          labels: { style: { colors: '#000', fontSize: '9px' } },
        },
        yaxis: {
          labels: {
            formatter: (val: number) => formatMiliar(val),
            style: { colors: '#000', fontSize: '9px' },
          },
        },
        legend: {
          position: 'top',
          fontSize: '9px',
          labels: { colors: '#000' },
        },
        title: {
          text: title,
          align: 'left',
          style: { color: '#000', fontSize: '11px', fontWeight: '600' },
        },
        colors: ['#94a3b8', '#cbd5e1', '#f87171', '#fb923c'],
        dataLabels: { enabled: false },
        tooltip: { y: { formatter: (val: number) => formatRupiah(val) } },
      },
    };
  };

  zakatChart.value = makeLineChart('Pengumpulan Zakat: Target vs Realisasi', zakatData);
  infakChart.value = makeLineChart('Pengumpulan Infaq: Target vs Realisasi', infaqData);
  donasiChart.value = makeLineChart('Pengumpulan Donasi: Target vs Realisasi', donasiData);
}

onMounted(async () => {
  try {
    await fetchData();
    await nextTick();

    if (data.value) {
      setTimeout(() => {
        window.print();
      }, 800);
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
    class="bg-white max-w-[210mm] mx-auto p-[12mm] font-sans print:p-[10mm] print:m-0 print:shadow-none print-area"
    style="color: black; font-size: 9pt; line-height: 1.3"
  >
    <!-- Header dengan Logo -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Laporan Pengumpulan</h1>
        <p class="text-sm text-gray-700">Tahun: {{ tahun }}</p>
      </div>
      <div class="flex-shrink-0">
        <Logos />
      </div>
    </div>

    <!-- Ringkasan Cards -->
    <div v-if="data" class="grid grid-cols-4 gap-3 mb-4">
      <div class="p-2 rounded-lg bg-blue-50 text-center border border-blue-200">
        <h3 class="text-xs font-semibold text-gray-700 mb-1">Total</h3>
        <p class="text-sm font-bold text-gray-900">{{ formatRupiah(data.totalRealisasi) }}</p>
      </div>
      <div class="p-2 rounded-lg bg-green-50 text-center border border-green-200">
        <h3 class="text-xs font-semibold text-gray-700 mb-1">Target</h3>
        <p class="text-sm font-bold text-gray-900">{{ formatRupiah(data.totalTarget) }}</p>
      </div>
      <div class="p-2 rounded-lg bg-yellow-50 text-center border border-yellow-200">
        <h3 class="text-xs font-semibold text-gray-700 mb-1">Realisasi</h3>
        <p class="text-sm font-bold text-gray-900">{{ formatRupiah(data.totalRealisasi) }}</p>
      </div>
      <div class="p-2 rounded-lg bg-purple-50 text-center border border-purple-200">
        <h3 class="text-xs font-semibold text-gray-700 mb-1">Persentase</h3>
        <p class="text-sm font-bold text-gray-900">{{ (data.persentaseTotal ?? 0).toFixed(2) }}%</p>
      </div>
    </div>

    <!-- Charts Grid - Baris 1 -->
    <div v-if="data" class="grid grid-cols-2 gap-3 mb-3">
      <!-- Zakat Chart -->
      <div class="p-2 rounded-lg border border-gray-300 bg-white">
        <VueApexCharts
          v-if="zakatChart.series && zakatChart.series.length > 0"
          :options="zakatChart.options"
          :series="zakatChart.series"
          height="240"
        />
      </div>

      <!-- Bar Chart Pengumpulan per Bulan -->
      <div class="p-2 rounded-lg border border-gray-300 bg-white">
        <h3 class="text-xs font-bold text-gray-900 mb-1">Pengumpulan per Bulan</h3>
        <VueApexCharts
          v-if="series.length > 0"
          type="bar"
          height="240"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>

    <!-- Charts Grid - Baris 2 -->
    <div v-if="data" class="grid grid-cols-2 gap-3 mb-3">
      <!-- Infaq Chart -->
      <div class="p-2 rounded-lg border border-gray-300 bg-white">
        <VueApexCharts
          v-if="infakChart.series && infakChart.series.length > 0"
          :options="infakChart.options"
          :series="infakChart.series"
          height="240"
        />
      </div>

      <!-- Tabel Target dan Capaian -->
      <div class="p-2 rounded-lg border border-gray-300 bg-white">
        <h3 class="text-xs font-bold text-gray-900 mb-2">Target dan Capaian</h3>
        <table class="w-full text-[8pt] border-collapse">
          <thead class="bg-gray-100 border-b-2 border-gray-400">
            <tr>
              <th class="text-left py-1 px-2 font-semibold text-gray-900 border-r border-gray-300">
                Kategori
              </th>
              <th class="text-right py-1 px-2 font-semibold text-gray-900 border-r border-gray-300">
                Target
              </th>
              <th class="text-right py-1 px-2 font-semibold text-gray-900 border-r border-gray-300">
                Realisasi
              </th>
              <th class="text-right py-1 px-2 font-semibold text-gray-900">(%)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="jenis in data.dataPerJenis" :key="jenis.jenis" class="border-b">
              <td class="py-1 px-2 border-r border-gray-300">{{ jenis.jenis }}</td>
              <td class="py-1 px-2 text-right border-r border-gray-300">
                {{ formatRupiah(jenis.target) }}
              </td>
              <td class="py-1 px-2 text-right border-r border-gray-300">
                {{ formatRupiah(jenis.realisasi) }}
              </td>
              <td class="py-1 px-2 text-right">{{ (jenis.persentase ?? 0).toFixed(2) }}%</td>
            </tr>
            <tr class="bg-gray-100 font-bold border-t-2 border-gray-400">
              <td class="py-1 px-2 border-r border-gray-300">Total</td>
              <td class="py-1 px-2 text-right border-r border-gray-300">
                {{ formatRupiah(data.totalTarget) }}
              </td>
              <td class="py-1 px-2 text-right border-r border-gray-300">
                {{ formatRupiah(data.totalRealisasi) }}
              </td>
              <td class="py-1 px-2 text-right">{{ (data.persentaseTotal ?? 0).toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Charts Grid - Baris 3 -->
    <div v-if="data" class="grid grid-cols-2 gap-3">
      <!-- Donasi Chart -->
      <div class="p-2 rounded-lg border border-gray-300 bg-white">
        <VueApexCharts
          v-if="donasiChart.series && donasiChart.series.length > 0"
          :options="donasiChart.options"
          :series="donasiChart.series"
          height="240"
        />
      </div>

      <!-- Tabel Komposisi Sumber Dana -->
      <div class="p-2 rounded-lg border border-gray-300 bg-white">
        <h3 class="text-xs font-bold text-gray-900 mb-2">Komposisi Sumber Dana</h3>
        <table class="w-full text-[8pt] border-collapse">
          <thead class="bg-gray-100 border-b-2 border-gray-400">
            <tr>
              <th class="text-left py-1 px-2 font-semibold text-gray-900 border-r border-gray-300">
                Kategori
              </th>
              <th class="text-right py-1 px-2 font-semibold text-gray-900 border-r border-gray-300">
                Rek Penampung
              </th>
              <th class="text-right py-1 px-2 font-semibold text-gray-900">Rek Kasda</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="jenis in data.dataPerJenis" :key="jenis.jenis" class="border-b">
              <td class="py-1 px-2 border-r border-gray-300">{{ jenis.jenis }}</td>
              <td class="py-1 px-2 text-right border-r border-gray-300">
                {{ formatRupiah(jenis.realisasi * 0.6) }}
              </td>
              <td class="py-1 px-2 text-right">{{ formatRupiah(jenis.realisasi * 0.4) }}</td>
            </tr>
            <tr class="bg-gray-100 font-bold border-t-2 border-gray-400">
              <td class="py-1 px-2 border-r border-gray-300">Total keseluruhan</td>
              <td class="py-1 px-2 text-right border-r border-gray-300">
                {{ formatRupiah(data.totalRealisasi * 0.6) }}
              </td>
              <td class="py-1 px-2 text-right">
                {{ formatRupiah(data.totalRealisasi * 0.4) }}
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
    width: 210mm;
    min-height: 297mm;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    margin: 20px auto;
  }
}

@media print {
  @page {
    size: A4 landscape;
    margin: 12mm;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: white;
  }

  .print-area {
    width: 277mm;
    box-shadow: none;
    margin: 0;
    padding: 0;
  }
}

:deep(.apexcharts-text),
:deep(.apexcharts-legend-text),
:deep(.apexcharts-xaxis-label),
:deep(.apexcharts-yaxis-label),
:deep(.apexcharts-title-text) {
  fill: #000 !important;
  color: #000 !important;
}
</style>

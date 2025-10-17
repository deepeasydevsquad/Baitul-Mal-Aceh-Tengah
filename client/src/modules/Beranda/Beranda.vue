<script setup lang="ts">
// Library
import { ref, onMounted, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import Notification from '@/components/Modal/Notification.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';
import Logo from '@/components/Logo/Logo.vue';

// Composable
import { useNotification } from '@/composables/useNotification';

// Service API
import { get_beranda } from '@/service/beranda';

// State
const isLoading = ref(false);
const isTableLoading = ref(false);

// Notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

// Data state
interface Item {
  target_pengumpulan: number;
  realisasi_pengumpulan: number;
  persentase_pengumpulan: number;
  target_distribusi: number;
  realisasi_distribusi: number;
  persentase_distribusi: number;
}

interface ApiData {
  infaq: Item;
  zakat: Item;
  donasi: Item;
}

const apiData = ref<ApiData | null>(null);

// Tahun filter
// Tahun filter
const tahun = ref<string>(new Date().getFullYear().toString());

// bikin array 5 tahun terakhir termasuk tahun sekarang
const tahunOptions = ref<number[]>(
  Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i),
);

// Helper
const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

// Total ringkasan
const totalPengumpulan = computed(() => {
  if (!apiData.value) return 0;
  return (
    apiData.value.infaq.realisasi_pengumpulan +
    apiData.value.zakat.realisasi_pengumpulan +
    apiData.value.donasi.realisasi_pengumpulan
  );
});

const totalDistribusi = computed(() => {
  if (!apiData.value) return 0;
  return (
    apiData.value.infaq.realisasi_distribusi +
    apiData.value.zakat.realisasi_distribusi +
    apiData.value.donasi.realisasi_distribusi
  );
});

const persentase = computed(() =>
  totalPengumpulan.value > 0 ? (totalDistribusi.value / totalPengumpulan.value) * 100 : 0,
);

// Chart
const seriesPengumpulan = ref<any[]>([]);
const seriesDistribusi = ref<any[]>([]);
const chartOptionsPengumpulan = ref<any>({});
const chartOptionsDistribusi = ref<any>({});

// Fetch API
async function fetchData() {
  console.log('xxx');
  console.log('Beranda');
  console.log('xxx');
  isTableLoading.value = true;
  try {
    const response = await get_beranda({ tahun: tahun.value });
    const resData = response;

    if (!resData) {
      apiData.value = null;
      return;
    }

    apiData.value = {
      infaq: resData.infaq,
      zakat: resData.zakat,
      donasi: resData.donasi,
    };

    // Chart Pengumpulan → line
    seriesPengumpulan.value = [
      {
        name: 'Total Pengumpulan',
        data: [0, totalPengumpulan.value], // dari 0 ke total
      },
    ];

    chartOptionsPengumpulan.value = {
      chart: { type: 'line', height: 200, foreColor: '#000', toolbar: { show: true } },
      stroke: { curve: 'smooth', width: 3 }, // bikin garis smooth
      markers: { size: 5 },
      xaxis: { categories: ['Start', 'Total'] }, // label 2 titik
      yaxis: { labels: { formatter: (val: number) => formatRupiah(val) } },
      tooltip: { y: { formatter: (val: number) => formatRupiah(val) } },
      dataLabels: { enabled: false },
      title: { text: 'Pengumpulan', align: 'left' },
    };

    // Chart Distribusi → bar
    seriesDistribusi.value = [
      { name: 'Zakat', data: [apiData.value.zakat.realisasi_distribusi] },
      { name: 'Infaq', data: [apiData.value.infaq.realisasi_distribusi] },
      { name: 'Donasi', data: [apiData.value.donasi.realisasi_distribusi] },
    ];

    chartOptionsDistribusi.value = {
      chart: { type: 'bar', foreColor: '#000', toolbar: { show: true } },
      plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 6 } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Tahun ' + tahun.value] },
      yaxis: { labels: { formatter: (val: number) => formatRupiah(val) } },
      tooltip: { y: { formatter: (val: number) => formatRupiah(val) } },
      title: { text: 'Distribusi', align: 'left' },
    };
  } catch (err) {
    console.error(err);
    displayNotification('Gagal mengambil data laporan tahunan', 'error');
  } finally {
    isTableLoading.value = false;
  }
}

onMounted(fetchData);
</script>

<template>
  <div class="mx-auto p-4">
    <Logo />
    <LoadingSpinner v-if="isLoading" label="Memuat halaman..." />

    <div v-else class="space-y-4">
      <!-- Tahun filter -->
      <div class="flex items-center gap-4 mb-4">
        <label for="tahun" class="font-medium text-gray-700">Pilih Tahun:</label>
        <select
          id="tahun"
          v-model="tahun"
          @change="fetchData"
          class="border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-300"
        >
          <option v-for="t in tahunOptions" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <!-- Ringkasan total -->
      <div class="grid grid-cols-3 gap-4 my-6">
        <div class="p-4 rounded-xl bg-green-50 text-center shadow">
          <h3 class="font-semibold text-gray-700">Total Pengumpulan</h3>
          <p class="text-lg font-bold text-gray-900">{{ formatRupiah(totalPengumpulan) }}</p>
        </div>
        <div class="p-4 rounded-xl bg-blue-50 text-center shadow">
          <h3 class="font-semibold text-gray-700">Total Distribusi</h3>
          <p class="text-lg font-bold text-gray-900">{{ formatRupiah(totalDistribusi) }}</p>
        </div>
        <div class="p-4 rounded-xl bg-yellow-50 text-center shadow">
          <h3 class="font-semibold text-gray-700">Persentase</h3>
          <p class="text-lg font-bold text-gray-900">{{ persentase.toFixed(2) }} %</p>
        </div>
      </div>

      <!-- Chart -->
      <div class="grid grid-cols-2 gap-4 mt-6">
        <div class="p-2 rounded-xl border shadow bg-white">
          <VueApexCharts
            type="line"
            height="200"
            :options="chartOptionsPengumpulan"
            :series="seriesPengumpulan"
          />
        </div>
        <div class="p-2 rounded-xl border shadow bg-white">
          <VueApexCharts
            type="bar"
            height="200"
            :options="chartOptionsDistribusi"
            :series="seriesDistribusi"
          />
        </div>
      </div>

      <!-- Tabel -->
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow mt-6">
        <LoadingSpinner v-if="isTableLoading" label="Memuat data..." />

        <table
          v-else
          class="w-full border-collapse bg-white text-sm text-center shadow-md rounded-lg overflow-hidden"
        >
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-4 py-3">Kategori</th>
              <th class="px-4 py-3">Target Pengumpulan</th>
              <th class="px-4 py-3">Realisasi Pengumpulan</th>
              <th class="px-4 py-3">Capaian</th>
              <th class="px-4 py-3">Target Distribusi</th>
              <th class="px-4 py-3">Realisasi Distribusi</th>
              <th class="px-4 py-3">Capaian</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="apiData" class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-4 py-2 font-medium text-left">Infaq</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.infaq.target_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.infaq.realisasi_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ apiData.infaq.persentase_pengumpulan.toFixed(2) }}%</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.infaq.target_distribusi) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.infaq.realisasi_distribusi) }}</td>
              <td class="px-4 py-2">{{ apiData.infaq.persentase_distribusi.toFixed(2) }}%</td>
            </tr>
            <tr v-if="apiData" class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-4 py-2 font-medium text-left">Zakat</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.zakat.target_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.zakat.realisasi_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ apiData.zakat.persentase_pengumpulan.toFixed(2) }}%</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.zakat.target_distribusi) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.zakat.realisasi_distribusi) }}</td>
              <td class="px-4 py-2">{{ apiData.zakat.persentase_distribusi.toFixed(2) }}%</td>
            </tr>
            <tr v-if="apiData" class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-4 py-2 font-medium text-left">Donasi</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.donasi.target_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.donasi.realisasi_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ apiData.donasi.persentase_pengumpulan.toFixed(2) }}%</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.donasi.target_distribusi) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.donasi.realisasi_distribusi) }}</td>
              <td class="px-4 py-2">{{ apiData.donasi.persentase_distribusi.toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Notification -->
      <Notification
        :showNotification="showNotification"
        :notificationType="notificationType"
        :notificationMessage="notificationMessage"
        @close="showNotification = false"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.apexcharts-text),
:deep(.apexcharts-legend-text),
:deep(.apexcharts-xaxis-label),
:deep(.apexcharts-yaxis-label) {
  fill: #000 !important;
  color: #000 !important;
  font-size: 12px !important;
}
</style>

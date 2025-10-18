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

interface PengumpulanBulanan {
  bulan: number;
  total: number;
}

interface PengumpulanTahunan {
  tahun: number;
  total: number;
}

interface ApiData {
  infaq: Item;
  zakat: Item;
  donasi: Item;
  pengumpulan: {
    totalGabungan?: PengumpulanBulanan[];
    totalPerTahun?: PengumpulanTahunan[];
  };
}

const apiData = ref<ApiData | null>(null);

// Tahun filter
const tahun = ref<string>('0');

// bikin array 5 tahun terakhir termasuk tahun sekarang
const tahunOptions = ref<number[]>(
  Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i),
);

// Helper
const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

// Cek apakah sedang lihat semua tahun
const isSemuaTahun = computed(() => tahun.value === '0');

// Total ringkasan
const totalPengumpulan = computed(() => {
  if (!apiData.value) return 0;
  return (
    (apiData.value.infaq?.realisasi_pengumpulan || 0) +
    (apiData.value.zakat?.realisasi_pengumpulan || 0) +
    (apiData.value.donasi?.realisasi_pengumpulan || 0)
  );
});

const totalDistribusi = computed(() => {
  if (!apiData.value) return 0;
  return (
    (apiData.value.infaq?.realisasi_distribusi || 0) +
    (apiData.value.zakat?.realisasi_distribusi || 0) +
    (apiData.value.donasi?.realisasi_distribusi || 0)
  );
});

const persentase = computed(() => {
  const pengumpulan = totalPengumpulan.value;
  const distribusi = totalDistribusi.value;
  if (!pengumpulan || pengumpulan === 0) return 0;
  return (distribusi / pengumpulan) * 100;
});

const totalTarget = computed(() => {
  if (!apiData.value) return 0;
  return (
    (apiData.value.infaq?.target_pengumpulan || 0) +
    (apiData.value.zakat?.target_pengumpulan || 0) +
    (apiData.value.donasi?.target_pengumpulan || 0)
  );
});

const totalTargetDistribusi = computed(() => {
  if (!apiData.value) return 0;
  return (
    (apiData.value.infaq?.target_distribusi || 0) +
    (apiData.value.zakat?.target_distribusi || 0) +
    (apiData.value.donasi?.target_distribusi || 0)
  );
});

const persentaseCapaianPengumpulan = computed(() => {
  const target = totalTarget.value;
  const realisasi = totalPengumpulan.value;
  if (!target || target === 0) return 0;
  return (realisasi / target) * 100;
});

const persentaseCapaianDistribusi = computed(() => {
  const target = totalTargetDistribusi.value;
  const realisasi = totalDistribusi.value;
  if (!target || target === 0) return 0;
  return (realisasi / target) * 100;
});

// Chart
const seriesPengumpulan = ref<any[]>([]);
const seriesDistribusi = ref<any[]>([]);
const chartOptionsPengumpulan = ref<any>({});
const chartOptionsDistribusi = ref<any>({});

// Fetch API
async function fetchData() {
  console.log('Fetching data untuk tahun:', tahun.value);
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
      pengumpulan: resData.pengumpulan,
    };

    // Chart Pengumpulan - beda handling untuk semua tahun vs per tahun
    if (isSemuaTahun.value && resData.pengumpulan.totalPerTahun) {
      // Mode Semua Tahun → chart per tahun
      const dataTahunan = resData.pengumpulan.totalPerTahun;

      seriesPengumpulan.value = [
        {
          name: 'Pengumpulan',
          data: dataTahunan.map((item: PengumpulanTahunan) => item.total),
        },
      ];

      chartOptionsPengumpulan.value = {
        chart: { type: 'line', height: 200, foreColor: '#000', toolbar: { show: true } },
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 5 },
        xaxis: {
          categories: dataTahunan.map((item: PengumpulanTahunan) => item.tahun.toString()),
        },
        yaxis: { labels: { formatter: (val: number) => formatRupiah(val) } },
        tooltip: { y: { formatter: (val: number) => formatRupiah(val) } },
        dataLabels: { enabled: false },
        title: { text: 'Pengumpulan Per Tahun', align: 'left' },
      };
    } else if (resData.pengumpulan.totalGabungan) {
      // Mode Per Tahun → chart per bulan
      const namaBulan = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agt',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ];

      const dataBulanan = resData.pengumpulan.totalGabungan;

      seriesPengumpulan.value = [
        {
          name: 'Pengumpulan',
          data: dataBulanan.map((item: PengumpulanBulanan) => item.total),
        },
      ];

      chartOptionsPengumpulan.value = {
        chart: { type: 'line', height: 200, foreColor: '#000', toolbar: { show: true } },
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 5 },
        xaxis: {
          categories: dataBulanan.map((item: PengumpulanBulanan) => namaBulan[item.bulan - 1]),
        },
        yaxis: { labels: { formatter: (val: number) => formatRupiah(val) } },
        tooltip: { y: { formatter: (val: number) => formatRupiah(val) } },
        dataLabels: { enabled: false },
        title: { text: `Pengumpulan Per Bulan - Tahun ${tahun.value}`, align: 'left' },
      };
    }

    // Chart Distribusi → bar (sama untuk semua mode)
    seriesDistribusi.value = [
      { name: 'Zakat', data: [apiData.value.zakat.realisasi_distribusi] },
      { name: 'Infaq', data: [apiData.value.infaq.realisasi_distribusi] },
      { name: 'Donasi', data: [apiData.value.donasi.realisasi_distribusi] },
    ];

    chartOptionsDistribusi.value = {
      chart: { type: 'bar', foreColor: '#000', toolbar: { show: true } },
      plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 6 } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: [isSemuaTahun.value ? 'Semua Tahun' : 'Tahun ' + tahun.value],
      },
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
    <LoadingSpinner v-if="isLoading" label="Memuat halaman..." />

    <div v-else class="space-y-4">
      <!-- Tahun filter -->
      <div class="flex items-center gap-4 mb-4">
        <label for="tahun" class="font-medium text-gray-700">Tahun:</label>
        <select
          id="tahun"
          v-model="tahun"
          @change="fetchData"
          class="border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-300"
        >
          <option value="0">Semua Tahun</option>
          <option v-for="t in tahunOptions" :key="t" :value="t">{{ t }}</option>
        </select>
        <Logo />
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
          <h3 class="font-semibold text-gray-700">Persentase Distribusi</h3>
          <p class="text-lg font-bold text-gray-900">{{ persentase.toFixed(2) }}%</p>
        </div>
      </div>

      <!-- Chart -->
      <div class="grid grid-cols-2 gap-4 mt-6">
        <div class="p-2 rounded-xl border shadow bg-white">
          <VueApexCharts
            v-if="seriesPengumpulan.length > 0"
            type="line"
            height="200"
            :options="chartOptionsPengumpulan"
            :series="seriesPengumpulan"
          />
          <div v-else class="flex items-center justify-center h-[200px] text-gray-500">
            Tidak ada data
          </div>
        </div>
        <div class="p-2 rounded-xl border shadow bg-white">
          <VueApexCharts
            v-if="seriesDistribusi.length > 0"
            type="bar"
            height="200"
            :options="chartOptionsDistribusi"
            :series="seriesDistribusi"
          />
          <div v-else class="flex items-center justify-center h-[200px] text-gray-500">
            Tidak ada data
          </div>
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
          <tbody v-if="apiData" class="divide-y divide-gray-200">
            <tr class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-4 py-2 font-medium text-left">Infaq</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.infaq.target_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.infaq.realisasi_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ apiData.infaq.persentase_pengumpulan.toFixed(2) }}%</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.infaq.target_distribusi) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.infaq.realisasi_distribusi) }}</td>
              <td class="px-4 py-2">{{ apiData.infaq.persentase_distribusi.toFixed(2) }}%</td>
            </tr>
            <tr class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-4 py-2 font-medium text-left">Zakat</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.zakat.target_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.zakat.realisasi_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ apiData.zakat.persentase_pengumpulan.toFixed(2) }}%</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.zakat.target_distribusi) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.zakat.realisasi_distribusi) }}</td>
              <td class="px-4 py-2">{{ apiData.zakat.persentase_distribusi.toFixed(2) }}%</td>
            </tr>
            <tr class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-4 py-2 font-medium text-left">Donasi</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.donasi.target_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.donasi.realisasi_pengumpulan) }}</td>
              <td class="px-4 py-2">{{ apiData.donasi.persentase_pengumpulan.toFixed(2) }}%</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.donasi.target_distribusi) }}</td>
              <td class="px-4 py-2">{{ formatRupiah(apiData.donasi.realisasi_distribusi) }}</td>
              <td class="px-4 py-2">{{ apiData.donasi.persentase_distribusi.toFixed(2) }}%</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7" class="px-4 py-8 text-center text-gray-500">Tidak ada data</td>
            </tr>
          </tbody>
          <tfoot v-if="apiData" class="bg-gray-200 font-bold text-gray-800">
            <tr>
              <td class="px-4 py-3 text-left">TOTAL</td>
              <td class="px-4 py-3">
                {{ formatRupiah(totalTarget) }}
              </td>
              <td class="px-4 py-3">
                {{ formatRupiah(totalPengumpulan) }}
              </td>
              <td class="px-4 py-3">{{ persentaseCapaianPengumpulan.toFixed(2) }}%</td>
              <td class="px-4 py-3">
                {{ formatRupiah(totalTargetDistribusi) }}
              </td>
              <td class="px-4 py-3">
                {{ formatRupiah(totalDistribusi) }}
              </td>
              <td class="px-4 py-3">{{ persentaseCapaianDistribusi.toFixed(2) }}%</td>
            </tr>
          </tfoot>
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

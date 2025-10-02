<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { list } from '@/service/rekap_pengumpulan';
import SkeletonTable from '@/components/SkeletonTable/SkeletonTable.vue';
import Notification from '@/components/Modal/Notification.vue';
import { useNotification } from '@/composables/useNotification';

const isLoading = ref(false);
const selectedYear = ref(new Date().getFullYear()); // default tahun sekarang
const years = [2023, 2024, 2025, 2026]; // bisa kamu generate dinamis

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

const rows = ref<any[]>([]);

const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

async function fetchData() {
  isLoading.value = true;
  try {
    const res = await list({ year: selectedYear.value }); // kirim param tahun ke backend
    const data = res.data || [];

    const tipe = [
      { key: 'zakat_harta', label: 'Zakat Harta' },
      { key: 'zakat_simpanan', label: 'Zakat Simpanan' },
      { key: 'zakat_profesi', label: 'Zakat Profesi' },
      { key: 'zakat_perdagangan', label: 'Zakat Perdagangan' },
      { key: 'zakat_pertanian', label: 'Zakat Pertanian' },
      { key: 'infaq', label: 'Infaq' },
      { key: 'sum_riwayat_donasi', label: 'Donasi' },
      { key: 'total_nominal_realisasi', label: 'Total' },
    ];

    rows.value = tipe.map((t) => {
      const values: Record<string, number> = {};
      let total = 0;

      months.forEach((m) => {
        let val = 0;
        const bulan = data.find((d) => d.month === m.key);
        if (bulan) {
          if (t.key === 'total_realisasi') val = bulan.total_realisasi;
          else if (t.key === 'total_nominal_realisasi') val = bulan.total_nominal_realisasi;
          else if (t.key === 'sum_riwayat_donasi') val = bulan.sum_riwayat_donasi;
          else val = bulan.sum_riwayat_pengumpulan[t.key] || 0;
        }
        values[m.key] = val;
        total += val;
      });
      return { label: t.label, values, total };
    });
  } catch (e: any) {
    displayNotification(e.response?.data?.message || 'Gagal memuat data', 'error');
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);
watch(selectedYear, fetchData); // reload data setiap kali tahun diganti
</script>

<template>
  <div class="p-6">
    <!-- Filter Tahun -->
    <div class="flex justify-end mb-4">
      <select
        v-model="selectedYear"
        class="border rounded-lg px-3 py-1 text-sm focus:ring focus:ring-indigo-300"
      >
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <SkeletonTable v-if="isLoading" :columns="months.length + 3" :rows="rows.length" />

      <table
        v-else
        class="min-w-full table-auto border-collapse bg-white shadow-md rounded-xl overflow-hidden text-sm"
      >
        <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
          <tr>
            <th class="w-[5%] text-center px-6 py-4 font-medium font-bold text-gray-900">No</th>
            <th class="w-[15%] text-center px-6 py-4 font-medium font-bold text-gray-900">
              Tipe Pengumpulan
            </th>
            <th
              v-for="m in months"
              :key="m.key"
              class="text-center px-6 py-4 font-medium font-bold text-gray-900"
            >
              {{ m.label }}
            </th>
            <th class="text-center px-6 py-4 font-medium font-bold text-gray-900 text-center">
              Jumlah
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(r, i) in rows"
            :key="r.label"
            class="even:bg-gray-50 hover:bg-indigo-50 transition-colors"
          >
            <td class="px-6 py-3 text-center font-medium">
              <span v-if="r.label !== 'Total'">{{ i + 1 }}</span>
            </td>

            <td class="px-6 py-3 text-left font-medium text-gray-700">
              {{ r.label }}
            </td>

            <td
              v-for="m in months"
              :key="m.key"
              class="px-6 py-3 text-right tabular-nums whitespace-nowrap"
            >
              {{ $formatToRupiah(r.values[m.key]) || '-' }}
            </td>

            <td class="px-6 py-3 text-right font-semibold text-indigo-600 whitespace-nowrap">
              {{ $formatToRupiah(r.total) || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Notification
      :showNotification="showNotification"
      :notificationType="notificationType"
      :notificationMessage="notificationMessage"
      @close="showNotification = false"
    />
  </div>
</template>

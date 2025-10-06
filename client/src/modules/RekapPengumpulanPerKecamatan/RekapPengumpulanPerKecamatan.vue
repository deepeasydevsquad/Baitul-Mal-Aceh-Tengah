<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { list } from '@/service/rekap_pengumpulan_per_kecamatan';
import SkeletonTable from '@/components/SkeletonTable/SkeletonTable.vue';
import Notification from '@/components/Modal/Notification.vue';
import { useNotification } from '@/composables/useNotification';

const isLoading = ref(false);
const selectedYear = ref(new Date().getFullYear()); // default tahun sekarang
const years = ref(
  Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)
);

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
    const res = await list({ year: selectedYear.value || new Date().getFullYear() }); // kirim param tahun ke backend
    const data = res.data || [];
    
    // === Format hasil berdasarkan kecamatan ===
    // Asumsi backend return: { year, month, nama_kecamatan, total_pengumpulan, total_donasi, total_semua }
    const groupedByKecamatan = data.reduce((acc, item) => {
      if (!acc[item.nama_kecamatan]) {
        acc[item.nama_kecamatan] = {
          nama_kecamatan: item.nama_kecamatan,
          year: item.year,
          monthly: {},
          total: 0,
        };
      }
      acc[item.nama_kecamatan].monthly[item.month] = item.total_semua;
      acc[item.nama_kecamatan].total += item.total_semua;
      return acc;
    }, {});

    rows.value = Object.values(groupedByKecamatan);
  } catch (e: any) {
    displayNotification(e.response?.data?.message || "Gagal memuat data", "error");
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);
watch(selectedYear, fetchData);

// ✅ Fallback rupiah formatter biar ga error lagi
function formatRupiah(value: any) {
  const safeValue = Number(value) || 0;
  return "Rp " + safeValue.toLocaleString("id-ID");
}
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
            <th class="w-[15%] text-center px-10 py-6 font-medium font-bold text-gray-900">
              Kecamatan
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
            :key="r.nama_kecamatan"
            class="even:bg-gray-50 hover:bg-indigo-50 transition-colors"
          >
            <td class="px-6 py-3 text-center font-medium">{{ i + 1 }}</td>

            <td class="px-6 py-3 text-left font-medium text-gray-700">
              {{ r.nama_kecamatan }}
            </td>

            <td
              v-for="m in months"
              :key="m.key"
              class="px-6 py-3 text-right tabular-nums whitespace-nowrap"
            >
              {{ formatRupiah(r.monthly[m.key] ?? 0) }}
            </td>

            <td class="px-6 py-3 text-right font-semibold text-indigo-600 whitespace-nowrap">
              {{ formatRupiah(r.total ?? 0) }}
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

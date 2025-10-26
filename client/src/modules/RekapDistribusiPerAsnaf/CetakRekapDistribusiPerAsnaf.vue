<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Logos from '@/components/Logo/Logo.vue';
import { list_rekap_distribusi_per_asnaf } from '@/service/rekap_distribusi_per_asnaf';

const route = useRoute();
const tahun = route.params.tahun as string;

const isLoading = ref(true);
const rowsNominal = ref<any[]>([]);
const rowsPenerima = ref<any[]>([]);

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

const formatRupiah = (value: any) => {
  const safeValue = Number(value) || 0;
  return 'Rp ' + safeValue.toLocaleString('id-ID');
};

async function fetchData() {
  isLoading.value = true;

  try {
    const yearParam = tahun === '0' ? 0 : parseInt(tahun);
    const res = await list_rekap_distribusi_per_asnaf({
      year: yearParam || new Date().getFullYear(),
    });

    if (res.error || !res.data || !res.data.length) {
      console.error('Data tidak ditemukan');
      return;
    }

    const raw = res.data;
    const asnafMap: Record<string, { asnaf: string; valuesNominal: any; valuesPenerima: any }> = {};

    if (raw[0]?.data) {
      raw.forEach((bulan: any) => {
        bulan.data.forEach((item: any) => {
          if (!asnafMap[item.asnaf_id]) {
            asnafMap[item.asnaf_id] = {
              asnaf: item.asnaf,
              valuesNominal: {},
              valuesPenerima: {},
            };
          }
          asnafMap[item.asnaf_id].valuesNominal[bulan.month] = item.total_nominal || 0;
          asnafMap[item.asnaf_id].valuesPenerima[bulan.month] = item.total_penerima || 0;
        });
      });
    } else {
      raw.forEach((item: any) => {
        if (!asnafMap[item.asnaf_id]) {
          asnafMap[item.asnaf_id] = {
            asnaf: item.asnaf,
            valuesNominal: {},
            valuesPenerima: {},
          };
        }
        asnafMap[item.asnaf_id].valuesNominal[item.month] = item.total_nominal || 0;
        asnafMap[item.asnaf_id].valuesPenerima[item.month] = item.total_penerima || 0;
      });
    }

    rowsNominal.value = Object.values(asnafMap).map((a: any) => {
      let total = 0;
      months.forEach((m) => {
        const val = a.valuesNominal[m.key] || 0;
        total += val;
        a.valuesNominal[m.key] = val;
      });
      return { label: a.asnaf, values: a.valuesNominal, total };
    });

    rowsPenerima.value = Object.values(asnafMap).map((a: any) => {
      let total = 0;
      months.forEach((m) => {
        const val = a.valuesPenerima[m.key] || 0;
        total += val;
        a.valuesPenerima[m.key] = val;
      });
      return { label: a.asnaf, values: a.valuesPenerima, total };
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

  if (rowsNominal.value.length > 0) {
    setTimeout(() => {
      window.print();
    }, 800);
  }
});
</script>

<template>
  <div
    class="bg-white mx-auto font-sans print-area"
    style="color: black; font-size: 8pt; line-height: 1.2"
  >
    <!-- Header dengan Logo -->
    <div class="flex justify-between items-start mb-3 px-4 pt-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900 mb-1">Laporan Rekap Distribusi Per Asnaf</h1>
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

    <div v-else-if="rowsNominal.length === 0" class="text-center py-12">
      <p class="text-gray-500">Data tidak tersedia</p>
    </div>

    <div v-else class="px-4 pb-4">
      <!-- Tabel Nominal Distribusi -->
      <div class="mb-4">
        <h2 class="text-sm font-bold mb-2 text-gray-900">DISTRIBUSI (NOMINAL RUPIAH)</h2>
        <div class="border border-gray-300">
          <table class="w-full text-[7pt] border-collapse table-fixed">
            <thead class="bg-gray-100 border-b-2 border-gray-400">
              <tr>
                <th
                  rowspan="2"
                  class="w-[12%] px-2 py-1 text-left font-semibold text-gray-900 border-r border-gray-300"
                >
                  ASNAF
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
                  v-for="m in months"
                  :key="m.key"
                  class="w-[6%] px-1 py-1 text-center font-semibold text-gray-900 border-r border-gray-300"
                >
                  {{ m.label }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="r in rowsNominal" :key="r.label" class="border-b">
                <td class="px-2 py-1 text-left font-medium text-gray-700 border-r border-gray-300">
                  {{ r.label }}
                </td>
                <td
                  v-for="m in months"
                  :key="m.key"
                  class="px-1 py-1 text-right border-r border-gray-300 whitespace-nowrap"
                >
                  {{ formatRupiah(r.values[m.key]) }}
                </td>
                <td
                  class="px-2 py-1 text-right font-medium bg-gray-50 text-gray-700 whitespace-nowrap"
                >
                  {{ formatRupiah(r.total) }}
                </td>
              </tr>
              <tr class="bg-gray-100 font-bold border-t-2 border-gray-400">
                <td class="px-2 py-1 text-left border-r border-gray-300">Total</td>
                <td
                  v-for="m in months"
                  :key="m.key"
                  class="px-1 py-1 text-right border-r border-gray-300 whitespace-nowrap"
                >
                  {{
                    formatRupiah(
                      rowsNominal.reduce((acc, curr) => acc + (curr.values[m.key] || 0), 0),
                    )
                  }}
                </td>
                <td class="px-2 py-1 text-right whitespace-nowrap">
                  {{ formatRupiah(rowsNominal.reduce((acc, curr) => acc + (curr.total || 0), 0)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabel Jumlah Penerima -->
      <div>
        <h2 class="text-sm font-bold mb-2 text-gray-900">DISTRIBUSI (JUMLAH PENERIMA)</h2>
        <div class="border border-gray-300">
          <table class="w-full text-[7pt] border-collapse table-fixed">
            <thead class="bg-gray-100 border-b-2 border-gray-400">
              <tr>
                <th
                  rowspan="2"
                  class="w-[12%] px-2 py-1 text-left font-semibold text-gray-900 border-r border-gray-300"
                >
                  ASNAF
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
                  v-for="m in months"
                  :key="m.key"
                  class="w-[6%] px-1 py-1 text-center font-semibold text-gray-900 border-r border-gray-300"
                >
                  {{ m.label }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="r in rowsPenerima" :key="r.label" class="border-b">
                <td class="px-2 py-1 text-left font-medium text-gray-700 border-r border-gray-300">
                  {{ r.label }}
                </td>
                <td
                  v-for="m in months"
                  :key="m.key"
                  class="px-1 py-1 text-center border-r border-gray-300"
                >
                  {{ r.values[m.key] || '-' }}
                </td>
                <td class="px-2 py-1 text-center font-medium bg-gray-50 text-gray-700">
                  {{ r.total }}
                </td>
              </tr>
              <tr class="bg-gray-100 font-bold border-t-2 border-gray-400">
                <td class="px-2 py-1 text-left border-r border-gray-300">Total</td>
                <td
                  v-for="m in months"
                  :key="m.key"
                  class="px-1 py-1 text-center border-r border-gray-300"
                >
                  {{ rowsPenerima.reduce((acc, curr) => acc + (curr.values[m.key] || 0), 0) }}
                </td>
                <td class="px-2 py-1 text-center">
                  {{ rowsPenerima.reduce((acc, curr) => acc + (curr.total || 0), 0) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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

  tfoot {
    display: table-footer-group;
  }

  /* Hilangkan overflow dan scroll */
  * {
    overflow: visible !important;
  }

  /* Pastikan tidak ada border-radius yang mengganggu */
  .border {
    border-radius: 0 !important;
  }
}
</style>

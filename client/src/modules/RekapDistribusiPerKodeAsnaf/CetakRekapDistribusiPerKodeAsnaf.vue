<script setup lang="ts">
import Logos from '@/components/Logo/Logo.vue';
import { list_rekap_distribusi_per_kode_asnaf } from '@/service/rekap_distribusi_per_kode_asnaf';
import { nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const tahun = parseInt(route.params.tahun as string);

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

interface KegiatanData {
  kode: string;
  kegiatan_id: number | null;
  values: Record<string, number>;
  total: number;
}

interface RowData {
  asnaf: string;
  asnaf_id: number;
  kegiatan: KegiatanData[];
  values: Record<string, number>;
  total: number;
}

const rowsNominal = ref<RowData[]>([]);

function calculateGrandTotalBulan(monthKey: string): number {
  return rowsNominal.value.reduce((sum, row) => sum + (row.values[monthKey] || 0), 0);
}

function calculateGrandTotal(): number {
  return months.reduce((sum, m) => sum + calculateGrandTotalBulan(m.key), 0);
}

async function fetchData() {
  try {
    const res = await list_rekap_distribusi_per_kode_asnaf({ year: tahun });

    if (!res.success || !res.data || !res.data.length) {
      rowsNominal.value = [];
      return;
    }

    const raw = res.data;
    const asnafMap: Record<number, any> = {};

    raw.forEach((monthData: any) => {
      const month = monthData.month;

      if (!monthData.data || !Array.isArray(monthData.data)) {
        return;
      }

      monthData.data.forEach((item: any) => {
        const asnafId = item.asnaf_id;

        if (!asnafMap[asnafId]) {
          asnafMap[asnafId] = {
            asnaf_id: asnafId,
            asnaf: item.asnaf || 'Tidak Diketahui',
            kegiatan: {},
            valuesNominal: {},
          };
        }

        const kegiatanId = item.kegiatan_id || 'null';
        if (!asnafMap[asnafId].kegiatan[kegiatanId]) {
          asnafMap[asnafId].kegiatan[kegiatanId] = {
            kegiatan_id: item.kegiatan_id,
            kode: item.kode || '-',
            valuesNominal: {},
          };
        }

        asnafMap[asnafId].kegiatan[kegiatanId].valuesNominal[month] = item.total_nominal || 0;

        if (!asnafMap[asnafId].valuesNominal[month]) {
          asnafMap[asnafId].valuesNominal[month] = 0;
        }
        asnafMap[asnafId].valuesNominal[month] += item.total_nominal || 0;
      });
    });

    rowsNominal.value = Object.values(asnafMap)
      .map((data: any) => {
        let totalAsnaf = 0;
        const valuesAsnaf: Record<string, number> = {};

        const kegiatanArray = Object.values(data.kegiatan).map((k: any) => {
          let totalKegiatan = 0;
          const valuesKegiatan: Record<string, number> = {};

          months.forEach((m) => {
            const val = k.valuesNominal[m.key] || 0;
            totalKegiatan += val;
            valuesKegiatan[m.key] = val;

            if (!valuesAsnaf[m.key]) {
              valuesAsnaf[m.key] = 0;
            }
            valuesAsnaf[m.key] += val;
          });

          totalAsnaf += totalKegiatan;

          return {
            kode: k.kode,
            kegiatan_id: k.kegiatan_id,
            values: valuesKegiatan,
            total: totalKegiatan,
          };
        });

        return {
          asnaf_id: data.asnaf_id,
          asnaf: data.asnaf,
          kegiatan: kegiatanArray,
          values: valuesAsnaf,
          total: totalAsnaf,
        };
      })
      .sort((a, b) => a.asnaf.localeCompare(b.asnaf, 'id'));
  } catch (error) {
    console.error('Error fetching data:', error);
    rowsNominal.value = [];
  }
}

onMounted(async () => {
  try {
    await fetchData();
    await nextTick();

    const oldTitle = document.title;
    document.title = `Rekap Penyaluran Per Kode Asnaf Tahun ${tahun}`;

    const styleId = 'print-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @page { size: A4 landscape; margin: 10mm; }
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      window.print();
      document.title = oldTitle;
      setTimeout(() => {
        window.close();
      }, 400);
    }, 1000);
  } catch (error) {
    console.error('Error saat mounting:', error);
  }
});
</script>

<template>
  <div class="min-h-screen p-4">
    <div
      class="print-area font-sans"
      style="color: black; font-size: 8pt; line-height: 1.3; background: white"
    >
      <!-- Header -->
      <div class="flex justify-between items-start mb-3">
        <div>
          <h1 class="text-lg font-bold mb-1">Rekap Penyaluran Per Kode Asnaf</h1>
          <p class="text-sm">Tahun: {{ tahun }}</p>
        </div>
        <div class="flex-shrink-0 scale-90 origin-top-right">
          <Logos />
        </div>
      </div>

      <!-- Tabel -->
      <table class="w-full border-collapse text-[6.5pt] mt-5" style="table-layout: auto">
        <thead class="border border-black text-center">
          <tr>
            <!-- <th rowspan="2" class="border border-black px-2 py-1 w-[5%]">NO</th> -->
            <th rowspan="2" class="border border-black px-2 py-1 w-[15%]">ASNAF</th>
            <th rowspan="2" class="border border-black px-2 py-1 w-[8%]">KODE</th>
            <th colspan="12" class="border border-black px-2 py-1">BULAN</th>
            <th rowspan="2" class="border border-black px-2 py-1 w-[8%]">JUMLAH</th>
          </tr>
          <tr>
            <th v-for="m in months" :key="m.key" class="border border-black px-1 py-1">
              {{ m.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-if="rowsNominal.length > 0">
            <template v-for="(row, index) in rowsNominal" :key="row.asnaf_id">
              <!-- Baris pertama dengan asnaf -->
              <tr class="text-[6pt] text-black" style="page-break-inside: avoid">
                <!-- <td
                  :rowspan="row.kegiatan.length"
                  class="border border-black px-2 py-1 text-center font-bold"
                >
                  {{ index + 1 }}
                </td> -->
                <td
                  :rowspan="row.kegiatan.length"
                  class="border border-black px-2 py-1 text-left font-bold"
                >
                  {{ row.asnaf }}
                </td>
                <td class="border border-black px-2 py-1 text-center">
                  {{ row.kegiatan[0]?.kode || '-' }}
                </td>
                <td
                  v-for="m in months"
                  :key="`${row.asnaf_id}_0_${m.key}`"
                  class="border border-black px-1 py-1 text-right"
                >
                  {{ $formatToRupiah(row.kegiatan[0]?.values[m.key] || 0) }}
                </td>
                <td
                  :rowspan="row.kegiatan.length"
                  class="border border-black px-1 py-1 text-right font-bold bg-gray-100"
                >
                  {{ $formatToRupiah(row.total) }}
                </td>
              </tr>

              <!-- Baris kegiatan tambahan -->
              <tr
                v-for="(kegiatan, kIndex) in row.kegiatan.slice(1)"
                :key="`${row.asnaf_id}_${kIndex + 1}`"
                class="text-[6pt] text-black"
                style="page-break-inside: avoid"
              >
                <td class="border border-black px-2 py-1 text-center">{{ kegiatan.kode }}</td>
                <td
                  v-for="m in months"
                  :key="`${row.asnaf_id}_${kIndex + 1}_${m.key}`"
                  class="border border-black px-1 py-1 text-right"
                >
                  {{ $formatToRupiah(kegiatan.values[m.key] || 0) }}
                </td>
              </tr>
            </template>

            <!-- Grand Total -->
            <tr class="font-bold text-black bg-gray-200">
              <td colspan="2" class="border border-black px-2 py-1 text-center">
                TOTAL KESELURUHAN
              </td>
              <td
                v-for="m in months"
                :key="`total_${m.key}`"
                class="border border-black px-1 py-1 text-right"
              >
                {{ $formatToRupiah(calculateGrandTotalBulan(m.key)) }}
              </td>
              <td class="border border-black px-1 py-1 text-right">
                {{ $formatToRupiah(calculateGrandTotal()) }}
              </td>
            </tr>
          </template>

          <tr v-else>
            <td colspan="16" class="border border-black px-2 py-3 text-center text-gray-700">
              Rekap Penyaluran Per Kode Asnaf Tidak Ditemukan
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.print-area {
  max-width: 297mm;
  min-height: 210mm;
  margin: 0 auto;
  padding: 15mm;
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

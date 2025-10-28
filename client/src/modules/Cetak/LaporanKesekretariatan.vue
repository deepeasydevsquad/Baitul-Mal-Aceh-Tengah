<script setup lang="ts">
import Logos from '@/components/Logo/Logo.vue';
import FooterCetak from '@/modules/FooterCetak/FooterCetak.vue';
import { get_laporan_kesekretariatan } from '@/service/laporan_kesekretariatan';
import { nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const tahun = route.params.tahun as string;

// Fungsi untuk parse format rupiah string ke number
const parseRupiah = (val: string | number): number => {
  if (typeof val === 'number') return val;
  const cleaned = val.replace(/Rp\s?|\./g, '').trim();
  return parseFloat(cleaned) || 0;
};

const laporanData = ref<any[]>([]);
const grandTotal = ref<number>(0);

async function fetchData() {
  try {
    const response = await get_laporan_kesekretariatan(tahun);

    // Flatten data dari response
    const flattenedData = response.data.data.flatMap((group: any) => group.data);
    laporanData.value = flattenedData;

    // Hitung grand total
    grandTotal.value = flattenedData.reduce((sum: number, row: any) => {
      return sum + parseRupiah(row[7]);
    }, 0);
  } catch (error) {
    console.error('Error fetching data:', error);
    laporanData.value = [];
    grandTotal.value = 0;
  }
}

onMounted(async () => {
  try {
    await fetchData();
    await nextTick();

    const oldTitle = document.title;
    document.title = `Laporan Kesekretariatan ${tahun === '0' ? 'Semua Tahun' : 'Per Tahun ' + tahun}`;

    const styleId = 'print-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @page { size: A4 landscape; margin: 15mm 12mm; }
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
      style="color: black; font-size: 9pt; line-height: 1.3; background: white"
    >
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Laporan Kesekretariatan</h1>
          <p class="text-sm text-gray-700">Tahun: {{ tahun === '0' ? 'Semua Tahun' : tahun }}</p>
        </div>
        <div class="flex-shrink-0">
          <Logos />
        </div>
      </div>

      <!-- Tabel -->
      <table class="w-full border-collapse text-[8pt] mb-4" style="table-layout: fixed">
        <thead class="border border-black text-center">
          <tr>
            <th class="border border-black w-[10%] px-2 py-1">Tanggal</th>
            <th class="border border-black w-[25%] px-2 py-1">Uraian</th>
            <th class="border border-black w-[12%] px-2 py-1">NIK</th>
            <th class="border border-black w-[20%] px-2 py-1">Alamat</th>
            <th class="border border-black w-[8%] px-2 py-1">Kec</th>
            <th class="border border-black w-[10%] px-2 py-1">Kode Akun</th>
            <th class="border border-black w-[15%] px-2 py-1">Kredit</th>
          </tr>
        </thead>

        <tbody>
          <template v-if="laporanData.length > 0">
            <tr
              v-for="(row, index) in laporanData"
              :key="index"
              class="text-[7pt] text-black"
              style="page-break-inside: avoid"
            >
              <td class="border border-black px-2 py-1 text-center whitespace-nowrap">
                {{ row[1] }}
              </td>
              <td class="border border-black px-2 py-1 text-left">{{ row[2] }}</td>
              <td class="border border-black px-2 py-1 text-center">{{ row[3] }}</td>
              <td class="border border-black px-2 py-1 text-left">{{ row[4] }}</td>
              <td class="border border-black px-2 py-1 text-center">{{ row[5] }}</td>
              <td class="border border-black px-2 py-1 text-center">{{ row[6] }}</td>
              <td class="border border-black px-2 py-1 text-right whitespace-nowrap">
                {{ row[7] }}
              </td>
            </tr>

            <!-- Grand Total -->
            <tr class="font-bold text-black bg-gray-100">
              <td colspan="6" class="border border-black px-2 py-1 text-right">Total</td>
              <td class="border border-black px-2 py-1 text-right">
                {{ $formatToRupiah(grandTotal) }}
              </td>
            </tr>
          </template>

          <tr v-else>
            <td colspan="7" class="border border-black px-2 py-3 text-center text-gray-700">
              Laporan Kesekretariatan Tidak Ditemukan
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Footer -->
      <FooterCetak />
    </div>
  </div>
</template>

<style scoped>
.print-area {
  max-width: 297mm;
  min-height: 210mm;
  margin: 0 auto;
  padding: 10mm;
  background: white;
}

@media screen {
  body {
    background: #f3f4f6;
  }
  .print-area {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    margin: 20px auto;
  }
}

@media print {
  @page {
    size: A4 landscape;
    margin: 15mm 12mm;
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

  .print-area {
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none;
    margin: 0 !important;
    padding: 8mm 10mm !important;
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

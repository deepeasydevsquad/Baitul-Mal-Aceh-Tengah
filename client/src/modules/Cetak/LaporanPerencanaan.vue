<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import Logos from '@/components/Logo/Logo.vue';
import { get_laporan_perencanaan } from '@/service/laporan_perencanaan';

const route = useRoute();
const tahun = parseInt(route.params.tahun as string);
const program = route.params.program == 'semua' ? undefined : (route.params.program as string);
const perPage = (route.params.perpage as string) || undefined;
const currentPage = (route.params.currentpage as string) || undefined;
const grandTotal = ref<string>('');

// Helper Format
const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val);

// Interfaces
interface LaporanPerencanaan {
  uraian: string;
  rencana: {
    jumlah: number;
    satuan: string;
  };
  rincian: {
    vol: number;
    satuan: string;
    jumlah_satuan: number;
    jumlah_satuan_format: number;
  };
  persentase: string;
  ket: string;
}

interface asnaf {
  nama: string;
  program: LaporanPerencanaan[];
  total: number;
}

const datas = ref<asnaf[]>([]);

// Fetch Data
async function fetchData() {
  try {
    const response = await get_laporan_perencanaan({
      perpage: perPage,
      pageNumber: currentPage,
      tahun: tahun || undefined,
      program: program || undefined,
    });
    datas.value = response.data;
    grandTotal.value = response.grand_total_format;
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  try {
    await fetchData();
    await nextTick();

    if (datas.value) {
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
    class="bg-white max-w-[297mm] mx-auto p-[12mm] font-sans print:p-[10mm] print:m-0 print:shadow-none print-area"
    style="color: black; font-size: 9pt; line-height: 1.3"
  >
    <!-- Header dengan Logo -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Laporan Perencanaan</h1>
        <p class="text-sm text-gray-700">Tahun: {{ tahun }}</p>
        <p class="text-sm text-gray-700">Program: {{ program }}</p>
      </div>
      <div class="flex-shrink-0">
        <Logos />
      </div>
    </div>
    <div class="flex justify-between items-start mb-4">
      <table class="w-full border-collapse bg-white text-sm">
        <!-- Header -->
        <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
          <tr>
            <th rowspan="2" class="w-[20%] px-6 py-3 font-medium border border-gray-300">Asnaf</th>
            <th colspan="2" class="w-[20%] px-6 py-3 font-medium border border-gray-300">
              Rencana
            </th>
            <th colspan="4" class="w-[40%] px-6 py-3 font-medium border border-gray-300">
              Rincihan Perhitungan (Murni)
            </th>
            <th rowspan="2" class="w-[10%] px-6 py-3 font-medium border border-gray-300">%</th>
            <th rowspan="2" class="w-[10%] px-6 py-3 font-medium border border-gray-300">Ket</th>
          </tr>
          <tr>
            <th class="px-6 py-3 font-medium border border-gray-300">Jumlah</th>
            <th class="px-6 py-3 font-medium border border-gray-300">Satuan</th>
            <th class="px-6 py-3 font-medium border border-gray-300">Vol</th>
            <th class="px-6 py-3 font-medium border border-gray-300">Satuan</th>
            <th class="px-6 py-3 font-medium border border-gray-300">Jumlah Satuan</th>
            <th class="px-6 py-3 font-medium border border-gray-300">Jumlah</th>
          </tr>
        </thead>
        <!-- Body -->
        <tbody class="divide-y divide-gray-100">
          <template v-if="datas.length > 0">
            <!-- Kategori Row -->
            <template v-for="asnaf in datas" :key="asnaf.nama">
              <tr class="bg-gray-100 text-center">
                <td colspan="6" class="px-4 py-2 font-semibold text-gray-700 text-left">
                  {{ asnaf.nama }}
                </td>
                <td class="px-6 py-2 font-semibold text-gray-700">
                  {{ formatRupiah(asnaf.total) }}
                </td>
                <td class="px-6 py-2 font-semibold text-gray-700">{{ 100 }} %</td>
                <td colspan="2"></td>
              </tr>

              <!-- Program Row -->
              <tr
                v-for="(laporanPerencanaan, idx) in asnaf.program"
                :key="idx"
                class="hover:bg-gray-50 transition-colors text-center"
              >
                <td class="px-6 py-2 text-gray-600 text-left">{{ laporanPerencanaan.uraian }}</td>
                <td class="px-6 py-4 text-gray-600">{{ laporanPerencanaan.rencana.jumlah }}</td>
                <td class="px-6 py-4 text-gray-600">{{ laporanPerencanaan.rencana.satuan }}</td>
                <td class="px-6 py-4 text-gray-600">{{ laporanPerencanaan.rincian.vol }}</td>
                <td class="px-6 py-4 text-gray-600">{{ laporanPerencanaan.rincian.satuan }}</td>
                <td class="px-6 py-4 text-gray-600">
                  {{ formatRupiah(laporanPerencanaan.rincian.jumlah_satuan) }}
                </td>
                <td class="px-6 py-4 text-gray-600">
                  {{
                    formatRupiah(
                      laporanPerencanaan.rincian.satuan == 'tahun'
                        ? laporanPerencanaan.rincian.jumlah_satuan *
                            laporanPerencanaan.rencana.jumlah
                        : laporanPerencanaan.rincian.jumlah_satuan * laporanPerencanaan.rincian.vol,
                    )
                  }}
                </td>
                <td class="px-6 py-4 text-gray-600">{{ laporanPerencanaan.persentase }}</td>
                <td class="px-6 py-4 text-gray-600">{{ laporanPerencanaan.ket }}</td>
              </tr>
            </template>

            <!-- Grand Total -->
            <tr class="bg-gray-200 text-center font-bold">
              <td colspan="6" class="px-6 py-2 text-left">Total</td>
              <td class="px-6 py-2">{{ grandTotal }}</td>
              <td colspan="2"></td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="9" class="px-6 py-4 text-gray-600 text-center">Data tidak ditemukan</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
@media screen {
  body {
    background-color: #f3f4f6;
  }

  .print-area {
    width: 297mm; /* Lebar untuk landscape */
    min-height: 210mm; /* Tinggi untuk landscape */
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    margin: 20px auto;
    background: white;
  }
}
</style>

<style>
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
    width: 297mm; /* Pastikan sesuai A4 landscape */
    height: 210mm;
    margin: 0;
    padding: 0;
    box-shadow: none;
    background: white;
  }
}
</style>

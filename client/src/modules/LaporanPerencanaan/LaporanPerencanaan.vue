<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import SkeletonTable from '@/components/SkeletonTable/SkeletonTable.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';
import { usePagination } from '@/composables/usePaginations';
import { useNotification } from '@/composables/useNotification';

import { get_laporan_perencanaan } from '@/service/laporan_perencanaan';

// State
const isLoading = ref(false);
const isTableLoading = ref(false);

const itemsPerPage = ref<number>(10);
const totalColumns = ref<number>(10);

const { currentPage, perPage, totalRow, totalPages, nextPage, prevPage, pageNow, pages } =
  usePagination(fetchData, { perPage: itemsPerPage.value });

const { showNotification, notificationType, notificationMessage } = useNotification();

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
const grandTotal = ref<string>('');

// Helper Format
const formatRupiah = (val: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val);

// Fetch Data
async function fetchData() {
  isTableLoading.value = true;
  try {
    const response = await get_laporan_perencanaan({
      perpage: perPage.value,
      pageNumber: currentPage.value,
    });
    datas.value = response.data;
    totalRow.value = response.total;
    grandTotal.value = response.grand_total_format;
  } catch (err) {
    console.error(err);
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
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow">
        <SkeletonTable v-if="isTableLoading" :columns="totalColumns" :rows="itemsPerPage" />
        <table v-else class="w-full border-collapse bg-white text-sm">
          <!-- Header -->
          <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
            <tr>
              <th rowspan="2" class="w-[20%] px-6 py-3 font-medium">Program</th>
              <th colspan="2" class="w-[20%] px-6 py-3 font-medium">Rencana</th>
              <th colspan="4" class="w-[40%] px-6 py-3 font-medium">
                Rincihan Perhitungan (Murni)
              </th>
              <th rowspan="2" class="w-[10%] px-6 py-3 font-medium">%</th>
              <th rowspan="2" class="w-[10%] px-6 py-3 font-medium">Ket</th>
            </tr>
            <tr>
              <th class="px-6 py-3 font-medium">Jumlah</th>
              <th class="px-6 py-3 font-medium">Satuan</th>
              <th class="px-6 py-3 font-medium">Vol</th>
              <th class="px-6 py-3 font-medium">Satuan</th>
              <th class="px-6 py-3 font-medium">Jumlah Satuan</th>
              <th class="px-6 py-3 font-medium">Jumlah</th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody class="divide-y divide-gray-100">
            <template v-if="datas.length > 0">
              <!-- Kategori Row -->
              <template v-for="asnaf in datas" :key="asnaf.nama">
                <tr class="bg-gray-100 text-center">
                  <td colspan="6" class="px-6 py-2 font-semibold text-gray-700 text-left">
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
                  <td class="px-4 py-2 text-gray-600">{{ laporanPerencanaan.uraian }}</td>
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
                          : laporanPerencanaan.rincian.jumlah_satuan *
                              laporanPerencanaan.rincian.vol,
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
                <td class="px-6 py-2">
                  {{ grandTotal }}
                </td>
                <td colspan="2"></td>
              </tr>
            </template>
          </tbody>

          <!-- Pagination -->
          <tfoot class="bg-gray-100 font-bold">
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :pages="pages"
              :total-columns="totalColumns"
              :total-row="totalRow"
              @prev-page="prevPage"
              @next-page="nextPage"
              @page-now="pageNow"
            />
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Notification -->
    <Notification
      :showNotification="showNotification"
      :notificationType="notificationType"
      :notificationMessage="notificationMessage"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup lang="ts">
// Library
import { ref, onMounted } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import SkeletonTable from '@/components/SkeletonTable/SkeletonTable.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';

// Composable
import { usePagination } from '@/composables/usePaginations';
import { useNotification } from '@/composables/useNotification';

// Service API
import { get_laporan_tahunan } from '@/service/laporan_tahunan';

// State: Loading
const isLoading = ref(false);
const isTableLoading = ref(false);

// Composable: pagination
const itemsPerPage = ref<number>(100);
const totalColumns = ref<number>(3);

const { currentPage, perPage, totalRow, totalPages, nextPage, prevPage, pageNow, pages } =
  usePagination(fetchData, { perPage: itemsPerPage.value });

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

// State Data
interface Pengumpulan {
  zakat: string;
  infaq: string;
  donasi: string;
  total: string;
}

interface Distribusi {
  zakat: string;
  infaq: string;
  total: string;
}

interface Data {
  tahun: string;
  pengumpulan: Pengumpulan;
  distribusi: Distribusi;
}

const datas = ref<Data[]>([]);

// Function: Fetch Data
const search = ref('');

async function fetchData() {
  isTableLoading.value = true;
  try {
    const response = await get_laporan_tahunan({
      search: search.value,
      perpage: perPage.value,
      pageNumber: currentPage.value,
    });

    datas.value = response.data;
    totalRow.value = response.total;
    console.log('Datas:', datas.value);
  } catch (error) {
    console.error(error);
    displayNotification('Gagal mengambil data laporan tahunan', 'error');
  } finally {
    isTableLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div class="mx-auto p-4">
    <!-- Header -->
    <LoadingSpinner v-if="isLoading" label="Memuat halaman..." />
    <div v-else class="space-y-4">
      <!-- Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow">
        <SkeletonTable v-if="isTableLoading" :columns="totalColumns" :rows="itemsPerPage" />
        <table v-else class="w-full border-collapse bg-white text-sm">
          <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
            <tr>
              <th rowspan="2" class="w-[15%] px-6 py-3 font-medium align-middle">Tahun</th>
              <th colspan="4" class="w-[45%] px-6 py-3 font-medium">Pengumpulan</th>
              <th colspan="3" class="w-[40%] px-6 py-3 font-medium">Distribusi</th>
            </tr>
            <tr>
              <!-- Subhead Pengumpulan -->
              <th class="px-4 py-2 font-medium">Zakat</th>
              <th class="px-4 py-2 font-medium">Infaq</th>
              <th class="px-4 py-2 font-medium">Donasi</th>
              <th class="px-4 py-2 font-medium">Total</th>

              <!-- Subhead Distribusi -->
              <th class="px-4 py-2 font-medium">Zakat</th>
              <th class="px-4 py-2 font-medium">Infaq</th>
              <th class="px-4 py-2 font-medium">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-if="datas.length > 0">
              <tr
                v-for="(data, index) in datas"
                :key="index"
                class="hover:bg-gray-50 transition-colors text-center"
              >
                <!-- Tahun -->
                <td class="px-6 py-4 font-medium text-gray-800">{{ data.tahun }}</td>

                <!-- Pengumpulan -->
                <td class="px-4 py-2 text-gray-700">{{ data.pengumpulan.zakat }}</td>
                <td class="px-4 py-2 text-gray-700">{{ data.pengumpulan.infaq }}</td>
                <td class="px-4 py-2 text-gray-700">{{ data.pengumpulan.donasi }}</td>
                <td class="px-4 py-2 font-semibold text-gray-900">{{ data.pengumpulan.total }}</td>

                <!-- Distribusi -->
                <td class="px-4 py-2 text-gray-700">{{ data.distribusi.zakat }}</td>
                <td class="px-4 py-2 text-gray-700">{{ data.distribusi.infaq }}</td>
                <td class="px-4 py-2 font-semibold text-gray-900">{{ data.distribusi.total }}</td>
              </tr>
            </template>

            <!-- Empty State -->
            <tr v-else>
              <td :colspan="8" class="px-6 py-8 text-center text-gray-500">
                <font-awesome-icon
                  icon="fa-solid fa-calendar-check"
                  class="text-4xl mb-2 text-gray-400"
                />
                <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
                <p class="text-sm">Belum ada laporan tahunan.</p>
              </td>
            </tr>
          </tbody>

          <!-- Pagination -->
          <tfoot class="bg-gray-100 font-bold">
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :pages="pages"
              :total-columns="8"
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

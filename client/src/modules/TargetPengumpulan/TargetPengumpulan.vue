<script setup lang="ts">
// Library
import { ref, onMounted } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import Confirmation from '@/components/Modal/Confirmation.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import LightButton from '@/components/Button/LightButton.vue';
import EditIcon from '@/components/Icons/EditIcon.vue';
import DangerButton from '@/components/Button/DangerButton.vue';
import DeleteIcon from '@/components/Icons/DeleteIcon.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import SkeletonTable from '@/components/SkeletonTable/SkeletonTable.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';
import FormAdd from '@/modules/TargetPengumpulan/widgets/FormAdd.vue';
import FormEdit from '@/modules/TargetPengumpulan/widgets/FormEdit.vue';

// Composable
import { usePagination } from '@/composables/usePaginations';
import { useConfirmation } from '@/composables/useConfirmation';
import { useNotification } from '@/composables/useNotification';

// Service API
import {
  get_target_pengumpulan,
  delete_target_pengumpulan,
  get_tahun,
} from '@/service/target_pengumpulan';

// State: Loading
const isLoading = ref(false);
const isTableLoading = ref(false);

// Composable: pagination
const itemsPerPage = ref<number>(100);
const totalColumns = ref<number>(5);

const { currentPage, perPage, totalRow, totalPages, nextPage, prevPage, pageNow, pages } =
  usePagination(fetchData, { perPage: itemsPerPage.value });

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

// Composable: confirmation
const { showConfirmDialog, confirmTitle, confirmMessage, displayConfirmation, confirm, cancel } =
  useConfirmation();

interface TargetPengumpulan {
  id: number;
  tahun: number;
  infaq: number;
  zakat: number;
  donasi: number;
}

const target_pengumpulan = ref<TargetPengumpulan[]>([]);

// Function: Format Rupiah
const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Function: Modal
const isModalAddOpen = ref(false);
const isModalEditOpen = ref(false);
const selectedTarget = ref<any>(null);

function openModalAdd() {
  isModalAddOpen.value = true;
}

function openModalEdit(target: any) {
  selectedTarget.value = target;
  isModalEditOpen.value = true;
}

const searchYear = ref('');
const availableYears = ref<number[]>([]);
async function fetchAvailableYears() {
  try {
    const response = await get_tahun();
    availableYears.value = response.data;
  } catch (error) {
    displayNotification('Gagal memuat opsi filter tahun', 'error');
  }
}

// Function: Clear search
const clearSearch = () => {
  searchYear.value = '';
  fetchData();
};

async function fetchData() {
  isTableLoading.value = true;
  try {
    const response = await get_target_pengumpulan({
      search: searchYear.value,
      perpage: perPage.value,
      pageNumber: currentPage.value,
    });

    target_pengumpulan.value = response.data;
    totalRow.value = response.total;
  } catch (error) {
    displayNotification('Gagal mengambil data target pengumpulan', 'error');
  } finally {
    isTableLoading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([fetchData(), fetchAvailableYears()]);
});

// Function: Delete Data
async function deleteData(id: number) {
  displayConfirmation(
    'Hapus Data Target Pengumpulan',
    'Apakah Anda yakin ingin menghapus data target pengumpulan ini?',
    async () => {
      try {
        isLoading.value = true;
        await delete_target_pengumpulan({ id: id });
        displayNotification('Data target pengumpulan berhasil dihapus', 'success');
        await Promise.all([fetchData(), fetchAvailableYears()]);
      } catch (error) {
        displayNotification('Gagal menghapus data target pengumpulan', 'error');
      } finally {
        isLoading.value = false;
      }
    },
  );
}
</script>

<template>
  <div class="mx-auto p-4">
    <!-- Header -->
    <LoadingSpinner v-if="isLoading" label="Memuat halaman..." />
    <div v-else class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <BaseButton
          @click="openModalAdd()"
          variant="primary"
          :loading="isModalAddOpen || isModalEditOpen"
          type="button"
        >
          <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
          Tambah Target
        </BaseButton>

        <!-- Search by Year -->
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <label for="searchYear" class="text-sm font-medium text-gray-600 whitespace-nowrap"
            >Cari Tahun</label
          >
          <div class="flex gap-2">
            <select
              id="searchYear"
              v-model="searchYear"
              @change="fetchData"
              class="rounded-lg border-gray-300 shadow-sm px-3 py-2 text-gray-700 focus:border-green-900 focus:ring-2 focus:ring-green-900 transition min-w-[120px]"
            >
              <option value="">Semua Tahun</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <button
              v-if="searchYear"
              @click="clearSearch"
              class="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              title="Clear filter"
            >
              <font-awesome-icon icon="fa-solid fa-times" class="text-sm" />
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow">
        <SkeletonTable v-if="isTableLoading" :columns="totalColumns" :rows="itemsPerPage" />
        <table v-else class="w-full border-collapse bg-white text-sm">
          <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
            <tr>
              <th class="w-[10%] px-6 py-3 font-medium">Tahun</th>
              <th class="w-[25%] px-6 py-3 font-medium">Infaq</th>
              <th class="w-[25%] px-6 py-3 font-medium">Zakat</th>
              <th class="w-[25%] px-6 py-3 font-medium">Donasi</th>
              <th class="w-[15%] px-6 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-if="target_pengumpulan.length > 0">
              <tr
                v-for="data in target_pengumpulan"
                :key="data.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 text-center font-medium text-gray-800">
                  {{ data.tahun }}
                </td>
                <td class="px-6 py-4 text-center font-medium text-gray-800">
                  {{ formatRupiah(data.infaq) }}
                </td>
                <td class="px-6 py-4 text-center font-medium text-gray-800">
                  {{ formatRupiah(data.zakat) }}
                </td>
                <td class="px-6 py-4 text-center font-medium text-gray-800">
                  {{ formatRupiah(data.donasi) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center gap-2">
                    <LightButton @click="openModalEdit(data)">
                      <EditIcon />
                    </LightButton>
                    <DangerButton @click="deleteData(data.id)">
                      <DeleteIcon />
                    </DangerButton>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Empty State -->
            <tr v-else>
              <td :colspan="totalColumns" class="px-6 py-8 text-center text-gray-500">
                <font-awesome-icon
                  icon="fa-solid fa-database"
                  class="text-4xl mb-2 text-gray-400"
                />
                <h3 class="mt-2 text-sm font-medium text-gray-900">
                  {{ searchYear ? `Tidak ada data untuk tahun ${searchYear}` : 'Tidak ada data' }}
                </h3>
                <p class="text-sm">
                  {{
                    searchYear
                      ? 'Coba pilih tahun lain atau hapus filter.'
                      : 'Belum ada data target pengumpulan.'
                  }}
                </p>
                <button
                  v-if="searchYear"
                  @click="clearSearch"
                  class="mt-2 text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Hapus Filter
                </button>
              </td>
            </tr>
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

    <!-- Modal FormAdd -->
    <FormAdd
      :is-modal-open="isModalAddOpen"
      @close="
        isModalAddOpen = false;
        fetchData();
        fetchAvailableYears();
      "
      @status="
        (payload: any) =>
          displayNotification(
            payload.error_msg || 'Tambah Target Pengumpulan gagal',
            payload.error ? 'error' : 'success',
          )
      "
    />

    <!-- Modal FormEdit -->
    <FormEdit
      :is-modal-open="isModalEditOpen"
      :selected-target="selectedTarget"
      @close="
        isModalEditOpen = false;
        selectedTarget = null;
        fetchData();
      "
      @status="
        (payload: any) =>
          displayNotification(
            payload.error_msg || 'Update Target Pengumpulan gagal',
            payload.error ? 'error' : 'success',
          )
      "
    />

    <!-- Confirmation -->
    <Confirmation
      :showConfirmDialog="showConfirmDialog"
      :confirmTitle="confirmTitle"
      :confirmMessage="confirmMessage"
    >
      <BaseButton variant="secondary" @click="cancel">Tidak</BaseButton>
      <BaseButton variant="warning" @click="confirm">Ya</BaseButton>
    </Confirmation>

    <!-- Notification -->
    <Notification
      :showNotification="showNotification"
      :notificationType="notificationType"
      :notificationMessage="notificationMessage"
      @close="showNotification = false"
    />
  </div>
</template>

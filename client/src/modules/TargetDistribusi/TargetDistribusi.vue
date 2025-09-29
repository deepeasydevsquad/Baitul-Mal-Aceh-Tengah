<script setup lang="ts">
// Library
import { ref, onMounted, computed } from 'vue';
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
import FormAdd from '@/modules/TargetDistribusi/Widgets/FormAdd.vue';
import FormEdit from '@/modules/TargetDistribusi/Widgets/FormEdit.vue';

// Composable
import { usePagination } from '@/composables/usePaginations';
import { useConfirmation } from '@/composables/useConfirmation';
import { useNotification } from '@/composables/useNotification';

// Service API
import { delete_target, list } from '@/service/target_distribusi';

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

// State Data Bank
const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

interface Data {
  id: number;
  tahun: number;
  asnaf_name: string;
  target_orang: number;
  target_rupiah: number;
}

const datas = ref<Data[]>([]);

// Function: Modal
const isModalAddOpen = ref(false);
const isModalEditOpen = ref(false);
const selectedTarget = ref<any>(null);

function openModalAdd() {
  isModalAddOpen.value = true;
}

function openModalEdit(tahun: any) {
  selectedTarget.value = tahun;
  console.log('selectedTarget Parent', selectedTarget.value);
  isModalEditOpen.value = true;
}

// Function: Fetch Data
const search = ref('');

async function fetchData() {
  isTableLoading.value = true;
  try {
    const response = await list({
      search: search.value,
      perpage: perPage.value,
      pageNumber: currentPage.value,
    });

    datas.value = response.data;
    const tahunUnik = new Set(datas.value.map((d) => d.tahun));
    totalRow.value = tahunUnik.size;
    console.log(datas.value);
  } catch (error) {
    displayNotification('Gagal mengambil data bank', 'error');
  } finally {
    isTableLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
});

const groupByTahun = (arr: Data[]) => {
  return arr.reduce((acc: Record<number, Data[]>, item) => {
    if (!acc[item.tahun]) acc[item.tahun] = [];
    acc[item.tahun].push(item);
    return acc;
  }, {});
};

async function deleteData(tahun: number) {
  displayConfirmation(
    'Hapus Data Target',
    'Apakah Anda yakin ingin menghapus data target ini?',
    async () => {
      try {
        isLoading.value = true;
        await delete_target({ tahun: tahun });
        displayNotification('Data target berhasil dihapus', 'success');
        await fetchData();
      } catch (error) {
        displayNotification('Gagal menghapus data target', 'error');
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

        <!-- Search -->
        <div class="flex items-center w-full sm:w-auto">
          <label for="search" class="mr-2 text-sm font-medium text-gray-600">Cari</label>
          <input
            id="search"
            type="text"
            v-model="search"
            @change="fetchData"
            placeholder="Cari tahun..."
            class="w-full sm:w-64 rounded-lg border-gray-300 shadow-sm px-3 py-2 text-gray-700 focus:border-green-900 focus:ring-2 focus:ring-green-900 transition"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow">
        <SkeletonTable v-if="isTableLoading" :columns="totalColumns" :rows="itemsPerPage" />
        <table v-else class="w-full border-collapse bg-white text-sm">
          <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
            <tr>
              <th class="w-[20%] px-6 py-3 font-medium">Tahun</th>
              <th class="w-[20%] px-6 py-3 font-medium">Nama Asnaf</th>
              <th class="w-[20%] px-6 py-3 font-medium">Target Orang</th>
              <th class="w-[30%] px-6 py-3 font-medium">Target Rupiah</th>
              <th class="w-[10%] px-6 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-if="datas && datas.length">
              <template v-for="(items, tahun) in groupByTahun(datas)" :key="tahun">
                <tr
                  v-for="(data, idx) in items"
                  :key="data.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <!-- Tahun (cuma muncul sekali per tahun, rowspan) -->
                  <td
                    v-if="idx === 0"
                    :rowspan="items.length"
                    class="px-6 py-4 text-center font-medium text-gray-800"
                  >
                    {{ tahun }}
                  </td>

                  <!-- Nama Asnaf -->
                  <td class="px-6 py-4 text-center font-medium text-gray-800">
                    {{ data.asnaf_name }}
                  </td>

                  <!-- Target Orang -->
                  <td class="px-6 py-4 text-center font-medium text-gray-800">
                    {{ data.target_orang }}
                  </td>

                  <!-- Target Rupiah -->
                  <td class="px-6 py-4 text-center font-medium text-gray-800">
                    Rp {{ data.target_rupiah.toLocaleString('id-ID') }}
                  </td>

                  <!-- Aksi -->
                  <td v-if="idx === 0" :rowspan="items.length" class="px-6 py-4">
                    <div class="flex justify-center gap-2">
                      <LightButton @click="openModalEdit(tahun)">
                        <EditIcon />
                      </LightButton>
                      <DangerButton @click="deleteData(tahun)">
                        <DeleteIcon />
                      </DangerButton>
                    </div>
                  </td>
                </tr>
              </template>
            </template>

            <!-- Empty State -->
            <tr v-else>
              <td :colspan="totalColumns" class="px-6 py-8 text-center text-gray-500">
                <font-awesome-icon
                  icon="fa-solid fa-database"
                  class="text-4xl mb-2 text-gray-400"
                />
                <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
                <p class="text-sm">Belum ada data target distribusi.</p>
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
      @close="((isModalAddOpen = false), fetchData())"
      @status="
        (payload: any) => {
          displayNotification(
            payload.error_msg || 'Tambah/Update Target gagal',
            payload.error ? 'error' : 'success',
          );
        }
      "
    />

    <!-- Modal FormEdit -->
    <FormEdit
      :is-modal-open="isModalEditOpen"
      :tahun="selectedTarget"
      @close="((isModalEditOpen = false), fetchData())"
      @status="
        (payload: any) => {
          displayNotification(
            payload.error_msg || 'Tambah/Update Target gagal',
            payload.error ? 'error' : 'success',
          );
          if (!payload.error) isModalEditOpen = false;
        }
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

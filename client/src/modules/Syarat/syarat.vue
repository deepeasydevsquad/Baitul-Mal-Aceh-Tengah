<script setup lang="ts">
// Library
import { ref, onMounted, computed } from 'vue'
import Notification from '@/components/Modal/Notification.vue'
import Confirmation from '@/components/Modal/Confirmation.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import LightButton from '@/components/Button/LightButton.vue'
import EditIcon from '@/components/Icons/EditIcon.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import SkeletonTable from '@/components/SkeletonTable/SkeletonTable.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'
import FormAdd from '@/modules/Syarat/widgets/FormAdd.vue'


// Composable
import { usePagination } from '@/composables/usePagination'
import { useConfirmation } from '@/composables/useConfirmation'
import { useNotification } from '@/composables/useNotification'

// Service API
import { get_syarat, delete_syarat } from '@/service/syarat'

// Function: Loading
const isLoading = ref(false)
const isTableLoading = ref(false)

// Composable: pagination
const itemsPerPage = ref<number>(100)
const totalColumns = ref<number>(3)

const { currentPage, perPage, totalRow, totalPages, nextPage, prevPage, pageNow, pages } =
usePagination(fetchData, { perPage: itemsPerPage.value })

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
useNotification()

// Composable: confirmation
const { showConfirmDialog, confirmTitle, confirmMessage, displayConfirmation, confirm, cancel } =
useConfirmation()

interface Syarat {
  id: number
  img: string
  name: string
}

const dataSyarat = ref<Syarat[]>([])

// Function Modal
const isModalOpen = ref(false)
const selectedSyarat = ref<any>(null)

function openModal(syarat: any = null) {
  selectedSyarat.value = syarat
  isModalOpen.value = true
}

// Function: fetch data
const search = ref('')

async function fetchData() {
  isTableLoading.value = true
  try {
    const response = await get_syarat({
      search: search.value,
      perpage: perPage.value,
      pageNumber: currentPage.value,
    })

    dataSyarat.value = response.data
    totalRow.value = response.total
  } catch (error) {
    displayNotification('Gagal mengambil syarat', 'error')
  } finally {
    isTableLoading.value = false
  }
}

onMounted(async () => {
  await fetchData()
  totalColumns.value = document.querySelectorAll('thead th').length
})

// Function: Delete Data
async function deleteData(id: number) {
  displayConfirmation(
    'Hapus Syarat',
    'Apakah Anda yakin ingin menghapus syarat ini?',
    async () => {
      try {
        isLoading.value = true
        await delete_syarat(id)
        displayNotification('Syarat berhasil dihapus', 'success')
        await fetchData()
      } catch (error) {
        displayNotification('Gagal menghapus syarat', 'error')
      } finally {
        isLoading.value = false
      }
    },
  )
}
</script>

<template>
  <div class="mx-auto p-4">
    <!-- Header -->
    <LoadingSpinner v-if="isLoading" label="Memuat halaman..." />
    <div v-else class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <BaseButton
          @click="openModal()"
          variant="primary"
          :loading="isModalOpen"
          type="button"
        >
          <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
          Tambah Syarat
        </BaseButton>

        <!-- Search -->
        <div class="flex items-center w-full sm:w-auto">
          <label for="search" class="mr-2 text-sm font-medium text-gray-600">Cari</label>
          <input
            id="search"
            type="text"
            v-model="search"
            @change="fetchData"
            placeholder="Cari syarat..."
            class="w-full sm:w-64 rounded-lg border-gray-300 shadow-sm px-3 py-2 text-gray-700
                   focus:border-[#14532d] focus:ring-2 focus:ring-[#14532d] transition"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow">
        <SkeletonTable v-if="isTableLoading" :columns="totalColumns" :rows="itemsPerPage" />
        <table v-else class="w-full border-collapse bg-white text-sm">
          <thead class="bg-gray-50 text-gray-700 text-center">
            <tr>
              <th class="w-[30%] px-6 py-3 font-medium">Syarat</th>
              <th class="w-[30%] px-6 py-3 font-medium">Path</th>
              <th class="w-[30%] px-6 py-3 font-medium">Datetimes</th>
              <th class="w-[10%] px-6 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-if="dataSyarat.length > 0">
              <tr
                v-for="syarat in dataSyarat"
                :key="syarat.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 text-center font-medium text-gray-800">
                  {{ syarat.name }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center gap-2">
                    <LightButton @click="openModal(syarat)">
                      <EditIcon />
                    </LightButton>
                    <DangerButton @click="deleteData(syarat.id)">
                      <DeleteIcon />
                    </DangerButton>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Empty State -->
            <tr v-else>
              <td :colspan="totalColumns" class="px-6 py-8 text-center text-gray-500">
                <font-awesome-icon icon="fa-solid fa-database" class="text-2xl mb-2 text-gray-400" />
                <p class="text-sm">Belum ada syarat.</p>
              </td>
            </tr>
          </tbody>

          <!-- Pagination -->
          <tfoot>
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
      :is-modal-open="isModalOpen"
      :selected-syarat="selectedSyarat"
      @close="isModalOpen = false; fetchData()"
      @status="(payload: any) => displayNotification(payload.err_msg || 'Tambah/Update syarat gagal', payload.error ? 'error' : 'success')"
    />

    <!-- Confirmation -->
    <Confirmation
      :showConfirmDialog="showConfirmDialog"
      :confirmTitle="confirmTitle"
      :confirmMessage="confirmMessage"
    >
      <BaseButton variant="warning" @click="confirm">Ya</BaseButton>
      <BaseButton variant="secondary" @click="cancel">Tidak</BaseButton>
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
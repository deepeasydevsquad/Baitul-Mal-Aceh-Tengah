<script setup lang="ts">
import Pagination from '@/components/Pagination/Pagination.vue'
import requestKeanggotaanService from '@/service/request_keanggotaan'
import DangerButton from '@/components/Button/DangerButton.vue'
import SuccessButton from '@/components/Button/SuccessButton.vue'
import { computed, onMounted, ref } from 'vue'
import ButtonReject from '@/components/Button/ButtonReject.vue'
import Notification from '@/components/Modal/Notification.vue'
import Confirmation from '@/components/Modal/Confirmation.vue'

interface RequestKeanggotaan {
  id: number
  status: 'verified' | 'unverified' | string
  tipe: 'perorangan' | 'kelompok' | string
  fullname: string
  nomor_ktp: string
  nomor_kk: string
  whatsapp_number: string
  birth_date: string
  alamat: string
  username: string
  nama_desa: string
  createdAt: string
  updatedAt: string
}

const searchQuery = ref('')
const data = ref<RequestKeanggotaan[]>([])
const totalItems = ref(0)
const itemsPerPage = 10
const currentPage = ref(1)
const totalPages = ref(1)

const fetchData = async () => {
  try {
    const response = await requestKeanggotaanService.list({
      search: searchQuery.value,
      perpage: itemsPerPage,
      pageNumber: currentPage.value,
      status: filterStatus.value,
    })
    data.value = response.data
    totalItems.value = response.total || response.data.length || 0
    totalPages.value = Math.ceil(response.total / itemsPerPage)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const timeoutId = ref<number | null>(null)

const resetNotificationTimeout = () => {
  if (timeoutId.value) clearTimeout(timeoutId.value)
  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('')

const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  resetNotificationTimeout()
}

const pages = computed<number[]>(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})
const totalColumns = 7 // karena table punya 5 kolom

const handlePrev = () => {
  if (currentPage.value > 1) currentPage.value--
}
const handleNext = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const handlePageNow = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  fetchData()
})

const filterStatus = ref('')
const OptionFilter = [
  { id: 'verified', name: 'Approve' },
  { id: 'unverified', name: 'Reject' },
  { id: '', name: 'Semua' },
]

const showConfirmDialog = ref(false)
const confirmMessage = ref('')
const confirmTitle = ref('')
const confirmAction = ref<(() => void) | null>(null)

const showConfirmation = (title: string, message: string, action: () => void) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmAction.value = action
  showConfirmDialog.value = true
}

const handleApprove = async (id: number) => {
  showConfirmDialog.value = false
  try {
    await requestKeanggotaanService.verifikasi({ id, action: 'approve' })
    displayNotification('Berhasil approve data!', 'success')
    fetchData()
  } catch (e) {
    displayNotification('Gagal approve data!', 'error')
  }
}

const handleReject = async (id: number) => {
  showConfirmDialog.value = false
  try {
    await requestKeanggotaanService.verifikasi({ id, action: 'reject' })
    displayNotification('Berhasil reject data!', 'success')
    fetchData()
  } catch (e) {
    displayNotification('Gagal reject data!', 'error')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 mt-10">
    <div class="flex justify-end items-center mb-6">
      <div class="inline-flex rounded-md shadow-xs" role="group">
        <label for="search" class="block text-sm font-medium text-gray-700 mr-2 mt-3">Filter</label>
        <input
          type="text"
          id="search"
          class="block w-64 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-s-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          v-model="searchQuery"
          @change="fetchData()"
          placeholder="Cari nama / nomor KTP..."
        />
        <select
          v-model="filterStatus"
          style="width: 200px"
          @change="fetchData()"
          class="border-t border-b border-e bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-e-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option v-for="optionC in OptionFilter" :key="optionC.id" :value="optionC.id">
            {{ optionC.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <!-- Header dengan grouping -->
        <thead class="bg-gray-50">
          <tr>
            <th class="text-center px-6 py-4 font-medium font-bold text-gray-900 text-center">Nama</th>
            <th class="text-center px-6 py-4 font-medium font-bold text-gray-900 text-center">Tgl Lahir</th>
            <th class="text-center px-6 py-4 font-medium font-bold text-gray-900 text-center">WhatsApp</th>
            <th class="text-center px-6 py-4 font-medium font-bold text-gray-900 text-center">Username</th>

            <th class="text-center px-6 py-4 font-medium font-bold text-gray-900 text-center">Desa</th>
            <th class="text-center px-6 py-4 font-medium font-bold text-gray-900 text-center">Status</th>
            <th class="text-center px-6 py-4 font-medium font-bold text-gray-900 text-center">Aksi</th>
          </tr>
        </thead>

        <!-- Isi Data -->
        <tbody class="divide-y divide-gray-100 border-t border-gray-100">
          <tr v-for="(item, idx) in data" :key="item.id">
            <td class="px-3 py-2 text-center">{{ item.fullname }}</td>
            <td class="px-3 py-2 text-center">{{ item.birth_date }}</td>
            <td class="px-3 py-2 text-center">{{ item.whatsapp_number }}</td>
            <td class="px-3 py-2 text-center">{{ item.username }}</td>
            <td class="px-3 py-2 text-center">{{ item.nama_desa }}</td>
            <td class="px-3 py-2 text-center">{{ item.status }}</td>
            <td class="px-3 py-2 text-center">
              <div class="flex flex-col items-center gap-2 w-full max-w-xs">
                <div class="flex flex-col gap-2 items-stretch">
                  <template v-if="item.status === 'verified'">
                    <span
                      class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold"
                    >
                      ✔ Verified
                    </span>
                  </template>
                  <template v-else-if="item.status === 'unverified'">
                    <span
                      class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold"
                    >
                      ✖ Unverified
                    </span>
                  </template>
                  <template v-else>
                    <span
                      class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold"
                    >
                      ⚠ Unknown
                    </span>
                  </template>

                  <!-- Approve -->
                  <SuccessButton
                    v-if="item.status == 'process'"
                    class="w-full flex justify-center"
                    @click="
                      showConfirmation(
                        'Konfirmasi Approve',
                        `Yakin mau approve ${item.fullname}?`,
                        () => handleApprove(item.id),
                      )
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </SuccessButton>

                  <!-- Reject -->
                  <ButtonReject
                    v-if="item.status == 'process'"
                    class="w-full flex justify-center"
                    @click="
                      showConfirmation(
                        'Konfirmasi Reject',
                        `Yakin mau reject ${item.fullname}?`,
                        () => handleReject(item.id),
                      )
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </ButtonReject>
                </div>
              </div>
            </td>
          </tr>

          <!-- Kalau data kosong -->
          <tr v-if="data.length === 0">
            <td :colspan="totalColumns" class="text-center py-6 text-gray-500">Data tidak ada</td>
          </tr>
        </tbody>

        <!-- Footer -->
        <tfoot class="bg-gray-100 font-bold">
          <Pagination
            :total-row="totalItems"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :pages="pages"
            :totalColumns="totalColumns"
            @prev-page="handlePrev"
            @next-page="handleNext"
            @page-now="handlePageNow"
          />
        </tfoot>
      </table>
    </div>
  </div>

  <Confirmation
    :showConfirmDialog="showConfirmDialog"
    :confirmTitle="confirmTitle"
    :confirmMessage="confirmMessage"
  >
    <button
      @click="confirmAction && confirmAction()"
      class="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Ya
    </button>
    <button
      @click="showConfirmDialog = false"
      class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Tidak
    </button>
  </Confirmation>
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>

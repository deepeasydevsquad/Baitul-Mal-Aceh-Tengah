<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Import service API
import {
  getBankPengumpulan,
  addBankPengumpulan,
  updateBankPengumpulan,
  deleteBankPengumpulan,
} from '@/service/bank_pengumpulan'

// Import Composables
import { useNotification } from '@/composables/useNotification'
import { useConfirmation } from '@/composables/useConfirmation'
import { usePagination } from '@/composables/usePagination'

// Import komponen UI
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'
import EditIcon from '@/components/Icons/EditIcon.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import Notification from '@/components/Modal/Notification.vue'
import Confirmation from '@/components/Modal/Confirmation.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import LightButton from '@/components/Button/LightButton.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import FormAdd from './Widgets/FormAdd.vue'
import FormEdit from './Widgets/FormEdit.vue'

// Interface definitions
interface Bank {
  id: number
  name: string
}

interface BankPengumpulan {
  id: number
  bank_id: number
  tipe: string
  nomor_akun_bank: string
  nama_akun_bank: string
  createdAt: string | null
  updatedAt: string | null
  Bank?: Bank
}

// Composables
const {
  showNotification,
  notificationType,
  notificationMessage,
  displayNotification,
  hideNotification,
} = useNotification()

const {
  showConfirmDialog,
  confirmTitle,
  confirmMessage,
  displayConfirmation,
  confirm,
  cancel,
} = useConfirmation()

const fetchData = async () => {
  try {
    const response = await getBankPengumpulan({
      search: search.value,
      perpage: perPage.value,
      pageNumber: currentPage.value,
    })
    totalEntries.value = response.total
    dataBankPengumpulan.value = response.data
  } catch (error) {
    displayNotification('Gagal mengambil data.', 'error')
  }
}

const {
  currentPage,
  totalPages,
  totalRow: totalEntries,
  perPage,
  pages,
  nextPage,
  prevPage,
  pageNow,
} = usePagination(fetchData, { perPage: 5 })

// State lokal komponen
const dataBankPengumpulan = ref<BankPengumpulan[]>([])
const search = ref('')
const totalColumns = ref(6)
const isModalAddOpen = ref(false)
const isModalEditOpen = ref(false)
const editData = ref<BankPengumpulan | null>(null)
const isEditLoading = ref(false)
const formAddRef = ref<any>(null)
const formEditRef = ref<any>(null)

// Fungsi untuk mengambil pesan error dari response API
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors[0]?.msg || 'Terjadi kesalahan validasi'
  }
  return 'Terjadi kesalahan pada server'
}

// Handler untuk menyimpan data baru
const handleSaveNewData = async (formData: any) => {
  const payload = {
    bank_id: formData.bank_id,
    tipe: formData.jenisPemasukan,
    nama_akun_bank: formData.namaAkunBank,
    nomor_akun_bank: formData.nomorAkunBank,
  }
  try {
    await addBankPengumpulan(payload)
    isModalAddOpen.value = false
    displayNotification('Data berhasil ditambahkan!', 'success')
    await fetchData()
  } catch (error: any) {
    if (error.response?.data?.errors && formAddRef.value?.parseServerErrors) {
      formAddRef.value.parseServerErrors(error)
      return
    }
    const errorMessage = getErrorMessage(error)
    displayNotification(errorMessage, 'error')
  }
}

// Handler untuk menyimpan data yang diedit
const handleSaveEditData = async (formData: BankPengumpulan) => {
  isEditLoading.value = true
  try {
    await updateBankPengumpulan(formData.id, formData)
    isModalEditOpen.value = false
    displayNotification('Data berhasil diperbarui!', 'success')
    await fetchData()
  } catch (error: any) {
    if (error.response?.data?.errors && formEditRef.value?.parseServerErrors) {
      formEditRef.value.parseServerErrors(error)
      return
    }
    const errorMessage = getErrorMessage(error)
    displayNotification(errorMessage, 'error')
  } finally {
    isEditLoading.value = false
  }
}

// Handler untuk menghapus data
const handleDelete = (item: BankPengumpulan) => {
  const truncatedName =
    item.nama_akun_bank.length > 30
      ? `${item.nama_akun_bank.substring(0, 30)}...`
      : item.nama_akun_bank

  displayConfirmation(
    'Konfirmasi Hapus',
    `Apakah Anda yakin ingin menghapus data atas nama "${truncatedName}"?`,
    async () => {
      try {
        await deleteBankPengumpulan(item.id)
        displayNotification('Data berhasil dihapus.', 'success')
        await fetchData()
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Gagal menghapus data. Silakan coba lagi.'
        displayNotification(errorMessage, 'error')
      }
    },
  )
}

// Handler untuk UI
const openModalAdd = () => {
  isModalAddOpen.value = true
}
const handleEdit = (item: BankPengumpulan) => {
  editData.value = { ...item }
  isModalEditOpen.value = true
}

// Lifecycle hook
onMounted(fetchData)
</script>

<template>
  <div class="container mx-auto px-4 mt-10">
    <div class="flex justify-between items-center mb-6">
      <BaseButton
        @click="openModalAdd()"
        variant="primary"
        type="button"
        size="sm"
        :loading="isModalAddOpen"
      >
        <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
        Tambahkan Bank Pengumpulan
      </BaseButton>
      <div class="flex items-center w-full sm:w-auto">
        <label for="search" class="mr-2 text-sm font-medium text-gray-600">Cari</label>
        <input
          id="search"
          type="text"
          v-model="search"
          @change="fetchData"
          placeholder="Cari Nama / No. Akun..."
          class="w-full sm:w-64 rounded-lg border-gray-300 shadow-sm px-3 py-2 text-gray-700 focus:border-green-900 focus:ring-2 focus:ring-green-900 transition"
        />
      </div>
    </div>

    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table class="w-full border-collapse bg-white text-left text-sm text-black">
        <thead class="bg-gray-50 border-b border-gray-300">
          <tr>
            <th class="w-[15%] px-6 py-4 font-medium text-center">Nama Bank</th>
            <th class="w-[10%] px-6 py-4 font-medium text-center">Jenis Pemasukan</th>
            <th class="w-[25%] px-6 py-4 font-medium text-center">Nomor Akun</th>
            <th class="w-[25%] px-6 py-4 font-medium text-center">Atas Nama</th>
            <th class="w-[15%] px-6 py-4 font-medium text-center">Tanggal</th>
            <th class="w-[10%] px-6 py-4 font-medium text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-if="dataBankPengumpulan.length > 0"
            v-for="item in dataBankPengumpulan"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td class="w-[15%] px-6 py-4 text-center">{{ item.Bank?.name || 'N/A' }}</td>
            <td class="w-[10%] px-6 py-4 text-center capitalize">{{ item.tipe }}</td>
            <td class="w-[25%] px-6 py-4 text-center">{{ item.nomor_akun_bank }}</td>
            <td class="w-[25%] px-6 py-4 text-center">{{ item.nama_akun_bank }}</td>
            <td class="w-[15%] px-6 py-4 text-center">
              {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-' }}
            </td>
            <td class="w-[10%] px-6 py-4">
              <div class="flex justify-center items-center gap-4">
                <LightButton @click="handleEdit(item)"><EditIcon /></LightButton>
                <DangerButton @click="handleDelete(item)"><DeleteIcon /></DangerButton>
              </div>
            </td>
          </tr>
          <tr v-else>
            <td :colspan="totalColumns" class="px-6 py-4 text-center text-gray-500">
              Tidak ada data untuk ditampilkan.
            </td>
          </tr>
        </tbody>
        <tfoot v-if="dataBankPengumpulan.length > 0" class="bg-gray-100 font-bold">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :pages="pages"
            :total-columns="totalColumns"
            :total-row="totalEntries"
            @prev-page="prevPage"
            @next-page="nextPage"
            @page-now="pageNow"
          />
        </tfoot>
      </table>
    </div>

    <FormAdd
      ref="formAddRef"
      :showModal="isModalAddOpen"
      @close="isModalAddOpen = false"
      @save="handleSaveNewData"
    />
    <FormEdit
      ref="formEditRef"
      :showModal="isModalEditOpen"
      :editData="editData"
      :isLoading="isEditLoading"
      @close="isModalEditOpen = false"
      @save="handleSaveEditData"
    />
    <Confirmation
      :showConfirmDialog="showConfirmDialog"
      :confirmTitle="confirmTitle"
      :confirmMessage="confirmMessage"
    >
      <button
        @click="confirm()"
        class="inline-flex justify-center rounded-md border bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700"
      >
        Ya, Hapus
      </button>
      <button
        @click="cancel()"
        class="mt-3 inline-flex justify-center rounded-md border bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3"
      >
        Batal
      </button>
    </Confirmation>
    <Notification
      :showNotification="showNotification"
      :notificationType="notificationType"
      :notificationMessage="notificationMessage"
      @close="hideNotification()"
    />
  </div>
</template>

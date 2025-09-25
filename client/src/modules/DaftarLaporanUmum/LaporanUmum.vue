<script setup lang="ts">
// Library
import { ref, onMounted } from "vue"
import Notification from '@/components/Modal/Notification.vue'
import Confirmation from '@/components/Modal/Confirmation.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import LightButton from '@/components/Button/LightButton.vue'
import EditIcon from '@/components/Icons/EditIcon.vue'
import DangerButton from '@/components/Button/DangerButton.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import SkeletonTable from '@/components/SkeletonTable/SkeletonTable.vue'

// Composable
import { useNotification } from "@/composables/useNotification"
import { usePagination } from "@/composables/usePagination"
import { useConfirmation } from "@/composables/useConfirmation"

// Service API
import { list } from "@/service/laporan_umum"

// State: Loading
const isLoading = ref(false)

// Composable: pagination
const itemsPerPage = ref<number>(100)
const totalColumns = ref<number>(3)

const { currentPage, perPage, totalRow, totalPages, nextPage, prevPage, pageNow, pages } =
usePagination(fetchData, { perPage: itemsPerPage.value })

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
useNotification()

// Composable: confirmation
const { showConfirmDialog, confirmTitle, confirmMessage, displayConfirmation, } =
useConfirmation()

// State Data
const data = ref<any>(null)

// Function: Fetch Data
async function fetchData() {
  isLoading.value = true
  try {
    const response = await list()
    if (response && response.status) {
      data.value = response.data
      console.log("Data laporan umum:", data.value)
    } else {
      displayNotification("Gagal mengambil data laporan umum", "error")
    }
  } catch (error) {
    displayNotification("Terjadi kesalahan saat mengambil data laporan umum", "error")
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await fetchData()
})

// Utils
const formatRupiah = (value: number) => {
  if (!value) return "Rp 0,-"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}
</script>


<template>
  <div class="p-6">
    <!-- Header -->
    <h2 class="text-lg font-semibold flex items-center mb-2"></h2>
    <!-- Grid Content -->
    <div v-if="data" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Kiri -->
      <div class="space-y-6">
        <!-- Info Umum -->
<div>
  <div class="bg-gray-200 px-4 py-2 font-semibold">INFO UMUM</div>
  <div class="border border-t-0 divide-y">
    <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
      <span>Total Member</span>
      <span>:</span>
      <span>{{ data.info_umum.totalMember }} Orang</span>
    </div>
    <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
      <span>Total Asnaf</span>
      <span>:</span>
      <span>{{ data.info_umum.totalAsnaf }} Asnaf</span>
    </div>
    <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
      <span>Total Program</span>
      <span>:</span>
      <span>{{ data.info_umum.totalProgram }} Program</span>
    </div>
  </div>
</div>


        <!-- Info Program Bantuan -->
        <div>
          <div class="bg-gray-200 px-4 py-2 font-semibold">INFO PROGRAM BANTUAN</div>
          <div class="border border-t-0 divide-y">
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Program Penyaluran</span>
              <span>:</span>
              <span>{{ data.info_program_bantuan.totalProgramPenyaluran }} Program Bantuan</span>
            </div>
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerima Bantuan</span>
              <span>:</span>
              <span>{{ data.info_program_bantuan.totalPenerimaBantuan }} Pemohon</span>
            </div>
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penyaluran Bantuan</span>
              <span>:</span>
              <span>{{ formatRupiah(data.info_program_bantuan.totalPenyaluranBantuan) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Kanan -->
      <div class="space-y-6">
        <!-- Total Penerimaan Zakat -->
        <div>
          <div class="bg-gray-200 px-4 py-2 font-semibold">TOTAL PENERIMAAN ZAKAT</div>
          <div class="border border-t-0 divide-y">
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerimaan Zakat Hari Ini</span>
              <span>:</span>
              <span>{{ formatRupiah(data.total_penerima_zakat.totalPenerimaanZakatHariIni) }}</span>
            </div>
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerimaan Zakat Tahun Ini</span>
              <span>:</span>
              <span>{{ formatRupiah(data.total_penerima_zakat.totalPenerimaanZakatTahunIni) }}</span>
            </div>
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerimaan Zakat</span>
              <span>:</span>
              <span>{{ formatRupiah(data.total_penerima_zakat.totalPenerimaanZakat) }}</span>
            </div>
          </div>
        </div>

        <!-- Total Penerimaan Infaq -->
        <div>
          <div class="bg-gray-200 px-4 py-2 font-semibold">TOTAL PENERIMAAN INFAQ</div>
          <div class="border border-t-0 divide-y">
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerimaan Infaq Hari Ini</span>
              <span>:</span>
              <span>{{ formatRupiah(data.total_penerimaan_infaq.totalPenerimaanInfaqHariIni) }}</span>
            </div>
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerimaan Infaq Tahun Ini</span>
              <span>:</span>
              <span>{{ formatRupiah(data.total_penerimaan_infaq.totalPenerimaanInfaqTahunIni) }}</span>
            </div>
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerimaan Infaq</span>
              <span>:</span>
              <span>{{ formatRupiah(data.total_penerimaan_infaq.totalPenerimaanInfaq) }}</span>
            </div>
          </div>
        </div>

        <!-- Total Penerimaan Donasi -->
        <div>
          <div class="bg-gray-200 px-4 py-2 font-semibold">TOTAL PENERIMAAN DONASI</div>
          <div class="border border-t-0 divide-y">
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerimaan Donasi Hari Ini</span>
              <span>:</span>
              <span>{{ formatRupiah(data.total_penerimaan_donasi.totalPenerimaanDonasiHariIni) }}</span>
            </div>
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerimaan Donasi Tahun Ini</span>
              <span>:</span>
              <span>{{ formatRupiah(data.total_penerimaan_donasi.totalPenerimaanDonasiTahunIni) }}</span>
            </div>
            <div class="grid grid-cols-[1fr_20px_1fr] px-4 py-2">
              <span>Total Penerimaan Donasi</span>
              <span>:</span>
              <span>{{ formatRupiah(data.total_penerimaan_donasi.totalPenerimaanDonasi) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center text-gray-500 py-10">
      Memuat data laporan umum...
    </div>
  </div>
</template>

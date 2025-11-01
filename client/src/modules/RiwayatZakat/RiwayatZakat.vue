<script setup lang="ts">
// Library
import { ref, onMounted, getCurrentInstance } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import Confirmation from '@/components/Modal/Confirmation.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import LightButton from '@/components/Button/LightButton.vue';
import ButtonGreen from '@/components/Button/ButtonGreen.vue';
import DangerButton from '@/components/Button/DangerButton.vue';
import DeleteIcon from '@/components/Icons/DeleteIcon.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import SkeletonTable from '@/components/SkeletonTable/SkeletonTable.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';
import FormAdd from '@/modules/RiwayatZakat/widgets/FormAdd.vue';
import FormReject from '@/modules/RiwayatZakat/widgets/FormReject.vue';
import BaseSelect from '@/components/Form/BaseSelect.vue';

// Composable
import { usePagination } from '@/composables/usePaginations';
import { useConfirmation } from '@/composables/useConfirmation';
import { useNotification } from '@/composables/useNotification';
import { useDynamicLabel } from '@/composables/useDynamicLabel';

// Service API
import { list, delete_riwayat_zakat, setujui_pembayaran_zakat } from '@/service/riwayat_zakat';

// Store
import { MessageTabZakat } from '@/stores/message';

// Global Properties
const { appContext } = getCurrentInstance()!;

const $formatToRupiah = appContext.config.globalProperties.$formatToRupiah;

const message = MessageTabZakat();

// State: Loading
const isLoading = ref(false);
const isTableLoading = ref(false);

// Composable: pagination
const itemsPerPage = ref<number>(100);
const totalColumns = ref<number>(6);

const { currentPage, perPage, totalRow, totalPages, nextPage, prevPage, pageNow, pages } =
  usePagination(fetchData, { perPage: itemsPerPage.value });

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

// Composable: confirmation
const { showConfirmDialog, confirmTitle, confirmMessage, displayConfirmation, confirm, cancel } =
  useConfirmation();

// Composable: dynamic label
const { dynamicLabel } = useDynamicLabel();

interface RiwayatZakat {
  id: number;
  member_id: number;
  member_name: string;
  member_nik: string;
  invoice: string;
  type: string;
  nominal: number;
  kode: string;
  status: string;
  alasan_penolakan: string;
  tipe_pembayaran: string;
  nominal_transfer: number;
  bukti_transfer: string;
  nominal_setoran: number;
  bukti_setoran: string;
  posisi_uang: string;
  konfirmasi_pembayaran: string;
  datetimes: string;
}

const dataRiwayatZakat = ref<RiwayatZakat[]>([]);

// Function: Modal
const isModalAddOpen = ref(false);

function openModalAdd() {
  isModalAddOpen.value = true;
}

// Function: Fetch Data
const search = ref('');
const selectStatus = ref('process');
const selectStatusKonfirmasi = ref('belum_dikirim');
const selectTipePembayaran = ref('');
const id = ref(0);

async function fetchData() {
  isTableLoading.value = true;
  try {
    const response = await list({
      search: search.value,
      perpage: perPage.value,
      pageNumber: currentPage.value,
      status: selectStatus.value,
      tipe_pembayaran: selectTipePembayaran.value,
      konfirmasi_pembayaran: selectStatusKonfirmasi.value,
    });

    dataRiwayatZakat.value = response.data.list;

    // gunakan variabel berbeda untuk HTML
    let htmlMessage = `

    `;
    if (response.data.pembayaran_online_dikirim > 0) {
      htmlMessage += `<span class="text-green-500">
        Terdapat ${response.data.pembayaran_online_dikirim} transaksi pembayaran online yang telah dikirim.
      </span>`;
    }

    if (response.data.total_saldo_dikantor > 0) {
      if (htmlMessage != '') {
        htmlMessage += `<br />`;
      }
      htmlMessage += `
       <span class="text-red-500">
          Saldo kas di kantor saat ini berjumlah ${$formatToRupiah(response.data.total_saldo_dikantor)}.
        </span>
      `;
    }

    // panggil setString pada store, bukan pada string
    message.setString(`
      <div class="text-sm text-gray-600 text-right">
        ${htmlMessage}
      </div>
    `);

    totalRow.value = response.total;
    console.log(dataRiwayatZakat.value);
  } catch (error) {
    displayNotification('Gagal mengambil data riwayat_zakat', 'error');
  } finally {
    isTableLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
});

// Function: Delete Data
async function deleteData(id: number) {
  displayConfirmation(
    'Hapus Data Riwayat Zakat',
    'Apakah Anda yakin ingin menghapus data riwayat zakat ini?',
    async () => {
      try {
        isLoading.value = true;
        await delete_riwayat_zakat(id);
        displayNotification('Data riwayat zakat berhasil dihapus', 'success');
        await fetchData();
      } catch (error: any) {
        displayNotification(error.response.data.error_msg, 'error');
      } finally {
        isLoading.value = false;
      }
    },
  );
}

async function approveOnline(id: number, status_kirim: string) {
  async function setujui(id: number) {
    try {
      isLoading.value = true;
      await setujui_pembayaran_zakat(id);
      displayNotification('Pembayaran zakat berhasil disetujui', 'success');
      await fetchData();
    } catch (error: any) {
      displayNotification(error.response.data.error_msg, 'error');
    } finally {
      isLoading.value = false;
    }
  }
  // Implementation for approving online payment
  if (status_kirim === 'belum_dikirim') {
    displayConfirmation(
      'Setujui Permohonan Pembayaran Zakat Online',
      'Biaya untuk permohonan pembayaran zakat ini belum dikirim. Apakah Anda yakin ingin menyetujui permohonan ini?',
      async () => {
        await setujui(id);
      },
    );
  } else {
    await setujui(id);
  }
}

const isModalRejectOpen = ref(false);
async function rejectOnline(idl: number) {
  isModalRejectOpen.value = true;
  id.value = idl;
}

async function uploadBuktiTransfer(id: number) {
  // Implementation for uploading transfer proof
}

async function cetakSuratSerahTerimaZakat(id: number) {
  // Implementation for printing receipt letter
}

async function uploadBuktiSetoranZakat(id: number) {
  // Implementation for uploading deposit proof
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
          :loading="isModalAddOpen"
          type="button"
        >
          <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
          {{ dynamicLabel('Tambah Riwayat Zakat') }}
        </BaseButton>
        <!-- Search -->
        <div class="flex items-center w-full sm:w-auto gap-2">
          <label for="search" class="mr-2 text-sm font-medium text-gray-600">Filter</label>

          <!-- Status -->
          <BaseSelect
            v-model="selectStatus"
            :options="[
              { value: 'process', label: 'Proses' },
              { value: 'success', label: 'Sukses' },
              { value: 'failed', label: 'Gagal' },
            ]"
            placeholder="Semua Status"
            @change="fetchData"
          />

          <!-- Status Konfirmasi -->
          <BaseSelect
            v-model="selectStatusKonfirmasi"
            :options="[
              { value: 'belum_dikirim', label: 'Belum Dikirim' },
              { value: 'sudah_dikirim', label: 'Sudah Dikirim' },
            ]"
            placeholder="Semua Status Konfirmasi"
            @change="fetchData"
          />

          <BaseSelect
            v-model="selectTipePembayaran"
            :options="[
              { value: 'online', label: 'Online' },
              { value: 'transfer', label: 'Transfer' },
              { value: 'cash', label: 'Cash' },
            ]"
            placeholder="Semua Tipe Pembayaran"
            @change="fetchData"
          />

          <!-- Search -->
          <input
            id="search"
            type="text"
            v-model="search"
            @change="fetchData"
            placeholder="Cari Nama / Nomor Nik / Nomor Akun..."
            class="w-full sm:w-86 rounded-lg border-gray-300 shadow-sm px-3 py-2 text-gray-700 focus:border-green-900 focus:ring-2 focus:ring-green-900 transition"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow-md">
        <SkeletonTable v-if="isTableLoading" :columns="totalColumns" :rows="itemsPerPage" />
        <table v-else class="w-full border-collapse bg-white text-sm">
          <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
            <tr>
              <th
                class="w-[30%] text-center px-6 py-4 font-medium font-bold text-gray-900 text-center"
              >
                Info Member
              </th>
              <th
                class="w-[30%] text-center px-6 py-4 font-medium font-bold text-gray-900 text-center"
              >
                Info Pemasukan
              </th>
              <th
                class="w-[10%] text-center px-6 py-4 font-medium font-bold text-gray-900 text-center"
              >
                Status
              </th>
              <th
                class="w-[10%] text-center px-6 py-4 font-medium font-bold text-gray-900 text-center"
              >
                Status Konfirmasi
              </th>
              <th
                class="w-[10%] text-center px-6 py-4 font-medium font-bold text-gray-900 text-center"
              >
                Datetimes
              </th>
              <th
                class="w-[10%] text-center px-6 py-4 font-medium font-bold text-gray-900 text-center"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-if="dataRiwayatZakat.length > 0">
              <tr
                v-for="riwayat_zakat in dataRiwayatZakat"
                :key="riwayat_zakat.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 text-start align-middle w-[30%] align-top">
                  <table class="w-full border border-gray-300 rounded-lg">
                    <tbody>
                      <tr class="border-b border-gray-300">
                        <td class="w-[40%] bg-gray-100 px-4 py-2 font-medium">Nama Muzakki</td>
                        <td class="px-4 py-2 font-medium w-full text-right">
                          {{ riwayat_zakat.member_name }}
                        </td>
                      </tr>
                      <tr class="border border-gray-300">
                        <td class="bg-gray-100 px-4 py-2 font-medium">NIK Muzakki</td>
                        <td class="px-4 py-2 font-medium w-full text-right">
                          {{ riwayat_zakat.member_nik }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td class="px-6 py-4 text-start font-medium text-gray-800 w-[30%] align-top">
                  <table class="w-full border border-gray-300 rounded-lg">
                    <tbody>
                      <tr class="border border-gray-300">
                        <td class="w-[40%] bg-gray-100 px-4 py-2 font-medium">Invoice</td>
                        <td class="px-4 py-2 font-medium w-full text-right">
                          #{{ riwayat_zakat.invoice }}
                        </td>
                      </tr>
                      <tr class="border border-gray-300">
                        <td class="bg-gray-100 px-4 py-2 font-medium">Nominal Zakat</td>
                        <td class="px-4 py-2 font-medium w-full text-right">
                          {{ $formatToRupiah(riwayat_zakat.nominal) }}
                        </td>
                      </tr>
                      <tr
                        class="border border-gray-300"
                        v-if="riwayat_zakat.tipe_pembayaran == 'online'"
                      >
                        <td class="bg-gray-100 px-4 py-2 font-medium">Kode</td>
                        <td class="px-4 py-2 font-medium w-full text-right text-red-500">
                          {{ $formatToRupiah(riwayat_zakat.kode) }}
                        </td>
                      </tr>
                      <tr
                        class="border border-gray-300"
                        v-if="riwayat_zakat.tipe_pembayaran == 'online'"
                      >
                        <td class="bg-gray-100 px-4 py-2 font-medium">Total Dikirim</td>
                        <td class="px-4 py-2 font-medium w-full text-right text-red-500">
                          {{ $formatToRupiah(riwayat_zakat.nominal + riwayat_zakat.kode) }}
                        </td>
                      </tr>
                      <tr class="border border-gray-300">
                        <td class="bg-gray-100 px-4 py-2 font-medium">Tipe Pembayaran</td>
                        <td class="px-4 py-2 font-medium w-full text-right">
                          {{ riwayat_zakat.tipe_pembayaran }}
                        </td>
                      </tr>
                      <tr class="border border-gray-300" v-if="riwayat_zakat.status == 'failed'">
                        <td class="bg-gray-100 px-4 py-2 font-medium text-red">Alasan Penolakan</td>
                        <td class="px-4 py-2 font-medium w-full text-right text-red">
                          {{ riwayat_zakat.alasan_penolakan }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td class="px-6 py-4 text-center font-bold text-gray-800">
                  <span
                    :class="{
                      'text-green-500': riwayat_zakat.status === 'success',
                      'text-yellow-500': riwayat_zakat.status === 'process',
                      'text-red-500': riwayat_zakat.status === 'failed',
                    }"
                  >
                    {{
                      {
                        success: 'SUKSES',
                        process: 'PROSES',
                        failed: 'GAGAL',
                      }[riwayat_zakat.status]
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center font-bold text-gray-800">
                  <span
                    :class="
                      riwayat_zakat.konfirmasi_pembayaran === 'sudah_dikirim'
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  >
                    {{
                      riwayat_zakat.konfirmasi_pembayaran === 'sudah_dikirim'
                        ? 'SUDAH DIKIRIM'
                        : 'BELUM DIKIRIM'
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center font-medium text-gray-800">
                  {{ riwayat_zakat.datetimes }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center gap-2">
                    <ButtonGreen
                      v-if="
                        riwayat_zakat.tipe_pembayaran == 'online' &&
                        riwayat_zakat.status == 'process'
                      "
                      title="Setujui Permohonan"
                      @click="approveOnline(riwayat_zakat.id, riwayat_zakat.konfirmasi_pembayaran)"
                    >
                      <font-awesome-icon icon="fa-solid fa-check" />
                    </ButtonGreen>
                    <DangerButton
                      v-if="
                        riwayat_zakat.tipe_pembayaran == 'online' &&
                        riwayat_zakat.status == 'process'
                      "
                      title="Reject Permohonan"
                      @click="rejectOnline(riwayat_zakat.id)"
                    >
                      <font-awesome-icon icon="fa-solid fa-ban" />
                    </DangerButton>
                    <LightButton
                      v-if="riwayat_zakat.tipe_pembayaran == 'transfer'"
                      title="Upload Bukti Transfer"
                      @click="uploadBuktiTransfer(riwayat_zakat.id)"
                    >
                      <font-awesome-icon icon="fa-solid fa-upload" />
                    </LightButton>
                    <LightButton
                      v-if="
                        riwayat_zakat.tipe_pembayaran == 'cash' &&
                        riwayat_zakat.posisi_uang == 'kantor_baitulmal'
                      "
                      title="Cetak Surat Serah Terima Zakat"
                      @click="cetakSuratSerahTerimaZakat(riwayat_zakat.id)"
                    >
                      <font-awesome-icon icon="fa-solid fa-print" />
                    </LightButton>
                    <LightButton
                      v-if="
                        riwayat_zakat.tipe_pembayaran == 'cash' &&
                        riwayat_zakat.posisi_uang == 'kantor_baitulmal'
                      "
                      @click="uploadBuktiSetoranZakat(riwayat_zakat.id)"
                      title="Upload Bukti Setoran"
                    >
                      <font-awesome-icon icon="fa-solid fa-upload" />
                    </LightButton>
                    <DangerButton @click="deleteData(riwayat_zakat.id)"
                      ><DeleteIcon
                    /></DangerButton>
                  </div>
                </td>
              </tr>
            </template>
            <!-- Empty State -->
            <tr v-else>
              <td :colspan="totalColumns" class="px-6 py-8 text-center text-gray-500">
                <font-awesome-icon
                  icon="fa-solid fa-hand-holding-dollar"
                  class="text-4xl mb-2 text-gray-400"
                />
                <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
                <p class="text-sm">Belum ada data riwayat zakat.</p>
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
      :is-modal-open="isModalAddOpen"
      @close="((isModalAddOpen = false), fetchData())"
      @status="
        (payload: any) =>
          displayNotification(
            payload.error_msg || 'Tambah/Update RiwayatZakat gagal',
            payload.error ? 'error' : 'success',
          )
      "
    />

    <!-- Modal FormReject -->
    <FormReject
      :is-modal-open="isModalRejectOpen"
      :id="id"
      @close="((isModalRejectOpen = false), fetchData())"
      @status="
        (payload: any) =>
          displayNotification(
            payload.error_msg || 'Tambah/Update RiwayatZakat gagal',
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

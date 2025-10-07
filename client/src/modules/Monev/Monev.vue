<script setup lang="ts">
// library
import { ref, computed, onMounted } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import Confirmation from '@/components/Modal/Confirmation.vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import LightButton from '@/components/Button/LightButton.vue';
import DangerButton from '@/components/Button/DangerButton.vue';
import DeleteIcon from '@/components/Icons/DeleteIcon.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';
import SelectField from '@/components/Form/SelectField.vue';
import BaseSelect from '@/components/Form/BaseSelect.vue';
import FormEvaluasi from '@/modules/Monev/widgets/FormEvaluasi.vue';
import FormMonitoring from './widgets/FormMonitoring.vue';

// Composables
import { usePagination } from '@/composables/usePaginations';
import { useConfirmation } from '@/composables/useConfirmation';
import { useNotification } from '@/composables/useNotification';

// Service API
import { get_filter_type, monev_list } from '@/service/monev';
import ButtonGreen from '@/components/Button/ButtonGreen.vue';
import IconDocumentation from '@/components/Icons/IconDocumentation.vue';

// Interface untuk Monev
export interface Monev {
  id: number;
  fullname: string;
  nomor_ktp: string;
  nomor_akun_bank: string;
  nama_kegiatan: string;
  biaya_disetujui: number;
  tanggal_realisasi: string;
  status_realisasi: string;
  datetimes: string;
  jenis_monev: string[];
  status_monitoring: string;
  status_evaluasi: string;
}

const selectedPermohonan = ref();
function openModalEvaluasi(id: number) {
  selectedPermohonan.value = id;
  isModalAddOpen.value = true;
}

function openModalMonitoring(id: number) {
  selectedPermohonan.value = id;
  isModalMonitoringOpen.value = true;
}

// Function: Modal
const isModalAddOpen = ref(false);
const isModalMonitoringOpen = ref(false);

// State
const dataMonev = ref<Monev[]>([]);
const selectedKegiatan = ref('');
const selectedYear = ref('');
const kegiatanOptions = ref<{ value: string; label: string }[]>([]);
const yearOptions = ref<{ value: string; label: string }[]>([]);
const isTableLoading = ref(false);

// Pagination
const itemsPerPage = ref<number>(100);
const totalColumns = ref<number>(5);
const { currentPage, perPage, totalRow, totalPages, nextPage, prevPage, pageNow, pages } =
  usePagination(fetchData, { perPage: itemsPerPage.value });

// Composables: notification & confirmation
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();
const { showConfirmDialog, confirmTitle, confirmMessage, confirm, cancel } = useConfirmation();

async function fetchData() {
  isTableLoading.value = true;
  try {
    //Ambil daftar monev
    const [res, filterRes] = await Promise.all([
      monev_list({
        perPage: perPage.value,
        pageNumber: currentPage.value,
        type_kegiatan: selectedKegiatan.value,
        type_year: selectedYear.value,
      }),
      get_filter_type(),
    ]);

    dataMonev.value = res.data;
    totalRow.value = res.total;
    kegiatanOptions.value = filterRes.data.type_kegiatan;
    yearOptions.value = filterRes.data.type_year;
    console.log(filterRes.data);
    console.log(dataMonev.value);
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    isTableLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div class="p-4 bg-gray-100 rounded">
    <!-- Filter Kegiatan & Tahun -->
    <div class="flex gap-4 mb-4 justify-end">
      <BaseSelect
        v-model="selectedKegiatan"
        :options="kegiatanOptions"
        placeholder="Semua Kegiatan"
        @change="fetchData"
      />
      <BaseSelect
        v-model="selectedYear"
        :options="yearOptions"
        placeholder="Semua Tahun"
        @change="fetchData"
      />
    </div>

    <!-- Loader -->
    <LoadingSpinner v-if="isTableLoading" />

    <div class="overflow-hidden rounded-xl border border-gray-200 shadow">
      <SkeletonTable v-if="isTableLoading" :columns="5" :rows="itemsPerPage" />
      <table v-else class="w-full border-collapse bg-white text-sm">
        <thead class="bg-gray-100 text-gray-700 text-center border-b border-gray-300">
          <tr>
            <th class="px-6 py-3 font-medium w-[30%]">Info Pemohon</th>
            <th class="px-6 py-3 font-medium w-[30%]">Info Program Bantuan</th>
            <th class="px-6 py-3 font-medium w-[20%]">Info Monev</th>
            <th class="px-6 py-3 font-medium w-[10%]">DateTimes</th>
            <th class="px-6 py-3 font-medium w-[10%]">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in dataMonev"
            :key="index"
            class="border-t hover:bg-gray-50 transition-colors"
          >
            <!-- Info Pemohon -->
            <td class="align-top px-4 py-3">
              <table class="w-full border border-gray-300">
                <tbody>
                  <tr class="border-b border-gray-300">
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold w-[40%]">
                      NAMA PEMOHON
                    </th>
                    <td class="px-3 py-2">{{ item.fullname }}</td>
                  </tr>
                  <tr class="border-b border-gray-300">
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">NOMOR KTP PEMOHON</th>
                    <td class="px-3 py-2">{{ item.nomor_ktp }}</td>
                  </tr>
                  <tr>
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">NOMOR REKENING</th>
                    <td class="px-3 py-2">{{ item.nomor_akun_bank }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Info Program Bantuan -->
            <td class="align-top px-4 py-3">
              <table class="w-full border border-gray-300">
                <tbody>
                  <tr class="border-b border-gray-300">
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold w-[40%]">
                      NAMA KEGIATAN
                    </th>
                    <td class="px-3 py-2">{{ item.nama_kegiatan }}</td>
                  </tr>
                  <tr class="border-b border-gray-300 last:border-b-0">
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">BIAYA DISETUJUI</th>
                    <td class="px-3 py-2">{{ $formatToRupiah(item.biaya_disetujui) }}</td>
                  </tr>
                  <tr>
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">STATUS REALISASI</th>
                    <td class="px-3 py-2">
                      {{
                        item.status_realisasi === 'sudah_direalisasi'
                          ? 'SUDAH DIREALISASI'
                          : 'BELUM DIREALISASI'
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">TANGGAL REALISASI</th>
                    <td class="px-3 py-2">{{ item.tanggal_realisasi }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Info Monev -->
            <td class="align-top px-4 py-3">
              <table class="w-full border border-gray-300">
                <tbody>
                  <tr class="border-b border-gray-300">
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">JENIS MONEV</th>
                    <td class="px-3 py-2">{{ item.jenis_monev }}</td>
                  </tr>
                  <tr class="border-b border-gray-300">
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">STATUS MONITORING</th>
                    <td class="px-3 py-2">{{ item.status_monitoring || '-' }}</td>
                  </tr>
                  <tr>
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">STATUS EVALUASI</th>
                    <td class="px-3 py-2">{{ item.status_evaluasi || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- Datetimes -->
            <td class="px-6 py-4 text-center font-medium text-gray-800">
              {{ item.datetimes }}
            </td>

            <!-- Aksi -->
            <td class="align-top text-center px-3 py-3">
              <div class="flex flex-row justify-center gap-2">
                <ButtonGreen @click="openModalEvaluasi(item.id)">
                  <IconDocumentation />
                </ButtonGreen>
                <DangerButton
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  @click="openModalMonitoring(item.id)"
                >
                  <IconDocumentation />
                </DangerButton>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="dataMonev.length === 0">
            <td colspan="5" class="text-center py-3 text-gray-500">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-columns="totalColumns"
        :next-page="nextPage"
        :prev-page="prevPage"
        :pages="pages"
        :page-now="pageNow"
      />
    </div>

    <!-- Modal FormMonitoring -->
    <FormMonitoring
      :is-modal-open="isModalMonitoringOpen"
      :monev_id="selectedPermohonan"
      @close="((isModalMonitoringOpen = false), fetchData())"
      @status="
        async (payload) => {
          if (!payload.error)
            displayNotification(
              payload.error_msg || 'Jawaban Monitoring Berhasil Dikirim',
              payload.error ? 'error' : 'success',
            );
        }
      "
    />

    <!-- Modal FormEvaluasi -->
    <FormEvaluasi
      :is-modal-open="isModalAddOpen"
      :monev_id="selectedPermohonan"
      @close="((isModalAddOpen = false), fetchData())"
      @status="
        async (payload) => {
          if (!payload.error)
            displayNotification(
              payload.error_msg || 'Jawaban Evaluasi Berhasil Dikirim',
              payload.error ? 'error' : 'success',
            );
        }
      "
    />

    <!-- Notification & Confirmation -->
    <Confirmation
      :showConfirmDialog="showConfirmDialog"
      :confirmTitle="confirmTitle"
      :confirmMessage="confirmMessage"
    >
      <BaseButton variant="secondary" @click="cancel">Batal</BaseButton>
      <BaseButton variant="danger" @click="confirm">Ya, Hapus</BaseButton>
    </Confirmation>

    <Notification
      :showNotification="showNotification"
      :notificationType="notificationType"
      :notificationMessage="notificationMessage"
      @close="showNotification = false"
    />
  </div>
</template>

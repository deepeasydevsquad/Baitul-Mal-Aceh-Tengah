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
import FormAdd from '@/modules/Monev/widgets/FormAdd.vue';

// Composables
import { usePagination } from '@/composables/usePaginations';
import { useConfirmation } from '@/composables/useConfirmation';
import { useNotification } from '@/composables/useNotification';

// Service API
import {
  monev_list,
  kirim_jawaban_evaluasi,
  kirim_jawaban_monitoring,
  gabung_status_monev,
} from '@/service/monev';
import ButtonGreen from '@/components/Button/ButtonGreen.vue';
import IconDocumentation from '@/components/Icons/IconDocumentation.vue';
import FormMonitoring from './widgets/FormMonitoring.vue';

// Interface untuk realisasi
export interface Realisasi {
  biaya_disetujui: number;
  status_realisasi: string;
  tanggal_realisasi: string;
}

// Interface untuk Monev
export interface Monev {
  fullname: any;
  nomor_ktp: any;
  id: number;
  nomor_akun_bank: string;
  kegiatan: string;
  jenis_monev: string;
  status_monitoring: string;
  status_evaluasi: string;
  createdAt: string;
  realisasi?: Realisasi[];
  monev: statusMonev;
}

interface statusMonev {
  jenis_monev: string;
  status_monitoring: string;
  status_evaluasi: string;
}

const selectedPermohonan = ref();
function openModalAdd(id: number) {
  isModalAddOpen.value = true;
  selectedPermohonan.value = id;
}

function openModalMonitoring(id: number) {
  isModalMonitoringOpen.value = true;
  selectedPermohonan.value = id;
}
// Interface untuk member
export interface Member {
  id: number;
  fullname: string;
  nomor_ktp: string;
}

// Function: Modal
const isModalAddOpen = ref(false);
const isModalMonitoringOpen = ref(false);

// Interface untuk pertanyaan Monev
export interface PertanyaanMonev {
  id: number;
  pertanyaan: string;
  monev_id: number;
  jenis_monev: 'monitoring' | 'evaluasi';
}

// State
const dataMonev = ref<Monev[]>([]);
const selectedKegiatan = ref('');
const selectedYear = ref('');
const kegiatanOptions = ref<string[]>([]);
const isTableLoading = ref(false);

// State evaluasi
const jawabanEvaluasi = ref<Record<number, string>>({});

// Tahun otomatis (3 tahun sebelum & 3 tahun sesudah)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 7 }, (_, i) => {
  const year = currentYear - 3 + i;
  return { id: year.toString(), name: year.toString() };
});

// Pagination
const itemsPerPage = ref<number>(100);
const totalColumns = ref<number>(5);
const { currentPage, perPage, totalRow, totalPages, nextPage, prevPage, pageNow, pages } =
  usePagination(fetchData, { perPage: itemsPerPage.value });

// Composables: notification & confirmation
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();
const { showConfirmDialog, confirmTitle, confirmMessage, confirm, cancel } = useConfirmation();

// Modal Monitoring & Evaluasi
const showMonitoringModal = ref(false);
const showEvaluasiModal = ref(false);
const pertanyaanMonitoring = ref<PertanyaanMonev[]>([]);
const pertanyaanEvaluasi = ref<PertanyaanMonev[]>([]);

async function fetchData() {
  isTableLoading.value = true;
  try {
    //Ambil daftar monev
    const res = await monev_list({ page: currentPage.value, limit: perPage.value });

    let listData: any[] = [];
    let total = 0;

    //Cek struktur API
    if (Array.isArray(res)) {
      listData = res;
      total = res.length;
    } else if (Array.isArray(res?.data?.data?.data)) {
      listData = res.data.data.data;
      total = res.data.data.pagination?.total_data || listData.length;
    } else if (Array.isArray(res?.data?.data)) {
      listData = res.data.data;
      total = res.data.pagination?.total_data || listData.length;
    } else {
      console.warn('Data format tidak dikenali:', res);
      listData = [];
    }

    //Mapping dengan status dari backend
    // Mapping data dari backend (ambil status dari monev[0])
    dataMonev.value = listData.map((item) => {
      const firstMonev = Array.isArray(item.monev) ? item.monev[0] : null;

      return {
        ...item,
        jenis_monev: firstMonev?.jenis_monev || '-',
        status_monitoring: firstMonev?.status_monitoring || 'belum selesai',
        status_evaluasi: firstMonev?.status_evaluasi || 'belum selesai',
        createdAt: item.realisasi?.[0]?.tanggal_realisasi || new Date().toISOString(),
      };
    });

    kegiatanOptions.value = [...new Set(dataMonev.value.map((d) => d.kegiatan))];
    totalRow.value = total;
  } catch (err) {
    console.error('Fetch error:', err);
    showNotification.value = true;
    notificationType.value = 'error';
    notificationMessage.value = 'Gagal memuat data Monev';
  } finally {
    isTableLoading.value = false;
  }
}

onMounted(fetchData);

// Filter gabungan Kegiatan & Tahun
const filteredMonev = computed(() => {
  return dataMonev.value.filter((item) => {
    const kegiatanMatch = selectedKegiatan.value ? item.kegiatan === selectedKegiatan.value : true;
    const yearMatch = selectedYear.value
      ? new Date(item.createdAt).getFullYear().toString() === selectedYear.value
      : true;
    return kegiatanMatch && yearMatch;
  });
});
</script>

<template>
  <div class="p-4 bg-gray-100 rounded">
    <!-- Filter Kegiatan & Tahun -->
    <div class="flex gap-4 mb-4 justify-end">
      <div class="w-48">
        <SelectField
          v-model="selectedKegiatan"
          :options="[
            { id: '', name: 'Semua Kegiatan' },
            ...kegiatanOptions.map((k) => ({ id: k, name: k })),
          ]"
        />
      </div>
      <div class="w-48">
        <SelectField
          v-model="selectedYear"
          :options="[{ id: '', name: 'Pilih Semua Tahun' }, ...years]"
        />
      </div>
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
            <th class="px-6 py-3 font-medium w-[25%]">Info Monev</th>
            <th class="px-6 py-3 font-medium w-[10%]">DateTimes</th>
            <th class="px-6 py-3 font-medium w-[5%]">Aksi</th>
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
                    <td class="px-3 py-2">{{ item.kegiatan }}</td>
                  </tr>
                  <tr
                    v-for="(r, i) in item.realisasi"
                    :key="i"
                    class="border-b border-gray-300 last:border-b-0"
                  >
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">BIAYA DISETUJUI</th>
                    <td class="px-3 py-2">Rp {{ Number(r.biaya_disetujui).toLocaleString() }}</td>
                  </tr>
                  <tr v-if="item.realisasi?.length">
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">STATUS REALISASI</th>
                    <td class="px-3 py-2">{{ item.realisasi[0].status_realisasi }}</td>
                  </tr>
                  <tr v-if="item.realisasi?.length">
                    <th class="bg-gray-200 px-3 py-2 text-left font-semibold">TANGGAL REALISASI</th>
                    <td class="px-3 py-2">{{ item.realisasi[0].tanggal_realisasi }}</td>
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
              {{
                item.realisasi?.[0]?.tanggal_realisasi
                  ? new Date(item.realisasi[0].tanggal_realisasi).toLocaleString('id-ID')
                  : new Date(item.createdAt).toLocaleString('id-ID')
              }}
            </td>

            <!-- Aksi -->
            <td class="align-top text-center px-3 py-3">
              <div class="flex flex-row justify-center gap-2">
                <ButtonGreen @click="openModalAdd(item.id)">
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
      @close="isModalMonitoringOpen = false"
      @status="
        async (payload) => {
          if (!payload.error) await fetchData(); // 🔹 auto refresh data setelah kirim jawaban
          displayNotification(
            payload.error_msg || 'Jawaban Monitoring Berhasil Dikirim',
            payload.error ? 'error' : 'success',
          );
        }
      "
    />

    <!-- Modal FormAdd -->
    <FormAdd
      :is-modal-open="isModalAddOpen"
      :monev_id="selectedPermohonan"
      @close="isModalAddOpen = false"
      @status="
        async (payload) => {
          if (!payload.error) await fetchData(); // 🔹 auto refresh data setelah kirim jawaban
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

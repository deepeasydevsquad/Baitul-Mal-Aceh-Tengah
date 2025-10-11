<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Notification from '@/components/Modal/Notification.vue';
import SkeletonTable from '@/components/SkeletonTable/SkeletonTable.vue';
import SelectField from '@/components/Form/SelectField.vue';
import { useNotification } from '@/composables/useNotification';
import { list_rekap_distribusi_per_kode_asnaf } from '@/service/rekap_distribusi_per_kode_asnaf';
import BaseButton from '@/components/Button/BaseButton.vue';

// ==================== STATE ====================
const isLoading = ref(false);
const isDownloading = ref(false);
const selectedYear = ref(new Date().getFullYear().toString());
const rowsNominal = ref<any[]>([]);
const rowsPenerima = ref<any[]>([]);

// ==================== CONSTANTS ====================
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 7 }, (_, i) => {
  const year = currentYear - 3 + i;
  return { id: year.toString(), name: year.toString() };
});

const months = [
  { key: '01', label: 'JAN' },
  { key: '02', label: 'FEB' },
  { key: '03', label: 'MAR' },
  { key: '04', label: 'APR' },
  { key: '05', label: 'MEI' },
  { key: '06', label: 'JUN' },
  { key: '07', label: 'JUL' },
  { key: '08', label: 'AGS' },
  { key: '09', label: 'SEP' },
  { key: '10', label: 'OKT' },
  { key: '11', label: 'NOV' },
  { key: '12', label: 'DES' },
];

const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification();

// ==================== INTERFACES ====================
interface KegiatanData {
  asnaf: string;
  kode: string;
  kegiatan_id: number;
  valuesNominal: Record<string, number>;
  valuesPenerima: Record<string, number>;
}

interface RowData {
  asnaf: string;
  kode: string;
  kegiatan_id: number;
  values: Record<string, number>;
  total: number;
}

// ==================== FETCH DATA ====================
async function fetchData() {
  isLoading.value = true;
  rowsNominal.value = [];
  rowsPenerima.value = [];

  try {
    const res = await list_rekap_distribusi_per_kode_asnaf({ year: selectedYear.value });
    console.log('📊 Response backend:', res);

    if (!res.success) {
      displayNotification('Data laporan tidak ditemukan');
      return;
    }

    const raw = res.data || [];
    if (!raw.length) {
      displayNotification('Data laporan penyaluran tidak ditemukan');
      return;
    }

    // Map untuk menyimpan data per kegiatan
    const kegiatanMap: Record<string, KegiatanData> = {};

    // Proses data dari API
    raw.forEach((monthData: any) => {
      const month = monthData.month;

      monthData.data.forEach((item: any) => {
        // Key unik: asnaf_id + kegiatan_id (biar tiap kegiatan terpisah)
        const key = `${item.asnaf_id}_${item.kegiatan_id}`;

        // Inisialisasi jika belum ada
        if (!kegiatanMap[key]) {
          kegiatanMap[key] = {
            asnaf: item.asnaf,
            kode: item.kode,
            kegiatan_id: item.kegiatan_id,
            valuesNominal: {},
            valuesPenerima: {},
          };
        }

        // Simpan nilai per bulan
        kegiatanMap[key].valuesNominal[month] = item.total_nominal || 0;
        kegiatanMap[key].valuesPenerima[month] = item.total_penerima || 0;
      });
    });

    // Build rows untuk tabel nominal
    rowsNominal.value = Object.entries(kegiatanMap).map(([key, data]) => {
      let total = 0;
      const values: Record<string, number> = {};

      months.forEach((m) => {
        const val = data.valuesNominal[m.key] || 0;
        total += val;
        values[m.key] = val;
      });

      return {
        asnaf: data.asnaf,
        kode: data.kode,
        kegiatan_id: data.kegiatan_id,
        values,
        total,
      };
    });

    // Build rows untuk tabel penerima
    rowsPenerima.value = Object.entries(kegiatanMap).map(([key, data]) => {
      let total = 0;
      const values: Record<string, number> = {};

      months.forEach((m) => {
        const val = data.valuesPenerima[m.key] || 0;
        total += val;
        values[m.key] = val;
      });

      return {
        asnaf: data.asnaf,
        kode: data.kode,
        kegiatan_id: data.kegiatan_id,
        values,
        total,
      };
    });

    console.log('✅ Data berhasil diproses:', {
      nominal: rowsNominal.value.length,
      penerima: rowsPenerima.value.length,
    });
  } catch (e: any) {
    console.error('❌ Error fetching data:', e);
    displayNotification(e.response?.data?.message || 'Gagal memuat data', 'error');
  } finally {
    isLoading.value = false;
  }
}

// ==================== PDF UTILS ====================
function fixOklchColors(element: HTMLElement) {
  const all = element.querySelectorAll('*');
  all.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const style = window.getComputedStyle(htmlEl);

    if (style.color.includes('oklch')) htmlEl.style.color = '#000000';
    if (style.backgroundColor.includes('oklch')) htmlEl.style.backgroundColor = '#ffffff';
    if (style.borderColor.includes('oklch')) htmlEl.style.borderColor = '#d1d5db';
  });
}

// ==================== DOWNLOAD PDF ====================
async function downloadPDF() {
  if (isDownloading.value) return;
  if (rowsNominal.value.length === 0) {
    displayNotification('Tidak ada data untuk diunduh', 'error');
    return;
  }

  isDownloading.value = true;

  try {
    const content = document.getElementById('rekap-pdf');
    if (!content) {
      displayNotification('Konten tidak ditemukan', 'error');
      return;
    }

    // Simpan state original
    const originalOverflow = document.body.style.overflow;
    const originalWidth = content.style.width;
    const originalMaxWidth = content.style.maxWidth;

    // Force konten jadi full width & visible
    document.body.style.overflow = 'visible';
    content.style.width = 'max-content';
    content.style.maxWidth = 'none';

    // Fix warna oklch
    fixOklchColors(content);

    // Tunggu layout settle
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Capture ke canvas
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: content.scrollWidth,
      height: content.scrollHeight,
      windowWidth: content.scrollWidth,
      windowHeight: content.scrollHeight,
    });

    // Restore style
    document.body.style.overflow = originalOverflow;
    content.style.width = originalWidth;
    content.style.maxWidth = originalMaxWidth;

    const imgData = canvas.toDataURL('image/png');

    // Buat PDF A4 Landscape
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Convert px to mm
    const imgWidthMM = (canvas.width * 25.4) / 96;
    const imgHeightMM = (canvas.height * 25.4) / 96;

    // Scale untuk fit ke lebar A4
    const scale = pdfWidth / imgWidthMM;
    const scaledHeight = imgHeightMM * scale;

    // Split ke multiple pages jika perlu
    let yPosition = 0;
    while (yPosition < scaledHeight) {
      if (yPosition > 0) pdf.addPage();

      pdf.addImage(imgData, 'PNG', 0, -yPosition, pdfWidth, scaledHeight, '', 'FAST');

      yPosition += pdfHeight;
    }

    // Download
    pdf.save(`Rekap_Penyaluran_Asnaf_${selectedYear.value}.pdf`);
    displayNotification('PDF berhasil diunduh', 'success');
  } catch (error: any) {
    console.error('❌ Error generating PDF:', error);
    displayNotification('Gagal mengunduh PDF: ' + error.message, 'error');
  } finally {
    isDownloading.value = false;
  }
}

// ==================== LIFECYCLE ====================
onMounted(fetchData);
watch(selectedYear, fetchData);
</script>

<template>
  <div class="px-6 py-0 space-y-8">
    <!-- ==================== HEADER ==================== -->
    <div class="flex items-end justify-between gap-4 mb-0">
      <BaseButton @click="downloadPDF" variant="primary" type="button">
        <font-awesome-icon icon="fa-solid fa-download" class="mr-2" />
        Download PDF
      </BaseButton>
      <div class="w-48">
        <SelectField label="Tahun" v-model="selectedYear" :options="years" />
      </div>
    </div>

    <!-- ==================== TABLE ==================== -->
    <div class="mt-0">
      <div id="rekap-pdf" class="overflow-x-auto bg-white p-4 rounded-lg shadow-sm">
        <SkeletonTable v-if="isLoading" :columns="months.length + 3" :rows="6" />

        <table
          v-else
          class="min-w-full table-auto border-collapse bg-white shadow-md rounded-xl overflow-hidden text-sm"
        >
          <!-- TABLE HEAD -->
          <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
            <tr>
              <th class="px-4 py-2 border border-gray-300 font-medium">ASNAF</th>
              <th class="px-4 py-2 border border-gray-300 font-medium">KODE</th>
              <th
                v-for="m in months"
                :key="m.key"
                class="px-4 py-2 border border-gray-300 font-medium"
              >
                {{ m.label }}
              </th>
              <th class="px-4 py-2 border border-gray-300 font-medium">JUMLAH</th>
            </tr>
          </thead>

          <!-- TABLE BODY -->
          <tbody v-if="rowsNominal.length > 0">
            <tr
              v-for="r in rowsNominal"
              :key="`${r.asnaf}_${r.kegiatan_id}`"
              class="even:bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <td class="px-4 py-2 text-left border border-gray-200">{{ r.asnaf }}</td>
              <td class="px-4 py-2 text-left border border-gray-200">{{ r.kode }}</td>
              <td
                v-for="m in months"
                :key="m.key"
                class="px-4 py-2 text-right tabular-nums whitespace-nowrap border border-gray-200"
              >
                {{ $formatToRupiah(r.values[m.key]) }}
              </td>
              <td class="px-4 py-2 text-right font-bold text-indigo-600 border border-gray-200">
                {{ $formatToRupiah(r.total) }}
              </td>
            </tr>
          </tbody>

          <!-- EMPTY STATE -->
          <tbody v-else>
            <tr>
              <td :colspan="months.length + 3" class="text-center py-8 text-gray-500">
                📋 Rekap Penyaluran Per Kode Asnaf Tidak Ditemukan
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ==================== NOTIFICATION ==================== -->
    <Notification
      :showNotification="showNotification"
      :notificationType="notificationType"
      :notificationMessage="notificationMessage"
      @close="showNotification = false"
    />
  </div>
</template>

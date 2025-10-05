<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import Notification from "@/components/Modal/Notification.vue"
import SkeletonTable from "@/components/SkeletonTable/SkeletonTable.vue"
import SelectField from "@/components/Form/SelectField.vue"
import { useNotification } from "@/composables/useNotification"
import { list_rekap_distribusi_per_asnaf } from "@/service/rekap_distribusi_per_asnaf"

const isLoading = ref(false)
const selectedYear = ref(new Date().getFullYear().toString())

// Buat daftar tahun otomatis (3 tahun sebelum & 3 tahun sesudah)
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 7 }, (_, i) => {
  const year = currentYear - 3 + i
  return { id: year.toString(), name: year.toString() } // ✅ sesuai SelectField
})

const months = [
  { key: "01", label: "JAN" },
  { key: "02", label: "FEB" },
  { key: "03", label: "MAR" },
  { key: "04", label: "APR" },
  { key: "05", label: "MEI" },
  { key: "06", label: "JUN" },
  { key: "07", label: "JUL" },
  { key: "08", label: "AGS" },
  { key: "09", label: "SEP" },
  { key: "10", label: "OKT" },
  { key: "11", label: "NOV" },
  { key: "12", label: "DES" },
]

const rowsNominal = ref<any[]>([])
const rowsPenerima = ref<any[]>([])

const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification()

async function fetchData() {
  isLoading.value = true
  rowsNominal.value = []
  rowsPenerima.value = []

  try {
    const res = await list_rekap_distribusi_per_asnaf({ year: selectedYear.value })
    console.log("📊 Response backend:", res)

    if (res.error) {
      displayNotification(res.error_msg || "Data laporan tidak ditemukan")
      return
    }

    const raw = res.data || []
    if (!raw.length) {
      displayNotification("Data laporan penyaluran tidak ditemukan")
      return
    }

    const asnafMap: Record<string, { asnaf: string, valuesNominal: any, valuesPenerima: any }> = {}

    if (raw[0]?.data) {
      raw.forEach((bulan: any) => {
        bulan.data.forEach((item: any) => {
          if (!asnafMap[item.asnaf_id]) {
            asnafMap[item.asnaf_id] = {
              asnaf: item.asnaf,
              valuesNominal: {},
              valuesPenerima: {},
            }
          }
          asnafMap[item.asnaf_id].valuesNominal[bulan.month] = item.total_nominal || 0
          asnafMap[item.asnaf_id].valuesPenerima[bulan.month] = item.total_penerima || 0
        })
      })
    } else {
      raw.forEach((item: any) => {
        if (!asnafMap[item.asnaf_id]) {
          asnafMap[item.asnaf_id] = {
            asnaf: item.asnaf,
            valuesNominal: {},
            valuesPenerima: {},
          }
        }
        asnafMap[item.asnaf_id].valuesNominal[item.month] = item.total_nominal || 0
        asnafMap[item.asnaf_id].valuesPenerima[item.month] = item.total_penerima || 0
      })
    }

    rowsNominal.value = Object.values(asnafMap).map((a: any) => {
      let total = 0
      months.forEach((m) => {
        const val = a.valuesNominal[m.key] || 0
        total += val
        a.valuesNominal[m.key] = val
      })
      return { label: a.asnaf, values: a.valuesNominal, total }
    })

    rowsPenerima.value = Object.values(asnafMap).map((a: any) => {
      let total = 0
      months.forEach((m) => {
        const val = a.valuesPenerima[m.key] || 0
        total += val
        a.valuesPenerima[m.key] = val
      })
      return { label: a.asnaf, values: a.valuesPenerima, total }
    })
  } catch (e: any) {
    displayNotification(e.response?.data?.message || "Gagal memuat data", "error")
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)
watch(selectedYear, fetchData)
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Filter Tahun -->
    <div class="flex justify-end mb-4">
      <div class="w-48">
        <SelectField
          label="Tahun"
          v-model="selectedYear"
          :options="years"
        />
      </div>
    </div>

    <!-- Tabel Nominal Distribusi -->
    <div>
      <h2 class="text-lg font-bold mb-3">Distribusi (Nominal Rupiah)</h2>
      <div class="overflow-x-auto">
        <SkeletonTable v-if="isLoading" :columns="months.length + 3" :rows="rowsNominal.length" />
        <table
          v-else
          class="min-w-full table-auto border-collapse bg-white shadow-md rounded-xl overflow-hidden text-sm"
        >
          <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
            <tr>
              <th class="px-4 py-2">No</th>
              <th class="px-4 py-2">Asnaf</th>
              <th v-for="m in months" :key="m.key" class="px-4 py-2">{{ m.label }}</th>
              <th class="px-4 py-2">Jumlah</th>
            </tr>
          </thead>
          <tbody v-if="rowsNominal.length > 0">
            <tr v-for="(r, i) in rowsNominal" :key="r.label" class="even:bg-gray-50">
              <td class="px-4 py-2 text-center">{{ i + 1 }}</td>
              <td class="px-4 py-2">{{ r.label }}</td>
              <td
                v-for="m in months"
                :key="m.key"
                class="px-4 py-2 text-right tabular-nums whitespace-nowrap"
              >
                {{ $formatToRupiah(r.values[m.key]) }}
              </td>
              <td class="px-4 py-2 text-right font-bold text-indigo-600">
                {{ $formatToRupiah(r.total) }}
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="14" class="text-center py-6 text-gray-500">
                Data laporan penyaluran tidak ditemukan
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabel Jumlah Penerima -->
    <div>
      <h2 class="text-lg font-bold mb-3">Distribusi (Jumlah Penerima)</h2>
      <div class="overflow-x-auto">
        <SkeletonTable v-if="isLoading" :columns="months.length + 3" :rows="rowsPenerima.length" />
        <table
          v-else
          class="min-w-full table-auto border-collapse bg-white shadow-md rounded-xl overflow-hidden text-sm"
        >
          <thead class="bg-gray-50 text-gray-700 text-center border-b border-gray-300">
            <tr>
              <th class="px-4 py-2">No</th>
              <th class="px-4 py-2">Asnaf</th>
              <th v-for="m in months" :key="m.key" class="px-4 py-2">{{ m.label }}</th>
              <th class="px-4 py-2">Jumlah</th>
            </tr>
          </thead>
          <tbody v-if="rowsPenerima.length > 0">
            <tr v-for="(r, i) in rowsPenerima" :key="r.label" class="even:bg-gray-50">
              <td class="px-4 py-2 text-center">{{ i + 1 }}</td>
              <td class="px-4 py-2">{{ r.label }}</td>
              <td
                v-for="m in months"
                :key="m.key"
                class="px-4 py-2 text-center tabular-nums"
              >
                {{ r.values[m.key] || "-" }}
              </td>
              <td class="px-4 py-2 text-center font-bold text-indigo-600">
                {{ r.total }}
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="14" class="text-center py-6 text-gray-500">
                Data laporan penyaluran tidak ditemukan
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Notification
      :showNotification="showNotification"
      :notificationType="notificationType"
      :notificationMessage="notificationMessage"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from "vue";

import { get_info_pengaturan_umum } from "@/service/pengaturan_whatsapp";
import FormKonfigurasi from "./widget/FormKonfigurasi.vue";

// Props
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  showEditButton: {
    type: Boolean,
    default: false,
  },
  showRefreshButton: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: "",
  },
});

// Emits untuk event edit dan refresh
const emit = defineEmits(["edit", "refresh"]);

// State
const dataPengaturan = ref<any>(null);
const isEditOpen = ref(false);
const isLoadingData = ref(false);

// Panggil data
const fetchData = async () => {
  isLoadingData.value = true;
  try {
    const response = await get_info_pengaturan_umum();
    dataPengaturan.value = response.data;
    console.log("Data Pengaturan Umum:", response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoadingData.value = false;
  }
};

// Functions
function openEdit() {
  isEditOpen.value = true;
}

function closeEdit() {
  isEditOpen.value = false;
}

function handleUpdate(newData: any) {
  console.log("Data baru dari form:", newData);

  // Update state dengan data baru
  dataPengaturan.value = { ...dataPengaturan.value, ...newData };

  // Tutup modal
  closeEdit();

  // Optional: emit ke parent jika ada
  emit("edit", dataPengaturan.value);
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Aktif":
      return "bg-green-100 text-green-800";
    case "Tidak Aktif":
      return "bg-red-100 text-red-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function handleEdit() {
  emit("edit", dataPengaturan.value);
}

function handleRefresh() {
  fetchData(); // Refresh data internal
  emit("refresh"); // Emit ke parent jika ada
}

// Lifecycle
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div :class="className">
    <!-- Action Buttons di atas -->
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800">Pengaturan WhatsApp</h2>
      <div class="flex gap-3">
        <button
          @click="openEdit"
          :disabled="!dataPengaturan"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          <svg class="w-4 h-4 mr-2 inline animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit Konfigurasi
        </button>
        <button
          @click="handleRefresh"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          <svg class="w-4 h-4 mr-2 inline hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Modal Edit dengan backdrop animation -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <FormKonfigurasi
        v-if="isEditOpen"
        :initial-data="dataPengaturan"
        @close="closeEdit"
        @submit="handleUpdate"
      />
    </Transition>

    <!-- Loading State -->
    <div
      v-if="props.isLoading || isLoadingData"
      class="overflow-hidden rounded-xl border border-gray-200 shadow"
    >
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-300">
        <div class="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>
      <div class="bg-white">
        <div
          v-for="index in 5"
          :key="index"
          class="flex border-b border-gray-100 last:border-b-0"
        >
          <div class="w-1/3 px-6 py-4 bg-gray-50 border-r border-gray-200">
            <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
          <div class="w-2/3 px-6 py-4">
            <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!dataPengaturan"
      class="overflow-hidden rounded-xl border border-gray-200 shadow"
    >
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-300">
        <h3 class="text-lg font-semibold text-gray-800">INFO PERANGKAT</h3>
      </div>
      <div class="bg-white p-8 text-center">
        <div class="text-gray-400 mb-4">
          <svg
            class="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p class="text-gray-500 text-lg">Belum ada konfigurasi WhatsApp</p>
        <p class="text-gray-400 text-sm mt-2">Silakan klik "Edit Konfigurasi" untuk menambahkan pengaturan</p>
      </div>
    </div>

    <!-- Data Display -->
    <div v-else class="overflow-hidden rounded-xl border border-gray-200 shadow">
      <!-- Header -->
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-300">
        <h3 class="text-lg font-semibold text-gray-800">INFO PERANGKAT WHATSAPP</h3>
      </div>

      <!-- Data Rows -->
      <div class="bg-white">
        <!-- Nomor WA Perangkat -->
        <div v-if="dataPengaturan.whatsapp_number" class="flex border-b border-gray-100">
          <div class="w-1/3 px-6 py-4 bg-gray-50 border-r border-gray-200">
            <span class="font-medium text-gray-700">Nomor WhatsApp</span>
          </div>
          <div class="w-2/3 px-6 py-4">
            <span class="font-medium text-gray-800">
              {{ dataPengaturan.whatsapp_number }}
            </span>
          </div>
        </div>

        <!-- Device Key -->
        <div v-if="dataPengaturan.device_key" class="flex border-b border-gray-100">
          <div class="w-1/3 px-6 py-4 bg-gray-50 border-r border-gray-200">
            <span class="font-medium text-gray-700">Device Key</span>
          </div>
          <div class="w-2/3 px-6 py-4">
            <div class="flex items-center gap-2">
              <span class="font-mono text-sm bg-gray-100 px-3 py-1 rounded break-all flex-1">
                {{ dataPengaturan.device_key }}
              </span>
              <button
                @click="navigator.clipboard?.writeText(dataPengaturan.device_key)"
                class="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-110"
                title="Copy device key"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Tanggal Berlangganan -->
        <div v-if="dataPengaturan.created_at" class="flex border-b border-gray-100">
          <div class="w-1/3 px-6 py-4 bg-gray-50 border-r border-gray-200">
            <span class="font-medium text-gray-700">Tanggal Berlangganan</span>
          </div>
          <div class="w-2/3 px-6 py-4">
            <span class="font-medium text-gray-800">{{ dataPengaturan.created_at }}</span>
          </div>
        </div>

        <!-- Tanggal Berakhir -->
        <div v-if="dataPengaturan.expired_at" class="flex border-b border-gray-100">
          <div class="w-1/3 px-6 py-4 bg-gray-50 border-r border-gray-200">
            <span class="font-medium text-gray-700">Tanggal Berakhir</span>
          </div>
          <div class="w-2/3 px-6 py-4">
            <span class="font-medium text-gray-800">{{ dataPengaturan.expired_at }}</span>
          </div>
        </div>

        <!-- Status Berlangganan -->
        <div v-if="dataPengaturan.status" class="flex">
          <div class="w-1/3 px-6 py-4 bg-gray-50 border-r border-gray-200">
            <span class="font-medium text-gray-700">Status Berlangganan</span>
          </div>
          <div class="w-2/3 px-6 py-4">
            <span
              :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                dataPengaturan.status
              )}`"
            >
              {{ dataPengaturan.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons Bawah (Opsional) -->
    <div v-if="showEditButton || showRefreshButton" class="mt-4 flex justify-end gap-3">
      <button
        v-if="showEditButton"
        @click="handleEdit"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
      >
        Edit Perangkat
      </button>
      <button
        v-if="showRefreshButton"
        @click="handleRefresh"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
      >
        Refresh Data
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles jika diperlukan */
.break-all {
  word-break: break-all;
}

/* Animasi loading */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Notification from "@/components/Modal/Notification.vue";
import BaseButton from "@/components/Button/BaseButton.vue";
import InputText from "@/components/Form/InputText.vue";

// Composable
import { useNotification } from "@/composables/useNotification";

// Service

// Composable: notification
const {
  showNotification,
  notificationType,
  notificationMessage,
  displayNotification,
} = useNotification();

interface Props {
  initialData?: {
    whatsapp_number?: string;
    device_key?: string;
    created_at?: string;
    expired_at?: string;
    status?: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", payload: any): void;
}>();

// Function: Close modal
const closeModal = () => {
  resetForm();
  emit("close");
};

// Function: Reset form
const resetForm = () => {
  if (props.initialData) {
    form.value.whatsapp_number = props.initialData.whatsapp_number || "";
    form.value.device_key = props.initialData.device_key || "";
  } else {
    form.value.whatsapp_number = "";
    form.value.device_key = "";
  }

  // Reset errors
  errors.value = {};
};

// Function: Error handling
const errors = ref<Record<string, string>>({
  whatsapp_number: "",
  device_key: "",
});

const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.value = {};

  if (form.value.whatsapp_number === "") {
    errors.value.whatsapp_number = "Nomor WhatsApp tidak boleh kosong.";
    isValid = false;
  }

  // Validasi format nomor WhatsApp Indonesia
  const phonePattern = /^(\+62|62|0)[0-9]{9,13}$/;
  if (form.value.whatsapp_number && !phonePattern.test(form.value.whatsapp_number.replace(/\s+/g, ''))) {
    errors.value.whatsapp_number = "Format nomor WhatsApp tidak valid (contoh: +6281234567890).";
    isValid = false;
  }

  if (form.value.device_key === "") {
    errors.value.device_key = "Device Key tidak boleh kosong.";
    isValid = false;
  }

  console.log(errors.value);

  return isValid;
};

// Function: Handle submit
const isSubmitting = ref(false);
const form = ref<{ whatsapp_number: string; device_key: string }>({
  whatsapp_number: "",
  device_key: "",
});

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const payload = {
      whatsapp_number: form.value.whatsapp_number,
      device_key: form.value.device_key,
    };

    console.log("Payload yang dikirim:", payload);

    const response = await update_pengaturan_whatsapp(payload);

    console.log("Response dari server:", response);

    // Emit data yang diupdate ke parent dengan preserving data lainnya
    const updatedData = {
      ...props.initialData, // preserve created_at, expired_at, status, dll
      whatsapp_number: form.value.whatsapp_number,
      device_key: form.value.device_key,
    };

    emit("submit", updatedData);

    displayNotification("Konfigurasi WhatsApp berhasil diperbarui", "success");
  } catch (error: any) {
    console.error("Error saat update konfigurasi WhatsApp:", error);

    if (error.response) {
      // server balas error
      displayNotification(
        error.response.data?.error_msg ||
          error.response.data?.message ||
          "Terjadi kesalahan di server",
        "error"
      );
    } else if (error.request) {
      // request dikirim tapi tidak ada respon
      displayNotification("Tidak ada respon dari server", "error");
    } else {
      // error lain (setup axios, dll)
      displayNotification(error.message || "Terjadi kesalahan tidak diketahui", "error");
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Function: Handle escape
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") closeModal();
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
  // Initialize form dengan data awal
  resetForm();
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <Transition
    enter-active-class="transition-all ease-out duration-300"
    enter-from-class="opacity-0 translate-y-8 scale-90"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-8 scale-90"
  >
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-500"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="relative max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6 transform">
        <!-- Header dengan animasi slide dari atas -->
        <div class="flex items-center justify-between animate-slide-down">
          <h2 id="modal-title" class="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-bounce-subtle">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            Edit Konfigurasi WhatsApp
          </h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <!-- Nomor WhatsApp-->
        <div>
          <InputText
            id="whatsapp_number"
            v-model="form.whatsapp_number"
            label="Nomor WhatsApp"
            type="text"
            placeholder="Masukkan nomor WhatsApp (contoh: +6281234567890)"
            :error="errors.whatsapp_number"
          />
        </div>

        <!-- Device Key -->
        <div>
          <InputText
            id="device_key"
            v-model="form.device_key"
            label="Device Key"
            type="text"
            placeholder="Masukkan device key"
            :error="errors.device_key"
          />
        </div>

        <!-- Actions -->
        <div>
          <BaseButton
            type="submit"
            fullWidth
            variant="primary"
            :disabled="isSubmitting"
            @click="handleSubmit"
          >
            <span v-if="isSubmitting">Menyimpan...</span>
            <span v-else>Simpan Perubahan</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Notification -->
  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  />
</template>

<style scoped>
/* Enhanced backdrop animation */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>

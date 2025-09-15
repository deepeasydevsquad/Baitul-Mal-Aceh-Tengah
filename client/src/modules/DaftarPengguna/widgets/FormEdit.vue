<script setup lang="ts">
// Library
import { ref, onMounted, onBeforeUnmount, watch } from "vue"
import Notification from "@/components/Modal/Notification.vue"
import BaseButton from "@/components/Button/BaseButton.vue"
import InputText from "@/components/Form/InputText.vue"
import SelectField from "@/components/Form/SelectField.vue"

// Composable
import { useNotification } from "@/composables/useNotification"

// Service
import {  edit_daftar_pengguna, get_info_edit_daftar_pengguna, list_grup} from "@/service/daftar_pengguna"

// Notification
const {
  showNotification,
  notificationType,
  notificationMessage,
  displayNotification
} = useNotification()

// Props
interface Props {
  isModalOpen: boolean
  selectedPengguna: any
}
const props = defineProps<Props>()

// Emit
const emit = defineEmits<{
  (e: "close"): void
  (e: "status", payload: { error_msg?: string; error?: boolean }): void
}>()

// State
const isSubmitting = ref(false)
const isLoading = ref(false)
const form = ref<{
  id?: number
  name: string
  grup_id: string
  password: string
  password_confirmation: string
}>({
  id: undefined,
  name: "",
  grup_id: "",
  password: "",
  password_confirmation: ""
})
const errors = ref<Record<string, string>>({})
const grupData = ref<any[]>([])

// Reset form
const resetForm = () => {
  form.value = {
    id: undefined,
    name: "",
    grup_id: "",
    password: "",
    password_confirmation: ""
  }
  errors.value = {}
}

// Fetch grup list
const fetch_grup = async () => {
  try {
    // Fetch grup data from the server
    const response = await list_grup()
    grupData.value = response.data
    console.log("grupData.value", grupData.value)

  } catch (error) {
    console.error("Failed to fetch grup data:", error)
  }
}
// Validasi
const validateForm = () => {
  let isValid = true
  errors.value = {}

  if (!form.value.name) {
    errors.value.name = "Nama pengguna tidak boleh kosong."
    isValid = false
  }
  if (!form.value.grup_id) {
    errors.value.grup_id = "Grup tidak boleh kosong."
    isValid = false
  }
  if (form.value.password && form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = "Konfirmasi password tidak sama."
    isValid = false
  }
  return isValid
}

// Ambil data pengguna untuk edit
const fetchData = async () => {
  if (!props.selectedPengguna?.id) return
  isLoading.value = true
  try {
    const response = await get_info_edit_daftar_pengguna(props.selectedPengguna.id)
    form.value.id = response.data.id
    form.value.name = response.data.name
    form.value.grup_id = response.data.grup_id
    form.value.password = ""
    form.value.password_confirmation = ""
  } catch (error) {
    displayNotification("Gagal mengambil data pengguna", "error")
  } finally {
    isLoading.value = false
  }
}

// Submit
const handleSubmit = async () => {
  if (!validateForm()) return
  if (!props.selectedPengguna?.id) {
    displayNotification("ID pengguna tidak valid", "error")
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      id: Number(props.selectedPengguna.id),
      name: String(form.value.name).trim(),
      grup_id: String(form.value.grup_id).trim(),
      password: form.value.password || undefined
    }

    const response = await edit_daftar_pengguna(payload)
    const msg = response.message || response.error_msg || "Berhasil"
    const isError = response.error || false

    emit("status", { error_msg: msg, error: isError })
    closeModal()
  } catch (error: any) {
    const msg =
      error.response?.data?.error_msg ||
      error.response?.data?.message ||
      "Terjadi kesalahan"
    displayNotification(msg, "error")
  } finally {
    isSubmitting.value = false
  }
}

// Tutup modal
const closeModal = () => {
  resetForm()
  emit("close")
}

// Escape
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isModalOpen) closeModal()
}
onMounted(() => {
  document.addEventListener("keydown", handleEscape)
  fetch_grup()
})
onBeforeUnmount(() => document.removeEventListener("keydown", handleEscape))

// Watch perubahan modal
watch(
  () => props.isModalOpen,
  (val) => {
    if (val && props.selectedPengguna?.id) {
      fetchData()
    } else if (!val) {
      resetForm()
    }
  }
)
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="relative max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 id="modal-title" class="text-xl font-semibold text-gray-800">
            EDIT PENGGUNA
          </h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <!-- Input -->
        <InputText
          id="name"
          v-model="form.name"
          label="Nama Pengguna"
          type="text"
          placeholder="Masukkan nama pengguna"
          :error="errors.name"
        />

        <!-- Grup -->
        <div class="flex flex-col">
          <label class="mb-1 text-gray-700">Grup</label>
          <select
            v-model="form.grup_id"
            class="border rounded px-3 py-2"
          >
            <option disabled value="">Pilih grup</option>
            <option v-for="grup in grupData" :key="grup.id" :value="grup.id">
              {{ grup.name }}
            </option>
          </select>
          <p v-if="errors.grup_id" class="text-red-500 text-sm mt-1">{{ errors.grup_id }}</p>
        </div>

        <!-- Password -->
        <InputText
          id="password"
          v-model="form.password"
          label="Password"
          type="password"
          placeholder="Kosongkan jika tidak ingin ganti password"
          :error="errors.password"
        />

        <!-- Konfirmasi Password -->
        <InputText
          id="password_confirmation"
          v-model="form.password_confirmation"
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          :error="errors.password_confirmation"
        />

        <!-- Actions -->
        <div class="pt-4">
          <BaseButton
            type="submit"
            fullWidth
            variant="primary"
            :disabled="isSubmitting"
            @click="handleSubmit"
          >
            <span v-if="isSubmitting">Menyimpan...</span>
            <span v-else>Simpan</span>
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

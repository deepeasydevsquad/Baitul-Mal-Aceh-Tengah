<script setup lang="ts">
// Library
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Notification from '@/components/Modal/Notification.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'
import SelectField from '@/components/Form/SelectField.vue'

// Composable
import { useNotification } from '@/composables/useNotification'

// Service
import { add_syarat, daftar_syarat, detail_syarat } from '@/service/penetapan'
import DeleteIcon from '@/components/Icons/DeleteIcon.vue'

// Notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification()

// Props
interface Props {
  isModalOpen: boolean
  selectedKegiatan: any
}
const props = defineProps<Props>()

// Emit
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'status', payload: { error_msg?: string; error?: boolean }): void
}>()

// State
const isSubmitting = ref(false)
const syaratList = ref<any[]>([{ id: '' }]) // <-- multiple syarat
const errors = ref<Record<string, string>>({})
const syaratOptions = ref<any[]>([])

// Reset form
const resetForm = () => {
  syaratList.value = [{ id: '' }]
  errors.value = {}
}

// Validasi
const validateForm = () => {
  let isValid = true
  errors.value = {}

  syaratList.value.forEach((item, index) => {
    if (!item.id) {
      errors.value[`id_${index}`] = 'Syarat tidak boleh kosong.'
      isValid = false
    }
  })

  return isValid
}

const fetchData = async () => {
  try {
    const response = await daftar_syarat()
    syaratOptions.value = [{ id: '', name: '-- Pilih Syarat --' }, ...response.data]
  } catch (error: any) {
    const msg =
      error.response?.data?.error_msg || error.response?.data?.message || 'Terjadi kesalahan'
    displayNotification(msg, 'error')
  }
}

const fetchDetailSyarat = async () => {
  try {
    const response = await detail_syarat({ kegiatan_id: props.selectedKegiatan })

    // Langsung assign dengan mapping biar sesuai field form
    syaratList.value = response.data.map((s: any) => ({
      id: s.id,
    }))
  } catch (error: any) {
    const msg =
      error.response?.data?.error_msg || error.response?.data?.message || 'Terjadi kesalahan'
    displayNotification(msg, 'error')
  }
}

watch(
  () => props.isModalOpen,
  (val) => {
    if (val) {
      fetchDetailSyarat()
    } else {
      resetForm()
    }
  },
)

onMounted(() => {
  fetchData()
})

// Submit
const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true

  try {
    // bentuk payload sesuai backend
    const payload = syaratList.value.map((s) => ({
      kegiatan_id: props.selectedKegiatan,
      syarat_id: s.id,
    }))

    const response = await add_syarat(payload)

    console.log(response)
    emit('status', { error_msg: response.error_msg, error: response.error })
    closeModal()
  } catch (error: any) {
    const msg =
      error.response?.data?.error_msg || error.response?.data?.message || 'Terjadi kesalahan'
    displayNotification(msg, 'error')
  } finally {
    isSubmitting.value = false
    closeModal()
  }
}

// Tambah syarat baru
const addField = () => {
  syaratList.value.push({ id: '' })
}

// Hapus syarat
const removeField = (index: number) => {
  if (syaratList.value.length > 1) {
    syaratList.value.splice(index, 1)
  }
}

// Close modal
const closeModal = () => {
  if (isSubmitting.value) return
  resetForm()
  emit('close')
}

// Escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isModalOpen) closeModal()
}
onMounted(() => document.addEventListener('keydown', handleEscape))
onBeforeUnmount(() => document.removeEventListener('keydown', handleEscape))
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
    >
      <LoadingSpinner v-if="isSubmitting" label="Menyimpan..." />
      <div v-else class="relative max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">Edit Syarat</h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <!-- Dynamic Syarat -->
        <div class="space-y-4">
          <div v-for="(item, index) in syaratList" :key="index" class="flex items-end gap-2">
            <SelectField
              v-model="item.id"
              :id="`syarat_${index}`"
              :label="index === 0 ? 'Pilih Syarat' : ''"
              placeholder="Pilih syarat"
              :error="errors[`id_${index}`]"
              :options="syaratOptions"
              class="flex-1"
            />
            <button
              v-if="syaratList.length > 1"
              type="button"
              @click="removeField(index)"
              class="px-2 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              <DeleteIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Tombol tambah syarat -->
          <button
            type="button"
            @click="addField"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            + Tambah Syarat
          </button>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-4">
          <BaseButton
            @click="closeModal"
            type="button"
            :disabled="isSubmitting"
            variant="secondary"
          >
            Batal
          </BaseButton>
          <BaseButton
            type="submit"
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

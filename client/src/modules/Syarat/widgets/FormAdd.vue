<script setup lang="ts">
// Library
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Notification from '@/components/Modal/Notification.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import InputFile from '@/components/Form/InputFile.vue'
import InputText from '@/components/Form/InputText.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

// Composable
import { useNotification } from '@/composables/useNotification'

// Service
import { edit_syarat, get_info_edit_syarat } from '@/service/syarat'

// Composable: notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
useNotification()

interface Props {
  isModalOpen: boolean
  selectedBank: any
  selectedSyarat: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'status', payload: { error_msg?: string; error?: boolean }): void
}>()

// Function: Close modal
const closeModal = () => {
  resetForm()
  emit('close')
}

const preview = ref<string | null>(null)

const resetForm = () => {
  form.value.name = ''
  form.value.img = null
  preview.value = null
  errors.value = {}
}

// Function: Validate form
const errors = ref<Record<string, string>>({
  name: '',
  img: '',
})

const validateForm = () => {
  let isValid = true

  // Reset errors
  errors.value = {}

  if (form.value.name === '') {
    errors.value.name = 'Nama syarat tidak boleh kosong.'
    isValid = false
  }

  console.log(errors.value)

  return isValid
}

// State: Loading
const isLoading = ref(true)

// Function: Fetch Data
const fetchData = async () => {
  if (!props.selectedSyarat || !props.selectedSyarat.id) return
  try {
    const response =  await get_info_edit_syarat(props.selectedSyarat.id)
    form.value.name = response.data.name
  } catch {
    displayNotification('Gagal mengambil data syarat', 'error')
  } finally {
    isLoading.value = false
  }
}

// Function: Handle submit
const isSubmitting = ref(false)
const form = ref<{ name: string; img: File | null }>({
  name: '',
  img: null,
})

const handleSubmit = async () => {
  if (!validateForm()) return

  const syarat_id = props.selectedSyarat.id
  const formData = new FormData()
  formData.append('id', syarat_id.toString())
  formData.append('name', form.value.name)
  if (form.value.img) formData.append('img', form.value.img)

  isSubmitting.value = true

  console.log(formData.get('name'))
  console.log(formData.get('img'))

  try {
    const response = await edit_syarat(formData)
    emit('status', { error_msg: response.error_msg, error: response.error })
    closeModal()

  } catch (error: any) {
    displayNotification(error.response.data.error_msg || error.response.data.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Function: Handle escape & Fetch Data
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isModalOpen) closeModal()
}
onMounted(async () => {
  await fetchData()
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(async () => {
  await fetchData()
  document.removeEventListener('keydown', handleEscape)
})

watch(() => props.selectedSyarat, (val) => {
  if (props.isModalOpen && val?.id) fetchData()
})
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
      <LoadingSpinner v-if="isLoading" label="Memuat halaman..." />
      <div
        v-else
        class="relative max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6"
      >
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 id="modal-title" class="text-xl font-semibold text-gray-800">
            Edit Syarat
          </h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <!-- Nama Bank -->
        <div>
          <InputText
            id="name"
            v-model="form.name"
            label="syarat"
            type="text"
            placeholder="Masukkan syarat"
            :error="errors.name"
          />
        </div>

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
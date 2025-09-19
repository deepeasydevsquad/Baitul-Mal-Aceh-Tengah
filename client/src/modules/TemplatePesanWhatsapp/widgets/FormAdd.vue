<script setup lang="ts">
// Library
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Notification from '@/components/Modal/Notification.vue'
import BaseButton from '@/components/Button/BaseButton.vue'
import InputText from '@/components/Form/InputText.vue'
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue'
import SelectField from '@/components/Form/SelectField.vue'
import InputReadonly from '@/components/Form/InputReadonly.vue'

// Composable
import { useNotification } from '@/composables/useNotification'

// Service
import { add_template_pesan_whatsapp } from '@/service/template_pesan_whatsapp'

// Notification
const { showNotification, notificationType, notificationMessage, displayNotification } =
  useNotification()

// Props
interface Props {
  isModalOpen: boolean
}
const props = defineProps<Props>()

// Emit
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'status', payload: { error_msg?: string; error?: boolean }): void
}>()

// State
const isSubmitting = ref(false)
const form = ref<{ name: string; type: string; message: string; variable: string[] }>({
  name: '',
  type: '',
  message: '',
  variable: [],
})
const errors = ref<Record<string, string>>({})

// Reset form
const resetForm = () => {
  form.value = { name: '', type: '', message: '', variable: [] }
  errors.value = {}
}

// Variabel otomatis berdasarkan type
const getVariableByType = (type: string): string[] => {
  switch (type) {
    case 'semua_member':
      return ['{{nama_member}}', '{{nomor_identitas}}']

    case 'semua_surveyor':
      return ['{{nama_surveyor}}']

    case 'semua_user':
      return ['{{nama_user}}']

    case 'pesan_biasa':
    default:
      return []
  }
}

const getMessageByType = (type: string): string => {
  switch (type) {
    case 'semua_member':
      return 'Halo {{nama_member}} '
    case 'semua_surveyor':
      return 'Halo {{nama_surveyor}}'
    case 'semua_user':
      return 'Halo {{nama_user}}'
    case 'pesan_biasa':
    default:
      return ''
  }
}

// Update otomatis saat type berubah
watch(
  () => form.value.type,
  (type) => {
    form.value.variable = getVariableByType(type)
    form.value.message = getMessageByType(type)
  },
)

// Validasi
const validateForm = () => {
  let isValid = true
  errors.value = {}

  if (!form.value.name) {
    errors.value.name = 'Nama template pesan tidak boleh kosong.'
    isValid = false
  }

  if (!form.value.type) {
    errors.value.type = 'Jenis template pesan tidak boleh kosong.'
    isValid = false
  }

  return isValid
}

// Submit
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    const payload = {
      name: form.value.name,
      type: form.value.type,
      message: form.value.message,
      variable: form.value.variable,
    }

    const response = await add_template_pesan_whatsapp(payload)

    if (response && !response.error) {
      emit('status', { error: false })
    } else {
      const msg = response.error_msg || 'Tambah Template Pesan Whatsapp gagal'
      displayNotification(msg, 'error')
      emit('status', { error: true, error_msg: msg })
    }
  } catch (error: any) {
    const msg =
      error.response?.data?.error_msg || error.response?.data?.message || 'Terjadi kesalahan'
    displayNotification(msg, 'error')
    emit('status', { error: true, error_msg: msg })
  } finally {
    isSubmitting.value = false
    closeModal()
  }
}

// Close modal
const closeModal = () => {
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
          <h2 class="text-xl font-semibold text-gray-800">TAMBAH TEMPLATE PESAN BARU</h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <InputText
          v-model="form.name"
          label="Nama Template Pesan Whatsapp"
          type="text"
          placeholder="Masukkan nama template pesan whatsapp"
          :error="errors.name"
        />

        <SelectField
          v-model="form.type"
          id="type"
          label="Jenis Template Pesan Whatsapp"
          placeholder="Pilih Jenis Template"
          :error="errors.type"
          :options="[
            { id: '', name: '-- Pilih Jenis Template --' },
            { id: 'pesan_biasa', name: 'pesan biasa' },
            { id: 'semua_member', name: 'semua member' },
            { id: 'semua_surveyor', name: 'semua surveyor' },
            { id: 'semua_user', name: 'semua user' },
          ]"
        />

        <!-- Muncul setelah pilih type -->
        <div v-if="form.type">
          <InputReadonly label="Variable Otomatis" :value="form.variable.join(', ') || '-'" />
          <div class="mt-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Isi Pesan</label>
            <textarea v-model="form.message" rows="4" class="w-full border rounded-lg p-2" />
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-4">
          <BaseButton fullWidth variant="primary" :disabled="isSubmitting" @click="handleSubmit">
            Simpan
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

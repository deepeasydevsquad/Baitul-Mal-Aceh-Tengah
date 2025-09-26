<script setup lang="ts">
import { ref, watch, reactive, onMounted } from 'vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';
import { getUrutanBagian, create_pertanyaan } from '@/service/pertanyaan_monev';

interface Props {
  isModalOpen: boolean;
  parentPertanyaan: {
    id: number;
    jenis_monev: string;
    tipe: string;
  } | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'status', payload: { error: boolean; error_msg?: string }): void;
}>();

const isSubmitting = ref(false);
const isLoadingData = ref(false);

const formData = ref({
  pertanyaan: '',
  bagian: '',
  bentuk_pertanyaan: 'text',
});

const bagianMonevOptions = ref<string[]>([]);
const bentukPertanyaanOptions = ['text', 'checkbox', 'currency'];

const errors = reactive({
  pertanyaan: '',
  bagian: '',
});

const fetchAllBagianMonev = async () => {
  isLoadingData.value = true;
  try {
    const response = await getUrutanBagian('all');
    bagianMonevOptions.value = response.data;
  } catch (err) {
    console.error('Error fetching all bagian monev:', err);
    emit('status', { error: true, error_msg: 'Gagal memuat daftar bagian.' });
  } finally {
    isLoadingData.value = false;
  }
};

const resetForm = () => {
  formData.value = { pertanyaan: '', bagian: '', bentuk_pertanyaan: 'text' };
  Object.keys(errors).forEach((key) => (errors[key] = ''));
  isSubmitting.value = false;
};

const closeModal = () => {
  emit('close');
};

const validateForm = (): boolean => {
  Object.keys(errors).forEach((key) => (errors[key] = ''));
  let isValid = true;
  if (!formData.value.pertanyaan.trim()) {
    errors.pertanyaan = 'Pertanyaan tidak boleh kosong';
    isValid = false;
  }
  if (!formData.value.bagian) {
    errors.bagian = 'Bagian harus dipilih';
    isValid = false;
  }
  return isValid;
};

async function handleSubmit() {
  if (!validateForm() || isSubmitting.value || !props.parentPertanyaan) return;
  isSubmitting.value = true;
  try {
    const payload = {
      ...formData.value,
      parent_id: props.parentPertanyaan.id,
      jenis_monev: props.parentPertanyaan.jenis_monev,
      tipe: props.parentPertanyaan.tipe,
    };
    await create_pertanyaan(payload);
    emit('status', { error: false, error_msg: 'Sub-pertanyaan berhasil ditambahkan!' });
    closeModal();
  } catch (error) {
    console.error(error);
    emit('status', { error: true, error_msg: 'Gagal menyimpan sub-pertanyaan.' });
  } finally {
    isSubmitting.value = false;
  }
}

watch(
  () => props.isModalOpen,
  (newValue) => {
    if (newValue) {
      resetForm();
      fetchAllBagianMonev();
    }
  },
);
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-75 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="w-full max-w-lg mx-4 p-6 bg-white rounded-lg shadow-xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Tambah Anak Pertanyaan Monev</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
            :disabled="isSubmitting"
          >
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>

        <LoadingSpinner v-if="isLoadingData" label="Memuat data..." />
        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Pertanyaan -->
          <div>
            <label for="sub_pertanyaan" class="block text-sm font-medium text-gray-700 mb-1"
              >Pertanyaan <span class="text-red-500">*</span></label
            >
            <textarea
              id="sub_pertanyaan"
              v-model="formData.pertanyaan"
              :class="[
                'block w-full px-3 py-2 border rounded-md',
                errors.pertanyaan ? 'border-red-500' : 'border-gray-300',
              ]"
              placeholder="Pertanyaan Monev"
              rows="3"
              :disabled="isSubmitting"
            ></textarea>
            <p v-if="errors.pertanyaan" class="mt-1 text-xs text-red-600">
              {{ errors.pertanyaan }}
            </p>
          </div>

          <!-- Bagian -->
          <div>
            <label for="sub_bagian" class="block text-sm font-medium text-gray-700 mb-1"
              >Bagian <span class="text-red-500">*</span></label
            >
            <select
              id="sub_bagian"
              v-model="formData.bagian"
              :class="[
                'block w-full px-3 py-2 border rounded-md',
                errors.bagian ? 'border-red-500' : 'border-gray-300',
              ]"
              :disabled="isSubmitting"
            >
              <option value="" disabled>Pilih Bagian</option>
              <option v-for="b in bagianMonevOptions" :key="b" :value="b">
                {{ b.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) }}
              </option>
            </select>
            <p v-if="errors.bagian" class="mt-1 text-xs text-red-600">{{ errors.bagian }}</p>
          </div>

          <!-- Bentuk Jawaban -->
          <div>
            <label for="sub_bentuk_jawaban" class="block text-sm font-medium text-gray-700 mb-1"
              >Bentuk Jawaban <span class="text-red-500">*</span></label
            >
            <select
              id="sub_bentuk_jawaban"
              v-model="formData.bentuk_pertanyaan"
              class="block w-full px-3 py-2 border rounded-md border-gray-300"
              :disabled="isSubmitting"
            >
              <option
                v-for="opsi in bentukPertanyaanOptions"
                :key="opsi"
                :value="opsi"
                class="capitalize"
              >
                {{ opsi.charAt(0).toUpperCase() + opsi.slice(1) }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <BaseButton
              type="button"
              variant="secondary"
              @click="closeModal"
              :disabled="isSubmitting"
              >Tutup</BaseButton
            >
            <BaseButton
              type="submit"
              variant="primary"
              :loading="isSubmitting"
              :disabled="
                !(
                  formData.bagian &&
                  formData.pertanyaan.trim() &&
                  formData.bentuk_pertanyaan
                )||
                isSubmitting
              "
            >
              <span>Tambah Anak Pertanyaan</span>
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

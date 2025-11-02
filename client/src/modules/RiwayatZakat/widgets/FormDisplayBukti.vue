<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/Button/BaseButton.vue';
import LoadingSpinner from '@/components/Loading/LoadingSpinner.vue';

import { API_URL } from '@/config/config';

interface Props {
  isModalOpen: boolean;
  tipe_pembayaran: string;
  nominal_zakat: number;
  bukti: string;
  nominal_bukti: number;
}

const props = defineProps<Props>();

const isLoading = ref(false);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// Function: Close modal
const closeModal = () => {
  emit('close');
};

const BASE_URL = API_URL;
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
      <div v-else class="relative max-w-xl w-full bg-white shadow-2xl rounded-2xl p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h2 id="modal-title" class="text-xl font-bold text-gray-800">
            Display Bukti {{ props.tipe_pembayaran == 'transfer' ? 'Transfer' : 'Setoran' }}
          </h2>
          <button
            class="text-gray-400 text-lg hover:text-gray-600"
            @click="closeModal"
            aria-label="Tutup modal"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nominal Zakat</label>
            <input
              type="text"
              :value="$formatToRupiah(props.nominal_zakat)"
              class="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1"
              readonly
            />
          </div>
        </div>
        <div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Nominal {{ props.tipe_pembayaran == 'transfer' ? 'Transfer' : 'Setoran' }}</label
            >
            <input
              type="text"
              :value="$formatToRupiah(props.nominal_bukti)"
              class="w-full bg-gray-100 border-gray-300 rounded-md p-2 mt-1"
              readonly
            />
          </div>
        </div>
        <div>
          <div class="col-span-3 mt-3">
            <p class="text-sm text-gray-500 mb-2 font-medium">
              Bukti {{ props.tipe_pembayaran == 'transfer' ? 'Transfer' : 'Setoran' }} :
            </p>
            <div class="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-2">
              <img
                :src="
                  BASE_URL +
                  '/uploads/img/zakat/' +
                  (props.tipe_pembayaran == 'transfer' ? 'bukti_transfer/' : 'bukti_setoran/') +
                  props.bukti
                "
                :alt="`Foto bukti ${props.tipe_pembayaran == 'transfer' ? 'Transfer' : 'Setoran'}`"
                class="object-contain w-full"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <BaseButton @click="closeModal" type="button" variant="secondary"> Tutup </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

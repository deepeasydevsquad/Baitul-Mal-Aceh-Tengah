<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  useSelectedTab,
  useGlobalTab,
  useGlobalActiveTab,
  useTabTerpilih,
} from '../../../../stores/sidebar'
import 'flowbite'
import Surveyor from '@/modules/Surveyor/Surveyor.vue'
import syarat from '@/modules/Syarat/syarat.vue'
import SystemLogSurveyor from '@/modules/SystemLogSurveyor/SystemLogSurveyor.vue'
import Bank from '@/modules/Bank/Bank.vue'
import RequestKeanggotaan from '@/modules/RequestKeanggotaan/RequestKeanggotaan.vue'
import RunningText from '@/modules/RunningText/RunningText.vue'
import BankPengumpulan from '@/modules/BankPengumpulan/BankPengumpulan.vue'
import GrupAkses from '@/modules/GrupAkses/GrupAkses.vue'
import KegiatanKeseketariatan from '@/modules/KegiatanKeseketariatan/KegiatanKeseketariatan.vue'
import kecamatan from '@/modules/Kecamatan/Kecamatan.vue'

const tabComponents = {
  daftar_kecamatan: kecamatan,
  syarat: syarat,
  daftar_bank: Bank,
  running_text: RunningText,
  request_keanggotaan: RequestKeanggotaan,
  daftar_grup_akses: GrupAkses,
  system_log_surveyor: SystemLogSurveyor,
  program_kegiatan_kesekretariatan: KegiatanKeseketariatan,
  daftar_bank_pengumpulan: BankPengumpulan,
  daftar_surveyor: Surveyor,
}

const selectedTab = useSelectedTab() // untuk menampung daftar tab yang menu / submenunya di click
const tab = useGlobalTab()
const activeTab = useGlobalActiveTab()
const tabTerpilih = useTabTerpilih()

//const props = defineProps<{ default: string; tabAwal: any }>()
const mulaiPilihTab = ref(false)

const selectTab = (tabPath: string, key: number) => {
  // tabTerpilih.value = key
  tabTerpilih.setNumber(key)
  activeTab.setString(tabPath) // Menandai tab yang dipilih
  mulaiPilihTab.value = true
}
</script>

<template>
  <!--  -->
  <div class="mb-0 dark:border-gray-700">
    <ul
      class="flex flex-wrap -mb-px text-sm font-medium text-center text-graydark"
      id="default-tab"
      data-tabs-toggle="#default-tab-content"
      role="tablist"
    >
      <li
        class="me-2"
        role="presentation"
        v-for="(item, key) in selectedTab.sharedArray"
        :key="key"
      >
        <button
          class="inline-block p-4 rounded-t-lg rrr"
          :id="`${tab.sharedObject[item.id].path}-tab`"
          :data-tabs-target="`#${tab.sharedObject[item.id].path}`"
          type="button"
          role="tab"
          :aria-controls="`${tab.sharedObject[item.id].path}`"
          :aria-selected="
            activeTab.sharedString === tab.sharedObject[item.id].path ||
            (tabTerpilih.sharedNumber === 0 && key === 0)
              ? 'true'
              : 'false'
          "
          @click="selectTab(tab.sharedObject[item.id].path, key)"
          :class="
            activeTab.sharedString === tab.sharedObject[item.id].path ||
            (tabTerpilih.sharedNumber === 0 && key === 0)
              ? 'AAA bg-white !text-green-900 font-semibold hover:text-green-700 dark:text-green-900 dark:hover:text-green-900 border-[#3a477d] dark:border-[#3a477d]'
              : 'BBB inline-block p-4 rounded-t-lg dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300'
          "
        >
          <font-awesome-icon :icon="tab.sharedObject[item.id].icon" />
          <span class="hidden lg:inline ml-2">
            {{ tab.sharedObject[item.id].name }}
          </span>
        </button>
      </li>
    </ul>
  </div>

  <div id="default-tab-content ">
    <div
      v-for="(item, key) in selectedTab.sharedArray"
      :key="key"
      class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[500px]"
      :class="
        (activeTab.sharedString === tab.sharedObject[item.id].path ||
        (tabTerpilih.sharedNumber === 0 && key === 0)
          ? ''
          : 'hidden') + (key === 0 ? ' rounded-tl-none' : '')
      "
      :id="tab.sharedObject[item.id].path"
      role="tabpanel"
      :aria-labelledby="`${tab.sharedObject[item.id].path}-tab`"
    >
      <p
        class="px-5 mb-5 text-sm text-gray-900 dark:text-white"
        v-html="tab.sharedObject[item.id].desc"
      ></p>
      <component :is="tabComponents[tab.sharedObject[item.id].path]" class="tab"></component>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, nextTick } from 'vue';
import Notification from '@/components/Modal/Notification.vue';
import { initTooltips } from 'flowbite';

const timeoutId = ref<number | null>(null);
const showNotification = ref<boolean>(false);
const notificationMessage = ref<string>('');
const notificationType = ref<'success' | 'error'>('success');
const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  if (timeoutId.value) clearTimeout(timeoutId.value);
  timeoutId.value = window.setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const windowWidth = ref(window.innerWidth);

const dynamicLabel = (val: string) => {
  if (windowWidth.value < 640) {
    // < sm → mobile
    return '';
  } else if (windowWidth.value < 1269) {
    // sm
    return val.slice(0, 8) + '...';
  } else if (windowWidth.value < 1467) {
    // md
    return val.slice(0, 8) + '...';
  } else if (windowWidth.value < 1611) {
    // lg
    return val.slice(0, 13) + '...';
  } else if (windowWidth.value < 1707) {
    // xl
    return val.slice(0, 16) + '...';
  } else {
    // 2xl atau lebih
    return val;
  }
};

const logout = async () => {
  displayNotification('Proses logout berhasil dilakukan.', 'success');
  localStorage.removeItem('member_access_token');
  localStorage.removeItem('member_refresh_token');
  setTimeout(() => {
    window.location.href = '/';
  }, 1200);
};

onMounted(() => {
  const resizeHandler = () => {
    windowWidth.value = window.innerWidth;
  };
  window.addEventListener('resize', resizeHandler);
  nextTick(() => initTooltips());

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
  });
});

const menuItems = [
  {
    id: 'program-bantuan',
    label: 'Program Bantuan',
    icon: 'fa-solid fa-hand-holding-heart',
    bg: 'bg-green-900',
    rounded: 'rounded-tl-lg rounded-bl-lg',
    lgWidth: 'lg:w-46',
  },
  {
    id: 'zakat',
    label: 'Zakat',
    icon: 'fa-solid fa-mosque',
    bg: 'bg-green-800',
    rounded: '',
    lgWidth: 'lg:w-40',
  },
  {
    id: 'infaq',
    label: 'Infaq',
    icon: 'fa-solid fa-coins',
    bg: 'bg-green-700',
    rounded: '',
    lgWidth: 'lg:w-40',
  },
  {
    id: 'donasi',
    label: 'Donasi',
    icon: 'fa-solid fa-gift',
    bg: 'bg-green-600',
    rounded: 'rounded-tr-lg rounded-br-lg',
    lgWidth: 'lg:w-40',
  },
];

const tooltips = [
  { id: 'program-bantuan', label: 'Program Bantuan' },
  { id: 'zakat', label: 'Zakat' },
  { id: 'infaq', label: 'Infaq' },
  { id: 'donasi', label: 'Donasi' },
  { id: 'edit-profil', label: 'Edit Profil' },
  { id: 'logout', label: 'Logout' },
];
</script>
<template>
  <div
    v-for="tooltip in tooltips"
    :key="tooltip.id"
    :id="`tooltip-default-${tooltip.id}`"
    role="tooltip"
    class="absolute invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-graydark rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700 z-999999"
  >
    {{ tooltip.label }}
    <div class="tooltip-arrow" data-popper-arrow></div>
  </div>
  <div class="w-full flex flex-row items-center justify-between gap-8">
    <div class="flex-1 flex justify-start"></div>
    <div class="flex-1 flex justify-center items-center">
      <a
        v-for="item in menuItems"
        :key="item.id"
        href="#"
        class="w-12 h-10 md:w-32"
        :class="[
          item.lgWidth,
          item.bg,
          item.rounded,
          'px-4 py-2.5 hover:bg-green-950 focus:bg-green-950 flex justify-center items-center gap-2 font-semibold text-white text-sm sm:text-[14px]',
        ]"
        :data-tooltip-target="`tooltip-default-${item.id}`"
      >
        <font-awesome-icon :icon="item.icon" />
        <span class="hidden md:inline">{{ dynamicLabel(item.label) }}</span>
      </a>
    </div>
    <div class="flex-1 flex justify-end items-center">
      <a
        href="#"
        class="px-4 py-2.5 h-10 bg-green-900 hover:bg-green-950 focus:bg-green-950 rounded-tl-lg rounded-bl-lg flex justify-center items-center gap-2 text-white font-semibold text-[14px]"
        :data-tooltip-target="`tooltip-default-edit-profil`"
      >
        <font-awesome-icon icon="fa-solid fa-gears" />
        <span class="hidden md:inline">{{ dynamicLabel('Edit Profile') }}</span>
      </a>
      <a
        @click="logout"
        :data-tooltip-target="`tooltip-default-logout`"
        class="px-4 py-2.5 h-10 bg-red-500 hover:bg-red-600 focus:bg-red-600 rounded-tr-lg rounded-br-lg flex justify-center items-center gap-2 text-white font-semibold text-[14px]"
      >
        <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
        <span class="hidden md:inline">{{ dynamicLabel('Logout') }}</span>
      </a>
    </div>
  </div>

  <Notification
    :showNotification="showNotification"
    :notificationType="notificationType"
    :notificationMessage="notificationMessage"
    @close="showNotification = false"
  ></Notification>
</template>

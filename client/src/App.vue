<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { useHead } from '@vueuse/head'

useHead({
  // title: 'Aplikasi Muzakki & Mustahik Kabupaten Aceh Tengah',
  link: [ { rel: 'icon', type: 'image/png', href: 'public/favicon.png' } ],
  meta: [ { name: 'AMRA', content: 'Aplikasi manajemen travel Haji dan Umrah' } ]
});

</script>

<template>
  <RouterView />
</template>

<style scoped></style>

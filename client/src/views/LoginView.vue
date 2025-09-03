<script setup lang="ts">

import { useHead } from '@vueuse/head'

useHead({
  title: 'AMRA :: Aplikasi Manajemen Travel Haji dan Umrah',
  link: [ { rel: 'icon', type: 'image/png', href: 'public/favicon.png' } ],
  meta: [ { name: 'AMRA', content: 'Aplikasi manajemen travel Haji dan Umrah' } ]
});

import LoginCard from '@/components/Login/widgets/LoginCard.vue'

</script>

<template>
  <div class="bg-gray-100 flex items-center justify-center h-screen">
    <LoginCard />
  </div>
</template>

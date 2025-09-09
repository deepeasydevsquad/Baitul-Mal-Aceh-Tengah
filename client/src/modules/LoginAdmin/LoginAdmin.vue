<script setup lang="ts">
import Content from './widgets/Content.vue'
import Footer from './widgets/Footer.vue'
import Header from './widgets/Header.vue'
</script>

<template>
   <LoaderOverlay />
  <div class="min-h-screen flex flex-col bg-white">
    <Header />
    <Content />
  </div>
</template>

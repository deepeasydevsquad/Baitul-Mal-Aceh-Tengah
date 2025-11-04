<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Header from './Widgets/Header.vue';
import Content from './Widgets/Content.vue';
import Form from '@/components/Modal/Form.vue';
import Footer from './Widgets/Footer.vue';
</script>

<template>
  <div class="bg-white">
    <Header />
    <section class="mt-8 flex justify-center">
      <div class="w-full max-w-3xl">
        <Content />
      </div>
    </section>
  </div>
</template>

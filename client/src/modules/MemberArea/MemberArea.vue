<script setup lang="ts">
import Header from './widgets/Header.vue';
import ActionButtons from './widgets/ActionButtons.vue';
import ProgramBantuan from './widgets/ProgramBantuan.vue';
import MainContent from './widgets/MainContent.vue';
import Stats from './widgets/Stats.vue';
</script>

<template>
  <Header />
  <main class="py-6">
    <div class="w-full max-w-[1340px] mx-auto flex flex-col gap-[30px] px-4">
      <ActionButtons />
      <div
        class="w-full p-6 md:p-10 bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row justify-start items-start gap-10 overflow-hidden"
      >
        <ProgramBantuan />
        <MainContent />
      </div>
      <Stats />
    </div>
  </main>
</template>

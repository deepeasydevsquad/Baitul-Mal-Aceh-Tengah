 <script setup lang="ts">
  import { onMounted } from 'vue';
  import Header from './widgets/Header/HeaderArea.vue'
  import Sidebar from './widgets/Sidebar/SidebarArea.vue'
  import Content from './widgets/Content/ContentViews.vue'

 onMounted(() => {
    const token = localStorage.getItem('administrator_access_token');
    if (!token) {
      window.location.href = '/login-admin'; // direct ke root
    }else{
      // get data utama di area member
    }
  });
</script>
<template>
  <div>
    <div class="flex h-screen overflow-hidden">
      <Sidebar />
      <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header />
        <main>
          <div class="mx-auto max-w-screen p-4 md:p-6 2xl:p-10">
            <Content></Content>
            <div
              class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5"
            ></div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

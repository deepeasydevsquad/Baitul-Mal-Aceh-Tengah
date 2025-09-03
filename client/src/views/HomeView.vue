<template>
    <header class="absolute w-full">
      <div class="w-full px-[32px] lg:px-[75px] pt-8 mx-auto flex justify-between">
        <a href="#">
          <img src="/images/logo.png" alt="Logo Baitul Mal" />
        </a>
        <a href="#" class="mt-3">
          <img src="/images/icon_member.svg"/>
        </a>
      </div>
    </header>
    <div class="h-screen flex">
      <!-- Left Column -->
      <div class="bg-left hidden lg:flex w-full lg:w-1/2 px-[75px] items-center justify-center">
        <div class="pt-8 inline-flex flex-col justify-start items-start gap-8">
          <div class="self-stretch flex flex-col justify-start items-start gap-3">
            <div class="justify-start text-neutral-800 text-xl font-medium tracking-tight">
              Selamat Datang di
            </div>
            <img class="w-96 h-32" src="/images/ziwah.png" />
            <div
              class="self-stretch justify-start text-yellow-500 text-[52px] leading-[120%] font-bold tracking-wide"
            >
              Kabupaten Aceh Tengah
            </div>
          </div>
          <div class="w-96 flex flex-col justify-start items-start gap-4">
            <div
              class="self-stretch justify-start text-neutral-800 text-base font-normal tracking-tight"
            >
              Ayo, kita cari tahu bersama program-program bantuan apa saja yang sedang tersedia di
              Baitul Mal Kabupaten Aceh Tengah!
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div class="w-full max-w-md">
          <form class="bg-white rounded-lg shadow-md px-8 pt-6 pb-8 mb-4 mt-8 lg:mt-0">
            <div
              class="text-center justify-center text-gray-800 text-xl font-bold capitalize leading-loose tracking-tight mb-[32px]"
            >
              login area member
            </div>

            <div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm mb-2" for="emailAddress">
                  Email Adress
                </label>
                <input
                  class="border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:border-green-900 focus:ring-green-900"
                  id="emailAddress"
                  type="text"
                  placeholder="Masukkan email anda"
                />
              </div>

              <div class="mb-4">
                <div class="flex justify-between mb-2">
                  <label class="block text-gray-700 text-sm" for="password"> Password </label>
                  <a
                    href="#"
                    class="text-green-900 text-sm font-semibold leading-tight"
                    >Lupa Password?</a
                  >

                </div>
                <input
                  class="border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:border-green-900 focus:ring-green-900"
                  id="password"
                  type="password"
                  placeholder="Masukkan password anda"
                />
              </div>

              <div class="flex mb-4">
                <input
                  type="checkbox"
                  class="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  id="hs-default-checkbox"
                />
                <label for="hs-default-checkbox" class="text-sm text-gray-500 ms-3"
                  >Ingat Saya</label
                >
              </div>

              <div class="flex flex-col items-center justify-between gap-3">
                <button
                  class="w-full bg-[#0E561E] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Masuk
                </button>

                <div class="w-64 h-5 text-center justify-center">
                  <span class="text-gray-600 text-sm font-normal leading-tight"
                    >Belum punya akun ? </span
                  ><span class="text-green-900 text-sm font-semibold leading-tight"
                    >Daftar disini</span
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div
      class="w-full h-24 py-3.5 bg-green-900 border-t-2 border-b-2 border-yellow-400 inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden"
    >
      <marquee class="justify-start text-white text-xl font-semibold tracking-tight">
        SELAMAT DATANG DI APLIKASI MUSTAHIK DAN MUZAKKI BAITUL MAL KABUPATEN ACEH TENGAH
      </marquee>
    </div>
</template>

<script setup lang="ts">
// import NavbarCard from '@/components/Landing/widgets/NavbarCard.vue'
// import HeroCard1 from '@/components/Landing/widgets/HeroCard1.vue'
// import AboutCard from '@/components/Landing/widgets/AboutCard.vue'
// import WhyCard from '@/components/Landing/widgets/WhyCard.vue'
// import FeatureCard from '@/components/Landing/widgets/FeatureServiceCard.vue'
// import HeroCard2 from '@/components/Landing/widgets/HeroCard2.vue'
// import PriceCard from '@/components/Landing/widgets/PriceCard.vue'
// import FooterCard from '@/components/Landing/widgets/FooterCard.vue'
</script>

<style scoped>
</style>

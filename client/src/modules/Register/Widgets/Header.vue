<template>
  <header class="absolute w-full bg-white">
    <div class="w-full px-[32px] lg:px-[75px] pt-5 mx-auto flex items-center justify-between">
      <!-- Kiri: Logo + Link teks -->
      <div class="flex items-center space-x-6">
        <a href="/">
          <img src="/images/logo.png" alt="Logo Baitul Mal" />
        </a>
        <a href="/tentang-kami" class="text-[#0E561E] font-medium hover:text-green-700 transition">
          Tentang Kami
        </a>
        <a href="/kabar" class="text-[#0E561E] font-medium hover:text-green-700 transition">
          Kabar
        </a>
      </div>

      <!-- Kanan: Button + Login -->
      <div class="flex items-center space-x-4">
        <a
          href="/zakat"
          class="bg-[#0E561E] hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Zakat
        </a>
        <a
          href="/infak"
          class="bg-[#0E561E] hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Infak
        </a>
        <a
          href="/donasi"
          class="bg-[#0E561E] hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Donasi
        </a>
        <a href="/login-admin" class="mt-1" title="Login ke Area Administrator">
          <img src="/images/icon_member.svg" />
        </a>
      </div>
    </div>
  </header>
</template>

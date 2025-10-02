<template>
  <div class="w-full flex flex-col lg:flex-row gap-6">
    <!-- Sidebar Program (30%) -->
    <div
      class="w-full lg:w-[30%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 overflow-hidden"
    >
      <a
        href="#"
        class="self-stretch px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-500 rounded-lg inline-flex justify-start items-center gap-2.5 font-semibold text-[14px]"
      >
        <img src="/images/icon_program2.svg" />
        Program Bantuan Sosial
      </a>
      <a
        href="#"
        class="self-stretch px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-500 rounded-lg inline-flex justify-start items-center gap-2.5 font-semibold text-[14px]"
      >
        <img src="/images/icon_program2.svg" />
        Program Pemberdayaan Ekonomi
      </a>
      <a
        href="#"
        class="self-stretch px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-500 rounded-lg inline-flex justify-start items-center gap-2.5 font-semibold text-[14px]"
      >
        <img src="/images/icon_program2.svg" />
        Program Bantuan Kesehatan
      </a>
      <a
        href="#"
        class="self-stretch px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-500 rounded-lg inline-flex justify-start items-center gap-2.5 font-semibold text-[14px]"
      >
        <img src="/images/icon_program2.svg" />
        Program Bantuan Pendidikan
      </a>
      <a
        href="#"
        class="self-stretch px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-500 rounded-lg inline-flex justify-start items-center gap-2.5 font-semibold text-[14px]"
      >
        <img src="/images/icon_program2.svg" />
        Program Bantuan Keagamaan
      </a>
      <a
        href="#"
        class="self-stretch px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-500 rounded-lg inline-flex justify-start items-center gap-2.5 font-semibold text-[14px]"
      >
        <img src="/images/icon_program2.svg" />
        Program Bantuan Infak
      </a>
    </div>

    <!-- Konten Utama (70%) -->
    <div
      class="w-full lg:w-[70%] flex-1 gap-[30px] px-[24px] md:px-[32px] lg:px-[75px] py-6 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-black/20 flex flex-col justify-start items-center overflow-hidden"
    >
      <div class="flex flex-col md:flex-row justify-between w-full relative gap-6">
        <div class="flex gap-4">
          <div class="justify-center text-neutral-800 text-base font-normal leading-normal">
            Pilih Tahun Anggaran:
          </div>
          <select
            class="h-fit py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-green-900 focus:ring-green-900 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option selected="">2025</option>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
          </select>
        </div>
        <div class="flex">
          <div class="flex items-start gap-3">
            <img src="/images/icon_orang_terbantu.svg" />
            <div class="flex flex-col">
              <div class="justify-center text-green-900 text-xl font-bold leading-loose">+0</div>
              <div class="justify-center text-neutral-800 text-base font-normal leading-normal">
                Orang<br />Terbantu
              </div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <img src="/images/icon_bantuan_tersalurkan.svg" />
            <div class="flex flex-col">
              <div class="justify-center text-green-900 text-xl font-bold leading-loose">+0</div>
              <div class="justify-center text-neutral-800 text-base font-normal leading-normal">
                Bantuan<br />Disalurkan
              </div>
            </div>
          </div>
        </div>
      </div>
      <img class="w-full h-96 relative" src="https://placehold.co/744x372" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  useSelectedTab,
  useGlobalTab,
  useGlobalActiveTab,
  useTabTerpilih,
} from '../../../../stores/sidebar'
import 'flowbite'

// import BerandaUtama from '../../Modules/BerandaUtama/BerandaUtama.vue'
// import TransPaket from '../../Modules/TransPaket/TransPaket.vue'
// import DaftarKota from '../../Modules/DaftarKota/DaftarKota.vue'
// import DaftarFasilitas from '../../Modules/DaftarFasilitas/DaftarFasilitas.vue'
// import DaftarHotel from '../../Modules/DaftarHotel/DaftarHotel.vue'
// import JenisMobil from '../../Modules/JenisMobil/JenisMobil.vue'
// import Cabang from '../../Modules/Cabang/Cabang.vue'
// import Airlines from '../../Modules/Airlines/Airlines.vue'
// import Pengaturan from '../../Modules/Pengaturan/Pengaturan.vue'
// import SistemLog from '../../Modules/SistemLog/SistemLog.vue'
// import DaftarBandara from '../../Modules/DaftarBandara/DaftarBandara.vue'
// import DaftarAsuransi from '../../Modules/DaftarAsuransi/DaftarAsuransi.vue'
// import DaftarProviderVisa from '../../Modules/DaftarProviderVisa/DaftarProviderVisa.vue'
// import DaftarBank from '../../Modules/DaftarBank/DaftarBank.vue'
// import DaftarTipePaket from '../../Modules/DaftarTipePaket/DaftarTipePaket.vue'
// import Grup from '../../Modules/Grup/Grup.vue'
// import Supplier from '../../Modules/Supplier/Supplier.vue'
// import Akun from '../../Modules/Akun/Akun.vue'
// import DaftarMember from '../../Modules/Member/DaftarMember.vue'
// import Pengguna from '../../Modules/Pengguna/Pengguna.vue'
// import Kostumer from '../../Modules/Kostumer/Kostumer.vue'
// import DaftarPaketLa from '../../Modules/DaftarPaketLa/DaftarPaketLa.vue'
// import LevelAgen from '../../Modules/LevelAgen/LevelAgen.vue'
// import DaftarAgen from '../../Modules/DaftarAgen/DaftarAgen.vue'
// import DepositSaldo from '../../Modules/DepositSaldo/DepositSaldo.vue'
// import DaftarJamaah from '../../Modules/DaftarJamaah/DaftarJamaah.vue'
// import DaftarPeminjaman from '../../Modules/DaftarPeminjaman/DaftarPeminjaman.vue'
// import Jurnal from '../../Modules/Jurnal/Jurnal.vue'
// import Investor from '../../Modules/Investor/Investor.vue'
// import DaftarPaket from '../../Modules/DaftarPaket/DaftarPaket.vue'
// import TabunganUmrah from '../../Modules/TabunganUmrah/TabunganUmrah.vue'
// import RiwayatPeminjaman from '../../Modules/RiwayatPeminjaman/RiwayatPeminjaman.vue'
// import TransTiket from '../../Modules/TransTiket/TransTiket.vue'
// import DaftarSuratMenyurat from '../../Modules/DaftarSuratMenyurat/DaftarSuratMenyurat.vue'
// import BukuBesar from '../../Modules/BukuBesar/BukuBesar.vue'
// import NeracaLajur from '../../Modules/NeracaLajur/NeracaLajur.vue'
// import LabaRugi from '../../Modules/LabaRugi/LabaRugi.vue'
// import Neraca from '../../Modules/Neraca/Neraca.vue'
// import PengaturanPerangkanWhatsap from '../../Modules/PengaturanPerangkatWhatsapp/PengaturanPerangkanWhatsap.vue'
// import TemplatePesanWhatsapp from '../../Modules/TemplatePesanWhatsapp/TemplatePesanWhatsapp.vue'
// import TransaksiVisa from '../../Modules/TransaksiVisa/TransaksiVisa.vue'
// import PesanWhatsapp from '../../Modules/PesanWhatsapp/PesanWhatsapp.vue'
// import PembayaranFeeAgen from '../../Modules/PembayaranFeeAgen/PembayaranFeeAgen.vue'
// import TransaksiPassport from '../../Modules/TransaksiPassport/TransaksiPassport.vue'
// import TransHotel from '../../Modules/TransHotel/TransHotel.vue'
// import Modal from '../../Modules/Modal/Modal.vue'
// import TransTransport from '../../Modules/TransTransport/TransTransport.vue'
// import RekapitulasiTicket from '../../Modules/RekapitulasiTicket/RekapitulasiTicket.vue'
// import KasKeluarMasuk from '../../Modules/KasKeluarMasuk/KasKeluarMasuk.vue'
// import DaftarPembayaran from '../../Modules/PembayaranGaji/DaftarPembayaran.vue'
// import DaftarStokFasilitas from '../../Modules/DaftarStokFasilitas/DaftarStokFasilitas.vue'
// import Headline from '../../Modules/Headline/Headline.vue'
// import ItemFasilitas from '../../Modules/ItemFasilitas/ItemFasilitas.vue'
// import AkunBank from '../../Modules/AkunBank/AkunBank.vue'
// import DaftarProdukPpob from '../../Modules/DaftarProdukPpob/DaftarProdukPpob.vue'
// import TransFasilitas from '../../Modules/TransFasilitas/TransFasilitas.vue'
// import RiwayatTransaksiPpob from '../../Modules/RiwayatTransaksiPpob/RiwayatTransaksiPpob.vue'
// import PermintaanDepositMember from '../../Modules/PermintaanDepositMember/PermintaanDepositMember.vue'
// import RiwayatDepositMaskapai from '../../Modules/RiwayatDepositMaskapai/RiwayatDepositMaskapai.vue'

const tabComponents = {
  // beranda_utama: BerandaUtama,
  // trans_paket: TransPaket,
  // trans_tiket: TransTiket,
  // daftar_kota: DaftarKota,
  // daftar_fasilitas: DaftarFasilitas,
  // daftar_mobil: JenisMobil,
  // daftar_cabang: Cabang,
  // pengaturan: Pengaturan,
  // daftar_hotel: DaftarHotel,
  // airlines: Airlines,
  // daftar_bandara: DaftarBandara,
  // daftar_asuransi: DaftarAsuransi,
  // daftar_provider_visa: DaftarProviderVisa,
  // daftar_bank: DaftarBank,
  // system_log: SistemLog,
  // daftar_grup: Grup,
  // daftar_tipe_paket: DaftarTipePaket,
  // supplier: Supplier,
  // akun: Akun,
  // daftar_member: DaftarMember,
  // kostumer: Kostumer,
  // daftar_paket_la: DaftarPaketLa,
  // pengguna: Pengguna,
  // level_agen: LevelAgen,
  // daftar_agen: DaftarAgen,
  // deposit_saldo: DepositSaldo,
  // daftar_jamaah: DaftarJamaah,
  // daftar_peminjaman: DaftarPeminjaman,
  // jurnal: Jurnal,
  // investor: Investor,
  // daftar_paket: DaftarPaket,
  // tabungan_umrah: TabunganUmrah,
  // riwayat_transaksi_peminjaman: RiwayatPeminjaman,
  // buku_besar: BukuBesar,
  // daftar_surat_menyurat: DaftarSuratMenyurat,
  // neraca_lajur: NeracaLajur,
  // laba_rugi: LabaRugi,
  // neraca: Neraca,
  // pengaturan_perangkat_whatsapp: PengaturanPerangkanWhatsap,
  // template_pesan_whatsapp: TemplatePesanWhatsapp,
  // trans_visa: TransaksiVisa,
  // pesan_whatsapp: PesanWhatsapp,
  // pembayaran_fee_agen: PembayaranFeeAgen,
  // trans_passport: TransaksiPassport,
  // trans_hotel: TransHotel,
  // modal: Modal,
  // trans_transport: TransTransport,
  // rekapitulasi_tiket: RekapitulasiTicket,
  // kas_keluar_masuk: KasKeluarMasuk,
  // riwayat_pembayaran_gaji_staff: DaftarPembayaran,
  // daftar_stok_fasilitas: DaftarStokFasilitas,
  // daftar_item_fasilitas: ItemFasilitas,
  // headline: Headline,
  // daftar_akun_bank_perusahaan: AkunBank,
  // daftar_produk_ppob: DaftarProdukPpob,
  // riwayat_transaksi_ppob: RiwayatTransaksiPpob,
  // permintaan_deposit_member: PermintaanDepositMember,
  // trans_fasilitas: TransFasilitas,
  // riwayat_deposit_maskapai: RiwayatDepositMaskapai,
}

const selectedTab = useSelectedTab() // untuk menampung daftar tab yang menu / submenunya di click
const tab = useGlobalTab()
const activeTab = useGlobalActiveTab()
const tabTerpilih = useTabTerpilih()

//const props = defineProps<{ default: string; tabAwal: any }>()
const mulaiPilihTab = ref(false)

const selectTab = (tabPath: string, key: number) => {
  // tabTerpilih.value = key
  tabTerpilih.setNumber(key)
  activeTab.setString(tabPath) // Menandai tab yang dipilih
  mulaiPilihTab.value = true
}
</script>

<template>
  <!--  -->
  <div class="mb-0 dark:border-gray-700">
    <ul
      class="flex flex-wrap -mb-px text-sm font-medium text-center text-graydark"
      id="default-tab"
      data-tabs-toggle="#default-tab-content"
      role="tablist"
    >
      <li
        class="me-2"
        role="presentation"
        v-for="(item, key) in selectedTab.sharedArray"
        :key="key"
      >
        <button
          class="inline-block p-4 rounded-t-lg rrr"
          :id="`${tab.sharedObject[item.id].path}-tab`"
          :data-tabs-target="`#${tab.sharedObject[item.id].path}`"
          type="button"
          role="tab"
          :aria-controls="`${tab.sharedObject[item.id].path}`"
          :aria-selected="
            activeTab.sharedString === tab.sharedObject[item.id].path ||
            (tabTerpilih.sharedNumber === 0 && key === 0)
              ? 'true'
              : 'false'
          "
          @click="selectTab(tab.sharedObject[item.id].path, key)"
          :class="
            activeTab.sharedString === tab.sharedObject[item.id].path ||
            (tabTerpilih.sharedNumber === 0 && key === 0)
              ? 'AAA bg-white !text-[#3a477d] font-bold hover:text-[#3a477d] dark:text-[#3a477d] dark:hover:text-[#3a477d] border-[#3a477d] dark:border-[#3a477d]'
              : 'BBB inline-block p-4 rounded-t-lg dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300'
          "
        >
          <font-awesome-icon :icon="tab.sharedObject[item.id].icon" />
          {{ tab.sharedObject[item.id].name }}
        </button>
      </li>
    </ul>
  </div>

  <div id="default-tab-content ">
    <div
      v-for="(item, key) in selectedTab.sharedArray"
      :key="key"
      class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[500px]"
      :class="
        (activeTab.sharedString === tab.sharedObject[item.id].path ||
        (tabTerpilih.sharedNumber === 0 && key === 0)
          ? ''
          : 'hidden') + (key === 0 ? ' rounded-tl-none' : '')
      "
      :id="tab.sharedObject[item.id].path"
      role="tabpanel"
      :aria-labelledby="`${tab.sharedObject[item.id].path}-tab`"
    >
      <p
        class="px-5 mb-5 text-sm text-gray-900 dark:text-white"
        v-html="tab.sharedObject[item.id].desc"
      ></p>
      <component :is="tabComponents[tab.sharedObject[item.id].path]" class="tab"></component>
    </div>
  </div>
</template>

<style scoped></style>

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginAdminView from '@/views/LoginAdminView.vue'
// import UserView from '@/views/UserView.vue'
// import LoginView from '@/views/LoginView.vue'
// import RegisterView from '@/views/RegisterView.vue'
// import KwitansiView from '@/views/KwitansiView.vue'
// import InvoicePaketLa from '@/components/User/Modules/Invoice/InvoicePaketLa.vue'
// import InvoiceDeposit from '@/components/User/Modules/Invoice/InvoiceDeposit.vue'
// import InvoiceKwitansiTerakhir from '@/components/User/Modules/Invoice/InvoiceKwitansiTerakhir.vue'
// import InvoicePembayranPerbulan from '../components/User/Modules/Invoice/InvoicePembayranPerbulan.vue'
// import KwitansiTabunganUmrah from '@/components/User/Modules/Invoice/KwitansiTabunganUmrah.vue'
// import CetakSurat from '@/components/User/Modules/DaftarSuratMenyurat/widgets/CetakSurat.vue'
// import KwitansiHandoverFasilitas from '@/components/User/Modules/Invoice/KwitansiHandoverFasilitas.vue'
// import CetakDataJamaah from '@/components/User/Modules/TabunganUmrah/Widget/CetakDataJamaah.vue'
// import KwitansiHandoverBarang from '@/components/User/Modules/Invoice/KwitansiHandoverBarang.vue'
// import KwitansiPengembalianBarang from '@/components/User/Modules/Invoice/KwitansiPengembalianBarang.vue'
// import TransaksiVisa from '@/components/User/Modules/TransaksiVisa/TransaksiVisa.vue'
// import CetakKwitansiVisa from '@/components/User/Modules/Invoice/InvoiceTransaksiVisa.vue'
// import InvoicePembayaranFeeAgen from '@/components/User/Modules/Invoice/InvoicePembayaranFeeAgen.vue'
// import KwitansiPembayaranTransaksiPaket from '@/components/User/Modules/Invoice/KwitansiPembayaranTransaksiPaket.vue'
// import InvoiceTransHotel from '@/components/User/Modules/Invoice/InvoiceTransHotel.vue'
// import InvoiceKasKeluarMasuk from '@/components/User/Modules/Invoice/InvoiceKasKeluarMasuk.vue'
// import TransaksiPassport from '@/components/User/Modules/TransaksiPassport/TransaksiPassport.vue'
// import CetakKwitansiPassport from '@/components/User/Modules/Invoice/InvoiceTransaksiPassport.vue'
// import CetakDataJamaahPaket from '@/components/User/Modules/DaftarJamaahPaket/Widgets/CetakDataJamaah.vue'
// import KwitansiHandoverFasilitasPaket from '@/components/User/Modules/Invoice/KwitansiHandoverFasilitasPaket.vue'
// import KwitansiHandoverBarangPaket from '@/components/User/Modules/Invoice/KwitansiHandoverBarangPaket.vue'
// import KwitansiPengembalianBarangPaket from '@/components/User/Modules/Invoice/KwitansiPengembalianBarangPaket.vue'
// import CetakDataAbsensiJamaah from '@/components/User/Modules/DaftarJamaahPaket/Widgets/CetakDataAbsensiJamaah.vue'
// import DownloadDaftarKamar from '@/components/User/Modules/KamarPaket/Widget/DownloadDaftarKamar.vue'
// import InvoiceTransTransport from '@/components/User/Modules/Invoice/InvoiceTransTransport.vue'
// import InvoiceTransFasilitas from '@/components/User/Modules/Invoice/InvoiceTransFasilitas.vue'
// import CetakRekapitulasi from '@/components/User/Modules/RekapitulasiTicket/Widget/CetakRekapitulasi.vue'
// import Profile from '@/components/User/Modules/Profile/Profile.vue'
// import CabangPertama from '@/components/User/Modules/CabangPertama/CabangPertama.vue'
// import InvoiceTransTiket from '@/components/User/Modules/Invoice/InvoiceTransTiket.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'AMRA :: Aplikasi Manajemen Travel Haji dan Umrah',
        description: 'Ini adalah deskripsi halaman Home',
      },
    },
    {
      path: '/login-admin',
      name: 'login-admin',
      component: LoginAdminView,
    },
    
    // {
    //   path: '/Login',
    //   name: 'login',
    //   component: LoginView,
    //   meta: {
    //     title: 'Login || AMRA :: Aplikasi Manajemen Travel Haji dan Umrah',
    //     description: 'Ini adalah deskripsi halaman Home',
    //   },
    // },
    // {
    //   path: '/Register',
    //   name: 'register',
    //   component: RegisterView,
    //   meta: {
    //     title: 'Registrasi || AMRA :: Aplikasi Manajemen Travel Haji dan Umrah',
    //     description: 'Ini adalah deskripsi halaman Home',
    //   },
    // },
    // {
    //   path: '/kwitansi',
    //   name: 'kwitansi',
    //   component: KwitansiView,
    // },
    // {
    //   path: '/tab-tes',
    //   name: 'tab-tes',
    //   component: () => import('../views/MemberAreaView.vue'),
    // },
    // {
    //   path: '/User',
    //   name: 'user',
    //   meta: {
    //     title: 'User Area || AMRA :: Aplikasi Manajemen Travel Haji dan Umrah',
    //     description: 'Ini adalah deskripsi halaman Home',
    //   },
    //   component: UserView,
    // },
    // {
    //   path: '/invoice-paket-la/:id',
    //   name: 'invoice-paket-la',
    //   component: InvoicePaketLa,
    // },
    // {
    //   path: '/invoice-kas-keluar-masuk/:invoice',
    //   name: 'invoice-kas-keluar-masuk',
    //   component: InvoiceKasKeluarMasuk,
    // },
    // {
    //   path: '/invoice-deposit/:id',
    //   name: 'invoice-deposit',
    //   component: InvoiceDeposit,
    // },
    // {
    //   path: '/kwitansi-terakhir/:invoice',
    //   name: 'kwitansi-terakhir',
    //   component: InvoiceKwitansiTerakhir,
    // },
    // {
    //   path: '/kwitansi-tabungan-umrah/:invoice',
    //   name: 'kwitansi-tabungan-umrah',
    //   component: KwitansiTabunganUmrah,
    // },
    // {
    //   path: '/invoice-pembayaran/:invoice',
    //   name: 'invoice-pembayaran',
    //   component: InvoicePembayranPerbulan,
    // },
    // {
    //   path: '/kwitansi-handover-fasilitas/:invoice',
    //   name: 'kwitansi-handover-fasilitas',
    //   component: KwitansiHandoverFasilitas,
    // },
    // {
    //   path: '/cetak_surat/:jenis_surat',
    //   name: 'invoice-pembayran',
    //   component: CetakSurat,
    // },
    // {
    //   path: '/daftar-tabungan-umrah/cetak-data-jamaah/:id/cetak',
    //   name: 'cetak-jamaah',
    //   component: CetakDataJamaah,
    // },
    // {
    //   path: '/kwitansi-handover-barang/:invoice',
    //   name: 'kwitansi-handover-barang',
    //   component: KwitansiHandoverBarang,
    // },
    // {
    //   path: '/kwitansi-pengembalian-handover-barang/:invoice',
    //   name: 'kwitansi-pengembalian-handover-barang',
    //   component: KwitansiPengembalianBarang,
    // },
    // {
    //   path: '/transaksi-visa',
    //   name: 'transaksi-visa',
    //   component: TransaksiVisa,
    // },
    // {
    //   path: '/cetak-kwitansi-visa/:invoice',
    //   name: 'cetak-kwitansi-visa',
    //   component: CetakKwitansiVisa,
    // },
    // {
    //   path: '/kwitansi-pembayaran-fee-agen/:invoice',
    //   name: 'kwitansi-pembayaran-fee-agen',
    //   component: InvoicePembayaranFeeAgen,
    // },
    // {
    //   path: '/kwitansi-pembayaran-transaksi-paket/:invoice',
    //   name: 'kwitansi-pembayaran-transaksi-paket',
    //   component: KwitansiPembayaranTransaksiPaket,
    // },
    // {
    //   path: '/kwitansi-trans-hotel/:invoice',
    //   name: 'kwitansi-trans-hotel',
    //   component: InvoiceTransHotel,
    // },
    // {
    //   path: '/transaksi-passport',
    //   name: 'transaksi-passport',
    //   component: TransaksiPassport,
    // },

    // {
    //   path: '/cetak-kwitansi-passport/:invoice',
    //   name: 'cetak-kwitansi-passport',
    //   component: CetakKwitansiPassport,
    // },
    // {
    //   path: '/daftar-jamaah-paket/absensi-jamaah-paket/:paketId/cetak',
    //   name: 'absensi-jamaah-paket',
    //   component: CetakDataAbsensiJamaah,
    // },
    // {
    //   path: '/daftar-jamaah-paket/cetak-data-jamaah/:id/cetak',
    //   name: 'cetak-jamaah-paket',
    //   component: CetakDataJamaahPaket,
    // },
    // {
    //   path: '/kwitansi-handover-fasilitas-paket/:invoice',
    //   name: 'kwitansi-handover-fasilitas-paket',
    //   component: KwitansiHandoverFasilitasPaket,
    // },
    // {
    //   path: '/kwitansi-handover-barang-paket/:invoice',
    //   name: 'kwitansi-handover-barang-paket',
    //   component: KwitansiHandoverBarangPaket,
    // },
    // {
    //   path: '/kwitansi-pengembalian-handover-barang-paket/:invoice',
    //   name: 'kwitansi-pengembalian-handover-barang-paket',
    //   component: KwitansiPengembalianBarangPaket,
    // },
    // {
    //   path: '/download-daftar-kamar',
    //   name: 'download-daftar-kamar',
    //   component: DownloadDaftarKamar,
    // },
    // {
    //   path: '/kwitansi-trans-transport/:invoice',
    //   name: 'kwitansi-trans-transport',
    //   component: InvoiceTransTransport,
    // },
    // {
    //   path: '/kwitansi-trans-fasilitas/:invoice',
    //   name: 'kwitansi-trans-fasilitas',
    //   component: InvoiceTransFasilitas,
    // },
    // {
    //   path: '/rekapitulasi-ticket/cetak/:regnumb',
    //   name: 'rekapitulasi-ticket',
    //   component: CetakRekapitulasi
    // },
    // {
    //   path : '/profile',
    //   name: 'profile',
    //   component: Profile
    // },
    // {
    //   path: '/tambah-cabang',
    //   name: 'tambah-cabang',
    //   component: CabangPertama
    // },
    // {
    //   path: '/invoice-trans-tiket/:regnum',
    //   name: 'trans-tiket',
    //   component: InvoiceTransTiket
    // }
  ],
})

export default router

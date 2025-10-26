import Beranda from '@/modules/Cetak/Beranda.vue';
import LaporanPengumpulan from '@/modules/Cetak/LaporanPengumpulan.vue';
import LaporanPerencanaan from '@/modules/Cetak/LaporanPerencanaan.vue';
import LaporanTahunan from '@/modules/Cetak/LaporanTahunan.vue';
import Register from '@/modules/Register/Register.vue';
import CetakRekapDistribusiPerkecamatan from '@/modules/RekapPerkecamatan/CetakRekapDistribusiPerkecamatan.vue';
import AdministratorAreaView from '@/views/AdministratorView.vue';
import homeView from '@/views/HomeView.vue';
import LoginAdminView from '@/views/LoginAdminView.vue';
import MemberAreaView from '@/views/MemberAreaView.vue';
import SurveyLapanganView from '@/views/SurveyLapanganView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: homeView,
      meta: {
        title: 'Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah merupakan platform digital yang dirancang untuk mempermudah pengelolaan data penerima manfaat (mustahik) dan pemberi zakat (muzaki). Melalui aplikasi ini, proses pendataan, penyaluran, dan pelaporan zakat, infak, serta sedekah dapat dilakukan dengan lebih transparan, cepat, dan akurat. Aplikasi ini juga mendukung visi Baitul Mal Kabupaten Aceh Tengah dalam mewujudkan tata kelola zakat yang religius, mandiri, dan sejahtera bagi masyarakat.',
      },
    },
    {
      path: '/login-admin',
      name: 'login-admin',
      component: LoginAdminView,
      meta: {
        title: 'Login Area || Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah untuk registrasi, pendataan, dan layanan zakat secara mudah, cepat, dan transparan.',
      },
    },
    {
      path: '/registrasi',
      name: 'registrasi',
      component: Register,
      meta: {
        title: 'Registrasi Area || Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Daftar sekarang di Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah. Nikmati kemudahan layanan zakat online, mulai dari registrasi hingga pendataan, dengan sistem yang aman, transparan, dan terpercaya.',
      },
    },
    {
      path: '/member-area',
      name: 'member-area',
      component: MemberAreaView,
      meta: {
        title: 'Member Area || Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Member Area Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah memberikan akses mudah untuk melihat data zakat, status permohonan, serta laporan transaksi secara aman dan transparan',
      },
    },
    {
      path: '/administrator-area',
      name: 'administrator-area',
      component: AdministratorAreaView,
      meta: {
        title: 'Administrator Area || Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Member Area Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah memberikan akses mudah untuk melihat data zakat, status permohonan, serta laporan transaksi secara aman dan transparan',
      },
    },
    {
      path: '/survey',
      name: 'survey-lapangan',
      component: SurveyLapanganView,
      meta: {
        title: 'Apakah Anda Suka dengan Survey Lapangan ini?',
        description:
          'Member Area Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah memberikan akses mudah untuk melihat data zakat, status permohonan, serta laporan transaksi secara aman dan transparan',
      },
    },
    {
      path: '/laporan-tahunan/:tahun',
      name: 'laporan-tahunan',
      component: LaporanTahunan,
      meta: {
        title: 'Laporan Tahunan || Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Member Area Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah memberikan akses mudah untuk melihat data zakat, status permohonan, serta laporan transaksi secara aman dan transparan',
      },
    },
    {
      path: '/laporan-pengumpulan/:tahun',
      name: 'laporan-pengumpulan',
      component: LaporanPengumpulan,
      meta: {
        title: 'Laporan Pengumpulan || Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Member Area Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah memberikan akses mudah untuk melihat data zakat, status permohonan, serta laporan transaksi secara aman dan transparan',
      },
    },
    {
      path: '/laporan-perencanaan/:tahun/:program/:perpage/:currentpage',
      name: 'laporan-perencanaan',
      component: LaporanPerencanaan,
      meta: {
        title: 'Laporan Perencanaan || Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Member Area Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah memberikan akses mudah untuk melihat data zakat, status permohonan, serta laporan transaksi secara aman dan transparan',
      },
    },
    {
      path: '/beranda/:tahun',
      name: 'beranda',
      component: Beranda,
      meta: {
        title: 'Beranda || Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Member Area Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah memberikan akses mudah untuk melihat data zakat, status permohonan, serta laporan transaksi secara aman dan transparan',
      },
    },
    {
      path: '/rekap-distribusi-perkecamatan/:tahun',
      name: 'rekap-distribusi-perkecamatan',
      component: CetakRekapDistribusiPerkecamatan,
      meta: {
        title:
          'Rekap Distribusi Perkecamatan || Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah',
        description:
          'Member Area Aplikasi Mustahik dan Muzaki Kabupaten Aceh Tengah memberikan akses mudah untuk melihat data zakat, status permohonan, serta laporan transaksi secara aman dan transparan',
      },
    },
  ],
});

export default router;

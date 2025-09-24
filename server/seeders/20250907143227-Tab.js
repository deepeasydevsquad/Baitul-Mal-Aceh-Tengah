'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tabs', [
      { name: 'Beranda', icon : 'fa-solid fa-house', path: 'beranda_utama', desc:'Halaman utama aplikasi yang menampilkan ringkasan informasi dan menu navigasi utama.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Program Donasi', icon : 'fa-solid fa-hand-holding-heart', path: 'program_donasi', desc:'Menampilkan daftar program donasi yang sedang berjalan dan dapat diikuti oleh anggota.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Riwayat Donasi', icon : 'fa-solid fa-clock-rotate-left', path: 'riwayat_donasi', desc:'Menampilkan riwayat donasi yang telah dilakukan oleh anggota.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Riwayat Zakat', icon : 'fa-solid fa-coins', path: 'riwayat_zakat', desc:'Menampilkan riwayat pembayaran zakat oleh anggota.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Riwayat Infaq', icon : 'fa-solid fa-hand-holding-dollar', path: 'riwayat_infaq', desc:'Menampilkan riwayat pembayaran infaq oleh anggota.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Program Kegiatan Bantuan', icon : 'fa-solid fa-people-carry-box', path: 'program_kegiatan_bantuan', desc:'Daftar program kegiatan bantuan yang tersedia untuk masyarakat.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Monev', icon : 'fa-solid fa-chart-line', path: 'monev', desc:'Fitur monitoring dan evaluasi untuk memantau pelaksanaan program.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pertanyaan Monev', icon : 'fa-solid fa-question-circle', path: 'pertanyaan_monev', desc:'Daftar pertanyaan yang digunakan dalam proses monitoring dan evaluasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Urutan Bagian Monev', icon : 'fa-solid fa-list-ol', path: 'urutan_bagian_monev', desc:'Pengaturan urutan bagian dalam proses monitoring dan evaluasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Permohonan Bantuan', icon : 'fa-solid fa-file-signature', path: 'permohonan_bantuan', desc:'Fitur untuk mengelola permohonan bantuan dari masyarakat.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Penetapan Kriteria, Syarat & Surveyor', icon : 'fa-solid fa-clipboard-check', path: 'penetapan_kriteria_syarat_surveyor', desc:'Menetapkan kriteria, syarat dan surveyor untuk program bantuan.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Syarat', icon : 'fa-solid fa-file-contract', path: 'syarat', desc:'Daftar syarat yang harus dipenuhi untuk mengikuti program.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kriteria', icon : 'fa-solid fa-list-check', path: 'kriteria', desc:'Daftar kriteria penerima bantuan.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Surveyor', icon : 'fa-solid fa-user-tie', path: 'daftar_surveyor', desc:'Menampilkan daftar surveyor yang terlibat dalam program.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Program Kegiatan Kesekretariatan', icon : 'fa-solid fa-briefcase', path: 'program_kegiatan_kesekretariatan', desc:'Daftar program kegiatan yang dikelola oleh kesekretariatan.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Keanggotaan', icon : 'fa-solid fa-users', path: 'daftar_keanggotaan', desc:'Menampilkan daftar anggota yang terdaftar di aplikasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Asnaf', icon : 'fa-solid fa-people-group', path: 'daftar_asnaf', desc:'Daftar golongan penerima zakat (asnaf) yang terdata.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Program', icon : 'fa-solid fa-list', path: 'daftar_program', desc:'Menampilkan seluruh program yang tersedia di aplikasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Desa', icon : 'fa-solid fa-map-location-dot', path: 'daftar_desa', desc:'Daftar desa yang menjadi area penyaluran bantuan.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Kecamatan', icon : 'fa-solid fa-map', path: 'daftar_kecamatan', desc:'Daftar kecamatan yang menjadi area penyaluran bantuan.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Bank', icon : 'fa-solid fa-building-columns', path: 'daftar_bank', desc:'Daftar bank yang digunakan untuk penyaluran dana.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Bank Pengumpulan', icon : 'fa-solid fa-piggy-bank', path: 'daftar_bank_pengumpulan', desc:'Daftar bank yang digunakan untuk pengumpulan dana.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pengaturan Umum', icon : 'fa-solid fa-gears', path: 'pengaturan_umum', desc:'Fitur untuk mengatur konfigurasi umum aplikasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Tab', icon : 'fa-solid fa-table-cells-large', path: 'daftar_tab', desc:'Menampilkan dan mengelola daftar tab/menu aplikasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Grup Akses', icon : 'fa-solid fa-user-shield', path: 'daftar_grup_akses', desc:'Daftar grup akses untuk pengaturan hak akses pengguna.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Daftar Pengguna', icon : 'fa-solid fa-user', path: 'daftar_pengguna', desc:'Menampilkan daftar pengguna aplikasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pengaturan Whatsapp', icon : 'fa-brands fa-whatsapp', path: 'pengaturan_whatsapp', desc:'Pengaturan integrasi dan notifikasi Whatsapp.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Riwayat Pesan Whatsapp', icon : 'fa-solid fa-message', path: 'riwayat_pesan_whatsapp', desc:'Menampilkan riwayat pesan Whatsapp yang dikirim melalui aplikasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'System Log', icon : 'fa-solid fa-clipboard-list', path: 'system_log', desc:'Mencatat aktivitas sistem untuk keperluan audit.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'System Log Surveyor', icon : 'fa-solid fa-clipboard-user', path: 'system_log_surveyor', desc:'Mencatat aktivitas surveyor dalam aplikasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Running Text', icon : 'fa-solid fa-scroll', path: 'running_text', desc:'Menampilkan dan mengatur running text pada aplikasi.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Laporan Umum', icon : 'fa-solid fa-file-lines', path: 'laporan_umum', desc:'Menampilkan laporan umum terkait program dan bantuan.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Laporan Asnaf Fakir', icon : 'fa-solid fa-hand-holding-medical', path: 'laporan_asnaf_fakir', desc:'Laporan penyaluran bantuan untuk asnaf fakir.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Laporan Asnaf Miskin', icon : 'fa-solid fa-hand-holding-hand', path: 'laporan_asnaf_miskin', desc:'Laporan penyaluran bantuan untuk asnaf miskin.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Laporan Asnaf Fisabilillah', icon : 'fa-solid fa-hands-holding-circle', path: 'laporan_asnaf_fisabilillah', desc:'Laporan penyaluran bantuan untuk asnaf fisabilillah.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Laporan Asnaf Ibnu Sabil', icon : 'fa-solid fa-route', path: 'laporan_asnaf_ibnu_sabil', desc:'Laporan penyaluran bantuan untuk asnaf ibnu sabil.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Laporan Asnaf Gharim', icon : 'fa-solid fa-hand-holding-droplet', path: 'laporan_asnaf_gharim', desc:'Laporan penyaluran bantuan untuk asnaf gharim.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Laporan Asnaf Muallaf', icon : 'fa-solid fa-handshake-angle', path: 'laporan_asnaf_muallaf', desc:'Laporan penyaluran bantuan untuk asnaf muallaf.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Request Keanggotaan', icon : 'fa-solid fa-user-plus', path: 'request_keanggotaan', desc:'Permintaan pendaftaran keanggotaan baru.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Template Pesan Whatsapp', icon : 'fa-solid fa-message', path: 'template_pesan_whatsapp', desc:'Template pesan otomatis untuk Whatsapp.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bakal Penerima Bantuan', icon : 'fa-solid fa-user-clock', path: 'bakal_penerima_bantuan', desc:'Daftar penerima bantuan yang masih dalam proses penyaluran bantuan.',  createdAt: new Date(), updatedAt: new Date() },
      { name: 'Validasi Permohonan Bantuan', icon : 'fa-solid fa-clipboard-check', path: 'validasi_permohonan_bantuan', desc:'Proses validasi syarat-syarat permohonan bantuan yang masuk.',  createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tabs', null, {});
  }
};

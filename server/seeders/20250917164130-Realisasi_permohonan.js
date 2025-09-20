'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Menambahkan data seed ke dalam tabel Realisasi_permohonans.
     * Pastikan nama tabel 'Realisasi_permohonans' sesuai dengan yang digenerate oleh Sequelize.
     */
    await queryInterface.bulkInsert('Realisasi_permohonans', [
      // Contoh 1: Permohonan disetujui dan sudah direalisasi via transfer
      {
        permohonan_id: 1, // Pastikan ada permohonan dengan id=1
        status: 'approve',
        biaya_disetujui: 5000000,
        status_realisasi: 'sudah_direalisasi',
        tanggal_realisasi: new Date(),
        berita_acara: 'path/to/berita_acara_1.pdf',
        tipe: 'transfer',
        nominal_realisasi: 5000000,
        bukti_transfer: 'path/to/bukti_transfer_1.jpg',
        mou: 'path/to/mou_1.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Menghapus semua data dari tabel Realisasi_permohonans.
     */
    await queryInterface.bulkDelete('Realisasi_permohonans', null, {});
  }
};
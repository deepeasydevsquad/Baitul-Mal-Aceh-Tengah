'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Menambahkan data seed ke dalam tabel Permohonans.
     * Pastikan nama tabel 'Permohonans' sesuai dengan yang digenerate oleh Sequelize (biasanya bentuk jamak dari nama model).
     */
    await queryInterface.bulkInsert('Permohonans', [
      {
        member_id: 1, // Pastikan ada member dengan id=1
        kegiatan_id: 1, // Pastikan ada kegiatan dengan id=1
        bank_id: 1, // Pastikan ada bank dengan id=1
        nomor_akun_bank: '1234567890',
        nama_akun_bank: 'BUDI SANTOSO',
        status: 'sedang_berlangsung',
        alasan_penolakan: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Menghapus semua data dari tabel Permohonans.
     */
    await queryInterface.bulkDelete('Permohonans', null, {});
  }
};
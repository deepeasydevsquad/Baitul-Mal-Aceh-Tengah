"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Menambahkan data seed ke dalam tabel Kegiatan_keseketariatans.
     * Pastikan nama tabel 'Kegiatan_keseketariatans' sesuai dengan yang digenerate oleh Sequelize.
     */
    await queryInterface.bulkInsert(
      "Kegiatan_keseketariatans",
      [
        // Contoh 1: Bantuan untuk Instansi
        {
          kode: "SEK-001",
          nama_kegiatan: "Bantuan Operasional Dayah Modern",
          sumber_dana: "operasional_apbk",
          penerima: "Dayah Modern Misbahul Ulum",
          jenis_penerima: "instansi",
          nominal_kegiatan: 25000000,
          area_penyaluran: "kabupaten",
          desa_id: null,
          alamat: "Jl. Elak, Meunasah Mee, Muara Dua, Kota Lhokseumawe",
          tanggal_penyaluran: "2025-08-17",
          upload_bukti: "bukti/kegiatan_sek_001.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Menghapus semua data dari tabel Kegiatan_keseketariatans.
     */
    await queryInterface.bulkDelete("Kegiatan_keseketariatans", null, {});
  },
};

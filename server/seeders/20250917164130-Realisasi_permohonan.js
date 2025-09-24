"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Realisasi_permohonans",
      [
        {
          permohonan_id: 1,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: new Date(),
          berita_acara: "path/to/berita_acara_1.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_1.jpg",
          mou: "path/to/mou_1.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Realisasi_permohonans", null, {});
  },
};

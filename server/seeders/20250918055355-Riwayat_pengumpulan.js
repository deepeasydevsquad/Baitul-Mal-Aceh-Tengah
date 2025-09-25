"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Riwayat_pengumpulans",
      [
        {
          member_id: 1,
          invoice: "INV-ZP-20250918-001",
          tipe: "zakat_profesi",
          nominal: 500000,
          kode: 101,
          status: "success",
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          member_id: 1,
          invoice: "INV-INFAQ-20250918-002",
          tipe: "infaq",
          nominal: 100000,
          kode: 102,
          status: "process",
          konfirmasi_pembayaran: "belum_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          member_id: 1,
          invoice: "INV-ZH-20250918-003",
          tipe: "zakat_harta",
          nominal: 2500000,
          kode: 103,
          status: "failed",
          konfirmasi_pembayaran: "belum_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Riwayat_pengumpulans", null, {});
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Riwayat_pengumpulans",
      [
        // --- Data awal ---
        {
          member_id: 1,
          invoice: "INV-ZP-20230918-001",
          tipe: "zakat_profesi",
          nominal: 150000000, // 150 jt
          kode: 201,
          status: "success",
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          member_id: 1,
          invoice: "INV-INFAQ-20240918-002",
          tipe: "infaq",
          nominal: 200000000, // 200 jt
          kode: 202,
          status: "success",
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          member_id: 1,
          invoice: "INV-ZH-20250918-003",
          tipe: "zakat_harta",
          nominal: 300000000, // 300 jt
          kode: 203,
          status: "success",
          konfirmasi_pembayaran: "sudah_dikirim",
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

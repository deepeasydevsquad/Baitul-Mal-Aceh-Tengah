"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Riwayat_donasis",
      [
        {
          program_donasi_id: 1,
          member_id: 1,
          invoice: "DONASI-20250918-001",
          nominal: 250000,
          kode: 301,
          status: "success",
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          program_donasi_id: 1,
          member_id: 4,
          invoice: "DONASI-20250918-002",
          nominal: 75000,
          kode: 302,
          status: "success",
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          program_donasi_id: 1,
          member_id: 5,
          invoice: "DONASI-20250918-003",
          nominal: 100000,
          kode: 303,
          status: "success",
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          program_donasi_id: 1,
          member_id: 3,
          invoice: "DONASI-20250918-001",
          nominal: 250000,
          kode: 301,
          status: "success",
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          program_donasi_id: 1,
          member_id: 2,
          invoice: "DONASI-20250918-002",
          nominal: 75000,
          kode: 302,
          status: "success",
          konfirmasi_pembayaran: "sudah_dikirim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          program_donasi_id: 1,
          member_id: 5,
          invoice: "DONASI-20250918-003",
          nominal: 100000,
          kode: 303,
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
    await queryInterface.bulkDelete("Riwayat_donasis", null, {});
  },
};

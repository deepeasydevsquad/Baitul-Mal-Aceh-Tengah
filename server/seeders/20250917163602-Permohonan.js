"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Permohonans",
      [
        {
          member_id: 1,
          kegiatan_id: 1,
          bank_id: 1,
          nomor_akun_bank: "1234567890",
          nama_akun_bank: "BUDI SANTOSO",
          status: "sedang_berlangsung",
          alasan_penolakan: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          member_id: 1,
          kegiatan_id: 2,
          bank_id: 1,
          nomor_akun_bank: "1234567890",
          nama_akun_bank: "ADI HIDAYAT",
          status: "sedang_berlangsung",
          alasan_penolakan: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Permohonans", null, {});
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Target_distribusis",
      [
        // Zakat (asnaf_id 1-6)
        {
          tahun: 2025,
          asnaf_id: 1,
          tipe: "zakat",
          target_orang: 100,
          target_rupiah: 2000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tahun: 2025,
          asnaf_id: 2,
          tipe: "zakat",
          target_orang: 80,
          target_rupiah: 1500000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tahun: 2025,
          asnaf_id: 3,
          tipe: "zakat",
          target_orang: 70,
          target_rupiah: 1200000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tahun: 2025,
          asnaf_id: 4,
          tipe: "zakat",
          target_orang: 60,
          target_rupiah: 1000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tahun: 2025,
          asnaf_id: 5,
          tipe: "zakat",
          target_orang: 50,
          target_rupiah: 800000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tahun: 2025,
          asnaf_id: 6,
          tipe: "zakat",
          target_orang: 40,
          target_rupiah: 700000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Infaq (asnaf_id null)
        {
          tahun: 2025,
          asnaf_id: null,
          tipe: "infaq",
          target_orang: 0,
          target_rupiah: 3000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Donasi (asnaf_id null)
        {
          tahun: 2025,
          asnaf_id: null,
          tipe: "donasi",
          target_orang: 0,
          target_rupiah: 1500000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Target_distribusis",
      {
        tahun: 2025,
      },
      {}
    );
  },
};

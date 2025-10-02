"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Target_pengumpulans",
      [
        {
          tahun: 2025,
          zakat: 10000000,
          infaq: 5000000,
          donasi: 3000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Target_pengumpulans",
      {
        tahun: { [Sequelize.Op.in]: [2024, 2025] },
      },
      {}
    );
  },
};

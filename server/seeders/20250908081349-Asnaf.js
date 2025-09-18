"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Asnafs",
      [
        {
          name: 'Asnaf Fakir',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Asnaf Miskin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Asnaf Muallaf',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Asnaf Gharim',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Asnaf Fisabilillah',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Asnaf Ibnu Sabil',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Asnafs", null, {});
  },
};
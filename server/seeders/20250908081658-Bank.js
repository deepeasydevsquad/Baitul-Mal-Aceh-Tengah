"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Banks",
      [
        {
          img: "bank_aceh.png",
          name: "Bank Aceh",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          img: "bank_syariah_indonesia.png",
          name: "Bank Syariah Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Banks", null, {});
  },
};

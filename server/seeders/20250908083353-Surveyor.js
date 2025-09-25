"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Surveyors",
      [
        {
          name: "Muhammad Arif",
          nik: "11779715629381",
          whatsapp_number: "085262802141",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Surveyors", null, {});
  },
};

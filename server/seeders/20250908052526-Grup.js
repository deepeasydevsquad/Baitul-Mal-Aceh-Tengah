"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Grups",
      [
        {
            name: 'Staff',
            group_access: '[{"id":1,"name":"Beranda","path":"beranda","icon":"fas fa-home","Submenus":[]}]',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Grups", null, {});
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          grup_id: 1,
          name: "Administrator",
          jabatan: "Super Admin",
          kode: "AS1233",
          username: "admin",
          password:
            "$2a$10$Zr648UXQwtmNNUqeHhE5oujX.ecj7Kz4xL8Fv9iOQXMOREUf2PVDK",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          grup_id: 2,
          name: "Bendahara",
          jabatan: "Bendahara",
          kode: "BD1234",
          username: "bendahara",
          password:
            "$2a$10$Zr648UXQwtmNNUqeHhE5oujX.ecj7Kz4xL8Fv9iOQXMOREUf2PVDK",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};

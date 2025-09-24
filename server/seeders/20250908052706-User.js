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
          kode: "AS1233",
          username: "admin",
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

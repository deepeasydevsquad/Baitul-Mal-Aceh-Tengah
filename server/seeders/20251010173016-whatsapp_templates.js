"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Whatsapp_templates", [
      {
        id: 1,
        name: "Pesan Biasa",
        type: "pesan_biasa",
        message: "Ini pesan biasa tanpa variabel.",
        variable: JSON.stringify([]), // kosong
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "PsfagdfdfsgBifsdasa",
        type: "semua_member",
        message: "Ini pesan biasa tanpa variabel.",
        variable: JSON.stringify([]), // kosong
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Pesan fsdfsdsg35",
        type: "semua_surveyor",
        message: "Ini pesan biasa tanpa variabel.",
        variable: JSON.stringify([]), // kosong
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Pesan jkfhgdasfa",
        type: "semua_user",
        message: "Ini pesan biasa tanpa variabel.",
        variable: JSON.stringify([]), // kosong
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Whatsapp_templates", null, {});
  },
};
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Kecamatans",
      [
        { kode: "BE", name: "Bebesen", createdAt: new Date(), updatedAt: new Date() },
        { kode: "BI", name: "Bies", createdAt: new Date(), updatedAt: new Date() },
        { kode: "BT", name: "Bintang", createdAt: new Date(), updatedAt: new Date() },
        { kode: "CL", name: "Celala", createdAt: new Date(), updatedAt: new Date() },
        { kode: "JJ", name: "Jagong Jeget", createdAt: new Date(), updatedAt: new Date() },
        { kode: "KB", name: "Kebayakan", createdAt: new Date(), updatedAt: new Date() },
        { kode: "KT", name: "Ketol", createdAt: new Date(), updatedAt: new Date() },
        { kode: "KP", name: "Kute Panang", createdAt: new Date(), updatedAt: new Date() },
        { kode: "LG", name: "Linge", createdAt: new Date(), updatedAt: new Date() },
        { kode: "LT", name: "Lut Tawar", createdAt: new Date(), updatedAt: new Date() },
        { kode: "PG", name: "Pegasing", createdAt: new Date(), updatedAt: new Date() },
        { kode: "RA", name: "Rusip Antara", createdAt: new Date(), updatedAt: new Date() },
        { kode: "SN", name: "Silih Nara", createdAt: new Date(), updatedAt: new Date() },
        { kode: "AL", name: "Atu Lintang", createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Kecamatans", null, {});
  },
};
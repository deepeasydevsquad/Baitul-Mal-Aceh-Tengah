"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Desas",
      [
        // Kecamatan 1: Bebesen
        { kecamatan_id: 1, name: 'Bale Atu', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Bale Atu Gayo', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Bebesen', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Bener Pepanyi', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Blang Kolak I', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Blang Kolak II', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Blang Kolak III', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Blang Mancung', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Gunung Bukit', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Hakim Bale Bujang', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Hakim Bale Takengon', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Kemili', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Kuteni Reje', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Lelabu', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Lelabu Pepanyi', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Lelabu Pepanyi', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Paya Tumpi Baru', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Paya Tumpi I', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Paya Tumpi Induk', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 1, name: 'Paya Tumpi Lama', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 2: Bies
        { kecamatan_id: 2, name: 'Bies Penantanan', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 2, name: 'Bies Mulie', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 2, name: 'Bintang Bener', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 2, name: 'Bintang Kekelip', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 2, name: 'Bintang Pepanyi', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 2, name: 'Bintang Pepanyi', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 2, name: 'Bintang Pepanyi', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 2, name: 'Bintang Pepanyi', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 3: Bintang
        { kecamatan_id: 3, name: 'Bintang', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 3, name: 'Bintang Kekelip', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 3, name: 'Bintang Pepanyi', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 4: Celala
        { kecamatan_id: 4, name: 'Celala', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 4, name: 'Celala Baru', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 5: Jagong Jeget
        { kecamatan_id: 5, name: 'Jagong Jeget', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 5, name: 'Jeget Ayu', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 6: Kebayakan
        { kecamatan_id: 6, name: 'Kebayakan', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 7: Ketol
        { kecamatan_id: 7, name: 'Ketol', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 8: Kute Panang
        { kecamatan_id: 8, name: 'Kute Panang', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 9: Linge
        { kecamatan_id: 9, name: 'Linge', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 10: Lut Tawar
        { kecamatan_id: 10, name: 'Lut Tawar', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 11: Pegasing
        { kecamatan_id: 11, name: 'Pegasing', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 12: Rusip Antara
        { kecamatan_id: 12, name: 'Rusip Antara', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 13: Silih Nara
        { kecamatan_id: 13, name: 'Silih Nara', createdAt: new Date(), updatedAt: new Date() },
        // Kecamatan 14: Atu Lintang
        { kecamatan_id: 14, name: 'Atu Lintang', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 14, name: 'Berawang Dewal', createdAt: new Date(), updatedAt: new Date() },
        { kecamatan_id: 14, name: 'Delung Sikenel', createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Desas", null, {});
  },
};
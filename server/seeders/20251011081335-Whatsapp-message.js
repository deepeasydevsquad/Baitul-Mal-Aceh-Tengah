"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Whatsapp_messages", [
      {
        id: 1,
        sender_number: "085262802141",
        destination_number: "085262802141",
        message: "Tes",
        status: "success",
        type: "munfiq",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  // "surveyor",
  //       "pemohon",
  //       "otp",
  //       "munfiq",
  //       "muzakki",
  //       "pesan_biasa",

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Whatsapp_templates", null, {});
  },
};

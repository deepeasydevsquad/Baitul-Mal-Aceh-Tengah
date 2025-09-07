'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Otps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      whatsapp_number: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.INTEGER
      },
      otp_time: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM, 
        values: ['digunakan', 'belum_digunakan'], 
        defaultValue: 'belum_digunakan'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Otps');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Whatsapp_messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      destination_number: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM,
        values: ['process','success','failed'],
        defaultValue: 'process'
      },
      type: {
        type: Sequelize.ENUM,
        values: ['surveyor','pemohon','otp','muzakki_munfiq'],
        allowNull: true
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
    await queryInterface.dropTable('Whatsapp_messages');
  }
};
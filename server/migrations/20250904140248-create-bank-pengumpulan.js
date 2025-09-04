'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bank_pengumpulans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bank_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Banks",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      tipe: {
        type: Sequelize.ENUM,
        values: ['zakat', 'infaq', 'donasi'],
        defaultValue : "zakat"
      },
      nomor_akun_bank: {
        type: Sequelize.STRING
      },
      nama_akun_bank: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Bank_pengumpulans');
  }
};
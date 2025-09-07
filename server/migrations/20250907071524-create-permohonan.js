'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Permohonans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      member_id: {
        type: Sequelize.INTEGER,
         references: {
          model: "Members",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      kegiatan_id: {
        type: Sequelize.INTEGER,
         references: {
          model: "Kegiatans",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      bank_id: {
        type: Sequelize.INTEGER,
         references: {
          model: "Banks",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      nomor_akun_bank: {
        type: Sequelize.STRING
      },
      nama_akun_bank: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM,
        values: ["sedang_berlangsung", "terhenti"],
        defaultValue : "terhenti"
      },
      alasan_penolakan: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Permohonans');
  }
};
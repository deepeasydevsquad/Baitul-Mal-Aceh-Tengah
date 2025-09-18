'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Validasi_syarat_permohonans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      realisasi_permohonan_id: {
        type: Sequelize.INTEGER,
           references: {
          model: "Realisasi_permohonans",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      file_name: {
        type: Sequelize.STRING
      },
      path: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM, 
        values: ["process", "approve", "reject"], 
        defaultValue : "process"
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
    await queryInterface.dropTable('Validasi_syarat_permohonans');
  }
};
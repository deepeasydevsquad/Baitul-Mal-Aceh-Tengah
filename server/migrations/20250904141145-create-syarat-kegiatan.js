'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Syarat_kegiatans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kegiatan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Kegiatans",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      syarat_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Syarats",
          key: "id",
        },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('Syarat_kegiatans');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Kecamatan_area_kegiatans', {
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
      kecamatan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Kecamatans",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      kuota: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Kecamatan_area_kegiatans');
  }
};
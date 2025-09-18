'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Desa_area_kegiatans', {
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
      desa_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Desas",
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
    await queryInterface.dropTable('Desa_area_kegiatans');
  }
};
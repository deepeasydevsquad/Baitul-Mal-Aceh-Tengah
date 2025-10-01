"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Target_distribusis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tahun: {
        type: Sequelize.INTEGER,
      },
      asnaf_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Asnafs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      tipe: {
        type: Sequelize.ENUM,
        values: ["zakat", "infaq", "donasi"],
        allowNull: false,
      },
      target_orang: {
        type: Sequelize.INTEGER,
      },
      target_rupiah: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Target_distribusis");
  },
};

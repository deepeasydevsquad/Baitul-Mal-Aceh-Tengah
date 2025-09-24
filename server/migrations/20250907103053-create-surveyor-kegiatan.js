"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Surveyor_kegiatans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      kegiatan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Kegiatans",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      surveyor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Surveyors",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      sk: {
        type: Sequelize.STRING,
      },
      access_code: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "non_active"],
        defaultValue: "non_active",
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
    await queryInterface.dropTable("Surveyor_kegiatans");
  },
};

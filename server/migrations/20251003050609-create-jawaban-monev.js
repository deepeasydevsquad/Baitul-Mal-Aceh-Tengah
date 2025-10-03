"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Jawaban_monevs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      monev_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Monevs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      pertanyaan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Pertanyaan_monevs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      jawaban: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("Jawaban_monevs");
  },
};

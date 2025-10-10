"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Monevs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      permohonan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Permohonans",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      jenis_monev: {
        type: Sequelize.ENUM,
        values: [
          "evaluasi_konsumtif",
          "monitoring_konsumtif",
          "evaluasi_pemberdayaan_ekonomi",
          "monitoring_pemberdayaan_ekonomi",
          "evaluasi_pendidikan",
          "monitoring_pendidikan",
        ],
      },
      tipe: {
        type: Sequelize.ENUM,
        values: ["monitoring", "evaluasi"],
      },
      nama_petugas_monev: {
        type: Sequelize.STRING,
      },
      tim_monev_1: {
        type: Sequelize.STRING,
      },
      tim_monev_2: {
        type: Sequelize.STRING,
      },
      tim_monev_3: {
        type: Sequelize.STRING,
      },
      rekomendasi_tim: {
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
    await queryInterface.dropTable("Monevs");
  },
};

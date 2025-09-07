'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Realisasi_permohonans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      permohonan_id: {
        type: Sequelize.INTEGER,
           references: {
          model: "Permohonans",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM,
        values: ["process", "process_lapangan", "approve", "reject_berkas", "reject_tidak_layak", "reject_sudah_pernah", "reject_unkriteria", "reject_administrasi","ditunda"],
        defaultValue : "process"
      },
      biaya_disetujui: {
        type: Sequelize.INTEGER
      },
      status_realisasi: {
        type: Sequelize.ENUM, 
        values: ["belum_direalisasi", "sudah_direalisasi"], 
        defaultValue : "belum_direalisasi"
      },
      tanggal_realisasi: {
        type: Sequelize.DATE
      },
      berita_acara: {
        type: Sequelize.STRING
      },
      tipe: {
        type: Sequelize.ENUM,
        values: ["transfer", "bantuan_langsung"],
        defaultValue: 'bantuan_langsung'
      },
      nominal_realisasi: {
        type: Sequelize.INTEGER
      },
      bukti_transfer: {
        type: Sequelize.STRING
      },
      mou: {
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
    await queryInterface.dropTable('Realisasi_permohonans');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Kegiatan_keseketariatans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_kegiatan: {
        type: Sequelize.TEXT
      },
      sumber_dana: {
        type: Sequelize.ENUM, 
        values: ['zakat', 'infaq','operasional_apbk'],
        allowNull: true
      },
      penerima: {
        type: Sequelize.STRING
      },
      jenis_penerima: {
        type: Sequelize.ENUM, 
        values: ['perorangan','instansi'],
        defaultValue : 'perorangan'
      },
      nominal_kegiatan: {
        type: Sequelize.INTEGER
      },
      area_penyaluran: {
        type: Sequelize.ENUM, 
        values: ['kabupaten','kecamatan'],
        defaultValue: 'kabupaten'
      },
      desa_id: {
        type: Sequelize.INTEGER,
           references: {
          model: "Desas",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      alamat: {
        type: Sequelize.TEXT
      },
      tanggal_penyaluran: {
        type: Sequelize.DATEONLY
      },
      upload_bukti: {
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
    await queryInterface.dropTable('Kegiatan_keseketariatans');
  }
};
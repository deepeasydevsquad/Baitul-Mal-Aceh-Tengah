'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pertanyaan_monevs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jenis_monev: {
        type: Sequelize.ENUM,
        values: ['evaluasi_konsumtif','monitoring_konsumtif','evaluasi_pemberdayaan_ekonomi','monitoring_pemberdayaan_ekonomi','evaluasi_pendidikan','monitoring_pendidikan']
      },
      tipe: {
        type: Sequelize.ENUM,
        values: ['monitoring','evaluasi']
      },
      bagian: {
        type: Sequelize.ENUM,
        values: ['identitas_mustahik','identitas_kelompok','mustahik','birokrasi_administrasi','pemanfaatan_bantuan','pendampingan','identitas_orang_tua','kondisi_ekonomi','info_sekolah_dayah_kampus','lembaga_mitra','partisipasi_sekolah']
      },
      pertanyaan: {
        type: Sequelize.TEXT
      },
      parent_id: {
        type: Sequelize.INTEGER
      },
      bentuk_pertanyaan: {
        type: Sequelize.ENUM,
        values: ['text','checkbox','currency']
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
    await queryInterface.dropTable('Pertanyaan_monevs');
  }
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Kegiatans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      asnaf_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Asnafs",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      program_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Programs",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      kode: {
        type: Sequelize.STRING
      },
      nama_kegiatan: {
        type: Sequelize.TEXT
      },
      slug: {
        type: Sequelize.TEXT
      },
      status_tampil: {
        type: Sequelize.ENUM,
        values: ['tampil', 'tidak_tampil'],
        defaultValue : "tidak_tampil"
      },
      jumlah_dana: {
        type: Sequelize.INTEGER
      },
      jumlah_maksimal_nominal_bantuan: {
        type: Sequelize.INTEGER
      },
      jumlah_target_penerima: {
        type: Sequelize.INTEGER
      },
      sumber_dana: {
        type: Sequelize.ENUM,
        values: ['infaq', 'zakat'],
        defaultValue : "zakat"
      },
      area_penyaluran: {
        type: Sequelize.ENUM,
        values: ["semua_pemohon", "kabupaten", "instansi", "kecamatan", "desa"],
        defaultValue : "semua_pemohon"
      },
      jenis_penyaluran: {
        type: Sequelize.ENUM,
        values: ["langsung", "volume"],
        defaultValue : "langsung"
      },
      status_kegiatan: {
        type: Sequelize.ENUM,
        values: ["sedang_berlangsung", "selesai"],
        defaultValue : "sedang_berlangsung"
      },
      tahun: {
        type: Sequelize.INTEGER
      },
      banner: {
        type: Sequelize.STRING
      },
      periode_bantuan: {
        type: Sequelize.ENUM,
        values: ["tahunan", "bulanan"],
        defaultValue : "tahunan"
      },
      desc: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Kegiatans');
  }
};

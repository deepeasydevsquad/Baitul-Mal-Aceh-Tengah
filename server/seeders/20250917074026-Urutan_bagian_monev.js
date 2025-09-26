"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Urutan_bagian_monevs",
      [
        {
          jenis_monev: "evaluasi_konsumtif",
          urutan_bagian: `["identitas_mustahik","identitas_kelompok","mustahik"]`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          jenis_monev: "monitoring_konsumtif",
          urutan_bagian: `["identitas_mustahik","identitas_kelompok","birokrasi_administrasi","pemanfaatan_bantuan"]`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          jenis_monev: "evaluasi_pemberdayaan_ekonomi",
          urutan_bagian: `["identitas_mustahik","identitas_kelompok","mustahik"]`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          jenis_monev: "monitoring_pemberdayaan_ekonomi",
          urutan_bagian: `["identitas_mustahik","identitas_kelompok","birokrasi_administrasi","pemanfaatan_bantuan","pendampingan"]`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          jenis_monev: "evaluasi_pendidikan",
          urutan_bagian: `["identitas_mustahik","identitas_orang_tua","kondisi_ekonomi","info_sekolah_dayah_kampus","lembaga_mitra","mustahik"]`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          jenis_monev: "monitoring_pendidikan",
          urutan_bagian: `["identitas_mustahik","identitas_orang_tua","kondisi_ekonomi","info_sekolah_dayah_kampus","lembaga_mitra","partisipasi_sekolah","identitas_kelompok","birokrasi_administrasi","pemanfaatan_bantuan"]`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Urutan_bagian_monevs", null, {});
  },
};

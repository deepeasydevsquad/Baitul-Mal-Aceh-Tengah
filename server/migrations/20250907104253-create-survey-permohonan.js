'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Survey_permohonans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      surveyor_kegiatan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Surveyor_kegiatans",
          key: "id",
        },
      },
      permohonan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Permohonans",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM,
        values: ["process", "approve", "reject"],
        defaultValue: 'process'
      },
      kesimpulan: {
        type: Sequelize.TEXT
      },
      form_survey: {
        type: Sequelize.STRING
      },
      berita_acara: {
        type: Sequelize.STRING
      },
      tanggal_penilaian: {
        type: Sequelize.DATEONLY
      },
      nomor_ktp: {
        type: Sequelize.STRING
      },
      tempat_lahir: {
        type: Sequelize.STRING
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY
      },
      nama_suami_istri: {
        type: Sequelize.STRING
      },
      pekerjaan_suami_istri: {
        type: Sequelize.STRING
      },
      jumlah_tanggungan_suami_istri: {
        type: Sequelize.INTEGER
      },
      alamat: {
        type: Sequelize.TEXT
      },
      jenis_kelamin: {
        type: Sequelize.ENUM,
        values: ["laki_laki", "perempuan"],
      },
      status_pernikahan: {
        type: Sequelize.ENUM,
        values: ["belum_nikah", "menikah", "cerai_mati", "cerai_hidup"],
      },
      usia_25_60: {
        type: Sequelize.ENUM,
        values: ["iya", "tidak"],
      },
      penduduk_tetap: {
        type: Sequelize.ENUM,
        values: ["iya", "tidak"],
      },
      penghasilan_2jt: {
        type: Sequelize.ENUM,
        values: ["iya", "tidak"],
      },
      kondisi_fisik: {
        type: Sequelize.ENUM,
        values: ["disabilitas", "non_disabilitas", "pasca_odgj"],
      },
      atap: {
        type: Sequelize.ENUM,
        values: ["genteng_seng", "genteng_beton"],
      },
      rangka_rumah: {
        type: Sequelize.ENUM,
        values: ["kayu", "beton"],
      },
      dinding_rumah: {
        type: Sequelize.ENUM,
        values: ["tembok_semen", "papan", "triplek"],
      },
      lantai: {
        type: Sequelize.ENUM,
        values: ["tanah", "keramik", "ubin_semen"],
      },
      mck: {
        type: Sequelize.ENUM,
        values: ["sungai_jamban", "mck_umum", "k_mandi_pribadi"],
      },
      luas_rumah: {
        type: Sequelize.ENUM,
        values: ["kecil", "sedang", "luas"],
      },
      aset: {
        type: Sequelize.ENUM,
        values: ["kebun", "emas", "sawah", "tanah"],
      },
      kendaraan: {
        type: Sequelize.ENUM,
        values: ["sepeda", "sepeda_motor", "mobil"],
      },
      keterangan_kondisi_calon: {
        type: Sequelize.TEXT
      },
      keterangan_pilih_mustahik: {
        type: Sequelize.ENUM,
        values: ["miskin", "sederhana", "kaya"],
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
    await queryInterface.dropTable('Survey_permohonans');
  }
};
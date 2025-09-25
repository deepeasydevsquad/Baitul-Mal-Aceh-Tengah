"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Kegiatans",
      [
        {
          asnaf_id: 1,
          program_id: 1,
          kode: "PEND-001",
          nama_kegiatan: "Bantuan Pendidikan Anak Yatim & Dhuafa",
          slug: "bantuan-pendidikan-anak-yatim-dhuafa-2025",
          status_tampil: "tampil",
          jumlah_dana: 150000000,
          jumlah_maksimal_nominal_bantuan: 1000000,
          jumlah_target_penerima: 150,
          sumber_dana: "zakat",
          area_penyaluran: "kabupaten",
          jenis_penyaluran: "langsung",
          status_kegiatan: "sedang_berlangsung",
          tahun: 2025,
          banner: "korban.png",
          periode_bantuan: "tahunan",
          desc: "Program bantuan biaya pendidikan untuk siswa/siswi yatim dan dhuafa di seluruh kabupaten.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          asnaf_id: 1, // harus ada di tabel asnafs
          program_id: 1, // harus ada di tabel programs
          kode: `PEND-${Math.floor(Math.random() * 1000) + 1}`,
          nama_kegiatan: `Bantuan Pendidikan Anak Yatim & Dhuafa ${
            Math.floor(Math.random() * 10) + 1
          }`,
          slug: `bantuan-pendidikan-anak-yatim-dhuafa-${
            Math.floor(Math.random() * 10) + 1
          }-2025`,
          status_tampil: Math.random() < 0.5 ? "tampil" : "tidak_tampil",
          jumlah_dana: Math.floor(Math.random() * 100000000) + 1000000,
          jumlah_maksimal_nominal_bantuan:
            Math.floor(Math.random() * 1000000) + 100000,
          jumlah_target_penerima: Math.floor(Math.random() * 100) + 10,
          sumber_dana: Math.random() < 0.5 ? "infaq" : "zakat",
          area_penyaluran: "desa",
          jenis_penyaluran: Math.random() < 0.5 ? "langsung" : "volume",
          status_kegiatan:
            Math.random() < 0.5 ? "sedang_berlangsung" : "selesai",
          tahun: 2025,
          banner: `${Math.floor(Math.random() * 10) + 1}.png`,
          desc: `Program bantuan biaya pendidikan untuk siswa/siswi yatim dan dhuafa di seluruh kabupaten ${
            Math.floor(Math.random() * 10) + 1
          }`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          asnaf_id: 3,
          program_id: 2,
          kode: `YUDI-${Math.floor(Math.random() * 1000) + 1}`,
          nama_kegiatan: `Bantuan Pendidikan Anak Yatim & Dhuafa ${
            Math.floor(Math.random() * 10) + 1
          }`,
          slug: `bantuan-pendidikan-anak-yatim-dhuafa-${
            Math.floor(Math.random() * 10) + 1
          }-2025`,
          status_tampil: Math.random() < 0.5 ? "tampil" : "tidak_tampil",
          jumlah_dana: Math.floor(Math.random() * 100000000) + 1000000,
          jumlah_maksimal_nominal_bantuan:
            Math.floor(Math.random() * 1000000) + 100000,
          jumlah_target_penerima: Math.floor(Math.random() * 100) + 10,
          sumber_dana: Math.random() < 0.5 ? "infaq" : "zakat",
          area_penyaluran: "kecamatan",
          jenis_penyaluran: Math.random() < 0.5 ? "langsung" : "volume",
          status_kegiatan:
            Math.random() < 0.5 ? "sedang_berlangsung" : "selesai",
          tahun: 2025,
          banner: `${Math.floor(Math.random() * 10) + 1}.png`,
          desc: `Program bantuan biaya pendidikan untuk siswa/siswi yatim dan dhuafa di seluruh kecamatan ${
            Math.floor(Math.random() * 10) + 1
          }`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Kegiatans", null, {});
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Kegiatans",
      [
        // --- Data asli lo ---
        {
          asnaf_id: 1,
          program_id: 1,
          kode: "PEND-001",
          satuan: "orang",
          nama_kegiatan: "Bantuan Pendidikan Anak Yatim & Dhuafa",
          slug: "bantuan-pendidikan-anak-yatim-dhuafa-2023",
          status_tampil: "tampil",
          jumlah_dana: 150000000,
          jumlah_maksimal_nominal_bantuan: 2000000,
          jumlah_target_penerima: 150,
          sumber_dana: "zakat",
          area_penyaluran: "kabupaten",
          jenis_penyaluran: "langsung",
          status_kegiatan: "selesai",
          tahun: 2025,
          banner: "pendidikan-2023.png",
          periode_bantuan: "tahunan",
          desc: "Program bantuan biaya pendidikan untuk siswa/siswi yatim dan dhuafa di seluruh kabupaten (2023).",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          asnaf_id: 2,
          program_id: 1,
          kode: "PEND-002",
          satuan: "orang",
          nama_kegiatan: "Bantuan Pendidikan Sekolah Gratis",
          slug: "bantuan-pendidikan-sekolah-gratis-2024",
          status_tampil: "tampil",
          jumlah_dana: 200000000,
          jumlah_maksimal_nominal_bantuan: 2500000,
          jumlah_target_penerima: 250,
          sumber_dana: "infaq",
          area_penyaluran: "desa",
          jenis_penyaluran: "langsung",
          status_kegiatan: "sedang_berlangsung",
          tahun: 205,
          banner: "pendidikan-2024.png",
          periode_bantuan: "tahunan",
          desc: "Program bantuan biaya pendidikan untuk anak dhuafa di tingkat desa (2024).",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          asnaf_id: 3,
          program_id: 2,
          kode: "PEND-003",
          satuan: "orang",
          nama_kegiatan: "Beasiswa Anak Yatim Berprestasi",
          slug: "beasiswa-anak-yatim-berprestasi-2025",
          status_tampil: "tampil",
          jumlah_dana: 300000000,
          jumlah_maksimal_nominal_bantuan: 3000000,
          jumlah_target_penerima: 300,
          sumber_dana: "zakat",
          area_penyaluran: "kecamatan",
          jenis_penyaluran: "volume",
          status_kegiatan: "sedang_berlangsung",
          tahun: 2025,
          banner: "pendidikan-2025.png",
          periode_bantuan: "tahunan",
          desc: "Program beasiswa penuh untuk anak yatim berprestasi di seluruh kecamatan (2025).",
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

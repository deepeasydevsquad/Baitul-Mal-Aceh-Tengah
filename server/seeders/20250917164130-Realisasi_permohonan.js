"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const year = 2025; // biar jelas tahun 2025 semua

    function getEndOfMonth(year, month) {
      return new Date(year, month + 1, 0);
    }

    await queryInterface.bulkInsert(
      "Realisasi_permohonans",
      [
        {
          permohonan_id: 1,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 8), // September 2025
          berita_acara: "path/to/berita_acara_1.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_1.jpg",
          mou: "path/to/mou_1.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 2,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 9), // Oktober 2025
          berita_acara: "path/to/berita_acara_2.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_2.jpg",
          mou: "path/to/mou_2.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 3,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 10), // November 2025
          berita_acara: "path/to/berita_acara_3.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_3.jpg",
          mou: "path/to/mou_3.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 4,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 11), // Desember 2025
          berita_acara: "path/to/berita_acara_4.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_4.jpg",
          mou: "path/to/mou_4.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 5,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 0), // Januari 2025
          berita_acara: "path/to/berita_acara_5.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_5.jpg",
          mou: "path/to/mou_5.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 6,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 1), // Februari 2025
          berita_acara: "path/to/berita_acara_6.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_6.jpg",
          mou: "path/to/mou_6.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 7,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 2), // Maret 2025
          berita_acara: "path/to/berita_acara_7.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_7.jpg",
          mou: "path/to/mou_7.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 8,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 3), // April 2025
          berita_acara: "path/to/berita_acara_8.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_8.jpg",
          mou: "path/to/mou_8.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 9,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 4), // Mei 2025
          berita_acara: "path/to/berita_acara_9.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_9.jpg",
          mou: "path/to/mou_9.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 10,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 5), // Juni 2025
          berita_acara: "path/to/berita_acara_10.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_10.jpg",
          mou: "path/to/mou_10.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 11,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 6), // Juli 2025
          berita_acara: "path/to/berita_acara_11.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_11.jpg",
          mou: "path/to/mou_11.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          permohonan_id: 12,
          status: "approve",
          biaya_disetujui: 5000000,
          status_realisasi: "sudah_direalisasi",
          tanggal_realisasi: getEndOfMonth(year, 7), // Agustus 2025
          berita_acara: "path/to/berita_acara_12.pdf",
          tipe: "transfer",
          nominal_realisasi: 5000000,
          bukti_transfer: "path/to/bukti_transfer_12.jpg",
          mou: "path/to/mou_12.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Realisasi_permohonans", null, {});
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Programs",
      [
        {
          name: "Bantuan Sosial",
          desc: "Program bantuan untuk masyarakat yang membutuhkan dalam bentuk kebutuhan pokok, sandang, dan bantuan darurat lainnya.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bantuan Pemberdayaan Ekonomi",
          desc: "Program yang bertujuan meningkatkan kemandirian ekonomi masyarakat melalui pelatihan, modal usaha, dan pendampingan.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bantuan Kesehatan",
          desc: "Program bantuan untuk mendukung kebutuhan kesehatan masyarakat, seperti pengobatan, alat kesehatan, dan biaya rumah sakit.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bantuan Sosial Keagamaan",
          desc: "Program bantuan yang mendukung kegiatan keagamaan, pembangunan sarana ibadah, dan kegiatan sosial berbasis agama.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bantuan Pendidikan",
          desc: "Program bantuan untuk mendukung pendidikan masyarakat, seperti beasiswa, perlengkapan sekolah, dan pelatihan pendidikan.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Programs", null, {});
  },
};

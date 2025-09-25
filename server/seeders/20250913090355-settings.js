"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Settings",
      [
        {
          name: "api_key",
          value: "EEC67097-6D17-4767-A3D5-D9D5B3420533",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "device_key",
          value: "VFAURD",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "whatsapp_number",
          value: "62895330275849",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "icon",
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "logo",
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "hero_logo",
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "nama_kabupaten_kota",
          value: "Kab. Aceh Tengah",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "alamat",
          value:
            "Jl. Lebe Kader No.2, Asir Asir Asia, Kec. Lut Tawar, Kabupaten Aceh Tengah, Provinsi Aceh 24519",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "quote",
          value: "Sucikan Harta dengan Zakat",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "nama_jabatan1",
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "nama_jabatan2",
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "nama_jabatan3",
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "nama_pejabat1",
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "nama_pejabat2",
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "nama_pejabat3",
          value: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Settings", null, {});
  },
};

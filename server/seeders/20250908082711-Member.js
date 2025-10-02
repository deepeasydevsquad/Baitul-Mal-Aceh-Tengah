"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Members",
      [
        {
          desa_id: 1,
          kode: "AABBCC",
          tipe: "perorangan",
          fullname: "Member Admin Akun",
          nomor_ktp: "1175427237712",
          nomor_kk: "1175427237712",
          whatsapp_number: "085262802141",
          birth_date: "1999-01-01",
          alamat: "Jln Utama, Kabupaten Aceh Tengah",
          username: "admin",
          password:
            "$2a$10$0nIvAjMEhKk2S2T2GbP1ou0OIpItaEtlHqb9Dns1NSQdkVM1r6o82",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          desa_id: 2,
          kode: "SDK12238",
          tipe: "perorangan",
          fullname: "Mita Wulandari",
          nomor_ktp: "89I12348587",
          nomor_kk: "89I12348587",
          whatsapp_number: "085262802141",
          birth_date: "1999-01-01",
          alamat: "Jln Bale Atu, Kecamatan Bukit, Kabupaten Bener Meriah",
          username: "admin",
          password:
            "$2a$10$0nIvAjMEhKk2S2T2GbP1ou0OIpItaEtlHqb9Dns1NSQdkVM1r6o82",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          desa_id: 3,
          kode: "AABBCC",
          tipe: "instansi",
          fullname: "Depot Padepokan Alam",
          nomor_ktp: "1175427237712",
          nomor_kk: "1175427237712",
          whatsapp_number: "085262802141",
          birth_date: "1999-01-01",
          alamat: "Jln Utama, Kabupaten Aceh Tengah, Aceh Tengah",
          username: "admin",
          password:
            "$2a$10$0nIvAjMEhKk2S2T2GbP1ou0OIpItaEtlHqb9Dns1NSQdkVM1r6o82",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          desa_id: 4,
          kode: "AABBCC",
          tipe: "perorangan",
          fullname: "Abdillah",
          nomor_ktp: "1175427237712",
          nomor_kk: "1175427237712",
          whatsapp_number: "085262802141",
          birth_date: "1999-01-01",
          alamat: "Jln Utama, Kabupaten Aceh Tengah",
          username: "admin",
          password:
            "$2a$10$0nIvAjMEhKk2S2T2GbP1ou0OIpItaEtlHqb9Dns1NSQdkVM1r6o82",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Members", null, {});
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Members",
      [
        {
          desa_id: 1, 
          kode: 'AABBCC',
          tipe: 'perorangan',
          fullname: 'Member Admin Akun',
          nomor_ktp: '1175427237712',
          nomor_kk: '1175427237712',
          whatsapp_number: '085262802141',
          birth_date: '1999-01-01',
          alamat: 'Jln Utama, Kabupaten Aceh Tengah',
          username: 'admin',
          password: '$2a$10$Ck6lr65BJZyHCKcORjf47eLiOwTxqEVUJYltyHlhSJ.zPuDOahhxm',
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
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Kegiatans', [
      {
        asnaf_id: 1,
        program_id: 1,
        kode: 'PEND-001',
        nama_kegiatan: 'Bantuan Pendidikan Anak Yatim & Dhuafa',
        slug: 'bantuan-pendidikan-anak-yatim-dhuafa-2025',
        status_tampil: 'tampil',
        jumlah_dana: 150000000,
        jumlah_maksimal_nominal_bantuan: 1000000,
        jumlah_target_penerima: 150,
        sumber_dana: 'zakat',
        area_penyaluran: 'kabupaten',
        jenis_penyaluran: 'langsung',
        status_kegiatan: 'sedang_berlangsung',
        tahun: 2025,
        name: 'Bantuan Pendidikan 2025',
        banner: 'banners/pendidikan_2025.jpg',
        desc: 'Program bantuan biaya pendidikan untuk siswa/siswi yatim dan dhuafa di seluruh kabupaten.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Kegiatans', null, {});
  }
};
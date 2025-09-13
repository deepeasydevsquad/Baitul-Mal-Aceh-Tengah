'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('system_log_surveyors', [
      {
        surveyor_id: 1,                  // id dari Surveyor A
        message: 'Login berhasil',
        ip: '192.168.1.10',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        surveyor_id: 1,                  // id dari Surveyor B
        message: 'Mengupdate data survey',
        ip: '192.168.1.11',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        surveyor_id: 1,                  // id dari Surveyor C
        message: 'Logout',
        ip: '192.168.1.12',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('system_log_surveyors', null, {});
  }
};

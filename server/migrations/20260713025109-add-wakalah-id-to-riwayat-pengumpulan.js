'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Riwayat_pengumpulans');
    if (!tableInfo.wakalah_id) {
      await queryInterface.addColumn('Riwayat_pengumpulans', 'wakalah_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Wakalahs', // Make sure this is the correct table name for Wakalah model
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  },

  async down (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Riwayat_pengumpulans');
    if (tableInfo.wakalah_id) {
      await queryInterface.removeColumn('Riwayat_pengumpulans', 'wakalah_id');
    }
  }
};

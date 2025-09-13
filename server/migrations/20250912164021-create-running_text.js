'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Running_texts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      is_active:{
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    // DIUBAH: dari Running_text menjadi Running_texts
    await queryInterface.dropTable('Running_texts');
  }
};

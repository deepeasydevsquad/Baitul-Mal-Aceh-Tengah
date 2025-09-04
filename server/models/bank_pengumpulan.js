'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bank_pengumpulan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bank_pengumpulan.belongsTo(models.Bank, {
        foreignKey: "bank_id",
      });
    }
  }
  Bank_pengumpulan.init({
    bank_id: DataTypes.INTEGER,
    tipe: DataTypes.ENUM(['zakat', 'infaq', 'donasi']),
    nomor_akun_bank: DataTypes.STRING,
    nama_akun_bank: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bank_pengumpulan',
  });
  return Bank_pengumpulan;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Target_pengumpulan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Target_pengumpulan.init({
    tahun: DataTypes.INTEGER,
    bulan: DataTypes.INTEGER,
    zakat: DataTypes.INTEGER,
    infaq: DataTypes.INTEGER,
    donasi: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Target_pengumpulan',
  });
  return Target_pengumpulan;
};
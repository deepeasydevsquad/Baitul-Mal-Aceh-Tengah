'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Urutan_bagian_monev extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Urutan_bagian_monev.init({
    jenis_monev: DataTypes.STRING,
    urutan_bagian: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Urutan_bagian_monev',
  });
  return Urutan_bagian_monev;
};
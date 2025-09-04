'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kecamatan_area_kegiatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kecamatan_area_kegiatan.belongsTo(models.Kegiatan, {
        foreignKey: "kegiatan_id",
      });
      Kecamatan_area_kegiatan.belongsTo(models.Kecamatan, {
        foreignKey: "kecamatan_id",
      });
    }
  }
  Kecamatan_area_kegiatan.init({
    kegiatan_id: DataTypes.INTEGER,
    kecamatan_id: DataTypes.INTEGER,
    kuota: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Kecamatan_area_kegiatan',
  });
  return Kecamatan_area_kegiatan;
};
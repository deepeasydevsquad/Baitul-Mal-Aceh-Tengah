'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Desa_area_kegiatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Desa_area_kegiatan.belongsTo(models.Kegiatan, {
        foreignKey: "kegiatan_id",
      });
      Desa_area_kegiatan.belongsTo(models.Desa, {
        foreignKey: "desa_id",
      });
    }
  }
  Desa_area_kegiatan.init({
    kegiatan_id: DataTypes.INTEGER,
    desa_id: DataTypes.INTEGER,
    kuota: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Desa_area_kegiatan',
  });
  return Desa_area_kegiatan;
};
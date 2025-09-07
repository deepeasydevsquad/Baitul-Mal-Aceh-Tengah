'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Syarat_kegiatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Syarat_kegiatan.belongsTo(models.Syarat, {
        foreignKey: "syarat_id",
      });
      Syarat_kegiatan.belongsTo(models.Kegiatan, {
        foreignKey: "kegiatan_id",
      });
    }
  }
  Syarat_kegiatan.init({
    kegiatan_id: DataTypes.INTEGER,
    syarat_id: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: 'Syarat_kegiatan',
  });
  return Syarat_kegiatan;
};
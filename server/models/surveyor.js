'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Surveyor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Surveyor.hasMany(models.System_log_surveyor, {
        foreignKey: "surveyor_id",
        onDelete: "CASCADE",
      });
      Surveyor.hasMany(models.Surveyor_kegiatan, {
        foreignKey: "surveyor_id",
        onDelete: "CASCADE",
      });
    }
  }
  Surveyor.init({
    name: DataTypes.STRING,
    nik: DataTypes.STRING,
    whatsapp_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Surveyor',
  });
  return Surveyor;
};
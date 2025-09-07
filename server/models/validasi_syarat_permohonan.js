'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Validasi_syarat_permohonan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Validasi_syarat_permohonan.belongsTo(models.Realisasi_permohonan, {
        foreignKey: "realisasi_permohonan_id",
      });
    }
  }
  Validasi_syarat_permohonan.init({
    realisasi_permohonan_id: DataTypes.INTEGER,
    file_name: DataTypes.STRING,
    path: DataTypes.STRING,
    status: DataTypes.ENUM(["process", "approve", "reject"]),
    alasan_penolakan: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Validasi_syarat_permohonan',
  });
  return Validasi_syarat_permohonan;
};
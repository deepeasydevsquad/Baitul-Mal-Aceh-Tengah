'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permohonan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Permohonan.belongsTo(models.Member, {
        foreignKey: "member_id",
      });
      Permohonan.belongsTo(models.Kegiatan, {
        foreignKey: "kegiatan_id",
      });
      Permohonan.belongsTo(models.Bank, {
        foreignKey: "bank_id",
      });
      Permohonan.hasMany(models.Realisasi_permohonan, {
        foreignKey: "permohonan_id",
      });
      Permohonan.hasMany(models.Survey_permohonan, {
        foreignKey: "permohonan_id",
      });

    //      Survey_permohonan.belongsTo(models.Surveyor_kegiatan, {
    //     foreignKey: "surveyor_kegiatan_id",
    //   });
    }
  }
  Permohonan.init({
    member_id: DataTypes.INTEGER,
    kegiatan_id: DataTypes.INTEGER,
    bank_id: DataTypes.INTEGER,
    nomor_akun_bank: DataTypes.STRING,
    nama_akun_bank: DataTypes.STRING,
    status: DataTypes.ENUM(['sedang_berlangsung', 'terhenti']),
    alasan_penolakan: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Permohonan',
  });
  return Permohonan;
};
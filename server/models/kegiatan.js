"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kegiatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kegiatan.belongsTo(models.Asnaf, {
        foreignKey: "asnaf_id",
      });
      Kegiatan.belongsTo(models.Program, {
        foreignKey: "program_id",
      });
      Kegiatan.hasMany(models.Syarat_kegiatan, {
        foreignKey: "kegiatan_id",
        onDelete: "CASCADE",
      });
      Kegiatan.hasMany(models.Kriteria, {
        foreignKey: "kegiatan_id",
        onDelete: "CASCADE",
      });
      Kegiatan.hasMany(models.Desa_area_kegiatan, {
        foreignKey: "kegiatan_id",
        onDelete: "CASCADE",
      });
      Kegiatan.hasMany(models.Kecamatan_area_kegiatan, {
        foreignKey: "kegiatan_id",
        onDelete: "CASCADE",
      });
      Kegiatan.hasMany(models.Permohonan, {
        foreignKey: "kegiatan_id",
      });
      Kegiatan.hasMany(models.Surveyor_kegiatan, {
        foreignKey: "kegiatan_id",
        onDelete: "CASCADE",
      });
    }
  }
  Kegiatan.init(
    {
      asnaf_id: DataTypes.INTEGER,
      program_id: DataTypes.INTEGER,
      satuan: DataTypes.STRING,
      kode: DataTypes.STRING,
      nama_kegiatan: DataTypes.TEXT,
      slug: DataTypes.TEXT,
      status_tampil: DataTypes.ENUM(["tampil", "tidak_tampil"]),
      jumlah_dana: DataTypes.INTEGER,
      jumlah_maksimal_nominal_bantuan: DataTypes.INTEGER,
      jumlah_target_penerima: DataTypes.INTEGER,
      sumber_dana: DataTypes.ENUM(["infaq", "zakat"]),
      area_penyaluran: DataTypes.ENUM([
        "semua_pemohon",
        "kabupaten",
        "instansi",
        "kecamatan",
        "desa",
      ]),
      jenis_penyaluran: DataTypes.ENUM(["langsung", "volume"]),
      status_kegiatan: DataTypes.ENUM(["sedang_berlangsung", "selesai"]),
      tahun: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      banner: DataTypes.STRING,
      periode_bantuan: DataTypes.ENUM(["tahunan", "bulanan"]),
      desc: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Kegiatan",
    },
  );
  return Kegiatan;
};

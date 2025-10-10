"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pertanyaan_monev extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Jawaban_monev.belongsTo(models.Pertanyaan, {
      //   foreignKey: "pertanyaan_id",
      // });
    }
  }
  Pertanyaan_monev.init(
    {
      jenis_monev: DataTypes.ENUM([
        "evaluasi_konsumtif",
        "monitoring_konsumtif",
        "evaluasi_pemberdayaan_ekonomi",
        "monitoring_pemberdayaan_ekonomi",
        "evaluasi_pendidikan",
        "monitoring_pendidikan",
      ]),
      tipe: DataTypes.ENUM(["monitoring", "evaluasi"]),
      bagian: DataTypes.ENUM([
        "identitas_mustahik",
        "identitas_kelompok",
        "mustahik",
        "birokrasi_administrasi",
        "pemanfaatan_bantuan",
        "pendampingan",
        "identitas_orang_tua",
        "kondisi_ekonomi",
        "info_sekolah_dayah_kampus",
        "lembaga_mitra",
        "partisipasi_sekolah",
      ]),
      pertanyaan: DataTypes.TEXT,
      parent_id: DataTypes.INTEGER,
      bentuk_pertanyaan: DataTypes.ENUM(["text", "checkbox", "currency"]),
    },
    {
      sequelize,
      modelName: "Pertanyaan_monev",
    }
  );
  return Pertanyaan_monev;
};

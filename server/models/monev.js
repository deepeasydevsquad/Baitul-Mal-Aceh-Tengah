"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Monev extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Monev.belongsTo(models.Permohonan, {
        foreignKey: "permohonan_id",
      });
      Monev.hasMany(models.Jawaban_monev, {
        foreignKey: "monev_id",
      });
    }
  }
  Monev.init(
    {
      permohonan_id: DataTypes.INTEGER,
      jenis_monev: DataTypes.ENUM([
        "evaluasi_konsumtif",
        "monitoring_konsumtif",
        "evaluasi_pemberdayaan_ekonomi",
        "monitoring_pemberdayaan_ekonomi",
        "evaluasi_pendidikan",
        "monitoring_pendidikan",
      ]),
      tipe: DataTypes.ENUM(["monitoring", "evaluasi"]),
      nama_petugas_monev: DataTypes.STRING,
      tim_monev_1: DataTypes.STRING,
      tim_monev_2: DataTypes.STRING,
      tim_monev_3: DataTypes.STRING,
      rekomendasi_tim: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Monev",
    }
  );
  return Monev;
};

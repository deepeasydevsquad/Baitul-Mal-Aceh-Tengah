"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Program_donasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Program_donasi.hasMany(models.Riwayat_donasi, {
        foreignKey: "program_donasi_id",
      });
    }
  }
  Program_donasi.init(
    {
      name: DataTypes.TEXT,
      slug: DataTypes.TEXT,
      banner: DataTypes.STRING,
      tahun: DataTypes.INTEGER,
      deskripsi: DataTypes.TEXT,
      target_donasi_terkumpul: DataTypes.INTEGER,
      status: DataTypes.ENUM(["sedang_berlangsung", "ditutup"]),
      waktu_donasi: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Program_donasi",
    }
  );
  return Program_donasi;
};

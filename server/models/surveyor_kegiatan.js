"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Surveyor_kegiatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Surveyor_kegiatan.belongsTo(models.Kegiatan, {
        foreignKey: "kegiatan_id",
        onDelete: "CASCADE",
      });
      Surveyor_kegiatan.belongsTo(models.Surveyor, {
        foreignKey: "surveyor_id",
        onDelete: "CASCADE",
      });
      Surveyor_kegiatan.hasMany(models.Survey_permohonan, {
        foreignKey: "surveyor_kegiatan_id",
        onDelete: "CASCADE",
      });
    }
  }
  Surveyor_kegiatan.init(
    {
      kegiatan_id: DataTypes.INTEGER,
      sk: DataTypes.STRING,
      surveyor_id: DataTypes.INTEGER,
      access_code: DataTypes.TEXT,
      status: DataTypes.ENUM(["active", "non_active"]),
    },
    {
      sequelize,
      modelName: "Surveyor_kegiatan",
    }
  );
  return Surveyor_kegiatan;
};

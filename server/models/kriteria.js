"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kriteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kriteria.belongsTo(models.Kegiatan, {
        foreignKey: "kegiatan_id",
      });
    }
  }
  Kriteria.init(
    {
      kegiatan_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Kriteria",
    }
  );
  return Kriteria;
};

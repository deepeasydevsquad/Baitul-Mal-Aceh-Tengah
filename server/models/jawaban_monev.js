"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jawaban_monev extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Jawaban_monev.belongsTo(models.Monev, {
        foreignKey: "monev_id",
      });
      Jawaban_monev.belongsTo(models.Pertanyaan, {
        foreignKey: "pertanyaan_id",
      });
    }
  }
  Jawaban_monev.init(
    {
      monev_id: DataTypes.INTEGER,
      pertanyaan_id: DataTypes.INTEGER,
      jawaban: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Jawaban_monev",
    }
  );
  return Jawaban_monev;
};

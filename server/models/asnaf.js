"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Asnaf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Asnaf.hasMany(models.Kegiatan, {
        foreignKey: "asnaf_id",
        onDelete: "CASCADE",
      });
    }
  }
  Asnaf.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Asnaf",
    }
  );
  return Asnaf;
};

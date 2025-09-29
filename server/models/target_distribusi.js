"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Target_distribusi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Target_distribusi.belongsTo(models.Asnaf, {
        foreignKey: "asnaf_id",
      });
    }
  }
  Target_distribusi.init(
    {
      tahun: DataTypes.INTEGER,
      asnaf_id: DataTypes.INTEGER,
      target_orang: DataTypes.INTEGER,
      target_rupiah: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Target_distribusi",
    }
  );
  return Target_distribusi;
};

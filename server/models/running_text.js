"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Running_text extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Running_text.init(
    {
      content: DataTypes.TEXT,
      is_active: DataTypes.BOOLEAN,
      order: DataTypes.INTEGER,
      speed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 80,
        validate: {
          min: 20,
          max: 200,
        },
      },
    },
    {
      sequelize,
      modelName: "Running_text",
    }
  );
  return Running_text;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Grup.hasMany(models.User, {
        foreignKey: "grup_id",
        onDelete: 'CASCADE',
      });
    }
  }
  Grup.init({
    name: DataTypes.STRING,
    group_access: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Grup',
  });
  return Grup;
};
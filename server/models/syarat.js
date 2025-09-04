'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Syarat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Syarat.hasMany(models.Syarat_kegiatan, {
        foreignKey: "syarat_id",
        onDelete: "CASCADE",
      });
    }
  }
  Syarat.init({
    name: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Syarat',
  });
  return Syarat;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Whatsapp_template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Whatsapp_template.init({
    name: DataTypes.STRING,
    type: DataTypes.ENUM(['pesan_biasa', 'semua_member', 'semua_surveyor', 'semua_user']),
    message: DataTypes.TEXT,
    variable: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Whatsapp_template',
  });
  return Whatsapp_template;
};
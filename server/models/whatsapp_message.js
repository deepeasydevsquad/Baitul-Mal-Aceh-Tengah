'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Whatsapp_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Whatsapp_message.init({
    destination_number: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: DataTypes.ENUM(['process','success','failed']),
    type: DataTypes.ENUM(['surveyor','pemohon','otp','muzakki_munfiq'])
  }, {
    sequelize,
    modelName: 'Whatsapp_message',
  });
  return Whatsapp_message;
};
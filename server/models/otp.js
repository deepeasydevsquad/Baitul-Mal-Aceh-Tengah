'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Otp.init({
    whatsapp_number: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    otp_time: DataTypes.DATE,
    status: DataTypes.ENUM(['digunakan','belum_digunakan'])
  }, {
    sequelize,
    modelName: 'Otp',
  });
  return Otp;
};
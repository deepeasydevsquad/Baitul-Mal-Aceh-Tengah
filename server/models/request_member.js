'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request_member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Request_member.belongsTo(models.Desa, {
        foreignKey: "desa_id",
      });
    }
  }
  Request_member.init({
     kode: DataTypes.STRING,
    desa_id: DataTypes.INTEGER,
    tipe: DataTypes.ENUM(["perorangan", "instansi"]),
    status: DataTypes.ENUM(['process', 'verified', 'unverified']),
    fullname: DataTypes.STRING,
    nomor_ktp: DataTypes.STRING,
    nomor_kk: DataTypes.STRING,
    whatsapp_number: DataTypes.STRING,
    birth_date: DataTypes.DATEONLY,
    alamat: DataTypes.TEXT,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Request_member',
  });
  return Request_member;
};
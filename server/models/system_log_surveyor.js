'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class System_log_surveyor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      System_log_surveyor.belongsTo(models.Surveyor, {
        foreignKey: "surveyor_id",
      });
    }
  }
  System_log_surveyor.init({
    message: DataTypes.TEXT,
    surveyor_id: DataTypes.INTEGER,
    ip: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'System_log_surveyor',
  });
  return System_log_surveyor;
};
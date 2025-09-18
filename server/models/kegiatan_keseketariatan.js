'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kegiatan_keseketariatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kegiatan_keseketariatan.belongsTo(models.Desa, {
        foreignKey: "desa_id",
      });
    }
  }
  Kegiatan_keseketariatan.init({
    kode: DataTypes.STRING,
    nama_kegiatan: DataTypes.TEXT,
    sumber_dana: DataTypes.ENUM(['zakat', 'infaq','operasional_apbk']),
    penerima: DataTypes.STRING,
    jenis_penerima: DataTypes.ENUM(['perorangan','instansi']),
    nominal_kegiatan: DataTypes.INTEGER,
    area_penyaluran: DataTypes.ENUM(['kabupaten','kecamatan']),
    desa_id: DataTypes.INTEGER,
    alamat: DataTypes.TEXT,
    tanggal_penyaluran: DataTypes.DATEONLY,
    upload_bukti: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kegiatan_keseketariatan',
  });
  return Kegiatan_keseketariatan;
};

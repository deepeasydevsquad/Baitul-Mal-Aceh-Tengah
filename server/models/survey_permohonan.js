'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Survey_permohonan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Survey_permohonan.belongsTo(models.Surveyor_kegiatan, {
        foreignKey: "surveyor_kegiatan_id",
      });
      Survey_permohonan.belongsTo(models.Permohonan, {
        foreignKey: "permohonan_id",
      });
    }
  }
  Survey_permohonan.init({
    surveyor_kegiatan_id: DataTypes.INTEGER,
    permohonan_id: DataTypes.INTEGER,
    status: DataTypes.ENUM(["process", "approve", "reject"]),
    kesimpulan: DataTypes.TEXT,
    form_survey: DataTypes.STRING,
    berita_acara: DataTypes.STRING,
    tanggal_penilaian: DataTypes.DATEONLY,
    nomor_ktp: DataTypes.STRING,
    tempat_lahir: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATEONLY,
    nama_suami_istri: DataTypes.STRING,
    pekerjaan_suami_istri: DataTypes.STRING,
    jumlah_tanggungan_suami_istri: DataTypes.INTEGER,
    alamat: DataTypes.TEXT,
    jenis_kelamin: DataTypes.ENUM(["laki_laki", "perempuan"]),
    status_pernikahan: DataTypes.ENUM(["belum_nikah", "menikah","cerai_mati", "cerai_hidup"]),
    usia_25_60: DataTypes.ENUM(["iya", "tidak"]),
    penduduk_tetap: DataTypes.ENUM(["iya", "tidak"]),
    penghasilan_2jt: DataTypes.ENUM(["iya", "tidak"]),
    kondisi_fisik: DataTypes.ENUM(["disabilitas", "non_disabilitas", "pasca_odgj"]),
    atap: DataTypes.ENUM(["genteng_seng", "genteng_beton"]),
    rangka_rumah: DataTypes.ENUM(["kayu", "beton"]),
    dinding_rumah: DataTypes.ENUM(["tembok_semen", "papan", "triplek"]),
    lantai: DataTypes.ENUM(["tanah", "keramik", "ubin_semen"]),
    mck: DataTypes.ENUM(["sungai_jamban", "mck_umum", "k_mandi_pribadi"]),
    luas_rumah: DataTypes.ENUM(["kecil", "sedang", "luas"]),
    aset: DataTypes.ENUM(["kebun", "emas", "sawah", "tanah"]),
    kendaraan: DataTypes.ENUM(["sepeda", "sepeda_motor", "mobil"]),
    keterangan_kondisi_calon: DataTypes.TEXT,
    keterangan_pilih_mustahik: DataTypes.ENUM(["miskin", "sederhana", "kaya"]),
  }, {
    sequelize,
    modelName: 'Survey_permohonan',
  });
  return Survey_permohonan;
};
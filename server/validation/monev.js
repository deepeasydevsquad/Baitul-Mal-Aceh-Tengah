const { Op, Realisasi_permohonan } = require("../models");

const validation = {};

// Validasi id keanggotaan apakah sudah ada di database
validation.check_id_permohonan = async (value) => {
  const check = await Realisasi_permohonan.findByPk(value);
  if (!check) {
    throw new Error("Realisasi permohonan tidak terdaftar di pangkalan data");
  }
  return true;
};

module.exports = validation;

const { Kecamatan } = require("../models");

const validation = {};

validation.check_id_kecamatan = async (value) => {
  const check = await Kecamatan.findByPk(value);
  if (!check) {
    throw new Error("Kecamatan tidak terdaftar di pangkalan data");
  }
  return true;
};

module.exports = validation;

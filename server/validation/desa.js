const { desa } = require("../models");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const validation = {};

// Validasi id desa apakah sudah ada di database
validation.check_id_desa = async (value) => {  
  const check = await desa.findByPk(value);
  if (!check) {
    throw new Error("desa tidak terdaftar di pangkalan data");
  }
  return true;
};

validation.check_kode_desa = async (value, { req }) => {
  const id = req.body.id;

  if (id) {
    const current = await desa.findByPk(id);
    if (!current) {
      throw new Error("desa tidak ditemukan");
    }

    if (current.kode === value) {
      return true;
    }

    const check = await desa.findOne({
      where: { id: { [Op.ne]: id }, kecamatan: value },
    });
    if (check) {
      throw new Error(
        "desa dengan kode yang sama sudah terdaftar di pangkalan data"
      );
    }
  } else {
    const check = await desa.findOne({
      where: { kecamatan_id: value },
    });
    if (check) {
      throw new Error(
        "desa dengan kode yang sama sudah terdaftar di pangkalan data"
      );
    }
  }

  return true;
};

module.exports = validation;

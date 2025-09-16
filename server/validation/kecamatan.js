const { kecamatan } = require("../models");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const validation = {};

// Validasi id kecamatan apakah sudah ada di database
validation.check_id_kecamatan = async (value) => {  
  const check = await kecamatan.findByPk(value);
  if (!check) {
    throw new Error("kecamatan tidak terdaftar di pangkalan data");
  }
  return true;
};

validation.check_kode_kecamatan = async (value, { req }) => {
  const id = req.body.id;

  if (id) {
    const current = await kecamatan.findByPk(id);
    if (!current) {
      throw new Error("kecamatan tidak ditemukan");
    }

    if (current.kode === value) {
      return true;
    }

    const check = await kecamatan.findOne({
      where: { id: { [Op.ne]: id }, kode: value },
    });
    if (check) {
      throw new Error(
        "kecamatan dengan kode yang sama sudah terdaftar di pangkalan data"
      );
    }
  } else {
    const check = await kecamatan.findOne({
      where: { kode: value },
    });
    if (check) {
      throw new Error(
        "kecamatan dengan kode yang sama sudah terdaftar di pangkalan data"
      );
    }
  }

  return true;
};

// Validasi nama kecamatan apakah sudah ada di database
validation.check_nama_kecamatan = async (value, { req }) => {
  const id = req.body.id;

  if (id) {
    const current = await kecamatan.findByPk(id);
    if (!current) {
      throw new Error("kecamatan tidak ditemukan");
    }

    if (current.name === value) {
      return true;
    }

    const check = await kecamatan.findOne({
      where: { id: { [Op.ne]: id }, name: value },
    });
    if (check) {
      throw new Error(
        "kecamatan dengan nama yang sama sudah terdaftar di pangkalan data"
      );
    }
  } else {
    const check = await kecamatan.findOne({
      where: { name: value },
    });
    if (check) {
      throw new Error(
        "kecamatan dengan nama yang sama sudah terdaftar di pangkalan data"
      );
    }
  }

  return true;
};

module.exports = validation;

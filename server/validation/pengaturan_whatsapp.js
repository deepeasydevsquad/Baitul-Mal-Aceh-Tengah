const { pengaturan_whatsapp } = require("../models");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const validation = {};

// Validasi id pengaturan_whatsapp apakah sudah ada di database
validation.check_id_pengaturan_whatsapp = async (value) => {
  const check = await pengaturan_whatsapp.findByPk(value);
  if (!check) {
    throw new Error("pengaturan_whatsapp tidak terdaftar di pangkalan data");
  }
  return true;
};

validation.check_kode_pengaturan_whatsapp = async (value, { req }) => {
  const id = req.body.id;

  if (id) {
    const current = await pengaturan_whatsapp.findByPk(id);
    if (!current) {
      throw new Error("pengaturan whatsapp tidak ditemukan");
    }

    if (current.kode === value) {
      return true;
    }

    const check = await pengaturan_whatsapp.findOne({
      where: { id: { [Op.ne]: id }, kode: value },
    });
    if (check) {
      throw new Error(
        "pengaturan_whatsapp dengan kode yang sama sudah terdaftar di pangkalan data"
      );
    }
  } else {
    const check = await pengaturan_whatsapp.findOne({
      where: { kode: value },
    });
    if (check) {
      throw new Error(
        "pengaturan_whatsapp dengan kode yang sama sudah terdaftar di pangkalan data"
      );
    }
  }

  return true;
};

// Validasi nama pengaturan_whatsapp apakah sudah ada di database
validation.check_nama_pengaturan_whatsapp = async (value, { req }) => {
  const id = req.body.id;

  if (id) {
    const current = await pengaturan_whatsapp.findByPk(id);
    if (!current) {
      throw new Error("pengaturan_whatsapp tidak ditemukan");
    }

    if (current.name === value) {
      return true;
    }

    const check = await pengaturan_whatsapp.findOne({
      where: { id: { [Op.ne]: id }, name: value },
    });
    if (check) {
      throw new Error(
        "pengaturan_whatsapp dengan nama yang sama sudah terdaftar di pangkalan data"
      );
    }
  } else {
    const check = await pengaturan_whatsapp.findOne({
      where: { name: value },
    });
    if (check) {
      throw new Error(
        "pengaturan whatsapp dengan nama yang sama sudah terdaftar di pangkalan data"
      );
    }
  }

  return true;
};

module.exports = validation;

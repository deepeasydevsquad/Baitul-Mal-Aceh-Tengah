const { Kriteria } = require("../models");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const validation = {};

// Validasi id kriteria apakah sudah ada di database
validation.check_id = async (value) => {
  const check = await Kriteria.findByPk(value);
  if (!check) {
    throw new Error("Kriteria tidak terdaftar di pangkalan data");
  }
  return true;
};

module.exports = validation;

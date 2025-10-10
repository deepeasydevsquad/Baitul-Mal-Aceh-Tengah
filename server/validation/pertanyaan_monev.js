const { body, param } = require("express-validator");
const { Pertanyaan_monev } = require("../models");

const validation = {};

validation.add = [
  body("pertanyaan")
    .notEmpty()
    .withMessage("Pertanyaan tidak boleh kosong.")
    .trim(),
  body("jenis_monev")
    .notEmpty()
    .withMessage("Jenis Monev harus dipilih.")
    .custom((value) => {
      const validValues = Pertanyaan_monev.getAttributes().jenis_monev.values;
      if (!validValues.includes(value))
        throw new Error("Jenis Monev tidak valid.");
      return true;
    }),
  body("bagian")
    .notEmpty()
    .withMessage("Bagian harus dipilih.")
    .custom((value) => {
      const validValues = Pertanyaan_monev.getAttributes().bagian.values;
      if (!validValues.includes(value)) throw new Error("Bagian tidak valid.");
      return true;
    }),
  body("bentuk_pertanyaan")
    .notEmpty()
    .withMessage("Bentuk Jawaban harus dipilih.")
    .custom((value) => {
      const validValues =
        Pertanyaan_monev.getAttributes().bentuk_pertanyaan.values;
      if (!validValues.includes(value))
        throw new Error("Bentuk Jawaban tidak valid.");
      return true;
    }),
  body("parent_id")
    .optional({ nullable: true })
    .isInt()
    .withMessage("ID Induk harus berupa angka.")
    .custom(async (value) => {
      if (value) {
        const parent = await Pertanyaan_monev.findByPk(value);
        if (!parent) throw new Error("Pertanyaan induk tidak ditemukan.");
      }
      return true;
    }),
];

validation.edit = [
  body("id")
    .isInt()
    .withMessage("ID tidak valid.")
    .custom(async (value) => {
      const pertanyaan = await Pertanyaan_monev.findByPk(value);
      if (!pertanyaan)
        throw new Error("Pertanyaan dengan ID ini tidak ditemukan.");
      return true;
    }),
  body("pertanyaan")
    .notEmpty()
    .withMessage("Pertanyaan tidak boleh kosong.")
    .trim(),
  body("jenis_monev")
    .notEmpty()
    .withMessage("Jenis Monev harus dipilih.")
    .custom((value) => {
      const validValues = Pertanyaan_monev.getAttributes().jenis_monev.values;
      if (!validValues.includes(value))
        throw new Error("Jenis Monev tidak valid.");
      return true;
    }),
  body("bagian")
    .notEmpty()
    .withMessage("Bagian harus dipilih.")
    .custom((value) => {
      const validValues = Pertanyaan_monev.getAttributes().bagian.values;
      if (!validValues.includes(value)) throw new Error("Bagian tidak valid.");
      return true;
    }),
  body("bentuk_pertanyaan")
    .notEmpty()
    .withMessage("Bentuk Jawaban harus dipilih.")
    .custom((value) => {
      const validValues =
        Pertanyaan_monev.getAttributes().bentuk_pertanyaan.values;
      if (!validValues.includes(value))
        throw new Error("Bentuk Jawaban tidak valid.");
      return true;
    }),
];

validation.delete = [
  body("id")
    .isInt()
    .withMessage("ID tidak valid.")
    .custom(async (value) => {
      const pertanyaan = await Pertanyaan_monev.findByPk(value);
      if (!pertanyaan)
        throw new Error("Pertanyaan dengan ID ini tidak ditemukan.");
      return true;
    }),
];

validation.getInfoEdit = [
  body("id")
    .notEmpty()
    .withMessage("ID tidak boleh kosong.")
    .isInt()
    .withMessage("ID tidak valid.")
    .custom(async (value) => {
      const pertanyaan = await Pertanyaan_monev.findByPk(value);
      if (!pertanyaan)
        throw new Error("Pertanyaan dengan ID ini tidak ditemukan.");
      return true;
    }),
];

module.exports = validation;

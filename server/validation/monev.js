const { body, param } = require("express-validator");

const validation = {};

//  ======================
//  VALIDATION UNTUK READ
//  ======================

// List Monev
validation.list = [
  body("perpage")
    .notEmpty()
    .withMessage("Perpage Tidak Boleh Kosong")
    .isInt()
    .withMessage("Perpage Harus Angka"),
  body("pageNumber")
    .notEmpty()
    .withMessage("Page Number Tidak Boleh Kosong")
    .isInt()
    .withMessage("Page Number Harus Angka"),
  body("search").optional().isString().withMessage("Search Harus String"),
];

// Detail Monev
validation.detail = [param("id").isInt().withMessage("ID harus angka")];

// Info Edit
validation.getInfoEdit = [param("id").isInt().withMessage("ID harus angka")];

// Pertanyaan Monev (berdasarkan jenis)
validation.getPertanyaan = [
  param("jenis").isString().withMessage("Jenis Monev harus string"),
];

//  ======================
//  VALIDATION UNTUK CUD
//  ======================

// Create Monev
validation.add = [
  body("nama_pemohon")
    .notEmpty()
    .withMessage("Nama Pemohon Tidak Boleh Kosong"),
  body("no_ktp").notEmpty().withMessage("No KTP Tidak Boleh Kosong"),
  body("nomor_rekening")
    .notEmpty()
    .withMessage("Nomor Rekening Tidak Boleh Kosong"),
  body("nama_kegiatan")
    .notEmpty()
    .withMessage("Nama Kegiatan Tidak Boleh Kosong"),
];

// Update Monev
validation.edit = [param("id").isInt().withMessage("ID harus angka")];

// Kirim Jawaban Evaluasi
validation.kirim_jawaban_evaluasi = [
  body("monev_id")
    .notEmpty()
    .withMessage("monev_id tidak boleh kosong")
    .isInt()
    .withMessage("monev_id harus berupa angka"),
  body("jawaban")
    .isObject()
    .withMessage("jawaban harus berupa object"),
  body("jawaban.*.pertanyaan_id")
    .isInt()
    .withMessage("pertanyaan_id harus berupa angka"),
  body("jawaban.*.jawaban")
    .isString()
    .withMessage("jawaban harus berupa teks"),
];

// Kirim Jawaban Monitoring
validation.kirim_jawaban_monitoring = [
  body("monev_id")
    .notEmpty()
    .withMessage("monev_id tidak boleh kosong")
    .isInt()
    .withMessage("monev_id harus berupa angka"),
  body("jawaban")
    .isObject()
    .withMessage("jawaban harus berupa object"),
  body("jawaban.*.pertanyaan_id")
    .isInt()
    .withMessage("pertanyaan_id harus berupa angka"),
  body("jawaban.*.jawaban")
    .isString()
    .withMessage("jawaban harus berupa teks"),
];


module.exports = validation;

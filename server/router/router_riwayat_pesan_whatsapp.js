const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/riwayat_pesan_whatsapp/controllers/index");
const validation = require("../validation/riwayat_pesan_whatsapp");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/riwayat_pesan_whatsapp/list",
  authenticateTokenAdministrator,
  [
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
  ],
  controllers.list
);

router.post(
  "/riwayat_pesan_whatsapp/get_template_pesan_whatsapp",
  authenticateTokenAdministrator,
  [
    body("type")
      .notEmpty()
      .withMessage("Jenis Pesan Tidak Boleh Kosong")
      .isIn(["surveyor", "pemohon", "otp", "munfiq", "muzakki", "pesan_biasa"])
      .withMessage("Jenis Pesan Tidak Ditemukan."),
  ],
  controllers.get_template_pesan_whatsapp
);

router.post(
  "/riwayat_pesan_whatsapp/get_pesan_template_pesan_whatsapp",
  authenticateTokenAdministrator,
  [
    body("template_id")
      .notEmpty()
      .withMessage("ID Template Pesan Tidak Boleh Kosong")
      .custom(validation.check_template_id),
  ],
  controllers.get_pesan_template_pesan_whatsapp
);

router.post(
  "/riwayat_pesan_whatsapp/kirim_pesan",
  authenticateTokenAdministrator,
  [
    body("type")
      .notEmpty()
      .withMessage("Jenis Pesan Tidak Boleh Kosong")
      .isIn(["surveyor", "munfiq", "muzakki", "pesan_biasa"])
      .withMessage("Jenis Pesan Tidak Ditemukan."),
    body("nomor_tujuan").custom((value, { req }) => {
      if (req.body.type == "pesan_biasa" && value == "") {
        throw new Error(
          "Untuk pesan dengan jenis pesan 'Pesan Biasa' nomor tujuan wajib diisi."
        );
      }
      return true;
    }),
    body("template_id")
      .notEmpty()
      .withMessage("ID Template Pesan Tidak Boleh Kosong")
      .custom(validation.check_template_id),
    body("isi_pesan").notEmpty().withMessage("Isi Pesan Tidak Boleh Kosong"),
  ],
  controllers.kirim_pesan
);

module.exports = router;

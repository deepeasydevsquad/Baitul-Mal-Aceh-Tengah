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

// 'surveyor','pemohon','otp','munfiq','muzakki','pesan_biasa'
// router.get(
//   "/riwayat_pesan_whatsapp/get_jenis_pesan",
//   authenticateTokenAdministrator,
//   controllers.get_jenis_pesan
// );

// riwayat_pesan_whatsapp/get_template_pesan_whatsapp

// router.post(
//   "/riwayat_infaq/add",
//   authenticateTokenAdministrator,
//   [
//     body("member_id")
//       .notEmpty()
//       .withMessage("Member ID Tidak Boleh Kosong")
//       .isInt()
//       .withMessage("Member ID Harus Angka")
//       .custom(validation.check_id_member),
//     body("nominal")
//       .notEmpty()
//       .withMessage("Nominal Tidak Boleh Kosong")
//       .isInt()
//       .withMessage("Nominal Harus Angka"),
//     body("status_pemasukan")
//       .notEmpty()
//       .withMessage("Status Pemasukan Tidak Boleh Kosong")
//       .isIn(["belum_dikirim", "sudah_dikirim"])
//       .withMessage("Status Pemasukan Harus String"),
//   ],
//   controllers.add
// );

// router.post(
//   "/riwayat_infaq/delete",
//   authenticateTokenAdministrator,
//   [
//     body("id")
//       .notEmpty()
//       .withMessage("ID Tidak Boleh Kosong")
//       .isInt()
//       .withMessage("ID Harus Angka")
//       .custom(validation.check_id_riwayat_infaq),
//   ],
//   controllers.delete
// );

module.exports = router;

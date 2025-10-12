const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/riwayat_pesan_whatsapp/controllers/index");
const validation = require("../validation/riwayat_pesan_whatsapp");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

// router.get(
//   "/riwayat_infaq/list_member",
//   authenticateTokenAdministrator,
//   controllers.list_member
// );

// router.post(
//   "/riwayat_pengaturan_whatsapp/get",
//   authenticateTokenAdministrator,
//   [
//     body("perpage") // <-- Validasi ini
//       .notEmpty()
//       .withMessage("Perpage Tidak Boleh Kosong")
//       .isInt()
//       .withMessage("Perpage Harus Angka"),
//     body("pageNumber") // <-- Dan validasi ini
//       .notEmpty()
//       .withMessage("Page Number Tidak Boleh Kosong")
//       .isInt()
//       .withMessage("Page Number Harus Angka"),
//     body("search").optional().isString().withMessage("Search Harus String"),
//   ],
//   controllers.get_info_pengaturan_whatsapp
// );

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

router.get(
  "/riwayat_pesan_whatsapp/get_jenis_pesan",
  authenticateTokenAdministrator,
  controllers.get_jenis_pesan
);

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

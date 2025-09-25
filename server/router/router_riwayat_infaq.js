const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/riwayat_infaq/controllers/index");
const validation = require("../validation/riwayat_infaq");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
  "/riwayat_infaq/list_member",
  authenticateTokenAdministrator,
  controllers.list_member
);

router.post(
  "/riwayat_infaq/list",
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
    body("search").optional().isString().withMessage("Search Harus String"),
    body("status").optional(),
    body("konfirmasi_pembayaran").optional(),
  ],
  controllers.list
);

router.post(
  "/riwayat_infaq/add",
  authenticateTokenAdministrator,
  [
    body("member_id")
      .notEmpty()
      .withMessage("Member ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("Member ID Harus Angka")
      .custom(validation.check_id_member),
    body("nominal")
      .notEmpty()
      .withMessage("Nominal Tidak Boleh Kosong")
      .isInt()
      .withMessage("Nominal Harus Angka"),
    body("status_pemasukan")
      .notEmpty()
      .withMessage("Status Pemasukan Tidak Boleh Kosong")
      .isIn(["belum_dikirim", "sudah_dikirim"])
      .withMessage("Status Pemasukan Harus String"),
  ],
  controllers.add
);

router.post(
  "/riwayat_infaq/delete",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_riwayat_infaq),
  ],
  controllers.delete
);

module.exports = router;

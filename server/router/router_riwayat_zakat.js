const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/riwayat_zakat/controllers/index");
const validation = require("../validation/riwayat_zakat");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/riwayat_zakat/list",
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
    body("search")
      .optional()
      .isString()
      .withMessage("Search Harus String"),
  ],
  controllers.list
);

router.post(
  "/riwayat_zakat/add",
  authenticateTokenAdministrator,
  validation.upload.single("banner"),
  [
    body("member_id")
      .notEmpty()
      .withMessage("Member_id Tidak Boleh Kosong")
      .isString()
      .withMessage("Member_id Harus String"),
    body("tahun")
      .notEmpty()
      .withMessage("Tahun Tidak Boleh Kosong")
      .isInt()
      .withMessage("Tahun Harus Angka"),
    body("deskripsi")
      .notEmpty()
      .withMessage("Deskripsi Tidak Boleh Kosong")
      .isString()
      .withMessage("Deskripsi Harus String"),
    body("target_donasi_terkumpul")
      .notEmpty()
      .withMessage("Target Donasi Terkumpul Tidak Boleh Kosong"),
    body("waktu_donasi")
      .notEmpty()
      .withMessage("Waktu Donasi Tidak Boleh Kosong"),
  ],
  controllers.add
);

router.post(
  "/riwayat_zakat/delete",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty().withMessage("ID Tidak Boleh Kosong")
      .isInt().withMessage("ID Harus Angka")
      .custom(validation.check_id_riwayat_zakat),
  ],
  controllers.delete
);

module.exports = router;

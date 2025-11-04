const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/riwayat_donasi/controllers/index");
const validation = require("../validation/riwayat_donasi");
const validationHelper = require("../helper/handleErrorFile");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/riwayat_donasi/list",
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
  ],
  controllers.list_riwayat_donasi
);

router.post(
  "/riwayat_donasi/delete",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID harus angka")
      .custom(validation.check_id_riwayat_donasi),
  ],
  controllers.delete
);

router.post(
  "/riwayat_donasi/riwayat_donasi_by_id",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID harus angka")
      .custom(validation.check_id_riwayat_donasi),
  ],
  controllers.detail
);

router.post(
  "/riwayat_donasi/approve_online",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_riwayat_donasi),
  ],
  controllers.approve_online
);

router.post(
  "/riwayat_donasi/reject_online",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_riwayat_donasi),
    body("alasan").notEmpty().withMessage("Alasan Tidak Boleh Kosong"),
  ],
  controllers.reject_online
);

router.post(
  "/riwayat_donasi/upload_bukti_transfer",
  authenticateTokenAdministrator,
  validation.upload("transfer").single("bukti"),
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_riwayat_donasi),
    body("nominal_transfer")
      .notEmpty()
      .withMessage("Jumlah Nominal Transfer Tidak Boleh Kosong")
      .isInt()
      .withMessage("Jumlah Nominal Transfer Harus Angka"),
  ],
  validationHelper.handleFileErrors,
  controllers.upload_bukti_transfer
);

router.post(
  "/riwayat_donasi/upload_bukti_setoran",
  authenticateTokenAdministrator,
  validation.upload("cash").single("bukti"),
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_riwayat_donasi),
    body("nominal_setoran")
      .notEmpty()
      .withMessage("Jumlah Nominal Setoran Tidak Boleh Kosong")
      .isInt()
      .withMessage("Jumlah Nominal Setoran Harus Angka"),
  ],
  validationHelper.handleFileErrors,
  controllers.upload_bukti_setoran
);

module.exports = router;

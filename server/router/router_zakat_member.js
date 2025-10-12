const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/zakat_member/controllers/index");
const validation = require("../validation/zakat_member");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/zakat_member/list",
  authenticateTokenAdministrator,
  controllers.getZakatList
);

router.get(
  "/zakat_member/profile",
  authenticateTokenAdministrator,
  controllers.getMemberProfile
);

router.get(
  "/zakat_member/banks",
  authenticateTokenAdministrator,
  controllers.getBankList
);

router.get(
  "/zakat_member/tipe",
  authenticateTokenAdministrator,
  controllers.getTipeZakat
);

router.post(
  "/zakat_member/add",
  authenticateTokenAdministrator,
  [
    // Validasi Tipe Zakat
    body("tipe")
      .notEmpty()
      .withMessage("Tipe zakat harus dipilih")
      .custom(validation.check_tipe_zakat),

    // Validasi Nominal
    body("nominal")
      .notEmpty()
      .withMessage("Jumlah zakat harus diisi")
      .isInt({ min: 1 })
      .withMessage("Jumlah zakat harus berupa angka positif dan lebih dari 0")
      .toInt(),

    // Validasi Invoice
    body("invoice")
      .notEmpty()
      .withMessage("Invoice harus diisi")
      .isString()
      .withMessage("Invoice harus berupa teks")
      .custom(validation.check_invoice_exists),
  ],
  controllers.addZakat
);

router.post(
  "/zakat_member/confirm",
  authenticateTokenAdministrator,
  [
    body("invoice")
      .notEmpty()
      .withMessage("Invoice harus diisi")
      .isString()
      .withMessage("Invoice harus berupa teks")
      .custom(validation.check_invoice_for_confirm),
  ],
  controllers.confirmZakatPayment
);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/laporan_umum/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/laporan_umum/list",
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
  controllers.laporan_umum
);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/laporan_perencanaan/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/laporan_perencanaan/list",
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
    body("tahun").optional().isInt().withMessage("Tahun harus angka"),
    body("program").optional().isString().withMessage("Program harus string"),
  ],
  controllers.list_laporan_perencanaan
);

module.exports = router;

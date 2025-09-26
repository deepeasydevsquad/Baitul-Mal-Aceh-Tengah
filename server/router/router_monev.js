const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const controller = require("../modules/monev/controllers/index"); // Pastikan ini benar
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

router.post(
  "/monev/list",
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
  controller.list_monev
);

module.exports = router;

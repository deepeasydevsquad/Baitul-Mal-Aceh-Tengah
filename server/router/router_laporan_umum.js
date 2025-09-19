const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/bank/controllers/index");

const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/bank/list",
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
      .isString().withMessage("Search Harus String"),
  ],
  controllers.daftar_bank
);
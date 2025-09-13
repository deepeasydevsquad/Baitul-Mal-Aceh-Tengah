const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/syarat/controllers/index");
const { authenticateTokenAdministrator } = require("../middleware/authenticateToken");

const router = express.Router();

// custom validator
const check_nama_syarat = async (value) => {
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    throw new Error("Nama syarat hanya boleh huruf, angka, dan underscore");
  }
  return true;
};

router.post(
  "/syarat/list",
  authenticateTokenAdministrator,
  [
    body("perpage")
      .notEmpty().withMessage("Perpage Tidak Boleh Kosong")
      .isInt().withMessage("Perpage Harus Angka"),
    body("pageNumber")
      .notEmpty().withMessage("Page Number Tidak Boleh Kosong")
      .isInt().withMessage("Page Number Harus Angka"),
    body("search")
      .optional()
      .isString().withMessage("Search Harus String"),
  ],
  controllers.list_syarat
);

router.post(
  "/syarat/add",
  authenticateTokenAdministrator,
  [
    body("name")
      .notEmpty().withMessage("Nama Syarat Tidak Boleh Kosong")
      .isString().withMessage("Nama Syarat Harus String"),
        body("path")
      .notEmpty().withMessage("Path Syarat Tidak Boleh Kosong")
  ],
  controllers.add
);

router.post(
  "/syarat/update",
  authenticateTokenAdministrator,
  [
    body("name")
      .notEmpty().withMessage("Name Tidak Boleh Kosong")
      .isString().withMessage("Name Harus String"),
    body("path")
      .notEmpty().withMessage("Path Tidak Boleh Kosong")
  ],
  controllers.update
);

router.post(
  "/syarat/delete",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty().withMessage("ID Tidak Boleh Kosong")
  ],
  controllers.delete
);

module.exports = router;

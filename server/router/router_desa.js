const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/desa/controllers/index");
const validation = require("../validation/desa");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
  "/desa/kecamatan_list",
  authenticateTokenAdministrator,
  controllers.kecamatan_list
);

router.post(
  "/desa/list",
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
  controllers.daftar_desa
);

router.post(
  "/desa/add",
  authenticateTokenAdministrator,
  [
    body("name")
      .notEmpty()
      .withMessage("Nama desa Tidak Boleh Kosong")
      .isString()
      .withMessage("Nama desa Harus String"),
    body("kecamatan_id")
      .notEmpty()
      .withMessage("Kecamatan Tidak Boleh Kosong")
      .isInt()
      .withMessage("Kecamatan Harus String"),
  ],
  controllers.add
);

router.post(
  "/desa/edit",
  authenticateTokenAdministrator,
  [
    body("name")
      .notEmpty()
      .withMessage("Nama Tidak Boleh Kosong")
      .isString()
      .withMessage("Nama Harus String"),
    body("kecamatan_id")
      .notEmpty()
      .withMessage("Kecamatan Tidak Boleh Kosong")
      .isString()
      .withMessage("Kecamatan Harus String"),
  ],
  controllers.edit
);

router.post(
  "/desa/delete",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka"),
  ],
  controllers.delete
);

router.post(
  "/desa/get_info_edit_desa",

  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka"),
  ],
  controllers.get_info_edit_desa
);

module.exports = router;

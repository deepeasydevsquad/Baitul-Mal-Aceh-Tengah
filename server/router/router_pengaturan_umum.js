const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/pengaturan_umum/controllers/index");
const validation = require("../validation/pengaturan_umum");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
  "/pengaturan_umum/get_info_pengaturan_umum",
  authenticateTokenAdministrator,
  controllers.get_info_pengaturan_umum
);

router.post(
  "/pengaturan_umum/edit",
  authenticateTokenAdministrator,
  validation.upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "hero_logo", maxCount: 1 },
  ]),
  validation.check_dimensions(false),
  [
    body("nama_kabupaten_kota")
      .notEmpty()
      .withMessage("Nama kabupaten/kota tidak boleh kosong")
      .isString()
      .withMessage("Nama kabupaten/kota harus string"),
    body("alamat")
      .notEmpty()
      .withMessage("Alamat tidak boleh kosong")
      .isString()
      .withMessage("Alamat harus string"),
    body("quote")
      .notEmpty()
      .withMessage("Quote tidak boleh kosong")
      .isString()
      .withMessage("Quote harus string"),
    body("nama_jabatan_1")
      .notEmpty()
      .withMessage("Nama jabatan 1 tidak boleh kosong")
      .isString()
      .withMessage("Nama jabatan 1 harus string"),
    body("nama_pejabat_1")
      .notEmpty()
      .withMessage("Nama pejabat 1 tidak boleh kosong")
      .isString()
      .withMessage("Nama pejabat 1 harus string"),
    body("nama_jabatan_2")
      .notEmpty()
      .withMessage("Nama jabatan 2 tidak boleh kosong")
      .isString()
      .withMessage("Nama jabatan 2 harus string"),
    body("nama_pejabat_2")
      .notEmpty()
      .withMessage("Nama pejabat 2 tidak boleh kosong")
      .isString()
      .withMessage("Nama pejabat 2 harus string"),
    body("nama_jabatan_3")
      .notEmpty()
      .withMessage("Nama jabatan 3 tidak boleh kosong")
      .isString()
      .withMessage("Nama jabatan 3 harus string"),
    body("nama_pejabat_3")
      .notEmpty()
      .withMessage("Nama pejabat 3 tidak boleh kosong")
      .isString()
      .withMessage("Nama pejabat 3 harus string"),
  ],
  controllers.edit
);

module.exports = router;

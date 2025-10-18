const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/target_pengumpulan/controllers/index");
const validation = require("../validation/target_pengumpulan");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/target_pengumpulan/list",
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
    body("tahun")
      .optional({ checkFalsy: true })
      .isInt()
      .withMessage("Tahun harus angka"),
    body("bulan")
      .optional({ checkFalsy: true })
      .isInt()
      .withMessage("Bulan harus angka"),
  ],
  controllers.list
);

router.post(
  "/target_pengumpulan/add",
  authenticateTokenAdministrator,
  [
    body("tahun")
      .notEmpty()
      .withMessage("Tahun tidak boleh kosong")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Tahun harus berupa angka antara 1900-2100"),
    body("bulan")
      .notEmpty()
      .withMessage("Bulan tidak boleh kosong")
      .isInt({ min: 1, max: 12 })
      .withMessage("Bulan harus berupa angka antara 1-12")
      .bail()
      .custom(validation.cek_tahun_bulan_add),
    body("infaq")
      .notEmpty()
      .withMessage("Target Infaq tidak boleh kosong")
      .isInt({ min: 0 })
      .withMessage("Target Infaq harus berupa angka positif"),
    body("zakat")
      .notEmpty()
      .withMessage("Target Zakat tidak boleh kosong")
      .isInt({ min: 0 })
      .withMessage("Target Zakat harus berupa angka positif"),
    body("donasi")
      .notEmpty()
      .withMessage("Target Donasi tidak boleh kosong")
      .isInt({ min: 0 })
      .withMessage("Target Donasi harus berupa angka positif"),
  ],
  controllers.add
);

router.post(
  "/target_pengumpulan/edit",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID tidak boleh kosong")
      .isInt()
      .withMessage("ID harus berupa angka"),
    body("tahun")
      .notEmpty()
      .withMessage("Tahun tidak boleh kosong")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Tahun harus berupa angka antara 1900-2100"),
    body("bulan")
      .notEmpty()
      .withMessage("Bulan tidak boleh kosong")
      .isInt({ min: 1, max: 12 })
      .withMessage("Bulan harus berupa angka antara 1-12")
      .bail()
      .custom(validation.cek_tahun_bulan_edit),
    body("infaq")
      .notEmpty()
      .withMessage("Target Infaq tidak boleh kosong")
      .isInt({ min: 0 })
      .withMessage("Target Infaq harus berupa angka positif"),
    body("zakat")
      .notEmpty()
      .withMessage("Target Zakat tidak boleh kosong")
      .isInt({ min: 0 })
      .withMessage("Target Zakat harus berupa angka positif"),
    body("donasi")
      .notEmpty()
      .withMessage("Target Donasi tidak boleh kosong")
      .isInt({ min: 0 })
      .withMessage("Target Donasi harus berupa angka positif"),
  ],
  controllers.edit
);

router.post(
  "/target_pengumpulan/detail",
  authenticateTokenAdministrator,
  [
    body("tahun").notEmpty().withMessage("Tahun tidak boleh kosong"),
    body("bulan").notEmpty().withMessage("Bulan tidak boleh kosong"),
  ],
  controllers.detail
);

router.post(
  "/target_pengumpulan/delete",
  authenticateTokenAdministrator,
  [
    body("tahun").notEmpty().withMessage("Tahun tidak boleh kosong"),
    body("bulan").notEmpty().withMessage("Bulan tidak boleh kosong"),
  ],
  controllers.delete
);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/penetapan/controllers/index");
const validation = require("../validation/penetapan");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/penetapan/list",
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
    body("type_status_kegiatan").optional(),
    body("type_asnaf_id").optional(),
    body("type_program_id").optional(),
    body("type_year").optional(),
  ],
  controllers.daftar_list
);

router.get(
  "/penetapan/get_filter_type",
  authenticateTokenAdministrator,
  controllers.get_filter_type
);

router.get(
  "/penetapan/daftar_syarat",
  authenticateTokenAdministrator,
  controllers.list_syarat
);

router.post(
  "/penetapan/add_syarat",
  authenticateTokenAdministrator,
  [
    body("*.kegiatan_id").notEmpty().withMessage("Kegiatan tidak boleh kosong"),
    body("*.syarat_id").notEmpty().withMessage("Syarat tidak boleh kosong"),
  ],
  controllers.add_syarat
);

router.post(
  "/penetapan/detail_syarat",
  authenticateTokenAdministrator,
  [body("kegiatan_id").notEmpty().withMessage("kegiatan Tidak Boleh Kosong")],
  controllers.list_syarat_by_kegiatan
);

router.post(
  "/penetapan/add_kriteria",
  authenticateTokenAdministrator,
  [
    body("*.kegiatan_id").notEmpty().withMessage("kegiatan Tidak Boleh Kosong"),
    body("*.name").notEmpty().withMessage("kriteria id Tidak Boleh Kosong"),
  ],
  controllers.add_kriteria
);

router.post(
  "/penetapan/detail_kriteria",
  authenticateTokenAdministrator,
  [body("kegiatan_id").notEmpty().withMessage("kegiatan Tidak Boleh Kosong")],
  controllers.list_kriteria
);

router.get(
  "/penetapan/daftar_surveyor",
  authenticateTokenAdministrator,
  controllers.list_surveyor
);

router.post(
  "/penetapan/detail_surveyor",
  authenticateTokenAdministrator,
  [body("kegiatan_id").notEmpty().withMessage("kegiatan Tidak Boleh Kosong")],
  controllers.detail_surveyor
);

router.post(
  "/penetapan/add_surveyor",
  authenticateTokenAdministrator,
  validation.upload.single("sk"), // jangan diganggu sk nya 👍
  [
    body("kegiatan_id")
      .notEmpty()
      .withMessage("kegiatan_id tidak boleh kosong")
      .isInt()
      .withMessage("kegiatan_id harus berupa angka"),

    body("surveyor")
      .isArray({ min: 1 })
      .withMessage("surveyor harus berupa array dan minimal 1 data"),

    body("surveyor.*.surveyor_id")
      .notEmpty()
      .withMessage("surveyor_id tidak boleh kosong")
      .isInt()
      .withMessage("surveyor_id harus berupa angka"),

    body("kegiatan_name")
      .notEmpty()
      .withMessage("kegiatan_name tidak boleh kosong"),
  ],
  controllers.add_surveyor
);

router.post(
  "/penetapan/send_pesan",
  authenticateTokenAdministrator,
  [
    body("kegiatan_id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka"),
  ],
  controllers.send_pesan
);

module.exports = router;

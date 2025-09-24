const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/penetapan/controllers/index");
const validation = require("../validation/penetapan");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

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
  validation.upload.single("sk"),
  // [
  //   body("*.kegiatan_id").notEmpty().withMessage("kegiatan Tidak Boleh Kosong"),
  //   body("*.surveyor_id")
  //     .notEmpty()
  //     .withMessage("surveyor id Tidak Boleh Kosong"),
  // ],
  controllers.add_surveyor
);

module.exports = router;

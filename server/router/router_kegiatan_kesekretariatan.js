const express = require("express");
const { body } = require("express-validator");
const controller = require("../modules/kegiatan_kesekretariatan/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/kegiatan_kesekretariatan/list",
  authenticateTokenAdministrator,
  [
    body("pageNumber")
      .trim()
      .notEmpty()
      .withMessage("Page Number tidak boleh kosong."),
    body("perpage")
      .trim()
      .notEmpty()
      .withMessage("Jumlah Per Page tidak boleh kosong."),
    body("search").trim(),
  ],
  controller.list
);

router.post(
  "/kegiatan_kesekretariatan/add",
  authenticateTokenAdministrator,
  [
    body("kode").trim().notEmpty().withMessage("id tidak boleh kosong."),
    body("nama_kegiatan")
      .trim()
      .notEmpty()
      .withMessage("nama tidak boleh kosong."),
    body("sumber_dana")
      .trim()
      .notEmpty()
      .withMessage("sumber dana tidak boleh kosong.")
      .isIn(['zakat', 'infaq', 'operasional_apbk'])
      .withMessage("sumber dana harus salah satu dari: zakat, infaq, operasional_apbk"),
    body("penerima")
      .trim()
      .notEmpty()
      .withMessage("penerima tidak boleh kosong."),
    body("jenis_penerima")
      .trim()
      .notEmpty()
      .withMessage("jenis penerima tidak boleh kosong."),
    body("nominal_kegiatan")
      .trim()
      .notEmpty()
      .withMessage("nominal tidak boleh kosong."),
    body("area_penyaluran")
      .trim()
      .notEmpty()
      .withMessage("area tidak boleh kosong."),
    body("tanggal_penyaluran")
      .notEmpty()
      .withMessage("Tanggal tidak boleh kosong.")
      .isISO8601()
      .withMessage("Format tanggal tidak valid.")
      .toDate(),
  ],
  authenticateTokenAdministrator,
  controller.add
);

router.post(
  "/kegiatan_kesekretariatan/daftar_desa",
  authenticateTokenAdministrator,
  body("kecamatan_id")
    .notEmpty()
    .withMessage("kecamatan_id tidak boleh kosong."),
  controller.list_desa
);

router.get(
  "/kegiatan_kesekretariatan/daftar_kecamatan",
  authenticateTokenAdministrator,
  controller.list_kecamatan
);

module.exports = router;
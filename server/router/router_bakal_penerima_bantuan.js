const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/bakal_penerima_bantuan/controllers/index");
const validation = require("../validation/bakal_penerima_bantuan.js");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken.js");
const validationHelper = require("../helper/handleErrorFile.js");

const router = express.Router();

router.get(
  "/bakal_penerima_bantuan/get_filter_type",
  authenticateTokenAdministrator,
  controllers.get_filter_type
);

router.post(
  "/bakal_penerima_bantuan/list",
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
    body("type_kegiatan").optional(),
    body("type_status_kegiatan").optional(),
    body("type_status_realisasi").optional(),
  ],
  controllers.list_bakal_penerima_bantuan
);

router.post(
  "/bakal_penerima_bantuan/get_info_permohonan",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_realisasi),
  ],
  controllers.get_info_permohonan
);

router.post(
  "/bakal_penerima_bantuan/list_belum_upload_berita_acara",
  authenticateTokenAdministrator,
  [
    body("kegiatan_id")
      .optional()
      .isInt()
      .withMessage("Kegiatan ID Harus Angka")
      .custom(validation.check_id_kegiatan),
  ],
  controllers.list_belum_upload_berita_acara
);

router.post(
  "/bakal_penerima_bantuan/realisasi_bantuan",
  authenticateTokenAdministrator,
  validation.single.upload("bukti_realisasi"),
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_realisasi)
      .custom(validation.check_status_belum_direalisasi),
    body("tanggal_realisasi")
      .notEmpty()
      .withMessage("Tanggal Realisasi Tidak Boleh Kosong")
      .isString()
      .withMessage("Tanggal Realisasi Harus String")
      .custom(validation.check_tanggal_realisasi),
    body("nominal_realisasi")
      .notEmpty()
      .withMessage("Nominal Realisasi Tidak Boleh Kosong")
      .isInt()
      .withMessage("Nominal Realisasi Harus Angka")
      .custom(validation.check_nominal_realisasi),
    body("tipe")
      .notEmpty()
      .withMessage("Tipe Tidak Boleh Kosong")
      .isIn(["transfer", "bantuan_langsung"])
      .withMessage("Tipe Harus Transfer atau Bantuan Langsung"),
    body("send_wa")
      .notEmpty()
      .withMessage("Send WA Tidak Boleh Kosong")
      .isBoolean()
      .withMessage("Send WA Harus Boolean"),
  ],
  validationHelper.handleFileErrors,
  controllers.realisasi_bantuan
);

router.post(
  "/bakal_penerima_bantuan/get_info_upload_berita_acara",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_realisasi),
  ],
  controllers.get_info_upload_berita_acara
);

router.post(
  "/bakal_penerima_bantuan/upload_berita_acara",
  authenticateTokenAdministrator,
  validation.single.upload("berita_acara"),
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_realisasi)
      .custom(validation.check_status_approve),
  ],
  validationHelper.handleFileErrors,
  controllers.upload_berita_acara
);

router.post(
  "/bakal_penerima_bantuan/upload_berita_acara_massal",
  authenticateTokenAdministrator,
  validation.single.upload("berita_acara"),
  [
    body("selected_ids")
      .notEmpty()
      .withMessage("Selected IDs Tidak Boleh Kosong")
      .isString()
      .withMessage("Selected IDs Harus String")
      .custom(validation.check_selected_ids),
  ],
  validationHelper.handleFileErrors,
  controllers.upload_berita_acara_massal
);

router.post(
  "/bakal_penerima_bantuan/batal_realisasi",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_realisasi)
      .custom(validation.check_status_sudah_direalisasi),
  ],
  controllers.batal_realisasi
);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/permohonan_bantuan/controllers/index");
const validation = require("../validation/permohonan_bantuan.js");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");
const validationHelper = require("../helper/handleErrorFile");

const router = express.Router();

router.get(
  "/permohonan_bantuan/list_kegiatan",
  authenticateTokenAdministrator,
  controllers.list_kegiatan
);

router.get(
  "/permohonan_bantuan/list_bank",
  authenticateTokenAdministrator,
  controllers.list_bank
);

router.get(
  "/permohonan_bantuan/list_member",
  authenticateTokenAdministrator,
  controllers.list_member
);

router.post(
  "/permohonan_bantuan/list_kriteria_syarat",
  authenticateTokenAdministrator,
  [
    body("kegiatan_id")
      .notEmpty()
      .withMessage("Kegiatan Id Tidak Boleh Kosong")
      .isInt()
      .withMessage("Kegiatan Id Harus Angka")
      .custom(validation.check_id_kegiatan),
  ],
  controllers.list_kriteria_syarat
);

router.get(
  "/permohonan_bantuan/get_filter_type",
  authenticateTokenAdministrator,
  controllers.get_filter_type
)

router.post(
  "/permohonan_bantuan/list",
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
    body("type_kegiatan_id").optional(),
    body("type_status_realisasi").optional(),
    body("type_realisasi").optional(),
  ],
  controllers.list_permohonan_bantuan
);

router.post(
  "/permohonan_bantuan/add",
  authenticateTokenAdministrator,
  validation.upload,
  [
    body("kegiatan_id")
      .notEmpty()
      .withMessage("Kegiatan Tidak Boleh Kosong")
      .isInt()
      .withMessage("Kegiatan Harus Angka")
      .custom(validation.check_id_kegiatan),
    body("member_id")
      .notEmpty()
      .withMessage("Member Tidak Boleh Kosong")
      .isInt()
      .withMessage("Member Harus Angka")
      .custom(validation.check_id_member),
    body("bank_id")
      .notEmpty()
      .withMessage("Bank Tidak Boleh Kosong")
      .isInt()
      .withMessage("Bank Harus Angka")
      .custom(validation.check_id_bank),
    body("nomor_rekening")
      .notEmpty()
      .withMessage("Nomor Rekening Tidak Boleh Kosong")
      .isString()
      .withMessage("Nomor Rekening Harus String"),
    body("atas_nama")
      .notEmpty()
      .withMessage("Atas Nama Tidak Boleh Kosong")
      .isString()
      .withMessage("Atas Nama Harus String"),
  ],
  validationHelper.handleFileErrors,
  controllers.add
);

router.post(
  "/permohonan_bantuan/get_info_edit_permohonan_bantuan",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_permohonan_bantuan),
  ],
  controllers.get_info_edit
);

router.post(
  "/permohonan_bantuan/edit",
  authenticateTokenAdministrator,
  validation.upload,
  validation.parseUploadMiddleware,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_permohonan_bantuan),
    body("kegiatan_id")
      .notEmpty()
      .withMessage("Kegiatan Tidak Boleh Kosong")
      .isInt()
      .withMessage("Kegiatan Harus Angka")
      .custom(validation.check_id_kegiatan),
    body("member_id")
      .notEmpty()
      .withMessage("Member Tidak Boleh Kosong")
      .isInt()
      .withMessage("Member Harus Angka")
      .custom(validation.check_id_member),
    body("bank_id")
      .notEmpty()
      .withMessage("Bank Tidak Boleh Kosong")
      .isInt()
      .withMessage("Bank Harus Angka")
      .custom(validation.check_id_bank),
    body("nomor_rekening")
      .notEmpty()
      .withMessage("Nomor Rekening Tidak Boleh Kosong")
      .isString()
      .withMessage("Nomor Rekening Harus String"),
    body("atas_nama")
      .notEmpty()
      .withMessage("Atas Nama Tidak Boleh Kosong")
      .isString()
      .withMessage("Atas Nama Harus String"),
  ],
  validationHelper.handleFileErrors,
  controllers.edit
);

router.post(
  "/permohonan_bantuan/edit_status",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_permohonan_bantuan),
    body("alasan_penolakan")
      .notEmpty()
      .withMessage("Alasan Penolakan Tidak Boleh Kosong")
      .isString()
      .withMessage("Alasan Penolakan Harus String"),
  ],
  controllers.edit_status
);

router.post(
  "/permohonan_bantuan/get_info_persetujuan_permohonan_bantuan",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_permohonan_bantuan),
  ],
  controllers.get_info_persetujuan
)

router.post(
  "/permohonan_bantuan/persetujuan_permohonan_bantuan",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_permohonan_bantuan),
    body("nominal_yang_disetujui")
      .notEmpty()
      .withMessage("Nominal Yang Disetujui Tidak Boleh Kosong")
      .isInt()
      .withMessage("Nominal Yang Disetujui Harus Angka")
      .custom(validation.check_nominal_yang_disetujui),
  ],
  controllers.persetujuan
)

router.post(
  "/permohonan_bantuan/delete",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID Tidak Boleh Kosong")
      .isInt()
      .withMessage("ID Harus Angka")
      .custom(validation.check_id_permohonan_bantuan)
      .custom(validation.check_status_permohonan_bantuan),
  ],
  controllers.delete
);

module.exports = router;

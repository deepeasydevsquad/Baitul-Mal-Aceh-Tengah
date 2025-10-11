const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/permohonan_bantuan_member/controllers/index");
const validation = require("../validation/permohonan_member");

const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/permohonan_member/desc",
  body("kegiatan_id").notEmpty().withMessage("kegiatan_id Tidak Boleh Kosong"),
  authenticateTokenAdministrator,
  controllers.get_desc
);

router.post(
  "/permohonan_member/syarat",
  body("kegiatan_id").notEmpty().withMessage("kegiatan_id Tidak Boleh Kosong"),
  authenticateTokenAdministrator,
  controllers.get_syarat
);

router.post(
  "/permohonan_member/kriteria",
  body("kegiatan_id").notEmpty().withMessage("kegiatan_id Tidak Boleh Kosong"),
  authenticateTokenAdministrator,
  controllers.get_kriteria
);

router.post(
  "/permohonan_member/info",
  body("kegiatan_id").notEmpty().withMessage("kegiatan_id Tidak Boleh Kosong"),
  authenticateTokenAdministrator,
  controllers.get_info
);

router.post(
  "/permohonan_member/lokasi",
  body("kegiatan_id").notEmpty().withMessage("kegiatan_id Tidak Boleh Kosong"),
  authenticateTokenAdministrator,
  controllers.get_lokasi
);

router.get(
  "/permohonan_member/info_member",
  authenticateTokenAdministrator,
  controllers.get_info_member
);

router.get(
  "/permohonan_member/list_bank",
  authenticateTokenAdministrator,
  controllers.list_bank
);

router.post(
  "/permohonan_member/add",
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
  // validationHelper.handleFileErrors,
  controllers.add
);

module.exports = router;

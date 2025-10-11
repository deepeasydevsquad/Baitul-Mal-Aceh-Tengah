const express = require("express");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
const controller = require("../modules/monev/controllers/index");
const validation = require("../validation/monev");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
  "/monev/get_filter_type",
  authenticateTokenAdministrator,
  controller.get_filter_type
);

router.post(
  "/monev/list",
  authenticateTokenAdministrator,
  controller.get_monev_list
);

router.post(
  "/monev/pertanyaan",
  authenticateTokenAdministrator,
  [
    body("jenis_monev")
      .trim()
      .notEmpty()
      .isIn([
        "evaluasi_konsumtif",
        "monitoring_konsumtif",
        "evaluasi_pemberdayaan_ekonomi",
        "monitoring_pemberdayaan_ekonomi",
        "evaluasi_pendidikan",
        "monitoring_pendidikan",
      ])
      .withMessage("Jenis tidak boleh kosong."),
    body("tipe")
      .trim()
      .notEmpty()
      .isIn(["evaluasi", "monitoring"])
      .withMessage("Tipe tidak boleh kosong."),
  ],
  controller.pertanyaan
);

router.post(
  "/monev/kirim_jawaban",
  authenticateTokenAdministrator,
  [
    body("permohonan_id")
      .notEmpty()
      .withMessage("Permohonan ID tidak boleh kosong.")
      .isInt()
      .withMessage("Permohonan ID harus berupa angka.")
      .custom(validation.check_id_permohonan),
    body("jenis_monev")
      .trim()
      .notEmpty()
      .isIn([
        "evaluasi_konsumtif",
        "monitoring_konsumtif",
        "evaluasi_pemberdayaan_ekonomi",
        "monitoring_pemberdayaan_ekonomi",
        "evaluasi_pendidikan",
        "monitoring_pendidikan",
      ])
      .withMessage("Jenis tidak boleh kosong."),
    body("tipe")
      .trim()
      .notEmpty()
      .isIn(["evaluasi", "monitoring"])
      .withMessage("Tipe tidak boleh kosong."),
    body("nama_petugas_monev")
      .trim()
      .notEmpty()
      .withMessage("Nama petugas tidak boleh kosong."),
    body("tim_monev_1")
      .trim()
      .notEmpty()
      .withMessage("Tim 1 tidak boleh kosong."),
    body("tim_monev_2").trim().optional({ nullable: true }),
    body("tim_monev_3").trim().optional({ nullable: true }),
    body("rekomendasi_tim").trim().optional({ nullable: true }),
    body("jawaban").isArray().withMessage("Jawaban harus berupa array."),
    body("jawaban.*.pertanyaan_id")
      .exists()
      .isInt()
      .withMessage("Pertanyaan ID harus berupa angka."),
    body("jawaban.*.jawaban")
      .exists()
      .notEmpty()
      .withMessage("Jawaban harus diisi."),
  ],
  controller.kirim_jawaban
);

module.exports = router;

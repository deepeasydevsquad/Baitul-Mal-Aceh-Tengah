const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/target_distribusi/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");
const validation = require("../validation/target_distribusi");

const router = express.Router();

router.post(
  "/target_distribusi/list",
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
  controllers.list
);

router.post(
  "/target_distribusi/add",
  authenticateTokenAdministrator,
  [
    body("tahun")
      .notEmpty()
      .withMessage("Tahun Tidak Boleh Kosong")
      .bail()
      .custom(validation.cek_tahun),
    body("targets")
      .isArray({ min: 1 })
      .withMessage("Targets harus berupa array"),
    body("targets.*.asnaf_id")
      .notEmpty()
      .withMessage("Asnaf Tidak Boleh Kosong"),
    body("targets.*.target_orang")
      .notEmpty()
      .withMessage("Target Orang Tidak Boleh Kosong"),
    body("targets.*.target_rupiah")
      .notEmpty()
      .withMessage("Target Rupiah Tidak Boleh Kosong"),
  ],
  controllers.add
);

router.post(
  "/target_distribusi/update",
  authenticateTokenAdministrator,
  [
    body("tahun").notEmpty().withMessage("Tahun Tidak Boleh Kosong"),
    body("targets")
      .isArray({ min: 1 })
      .withMessage("Targets harus berupa array"),
    body("targets.*.asnaf_id")
      .notEmpty()
      .withMessage("Asnaf Tidak Boleh Kosong"),
    body("targets.*.target_orang")
      .notEmpty()
      .withMessage("Target Orang Tidak Boleh Kosong"),
    body("targets.*.target_rupiah")
      .notEmpty()
      .withMessage("Target Rupiah Tidak Boleh Kosong"),
  ],
  controllers.update
);

router.post(
  "/target_distribusi/detail",
  authenticateTokenAdministrator,
  [body("tahun").notEmpty().withMessage("tahun Tidak Boleh Kosong")],
  controllers.detail_target
);

router.get(
  "/target_distribusi/list_asnaf",
  authenticateTokenAdministrator,
  controllers.daftar_asnaf
);

module.exports = router;

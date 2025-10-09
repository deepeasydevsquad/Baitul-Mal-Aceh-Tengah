const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/laporan_pengumpulan/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/laporan_pengumpulan/list",
  authenticateTokenAdministrator,
  [
    body("tahun").optional().isInt().withMessage("Tahun Harus Angka"),
  ],
  controllers.list_laporan_pengumpulan
);

module.exports = router;

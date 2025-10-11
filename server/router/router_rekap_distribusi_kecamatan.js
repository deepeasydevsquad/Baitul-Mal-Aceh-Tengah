const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const controller = require("../modules/rekap_distribusi_kecamatan/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

router.get(
  "/rekap_distribusi_kecamatan/list",
  authenticateTokenAdministrator,
  controller.fn_get_data_laporan_rekap_per_kecamatan
);

module.exports = router;

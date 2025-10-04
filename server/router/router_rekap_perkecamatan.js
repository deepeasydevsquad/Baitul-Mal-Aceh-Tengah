const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const controller = require("../modules/rekap_perkecamatan/controllers/index");
const { authenticateTokenAdministrator } = require("../middleware/authenticateToken");

router.get(
  "/rekap_perkecamatan/list",
  authenticateTokenAdministrator,
  controller.fn_get_data_laporan_rekap_per_kecamatan
);


module.exports = router;
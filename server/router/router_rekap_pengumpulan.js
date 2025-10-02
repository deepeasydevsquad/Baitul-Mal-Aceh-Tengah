const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const controller = require("../modules/rekap_pengumpulan/controllers/index");
const { authenticateTokenAdministrator } = require("../middleware/authenticateToken");

router.get(
  "/rekap_pengumpulan/list",
  authenticateTokenAdministrator,
  controller.list
);

module.exports = router;

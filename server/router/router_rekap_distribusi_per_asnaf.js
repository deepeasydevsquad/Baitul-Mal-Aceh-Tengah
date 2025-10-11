const express = require("express");
const router = express.Router();
const controller = require("../modules/rekap_distribusi_per_asnaf/controllers/index");
const { authenticateTokenAdministrator } = require("../middleware/authenticateToken");

router.get(
  "/rekap_distribusi_per_asnaf/list",
  authenticateTokenAdministrator,
  controller.list_rekap_distribusi_per_asnaf
);

module.exports = router;

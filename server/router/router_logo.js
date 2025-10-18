const express = require("express");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
const controller = require("../modules/logo/controllers/index");
const validation = require("../validation/monev");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/image/logo", authenticateTokenAdministrator, controller.logo);

module.exports = router;

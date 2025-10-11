const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/program_bantuan_member/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/program_bantuan_member/list",
  body("tahun").optional().isInt().withMessage("tahun Harus integer"),
  authenticateTokenAdministrator,
  controllers.list
);

router.post(
  "/program_bantuan_member/list_program",
  body("name").optional().isString().withMessage("tahun Harus String"),
  authenticateTokenAdministrator,
  controllers.list_bantuan
);

module.exports = router;

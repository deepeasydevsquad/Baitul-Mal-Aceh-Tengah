const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/program_bantuan_member/controllers/index");
const { authenticateTokenMember } = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/program_bantuan_member/list",
  authenticateTokenMember,
  body("tahun").optional().isInt().withMessage("tahun Harus integer"),
  controllers.list
);

router.post(
  "/program_bantuan_member/list_program",
  authenticateTokenMember,
  [
    body("name").optional().isString().withMessage("name Harus String"),
    body("type_date")
      .optional()
      .isObject()
      .withMessage("Filter Tanggal Harus String"),
  ],
  controllers.list_bantuan
);

module.exports = router;

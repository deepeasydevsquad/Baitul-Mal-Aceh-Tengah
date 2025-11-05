const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/member_area/controllers/index");
// const {
//   authenticateTokenAdministrator,
// } = require("../middleware/authenticateToken");

const { authenticateTokenMember } = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
  "/member_area/get_member_info",
  authenticateTokenMember,
  controllers.get_member_info
);

module.exports = router;

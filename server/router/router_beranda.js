const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/beranda/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/beranda/list",
  authenticateTokenAdministrator,
  [body("search").optional().isString().withMessage("Search Harus String")],
  controllers.beranda
);

module.exports = router;

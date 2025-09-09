const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/member/controllers/index");
const validation = require("../validation/member");

// ROUTER
const router = express.Router();

router.post('/auth/login_member', 
  body("username").notEmpty().withMessage("Username Tidak Boleh Kosong").trim().custom(validation.username),
  body("password").notEmpty().withMessage("Password Tidak Boleh Kosong").trim().custom(validation.password),
  controllers.login_member_process
);

module.exports = router;
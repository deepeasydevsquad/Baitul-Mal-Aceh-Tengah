const express = require("express");
const { body } = require("express-validator");
const controllersMember = require("../modules/member/controllers/index");
const controllersAdministrator = require("../modules/administrator/controllers/index");
const validationMember = require("../validation/member");
const validationAdministrator = require("../validation/administrator");

// ROUTER
const router = express.Router();

router.post('/auth/login_member', 
  body("username").notEmpty().withMessage("Username Tidak Boleh Kosong").trim().custom(validationMember.username),
  body("password").notEmpty().withMessage("Password Tidak Boleh Kosong").trim().custom(validationMember.password),
  controllersMember.login_member_process
);

router.post('/auth/login_administrator', 
  body("username").notEmpty().withMessage("Username Tidak Boleh Kosong").trim().custom(validationAdministrator.username),
  body("password").notEmpty().withMessage("Password Tidak Boleh Kosong").trim().custom(validationAdministrator.password),
  controllersAdministrator.login_administrator_process
);

router.post('/auth/administrator/refresh', 
   controllersAdministrator.refreshToken
);

// administrator

// auth/login_administrator

module.exports = router;
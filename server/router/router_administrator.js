const jwt = require("jsonwebtoken");
const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/administrator/controllers/index");
const { authenticateTokenAdministrator } = require("../middleware/authenticateToken");

// Simpan refresh token dalam database sementara (bisa diganti dengan DB asli)
let refreshTokens = [];

// ROUTER
const router = express.Router();

router.get('/administrator', authenticateTokenAdministrator, controllers.administrator);

module.exports = router;

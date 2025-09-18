const express = require("express");
const { body, validationResult } = require("express-validator");
const controllers = require("../modules/bank_pengumpulan/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");
const validation = require("../validation/bank_pengumpulan");

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get(
  "/daftar_bank/list",
  authenticateTokenAdministrator,
  controllers.daftar_bank
);

router.post(
  "/daftar_bank_pengumpulan/list",
  authenticateTokenAdministrator,
  controllers.daftar_bank_pengumpulan
);

router.post(
  "/bank_pengumpulan/add",
  authenticateTokenAdministrator,
  validation.add,
  handleValidation,
  controllers.add_bank_pengumpulan_baru
);

router.post(
  "/bank_pengumpulan/edit",
  authenticateTokenAdministrator,
  [body("id").isInt().withMessage("ID harus berupa angka"), ...validation.edit],
  handleValidation,
  controllers.edit_bank_pengumpulan
);

router.post(
  "/bank_pengumpulan/delete",
  authenticateTokenAdministrator,
  [body("id").isInt().withMessage("ID harus berupa angka")],
  handleValidation,
  controllers.delete_bank_pengumpulan
);

module.exports = router;

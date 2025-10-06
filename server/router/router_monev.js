const express = require("express");
const { validationResult } = require("express-validator");
const controller = require("../modules/monev/controllers/index");
const validation = require("../validation/monev");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/monev/list",
  authenticateTokenAdministrator,
  controller.get_monev_list
);

router.get(
  "/monev/pertanyaan_evaluasi",
  authenticateTokenAdministrator,
  controller.pertanyaan_evaluasi
);

router.get(
  "/monev/pertanyaan_monitoring",
  authenticateTokenAdministrator,
  controller.pertanyaan_monitoring
);

router.get(
  "/monev/gabung_status_monev",
  authenticateTokenAdministrator,
  controller.gabung_status_monev
);

// Kirim jawaban evaluasi
router.post(
  "/monev/kirim_jawaban_evaluasi",
  authenticateTokenAdministrator,
  validation.kirim_jawaban_evaluasi, // validasi dari validation/monev.js
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: errors.array() });
    }
    next();
  },
  controller.kirim_jawaban_evaluasi
);

// Kirim jawaban monitoring
router.post(
  "/monev/kirim_jawaban_monitoring",
  authenticateTokenAdministrator,
  validation.kirim_jawaban_monitoring, //  validasi dari validation/monev.js
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, message: errors.array() });
    }
    next();
  },
  controller.kirim_jawaban_monitoring
);

module.exports = router;

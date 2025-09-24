const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/pengaturan_whatsapp/controllers/index");
// const validation = require("../validation/pengaturan_whatsapp");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
  "/pengaturan_whatsapp/get_konfigurasi",
  authenticateTokenAdministrator,
  controllers.get_konfigurasi
);

router.get(
  "/pengaturan_whatsapp/list",
  authenticateTokenAdministrator,
  controllers.list_pengaturan_whatsapp
);

router.get(
  "/pengaturan_whatsapp/start",
  authenticateTokenAdministrator,
  controllers.start
);

router.post(
  "/pengaturan_whatsapp/update",
  authenticateTokenAdministrator,
  [
    body("api_key").notEmpty().withMessage("API Key Tidak Boleh Kosong"),
    body("device_key").notEmpty().withMessage("Device Key Tidak Boleh Kosong"),
    body("whatsapp_number")
      .notEmpty()
      .withMessage("Nomor WhatsApp Tidak Boleh Kosong"),
  ],
  controllers.update
);

module.exports = router;

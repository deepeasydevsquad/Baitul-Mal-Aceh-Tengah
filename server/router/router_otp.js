const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const Controller = require("../modules/otps/controllers/index"); // Pastikan ini benar
const validation = require("../validation/otp");

console.log("Controller loaded:", Controller); // Debugging

router.post(
    "/send_otp",
    body("whatsappNumber")
        .notEmpty()
        .withMessage("Nomor Whatsapp Tidak Boleh Kosong")
        .trim()
        .custom(validation.check_whatsappnumber),
    Controller.sendOtp
); // Pastikan tidak typo

module.exports = router;


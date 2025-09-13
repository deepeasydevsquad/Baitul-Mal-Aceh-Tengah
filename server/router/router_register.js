const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/register/controllers/index");

const router = express.Router();

router.post(
    "/register",
    [
        body("desa_id").notEmpty().withMessage("desa_id tidak boleh kosong."),
        body("tipe").notEmpty().withMessage("tipe tidak boleh kosong."),
        body("fullname").notEmpty().withMessage("fullname tidak boleh kosong."),
        body("whatsapp_number")
            .notEmpty()
            .withMessage("whatsapp_number tidak boleh kosong."),
        body("username").notEmpty().withMessage("username tidak boleh kosong."),
        body("password")
            .notEmpty()
            .withMessage("password tidak boleh kosong.")
            .isLength({ min: 6 })
            .withMessage("password minimal 6 karakter."),
    ],
    controllers.register
);

router.post("/register/daftar_desa", controllers.list_desa);

router.get("/register/daftar_kecamatan", controllers.list_kecamatan);

module.exports = router;


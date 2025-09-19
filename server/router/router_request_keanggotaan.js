const express = require("express");
const { body } = require("express-validator");
const controller = require("../modules/request_keanggotaan/controllers/index");
const { authenticateTokenAdministrator } = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
    "/request_keanggotaan/list",
    authenticateTokenAdministrator,
    [
        body("pageNumber").trim().notEmpty().withMessage("Page Number tidak boleh kosong."),
        body("perpage").trim().notEmpty().withMessage("Jumlah Per Page tidak boleh kosong."),
        body("search").trim(),
        body("status").trim(),
    ],
    controller.list
);

router.post(
    "/request_keanggotaan/verifikasi",
    [
        body("id").trim().notEmpty().withMessage("id tidak boleh kosong."),
        body("action").trim().notEmpty().withMessage("action tidak boleh kosong."),
    ],
    authenticateTokenAdministrator,
    controller.verifikasi
);

module.exports = router;


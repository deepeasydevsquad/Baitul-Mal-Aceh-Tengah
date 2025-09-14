const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const controller = require("../modules/system_log_surveyor/controller/index"); // Pastikan ini benar
const {
    authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

router.post(
    "/system_log_surveyor/list",
    authenticateTokenAdministrator,
    [
        body("pageNumber")
            .trim()
            .notEmpty()
            .withMessage("Page Number tidak boleh kosong."),
        body("perpage")
            .trim()
            .notEmpty()
            .withMessage("Jumlah Per Page tidak boleh kosong."),
        body("search").trim(),
        body("status").trim(),
    ],
    controller.daftar_surveyor // Pastikan tidak typo
);

module.exports = router;
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const controller = require("../modules/daftar_system_log/controllers/index"); // Pastikan ini benar
const {
    authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

router.post(
    "/system_log/list",
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
    controller.daftar_system_log // Pastikan tidak typo
);

module.exports = router;
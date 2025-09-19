const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/daftar_tab/controllers/index");
const {
    authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
    "/tab/list",
    authenticateTokenAdministrator,
    [
        body("perpage")
            .notEmpty()
            .withMessage("Perpage Tidak Boleh Kosong")
            .isInt()
            .withMessage("Perpage Harus Angka"),
        body("pageNumber")
            .notEmpty()
            .withMessage("Page Number Tidak Boleh Kosong")
            .isInt()
            .withMessage("Page Number Harus Angka"),
        body("search").optional().isString().withMessage("Search Harus String"),
    ],
    controllers.list_tab
);

router.post(
    "/tab/update",
    authenticateTokenAdministrator,
    [
        body("id")
            .notEmpty()
            .withMessage("ID Tidak Boleh Kosong")
            .isInt()
            .withMessage("ID harus angka"),
        body("desc")
            .notEmpty()
            .withMessage("Name Tidak Boleh Kosong")
            .isString()
            .withMessage("Name Harus String"),
        ],
    controllers.update
);

router.post(
    "/tab/tab_by_id",
    authenticateTokenAdministrator,
    [
        body("id")
            .notEmpty()
            .withMessage("ID Tidak Boleh Kosong")
            .isInt()
            .withMessage("ID harus angka"),
    ],
    controllers.detail
);

module.exports = router;


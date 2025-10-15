const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/riwayat_donasi/controllers/index");
const {
    authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
    "/riwayat_donasi/list",
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
    controllers.list_riwayat_donasi
);

router.post(
    "/riwayat_donasi/delete",
    authenticateTokenAdministrator,
    [
        body("id")
            .notEmpty()
            .withMessage("ID Tidak Boleh Kosong")
            .isInt()
            .withMessage("ID harus angka"),
    ],
    controllers.delete
);

router.post(
    "/riwayat_donasi/riwayat_donasi_by_id",
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

router.post(
    "/riwayat_donasi/update_status",
    authenticateTokenAdministrator,
    [
        body("id")
            .notEmpty()
            .withMessage("ID Tidak Boleh Kosong")
            .isInt()
            .withMessage("ID harus angka"),
        body("status")
            .notEmpty()
            .withMessage("Status Tidak Boleh Kosong")
    ],
    controllers.update_status
);

module.exports = router;


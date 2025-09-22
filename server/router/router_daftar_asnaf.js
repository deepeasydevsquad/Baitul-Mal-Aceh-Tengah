const express = require("express");
const { body, param } = require("express-validator");
const controllers = require("../modules/daftar_asnaf/controllers/index");
const {
    authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
    "/daftar_asnaf/list",
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
    controllers.list_asnaf
);

router.post(
    "/daftar_asnaf/add",
    authenticateTokenAdministrator,
    [
        body("name").notEmpty().withMessage("Nama Syarat Tidak Boleh Kosong"),
    ],
    controllers.add
);

router.post(
    "/daftar_asnaf/update",
    authenticateTokenAdministrator,
    [
        body("id")
            .notEmpty()
            .withMessage("ID Tidak Boleh Kosong")
            .isInt()
            .withMessage("ID harus angka"),
        body("name")
            .notEmpty()
            .withMessage("Name Tidak Boleh Kosong")
            .isString()
            .withMessage("Name Harus String"),
    ],
    controllers.update
);

router.post(
    "/daftar_asnaf/delete",
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
    "/daftar_asnaf/asnaf_by_id",
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


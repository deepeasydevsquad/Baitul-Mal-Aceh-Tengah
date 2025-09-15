const express = require("express");
const { body } = require("express-validator");
const controllers = require("../modules/daftar_grup_akses/controllers/index");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/grup_akses/list",
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
  controllers.list_grup
);

router.post(
  "/grup_akses/list_menu_by_id",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("id Tidak Boleh Kosong")
      .isInt()
      .withMessage("id Harus Angka"),
  ],
  controllers.list_menu_by_id
);

router.get(
  "/grup_akses/daftar_menu",
  authenticateTokenAdministrator,
  controllers.list_menu
);

router.post(
  "/grup_akses/add",
  authenticateTokenAdministrator,
  [
    body("name").notEmpty().withMessage("name tidak boleh kosong."),
    body("group_access")
      .notEmpty()
      .withMessage("group_access tidak boleh kosong.")
      .custom((value) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            throw new Error("group_access harus berupa array JSON.");
          }
          return true;
        } catch (err) {
          throw new Error("group_access harus berupa JSON valid.");
        }
      }),
  ],
  controllers.add
);

router.post(
  "/grup_akses/edit",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("id Tidak Boleh Kosong")
      .isInt()
      .withMessage("id Harus Angka"),
    body("name").notEmpty().withMessage("name tidak boleh kosong."),
    body("group_access")
      .notEmpty()
      .withMessage("group_access tidak boleh kosong.")
      .custom((value) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            throw new Error("group_access harus berupa array JSON.");
          }
          return true;
        } catch (err) {
          throw new Error("group_access harus berupa JSON valid.");
        }
      }),
  ],
  controllers.edit
);

router.post(
  "/grup_akses/delete",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("id tidak boleh kosong.")
      .isInt()
      .withMessage("id harus angka."),
  ],
  controllers.delete
);

module.exports = router;

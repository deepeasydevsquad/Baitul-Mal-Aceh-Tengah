const express = require("express");
const { body, validationResult } = require("express-validator");
const controllers = require("../modules/running_text/controllers/index");
const validation = require("../validation/running_text");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/running_text/list",
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
    body("activeOnly")
      .optional()
      .isBoolean()
      .withMessage("ActiveOnly harus boolean")
      .default(true),
  ],
  controllers.running_text
);

router.post(
  "/running_text/add",
  authenticateTokenAdministrator,
  [
    body("content")
      .notEmpty()
      .withMessage("Content tidak boleh kosong")
      .isLength({ min: 5, max: 500 })
      .withMessage("Content terlalu pendek/panjang")
      .custom(validation.content_unique),
  ],
  controllers.add_running_text
);

router.post(
  "/running_text/edit",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID tidak boleh kosong")
      .custom(validation.id_exists),
    body("content")
      .notEmpty()
      .withMessage("Content tidak boleh kosong")
      .isLength({ min: 5, max: 500 })
      .withMessage("Content terlalu pendek/panjang")
      .custom(validation.content_unique),
  ],
  controllers.edit_running_text
);

router.post(
  "/running_text/delete",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID tidak boleh kosong")
      .custom(validation.id_exists),
  ],
  controllers.delete_running_text
);

router.post(
  "/running_text/toggle",
  authenticateTokenAdministrator,
  [
    body("id")
      .notEmpty()
      .withMessage("ID tidak boleh kosong")
      .custom(validation.id_exists),
  ],
  controllers.toggle_status_running_text
);

router.post(
  "/running_text/update-order",
  authenticateTokenAdministrator,
  [
    body("order")
      .isArray({ min: 1 })
      .withMessage("Order harus berupa array dan tidak boleh kosong")
      .custom(validation.order_array),
  ],
  controllers.update_order_running_text
);


router.get("/running_text/active", controllers.getActiveRunningText);

module.exports = router;
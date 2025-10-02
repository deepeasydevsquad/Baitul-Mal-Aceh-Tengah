const express = require("express");
const controllers = require("../modules/target_pengumpulan/controllers/index");
const validation = require("../validation/target_pengumpulan");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

router.post(
  "/target_pengumpulan/list",
  authenticateTokenAdministrator,
  controllers.daftar_target_pengumpulan
);

router.post(
  "/target_pengumpulan/add",
  authenticateTokenAdministrator,
  validation.add,
  controllers.add_target_pengumpulan
);

router.post(
  "/target_pengumpulan/edit",
  authenticateTokenAdministrator,
  validation.edit,
  controllers.edit_target_pengumpulan
);

router.post(
  "/target_pengumpulan/get_info_edit",
  authenticateTokenAdministrator,
  validation.get_info_edit,
  controllers.get_info_edit_target_pengumpulan
);

router.post(
  "/target_pengumpulan/delete",
  authenticateTokenAdministrator,
  validation.delete,
  controllers.delete
);

router.get(
  "/target_pengumpulan/tahun",
  authenticateTokenAdministrator,
  controllers.get_tahun
);

module.exports = router;

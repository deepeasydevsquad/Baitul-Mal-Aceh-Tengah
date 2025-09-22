const express = require("express");
const controllers = require("../modules/urutan_bagian_monev/controllers/index");
const { authenticateTokenAdministrator } = require("../middleware/authenticateToken");

const router = express.Router();

router.get(
  "/urutan-monev/get-jenis",
  authenticateTokenAdministrator,
  controllers.get_jenis_monev_list
);

router.post(
  "/urutan-monev/get-urutan",
  authenticateTokenAdministrator,
  controllers.get_urutan_by_jenis
);

router.post(
  "/urutan-monev/update-urutan",
  authenticateTokenAdministrator,
  controllers.update_urutan
);

module.exports = router;


const express = require("express");
const { validationResult } = require("express-validator");
const controllers = require("../modules/pertanyaan_monev/controllers/index");
const validation = require("../validation/pertanyaan_monev");
const {
  authenticateTokenAdministrator,
} = require("../middleware/authenticateToken");

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


router.get(
  "/pertanyaan-monev/get-jenis",
  authenticateTokenAdministrator,
  controllers.get_jenis_monev_list
);
router.get(
  "/pertanyaan-monev/get-urutan-bagian",
  authenticateTokenAdministrator,
  controllers.get_urutan_bagian
);
router.post(
  "/pertanyaan-monev/list",
  authenticateTokenAdministrator,
  controllers.pertanyaan_monev_list
);

router.post(
  "/pertanyaan-monev/get-info-edit",
  authenticateTokenAdministrator,
  validation.getInfoEdit,
  handleValidationErrors,
  controllers.get_info_edit 
);


router.post(
  "/pertanyaan-monev/create",
  authenticateTokenAdministrator,
  validation.add,
  handleValidationErrors,
  controllers.create_pertanyaan
);

router.post(
  "/pertanyaan-monev/update",
  authenticateTokenAdministrator,
  validation.edit,
  handleValidationErrors,
  controllers.update_pertanyaan
);

router.post(
  "/pertanyaan-monev/delete",
  authenticateTokenAdministrator,
  validation.delete,
  handleValidationErrors,
  controllers.delete_pertanyaan
);

module.exports = router;

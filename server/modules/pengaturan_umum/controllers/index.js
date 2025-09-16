const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

controllers.get_info_pengaturan_umum = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_info_pengaturan_umum();

    res.status(200).json({
      error: false,
      data: feedBack,
      total: 1,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.edit = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.edit_pengaturan_umum();
    const result = await model_cud.response();

    if (result) {
      res.status(200).json({
        error: false,
        message: "Pengaturan umum berhasil diperbarui",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: model_cud.message || "Gagal memperbarui pengaturan umum",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;

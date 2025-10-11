const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

controllers.list = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.Kriteria();

    res.status(200).json({
      error: false,
      data: feedBack.data,
      total: feedBack.total,
    });
  } catch (error) {
    console.log("----------------111111");
    console.log(error);
    console.log("----------------xxx");
    handleServerError(res, error);
  }
};

controllers.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();

    const result = await model_cud.response();
    if (result.success) {
      res.status(200).json({
        error: false,
        error_msg: "Kriteria berhasil dihapus.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Kriteria gagal dihapus.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;

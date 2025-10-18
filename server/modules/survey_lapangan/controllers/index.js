const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

controllers.survey_lapangan = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.survey_lapangan();

    res.status(200).json({
      error: false,
      data: feedBack.data,
      total: feedBack.total,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.get_info_member = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_info_member();

    res.status(200).json({
      error: false,
      data: feedBack,
      total: 1,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.submit = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.submit();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Survey berhasil disimpan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Survey gagal disimpan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;

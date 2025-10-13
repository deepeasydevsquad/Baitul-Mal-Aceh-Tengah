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
    const model = new Model_r(req);
    const data = await model.list();
    return res.status(200).json(data); // pake return
  } catch (error) {
    return handleServerError(res, error); // kasih full error object
  }
};

controllers.get_template_pesan_whatsapp = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_template_pesan_whatsapp();
    res.status(200).json({
      error: false,
      message: "Daftar template pesan whatsapp ditemukan.",
      data: feedBack,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.get_pesan_template_pesan_whatsapp = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_pesan_template_pesan_whatsapp();
    res.status(200).json({
      error: false,
      message: "Success.",
      data: feedBack,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;

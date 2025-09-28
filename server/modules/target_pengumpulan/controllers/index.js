const Model_r = require("../models/model_r");
const Model_cud = require("../models/model_cud");
const {
  handleValidationErrors,
  handleServerError,
} = require("../../../helper/handleError");

const controllers = {};

controllers.daftar_target_pengumpulan = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.target_pengumpulan();

    res.status(200).json({
      error: false,
      data: feedBack.data,
      total: feedBack.total,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.add_target_pengumpulan = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.add_target_pengumpulan();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Target pengumpulan berhasil ditambahkan.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Target pengumpulan gagal ditambahkan.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.get_info_edit_target_pengumpulan = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_info_edit_target_pengumpulan();

    res.status(200).json({
      error: false,
      data: feedBack,
      total: 1,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.edit_target_pengumpulan = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.edit_target_pengumpulan();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Target pengumpulan berhasil diperbaharui.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Target pengumpulan gagal diperbaharui.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.delete = async (req, res) => {
  if (!(await handleValidationErrors(req, res))) return;

  try {
    const model_cud = new Model_cud(req);
    await model_cud.delete();

    if (await model_cud.response()) {
      res.status(200).json({
        error: false,
        error_msg: "Target pengumpulan berhasil dihapus.",
      });
    } else {
      res.status(400).json({
        error: true,
        error_msg: "Target pengumpulan gagal dihapus.",
      });
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

controllers.get_tahun = async (req, res) => {
  try {
    const model_r = new Model_r(req);
    const feedBack = await model_r.get_available_years();

    res.status(200).json({
      error: false,
      data: feedBack.data,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
